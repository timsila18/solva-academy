import { createServer } from "node:http";
import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { readFile, mkdir, rm, stat } from "node:fs/promises";
import { createWriteStream, createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";
import { fileURLToPath } from "node:url";
import { resolve, join, basename } from "node:path";
import { probeVideo, encodeVideo, profiles } from "./engine.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const scratch = join(ROOT, ".local/video-compressor");
const outputDir = resolve(ROOT, "../compressed-videos");
const token = randomBytes(32).toString("hex");
const nonce = randomBytes(18).toString("base64");
const port = Number(process.env.VIDEO_COMPRESSOR_PORT ?? 4318);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid compressor port.");
const origin = `http://127.0.0.1:${port}`;
const MAX_SOURCE = 8 * 1024 ** 3;
const jobs = new Map();
await mkdir(scratch, { recursive: true });
await mkdir(outputDir, { recursive: true });
function authorized(value) {
  return typeof value === "string" && value.length === token.length && timingSafeEqual(Buffer.from(value), Buffer.from(token));
}
function publicJob(job) {
  return { id: job.id, state: job.state, progress: job.progress, sourceBytes: job.sourceBytes,
    outputBytes: job.outputBytes, name: job.name, duration: job.duration, error: job.error,
    outputPath: job.state === "done" ? job.output : undefined, sample: job.sample,
    academyUploadLimitBytes: 100 * 1024 * 1024 };
}
function json(res, status, value) { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(value)); }
async function removeScratch(directory) {
  if (!resolve(directory).startsWith(resolve(scratch) + (process.platform === "win32" ? "\\" : "/")) || !/^[a-f0-9-]{36}$/.test(basename(directory))) throw new Error("Invalid temporary directory.");
  await rm(directory, { recursive: true, force: true });
}

async function compress(job) {
  try {
    job.state = "inspecting";
    const metadata = await probeVideo(job.input, job.controller.signal);
    if (job.controller.signal.aborted) throw new Error("Cancelled.");
    if (metadata.hdr) throw new Error("HDR video needs a colour-managed export. Ask your editor for an SDR MP4 copy.");
    job.duration = job.sample ? Math.min(metadata.duration, 60) : metadata.duration;
    job.state = "compressing";
    await encodeVideo(job.input, job.output, job.profile, job.sample, job.duration, job.controller.signal,
      (progress) => { job.progress = progress; });
    if (job.controller.signal.aborted) throw new Error("Cancelled.");
    const result = await probeVideo(job.output, job.controller.signal);
    if (result.codec !== "h264" || Math.abs(result.duration - job.duration) > 2) throw new Error("The output did not pass the video check.");
    job.outputBytes = (await stat(job.output)).size;
    job.progress = 100; job.state = "done";
  } catch (error) {
    job.state = job.controller.signal.aborted ? "cancelled" : "failed";
    job.error = job.state === "cancelled" ? "Compression cancelled. Original file unchanged." : error.message;
    await rm(job.output, { force: true }).catch(() => {});
  } finally {
    // Only this job's generated directory is removed; the original is never opened for writing.
    await removeScratch(job.directory).catch(() => {});
  }
}

