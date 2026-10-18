import assert from "node:assert/strict";
import { randomUUID, createHmac, createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, stat, rm } from "node:fs/promises";
import { resolve } from "node:path";
import ffmpeg from "ffmpeg-static";
import { uploadCompressed } from "../video-compressor/upload.mjs";
const endpoint = process.env.ACADEMY_MEDIA_ENDPOINT;
const key = createHmac("sha256", process.env.ACADEMY_MEDIA_SECRET)
  .update("academy-video-v1")
  .digest("hex");
const signature = (text) =>
  createHmac("sha256", key).update(text).digest("hex");
const folder = resolve(".local/academy-media/live-test");
await mkdir(folder, { recursive: true });
const file = resolve(folder, "synthetic-test.mp4");
const generated = spawnSync(
  ffmpeg,
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "lavfi",
    "-i",
    "testsrc2=size=1280x720:rate=25",
    "-t",
    "12",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-threads",
    "2",
    "-pix_fmt",
    "yuv420p",
    "-b:v",
    "2500k",
    "-movflags",
    "+faststart",
    file,
  ],
  { windowsHide: true, encoding: "utf8" },
);
assert.equal(generated.status, 0, generated.stderr);
const id = randomUUID().replaceAll("-", "");
const course = randomUUID(),
  lesson = randomUUID(),
  actor = randomUUID();
const expires = Math.floor(Date.now() / 1000) + 3600;
const ticket = {
  provider: "hostafrica",
  endpoint,
  id,
  course,
  lesson,
  actor,
  expires,
  maxBytes: 350000000,
};
ticket.signature = signature(
  `academy-upload-v1\n${id}\n${course}\n${lesson}\n${actor}\n${expires}\n350000000`,
);
function url(action, expiry = expires) {
  return (
    endpoint +
    "?" +
    new URLSearchParams({
      action,
      id,
      expires: String(expiry),
      signature: signature(`academy-${action}-v1\n${id}\n${expiry}`),
    })
  );
}
let uploaded = false;
try {
  assert.equal((await fetch(endpoint)).status, 401);
  const job = {
    output: file,
    outputBytes: (await stat(file)).size,
    controller: new AbortController(),
  };
  await uploadCompressed(job, ticket);
  uploaded = true;
  const status = await fetch(url("status"));
  assert.equal(status.status, 200);
  const info = await status.json();
  const bytes = await readFile(file);
  assert.equal(info.bytes, bytes.length);
  assert.equal(info.sha256, createHash("sha256").update(bytes).digest("hex"));
  assert.equal(info.course, course);
  const range = await fetch(url("stream"), {
    headers: { Range: "bytes=0-99" },
  });
  assert.equal(range.status, 206);
  assert.deepEqual(
    Buffer.from(await range.arrayBuffer()),
    bytes.subarray(0, 100),
  );
  const suffix = await fetch(url("stream"), {
    headers: { Range: "bytes=-16" },
  });
  assert.equal(suffix.status, 206);
  assert.deepEqual(
    Buffer.from(await suffix.arrayBuffer()),
    bytes.subarray(-16),
  );
  assert.equal(
    (await fetch(url("stream", Math.floor(Date.now() / 1000) - 10))).status,
    401,
  );
  assert.equal(
    (await fetch(url("stream"), { headers: { Range: "bytes=999999999-" } }))
      .status,
    416,
  );
  assert.equal(
    (
      await fetch(
        endpoint.replace(
          "/academy-media.php",
          `/academy-video-media/${id}.mp4`,
        ),
      )
    ).status,
    404,
  );
  console.log(
    JSON.stringify({
      passed: true,
      bytes: bytes.length,
      checks: [
        "chunked direct upload",
        "private storage",
        "scope and SHA-256 verification",
        "206 range playback",
        "suffix range playback",
        "expired access denied",
        "invalid ranges denied",
        "unsigned requests denied",
      ],
    }),
  );
} finally {
  if (uploaded) {
    const response = await fetch(url("purge"), { method: "POST" });
    assert.equal(response.status, 200, "Synthetic fixture cleanup failed");
    console.log("Synthetic remote verification clip removed.");
  }
  assert.equal(folder, resolve(".local/academy-media/live-test"));
  await rm(folder, { recursive: true, force: true });
}
