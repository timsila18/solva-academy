import { spawn } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import ffprobe from "ffprobe-static";

export const profiles = {
  balanced: { width: 1920, height: 1080, encoding: ["-b:v", "2000k", "-maxrate", "4000k", "-bufsize", "8000k"] },
  quality: { width: 1920, height: 1080, encoding: ["-crf", "21"] },
  compact: { width: 1280, height: 720, encoding: ["-b:v", "1000k", "-maxrate", "2000k", "-bufsize", "4000k"] },
};

export function encodingArguments(input, output, profile, sample) {
  const p = profiles[profile];
  if (!p) throw new Error("Choose a valid compression preset.");
  return ["-hide_banner", "-nostdin", "-y", "-protocol_whitelist", "file,pipe", "-i", input,
    ...(sample ? ["-t", "60"] : []), "-map", "0:V:0", "-map", "0:a:0?", "-sn", "-dn", "-map_metadata", "-1", "-map_chapters", "-1",
    "-vf", `scale=w='min(${p.width},iw)':h='min(${p.height},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
    "-c:v", "libx264", "-preset", "medium", "-threads", "2", "-pix_fmt", "yuv420p", ...p.encoding,
    "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-progress", "pipe:1", "-nostats", output];
}

export function probeVideo(input, signal) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffprobe.path, ["-v", "error", "-protocol_whitelist", "file,pipe", "-show_format", "-show_streams", "-of", "json", input], { windowsHide: true, signal, timeout: 60000 });
    let result = "";
    child.stdout.on("data", (chunk) => { result += chunk; if (result.length > 1024 * 1024) child.kill(); });
    child.stderr.resume();
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error("The file could not be read as a video."));
      try {
        const data = JSON.parse(result);
        const video = data.streams?.find((stream) => stream.codec_type === "video" && !stream.disposition?.attached_pic);
        const duration = Number(data.format?.duration);
        if (!video || !Number.isFinite(duration) || duration <= 0) throw new Error("The file has no playable video or duration.");
        resolve({ duration, width: video.width, height: video.height, codec: video.codec_name,
          hdr: ["smpte2084", "arib-std-b67"].includes(video.color_transfer) });
      } catch (error) { reject(error); }
    });
  });
}

export function encodeVideo(input, output, profile, sample, duration, signal, onProgress) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, encodingArguments(input, output, profile, sample), { windowsHide: true, signal });
    let pending = "";
    let errors = "";
    child.stdout.on("data", (chunk) => {
      pending += chunk.toString();
      const lines = pending.split(/\r?\n/); pending = lines.pop() ?? "";
      for (const line of lines) {
        const match = /^out_time_us=(\d+)$/.exec(line);
        if (match) onProgress(Math.min(99, Math.floor(Number(match[1]) / 1000000 / duration * 100)));
      }
    });
    child.stderr.on("data", (chunk) => { errors = (errors + chunk.toString()).slice(-3000); });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(signal?.aborted ? "Compression cancelled." : `Compression failed. ${errors.slice(-700)}`)));
  });
}