const server = createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  if (req.headers.host !== `127.0.0.1:${port}`) return json(res, 403, { error: "Local access only." });
  const url = new URL(req.url, origin);
  try {
    if (req.method === "GET" && url.pathname === "/") {
      const page = (await readFile(new URL("./index.html", import.meta.url), "utf8")).replaceAll("__TOKEN__", token).replaceAll("__NONCE__", nonce);
      res.setHeader("Content-Security-Policy", `default-src 'self'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; img-src 'self'; media-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return res.end(page);
    }
    if (req.method === "GET" && url.pathname === "/icon.png") {
      res.writeHead(200, { "Content-Type": "image/png" }); return createReadStream(join(ROOT, "public/icon-192.png")).pipe(res);
    }
    if (!authorized(req.headers["x-compressor-key"] ?? url.searchParams.get("key"))) return json(res, 403, { error: "Open the compressor on this computer first." });
    if (["POST", "DELETE"].includes(req.method) && req.headers.origin !== origin) return json(res, 403, { error: "Request origin rejected." });
    if (req.method === "GET" && url.pathname === "/api/jobs") return json(res, 200, [...jobs.values()].map(publicJob));
    if (req.method === "POST" && url.pathname === "/api/jobs") {
      if ([...jobs.values()].some((job) => ["reading", "inspecting", "compressing"].includes(job.state))) return json(res, 409, { error: "Finish or cancel the current video first." });
      const profile = url.searchParams.get("profile");
      if (!Object.hasOwn(profiles, profile)) return json(res, 400, { error: "Choose a compression preset." });
      const bytes = Number(req.headers["content-length"]);
      if (!Number.isSafeInteger(bytes) || bytes <= 0 || bytes > MAX_SOURCE) return json(res, 413, { error: "Select a video up to 8 GB." });
      if (jobs.size >= 20) return json(res, 409, { error: "Restart the compressor to clear the session history." });
      const id = randomUUID();
      const directory = join(scratch, id);
      await mkdir(directory);
      const name = basename(url.searchParams.get("name") ?? "class").replace(/[^a-zA-Z0-9 _.-]/g, "_").slice(0, 90).replace(/\.[^.]+$/, "") || "class";
      const sample = url.searchParams.get("sample") === "true";
      const job = { id, name, profile, sample, state: "reading", progress: 0, sourceBytes: bytes, controller: new AbortController(),
        directory, input: join(directory, "input.video"), output: join(outputDir, `${name}-${sample ? "sample" : "compressed"}-${id.slice(0, 8)}.mp4`) };
      jobs.set(id, job);
      let received = 0;
      const guard = new Transform({ transform(chunk, _encoding, callback) {
        received += chunk.length;
        if (received > bytes || received > MAX_SOURCE) return callback(new Error("Source size exceeded the limit."));
        callback(null, chunk);
      } });
      try {
        await pipeline(req, guard, createWriteStream(job.input, { flags: "wx" }), { signal: job.controller.signal });
        if (received !== bytes) throw new Error("The source file transfer was incomplete.");
      } catch {
        job.state = "failed"; job.error = "The video could not be read. Select it again.";
        await removeScratch(directory);
        if (!res.destroyed) json(res, 400, { error: job.error });
        return;
      }
      json(res, 202, publicJob(job)); void compress(job); return;
    }
    const match = /^\/api\/jobs\/([a-f0-9-]{36})(\/file)?$/.exec(url.pathname);
    const job = match && jobs.get(match[1]);
    if (!job) return json(res, 404, { error: "Video not found." });
    if (req.method === "DELETE" && !match[2]) {
      if (["reading", "inspecting", "compressing"].includes(job.state)) job.controller.abort();
      return json(res, 200, { cancelled: true });
    }
    if (req.method === "GET" && !match[2]) return json(res, 200, publicJob(job));
    if (req.method === "GET" && match[2] && job.state === "done") {
      const { size } = await stat(job.output);
      const range = req.headers.range;
      const parsed = range && /^bytes=(\d+)-(\d*)$/.exec(range);
      if (range && !parsed) { res.writeHead(416, { "Content-Range": `bytes */${size}` }); return res.end(); }
      const start = parsed ? Number(parsed[1]) : 0;
      const end = parsed?.[2] ? Math.min(Number(parsed[2]), size - 1) : size - 1;
      if (start > end || start >= size) { res.writeHead(416, { "Content-Range": `bytes */${size}` }); return res.end(); }
      res.setHeader("Content-Type", "video/mp4"); res.setHeader("Accept-Ranges", "bytes");
      if (url.searchParams.get("download") === "1") res.setHeader("Content-Disposition", `attachment; filename="${basename(job.output)}"`);
      if (parsed) res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
      res.writeHead(parsed ? 206 : 200, { "Content-Length": end - start + 1 });
      const stream = createReadStream(job.output, { start, end });
      stream.on("error", () => res.destroy());
      res.on("close", () => stream.destroy());
      return stream.pipe(res);
    }
    json(res, 405, { error: "Method not allowed." });
  } catch (error) { if (!res.headersSent && !res.destroyed) json(res, 500, { error: "The local operation failed. Check free disk space and retry." }); console.error(error.message); }
});
server.requestTimeout = 0;
server.on("error", (error) => { console.error(error.code === "EADDRINUSE" ? `Port ${port} is in use. Set VIDEO_COMPRESSOR_PORT to another port.` : error.message); process.exitCode = 1; });
server.listen(port, "127.0.0.1", () => console.log(`Solva video compressor: ${origin}\nCompressed copies: ${outputDir}\nOriginals are preserved. Keep this process running while compressing.`));
for (const event of ["SIGINT", "SIGTERM"]) process.on(event, () => {
  for (const job of jobs.values()) job.controller.abort();
  server.close(); setTimeout(() => process.exit(0), 1500).unref();
});
