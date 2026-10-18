import { spawn } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import ffprobe from "ffprobe-static";
import { rm } from "node:fs/promises";

export const MAX_OUTPUT_BYTES = 350_000_000;
export function compressionPlan(
  duration,
  profile,
  maxBytes = MAX_OUTPUT_BYTES,
) {
  if (!Number.isFinite(duration) || duration <= 0 || !profiles[profile])
    throw new Error("Invalid video duration or preset.");
  const audio = 96000;
  const budget = Math.floor((maxBytes * 0.94 * 8) / duration) - audio;
  if (budget < 80000)
    throw new Error(
      "This recording is too long for a usable 350 MB export. Split it into shorter classes.",
    );
  return {
    videoBitrate: Math.min(
      budget,
      profile === "compact"
        ? 1000000
        : profile === "quality"
          ? 5000000
          : 2000000,
    ),
    audioBitrate: audio,
    maxBytes,
  };
}

export const profiles = {
  balanced: {
    width: 1920,
    height: 1080,
    encoding: ["-b:v", "2000k", "-maxrate", "4000k", "-bufsize", "8000k"],
  },
  quality: { width: 1920, height: 1080, encoding: ["-crf", "21"] },
  compact: {
    width: 1280,
    height: 720,
    encoding: ["-b:v", "1000k", "-maxrate", "2000k", "-bufsize", "4000k"],
  },
};

export function encodingArguments(input, output, profile, sample, plan) {
  const p = profiles[profile];
  if (!p) throw new Error("Choose a valid compression preset.");
  return [
    "-hide_banner",
    "-nostdin",
    "-y",
    "-protocol_whitelist",
    "file,pipe",
    "-i",
    input,
    ...(sample ? ["-t", "60"] : []),
    "-map",
    "0:V:0",
    "-map",
    "0:a:0?",
    "-sn",
    "-dn",
    "-map_metadata",
    "-1",
    "-map_chapters",
    "-1",
    "-vf",
    `scale=w='min(${p.width},iw)':h='min(${p.height},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-threads",
    "2",
    "-pix_fmt",
    "yuv420p",
    ...(plan ? ["-b:v", String(plan.videoBitrate)] : p.encoding),
    "-c:a",
    "aac",
    "-b:a",
    plan ? String(plan.audioBitrate) : "128k",
    "-movflags",
    "+faststart",
    "-progress",
    "pipe:1",
    "-nostats",
    output,
  ];
}

export function probeVideo(input, signal) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      ffprobe.path,
      [
        "-v",
        "error",
        "-protocol_whitelist",
        "file,pipe",
        "-show_format",
        "-show_streams",
        "-of",
        "json",
        input,
      ],
      { windowsHide: true, signal, timeout: 60000 },
    );
    let result = "";
    child.stdout.on("data", (chunk) => {
      result += chunk;
      if (result.length > 1024 * 1024) child.kill();
    });
    child.stderr.resume();
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0)
        return reject(new Error("The file could not be read as a video."));
      try {
        const data = JSON.parse(result);
        const video = data.streams?.find(
          (stream) =>
            stream.codec_type === "video" && !stream.disposition?.attached_pic,
        );
        const duration = Number(data.format?.duration);
        if (!video || !Number.isFinite(duration) || duration <= 0)
          throw new Error("The file has no playable video or duration.");
        resolve({
          duration,
          width: video.width,
          height: video.height,
          codec: video.codec_name,
          hdr: ["smpte2084", "arib-std-b67"].includes(video.color_transfer),
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

export function encodeVideo(
  input,
  output,
  profile,
  sample,
  duration,
  signal,
  onProgress,
) {
  return runEncode(
    encodingArguments(input, output, profile, sample),
    duration,
    signal,
    onProgress,
  );
}

export async function encodeBoundedVideo(
  input,
  output,
  profile,
  sample,
  duration,
  signal,
  onProgress,
) {
  const plan = compressionPlan(duration, profile);
  const passlog = output + ".pass";
  try {
    const args = encodingArguments(input, output, profile, sample, plan);
    await runEncode(
      [
        ...args.slice(0, -1),
        "-pass",
        "1",
        "-passlogfile",
        passlog,
        "-an",
        "-f",
        "null",
        process.platform === "win32" ? "NUL" : "/dev/null",
      ],
      duration,
      signal,
      (p) => onProgress(Math.floor(p / 2)),
    );
    await runEncode(
      [...args.slice(0, -1), "-pass", "2", "-passlogfile", passlog, output],
      duration,
      signal,
      (p) => onProgress(50 + Math.floor(p / 2)),
    );
  } finally {
    for (const suffix of ["-0.log", "-0.log.mbtree"])
      await rm(passlog + suffix, { force: true }).catch(() => {});
  }
}

function runEncode(args, duration, signal, onProgress) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, args, { windowsHide: true, signal });
    let pending = "";
    let errors = "";
    child.stdout.on("data", (chunk) => {
      pending += chunk.toString();
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() ?? "";
      for (const line of lines) {
        const match = /^out_time_us=(\d+)$/.exec(line);
        if (match)
          onProgress(
            Math.min(
              99,
              Math.floor((Number(match[1]) / 1000000 / duration) * 100),
            ),
          );
      }
    });
    child.stderr.on("data", (chunk) => {
      errors = (errors + chunk.toString()).slice(-3000);
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(
            new Error(
              signal?.aborted
                ? "Compression cancelled."
                : `Compression failed. ${errors.slice(-700)}`,
            ),
          ),
    );
  });
}
