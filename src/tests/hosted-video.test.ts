import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createHmac, webcrypto } from "node:crypto";
import { File as NodeFile } from "node:buffer";
vi.mock("@/lib/supabase/server", () => ({
  createServiceSupabaseClient: vi.fn(),
}));
import {
  hostedUploadTicket,
  hostedUploadStatus,
} from "@/lib/courses/hosted-video";
import { uploadHostedVideo } from "@/lib/courses/hosted-upload";
import {
  MAX_CLASS_VIDEO_BYTES,
  resumableStorageEndpoint,
} from "@/lib/courses/video-policy";
const secret = "a".repeat(64);
const id = "37fc22f0-b065-4e13-bdd5-02852c3f950b";
const row = {
  id,
  course_id: id,
  lesson_id: id,
  actor_id: id,
  expires_at: new Date(Date.now() + 3600000).toISOString(),
};
beforeEach(() => {
  vi.stubEnv("ACADEMY_MEDIA_SECRET", secret);
  vi.stubEnv(
    "ACADEMY_MEDIA_ENDPOINT",
    "https://images.solfit.co.ke/academy-media.php",
  );
  vi.stubGlobal("crypto", webcrypto);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("caps final videos at 350 MB and uses signed resumable Supabase endpoints only as a fallback", () => {
  expect(MAX_CLASS_VIDEO_BYTES).toBe(350000000);
  expect(resumableStorageEndpoint("https://example.supabase.co")).toBe(
    "https://example.storage.supabase.co/storage/v1/upload/resumable/sign",
  );
});
it("binds private-host tickets to actor, course, lesson, expiry and byte ceiling without returning the signing secret", () => {
  const ticket = hostedUploadTicket(row);
  const key = createHmac("sha256", secret)
    .update("academy-video-v1")
    .digest("hex");
  const expected = createHmac("sha256", key)
    .update(
      `academy-upload-v1\n${id.replaceAll("-", "")}\n${id}\n${id}\n${id}\n${ticket.expires}\n350000000`,
    )
    .digest("hex");
  expect(ticket.signature).toBe(expected);
  expect(JSON.stringify(ticket)).not.toContain(secret);
});
it("rejects a storage response for another class", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        id: id.replaceAll("-", ""),
        course: id,
        lesson: "other",
        actor: id,
        bytes: 100,
        sha256: "b".repeat(64),
      }),
    ),
  );
  await expect(hostedUploadStatus(row)).rejects.toThrow(/verification/);
});
it("treats an incomplete private upload as not ready", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 404 })),
  );
  expect(await hostedUploadStatus(row)).toBeNull();
});
it("uploads directly to the private host in small chunks, then completes without Vercel receiving video bytes", async () => {
  const calls: string[] = [];
  const sizes: number[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string, options: RequestInit) => {
      const action = new URL(input).searchParams.get("action")!;
      calls.push(action);
      if (
        options.body &&
        typeof options.body === "object" &&
        "size" in options.body
      )
        sizes.push(Number(options.body.size));
      return Response.json(action === "offset" ? { next: 1 } : { ok: true });
    }),
  );
  const file = new NodeFile([new Uint8Array(2097152 + 100)], "compressed.mp4", {
    type: "video/mp4",
  });
  const progress = vi.fn();
  await uploadHostedVideo(
    file as unknown as File,
    hostedUploadTicket(row),
    new AbortController().signal,
    progress,
  );
  expect(calls).toEqual(["offset", "chunk", "complete"]);
  expect(sizes).toEqual([100]);
  expect(progress).toHaveBeenLastCalledWith(100);
});
it("rejects oversized compressed files before contacting the media host", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  await expect(
    uploadHostedVideo(
      { size: 350000001 } as File,
      hostedUploadTicket(row),
      new AbortController().signal,
      vi.fn(),
    ),
  ).rejects.toThrow(/350 MB/);
  expect(fetch).not.toHaveBeenCalled();
});
