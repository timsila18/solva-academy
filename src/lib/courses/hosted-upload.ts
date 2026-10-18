export type DirectVideoTicket = {
  provider: "hostafrica";
  path: string;
  endpoint: string;
  id: string;
  course: string;
  lesson: string;
  actor: string;
  expires: number;
  maxBytes: number;
  signature: string;
};
export const VIDEO_CHUNK_BYTES = 2 * 1024 * 1024;
export async function uploadHostedVideo(
  file: File,
  ticket: DirectVideoTicket,
  signal: AbortSignal,
  onProgress: (percent: number) => void,
) {
  if (!file.size || file.size > ticket.maxBytes)
    throw new Error("Compressed videos must be no larger than 350 MB.");
  const params = new URLSearchParams({
    id: ticket.id,
    course: ticket.course,
    lesson: ticket.lesson,
    actor: ticket.actor,
    expires: String(ticket.expires),
    signature: ticket.signature,
  });
  async function send(
    action: string,
    body?: Blob,
    index?: number,
    digest?: string,
  ) {
    let encoded: string | undefined;
    if (body) {
      const bytes = new Uint8Array(await body.arrayBuffer());
      const parts: string[] = [];
      for (let i = 0; i < bytes.length; i += 32768)
        parts.push(String.fromCharCode(...bytes.subarray(i, i + 32768)));
      encoded = btoa(parts.join(""));
    }
    const query = new URLSearchParams(params);
    query.set("action", action);
    if (index !== undefined) query.set("index", String(index));
    if (action === "complete") {
      query.set("size", String(file.size));
      query.set("total", String(Math.ceil(file.size / VIDEO_CHUNK_BYTES)));
    }
    for (let attempt = 0; attempt < 4; attempt++) {
      signal.throwIfAborted();
      try {
        const response = await fetch(ticket.endpoint + "?" + query, {
          method: "POST",
          signal,
          headers: {
            "Content-Type": body ? "text/plain" : "application/octet-stream",
            ...(body ? { "X-Chunk-Encoding": "base64" } : {}),
            ...(digest ? { "X-Chunk-Digest": digest } : {}),
          },
          body: encoded,
        });
        if (response.ok) return await response.json();
        if (response.status < 500 && response.status !== 429)
          throw new Error(
            "Video upload was rejected. Check the file or start a new upload.",
          );
      } catch (error) {
        if (signal.aborted) throw error;
        if (attempt === 3) throw error;
      }
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          clearTimeout(timer);
          reject(new Error("Upload paused."));
        };
        const timer = setTimeout(
          () => {
            signal.removeEventListener("abort", abort);
            resolve();
          },
          1000 * (attempt + 1),
        );
        signal.addEventListener("abort", abort, { once: true });
      });
    }
    throw new Error("Upload interrupted. Retry when the connection is stable.");
  }
  const checkpoint = await send("offset");
  const next = Number.isSafeInteger(checkpoint.next)
    ? Math.min(
        Math.max(0, checkpoint.next),
        Math.floor(file.size / VIDEO_CHUNK_BYTES),
      )
    : 0;
  for (
    let start = next * VIDEO_CHUNK_BYTES, index = next;
    start < file.size;
    start += VIDEO_CHUNK_BYTES, index++
  ) {
    const chunk = file.slice(
      start,
      Math.min(start + VIDEO_CHUNK_BYTES, file.size),
    );
    const hash = await crypto.subtle.digest(
      "SHA-256",
      await chunk.arrayBuffer(),
    );
    const digest = Array.from(new Uint8Array(hash), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    await send("chunk", chunk, index, digest);
    onProgress(
      Math.floor(
        (Math.min(start + VIDEO_CHUNK_BYTES, file.size) / file.size) * 100,
      ),
    );
  }
  await send("complete");
}
