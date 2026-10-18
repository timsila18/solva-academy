import { createReadStream } from "node:fs";
import { Upload } from "tus-js-client";
import { open } from "node:fs/promises";
import { createHash } from "node:crypto";
export function validateDestination(
  value,
  expectedOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL,
) {
  if (!value || typeof value !== "object")
    throw new Error("Open compression from the Academy class first.");
  if (value.provider === "hostafrica") {
    if (
      !process.env.ACADEMY_MEDIA_ENDPOINT ||
      value.endpoint !== process.env.ACADEMY_MEDIA_ENDPOINT ||
      !value.endpoint.startsWith("https://")
    )
      throw new Error(
        "The compressor is not configured for this Academy media host.",
      );
    if (
      !/^[a-f0-9]{32}$/.test(value.id) ||
      ![value.course, value.lesson, value.actor].every((v) =>
        /^[a-f0-9-]{36}$/.test(v),
      ) ||
      !/^[a-f0-9]{64}$/.test(value.signature) ||
      !Number.isSafeInteger(value.expires) ||
      value.expires <= Date.now() / 1000 ||
      value.maxBytes !== 350000000
    )
      throw new Error("Invalid Academy upload authorization.");
    return { ...value };
  }
  const url = new URL(value.storageOrigin);
  if (
    url.protocol !== "https:" ||
    !/^[a-z0-9]{20}\.supabase\.co$/.test(url.hostname) ||
    url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/"
  )
    throw new Error("Invalid storage destination.");
  if (!expectedOrigin || url.origin !== new URL(expectedOrigin).origin)
    throw new Error(
      "The compressor is not configured for this Academy storage project. Start it with npm run video:compressor.",
    );
  if (
    !/^[a-f0-9-]{36}\/[a-f0-9-]{36}\/[a-f0-9-]{36}\.mp4$/.test(value.path) ||
    typeof value.token !== "string" ||
    value.token.length < 20 ||
    value.token.length > 4000
  )
    throw new Error("Invalid upload authorization.");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!publishableKey)
    throw new Error(
      "Start the compressor with npm run video:compressor to configure uploads.",
    );
  return {
    storageOrigin: url.origin,
    path: value.path,
    token: value.token,
    publishableKey,
  };
}
export function uploadCompressed(job, destination) {
  const target = validateDestination(destination);
  if (target.provider === "hostafrica") return uploadHosted(job, target);
  const endpoint =
    target.storageOrigin.replace(".supabase.co", ".storage.supabase.co") +
    "/storage/v1/upload/resumable/sign";
  return new Promise((resolve, reject) => {
    const file = createReadStream(job.output);
    const finish = (error) => {
      job.controller.signal.removeEventListener("abort", cancel);
      file.destroy();
      if (error) reject(error);
      else resolve();
    };
    const upload = new Upload(file, {
      endpoint,
      uploadSize: job.outputBytes,
      chunkSize: 6 * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      storeFingerprintForResuming: false,
      headers: { "x-signature": target.token, apikey: target.publishableKey },
      metadata: {
        bucketName: "course-media",
        objectName: target.path,
        contentType: "video/mp4",
        cacheControl: "3600",
      },
      onProgress: (done, total) => {
        job.uploadProgress = Math.floor((done / total) * 100);
      },
      onError: () =>
        finish(
          new Error(
            "Upload interrupted or authorization expired. Keep this compressed copy and retry from Academy.",
          ),
        ),
      onSuccess: () => finish(),
    });
    const cancel = () => {
      void upload
        .abort()
        .then(() =>
          finish(new Error("Upload cancelled. Compressed copy retained.")),
        );
    };
    job.controller.signal.addEventListener("abort", cancel, { once: true });
    if (job.controller.signal.aborted) cancel();
    else upload.start();
  });
}
export async function preflightUpload(destination) {
  const ticket = validateDestination(destination);
  if (ticket.provider !== "hostafrica") return;
  const { id, course, lesson, actor, expires, signature } = ticket;
  const query = new URLSearchParams({
    action: "offset",
    id,
    course,
    lesson,
    actor,
    expires: String(expires),
    signature,
  });
  const response = await fetch(ticket.endpoint + "?" + query, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(
      `Video host is not ready (HTTP ${response.status}). Compression has not started; reconnect from your Academy class.`,
    );
}
async function uploadHosted(job, ticket) {
  if (job.outputBytes > 350000000)
    throw new Error("Compressed video exceeds 350 MB.");
  const chunkSize = 2097152;
  const params = new URLSearchParams({
    id: ticket.id,
    course: ticket.course,
    lesson: ticket.lesson,
    actor: ticket.actor,
    expires: String(ticket.expires),
    signature: ticket.signature,
  });
  const file = await open(job.output, "r");
  async function request(action, body, index, digest) {
    const query = new URLSearchParams(params);
    query.set("action", action);
    if (index !== undefined) query.set("index", String(index));
    if (action === "complete") {
      query.set("size", String(job.outputBytes));
      query.set("total", String(Math.ceil(job.outputBytes / chunkSize)));
    }
    for (let attempt = 0; attempt < 4; attempt++) {
      job.controller.signal.throwIfAborted();
      try {
        const response = await fetch(ticket.endpoint + "?" + query, {
          method: "POST",
          redirect: "error",
          signal: job.controller.signal,
          headers: {
            "Content-Type": body ? "text/plain" : "application/octet-stream",
            ...(body ? { "X-Chunk-Encoding": "base64" } : {}),
            ...(digest ? { "X-Chunk-Digest": digest } : {}),
          },
          body: body ? body.toString("base64") : undefined,
        });
        if (response.ok) {
          const data = await response.json();
          if (
            action === "complete" &&
            (data.id !== ticket.id || data.bytes !== job.outputBytes)
          )
            throw new Error("Upload verification failed.");
          return data;
        }
        if (response.status < 500) {
          const message =
            response.status === 401
              ? "Upload authorization expired. Reconnect from your Academy class; the compressed video is saved."
              : `Video host rejected ${index === undefined ? action : `chunk ${index + 1}`} (HTTP ${response.status}). Compressed video is saved; retry upload only.`;
          throw new Error(message);
        }
      } catch (error) {
        if (job.controller.signal.aborted || attempt === 3) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
    throw new Error("Video hosting is unavailable. Compressed copy retained.");
  }
  try {
    const checkpoint = await request("offset");
    const next = Number.isSafeInteger(checkpoint.next)
      ? Math.min(
          Math.max(0, checkpoint.next),
          Math.floor(job.outputBytes / chunkSize),
        )
      : 0;
    for (
      let offset = next * chunkSize, index = next;
      offset < job.outputBytes;
      offset += chunkSize, index++
    ) {
      const length = Math.min(chunkSize, job.outputBytes - offset);
      const buffer = Buffer.alloc(length);
      let read = 0;
      while (read < length) {
        const result = await file.read(
          buffer,
          read,
          length - read,
          offset + read,
        );
        if (!result.bytesRead)
          throw new Error("Compressed output could not be read.");
        read += result.bytesRead;
      }
      await request(
        "chunk",
        buffer,
        index,
        createHash("sha256").update(buffer).digest("hex"),
      );
      job.uploadProgress = Math.floor(
        ((offset + length) / job.outputBytes) * 100,
      );
    }
    await request("complete");
  } finally {
    await file.close();
  }
}
