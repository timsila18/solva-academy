import { createHmac } from "node:crypto";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { MAX_CLASS_VIDEO_BYTES } from "./video-policy";
export type HostedTicket = {
  id: string;
  course_id: string;
  lesson_id: string;
  actor_id: string;
  expires_at: string;
};
function config() {
  const endpoint = process.env.ACADEMY_MEDIA_ENDPOINT;
  const secret = process.env.ACADEMY_MEDIA_SECRET;
  if (!endpoint || !secret || !/^[a-f0-9]{64}$/.test(secret))
    throw new Error("Academy video hosting is not configured.");
  const url = new URL(endpoint);
  if (url.protocol !== "https:")
    throw new Error("HTTPS video hosting is required.");
  return {
    endpoint,
    key: createHmac("sha256", secret).update("academy-video-v1").digest("hex"),
  };
}
function sign(text: string) {
  return createHmac("sha256", config().key).update(text).digest("hex");
}
export function hostedUploadTicket(ticket: HostedTicket) {
  const id = ticket.id.replaceAll("-", "");
  const expires = Math.floor(new Date(ticket.expires_at).getTime() / 1000);
  return {
    provider: "hostafrica" as const,
    path: `hostafrica:${ticket.id}`,
    endpoint: config().endpoint,
    id,
    course: ticket.course_id,
    lesson: ticket.lesson_id,
    actor: ticket.actor_id,
    expires,
    maxBytes: MAX_CLASS_VIDEO_BYTES,
    signature: sign(
      `academy-upload-v1\n${id}\n${ticket.course_id}\n${ticket.lesson_id}\n${ticket.actor_id}\n${expires}\n${MAX_CLASS_VIDEO_BYTES}`,
    ),
  };
}
function signedUrl(id: string, action: "stream" | "status") {
  if (!/^[a-f0-9]{32}$/.test(id)) throw new Error("Invalid video reference.");
  const expires =
    Math.floor(Date.now() / 1000) + (action === "stream" ? 3600 : 120);
  const url = new URL(config().endpoint);
  url.search = new URLSearchParams({
    action,
    id,
    expires: String(expires),
    signature: sign(`academy-${action}-v1\n${id}\n${expires}`),
  }).toString();
  return url.toString();
}
export async function hostedUploadStatus(ticket: HostedTicket) {
  const response = await fetch(
    signedUrl(ticket.id.replaceAll("-", ""), "status"),
    {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Private video storage is unavailable.");
  const info = await response.json();
  if (
    info.id !== ticket.id.replaceAll("-", "") ||
    info.course !== ticket.course_id ||
    info.lesson !== ticket.lesson_id ||
    info.actor !== ticket.actor_id ||
    !Number.isSafeInteger(info.bytes) ||
    info.bytes < 1 ||
    info.bytes > MAX_CLASS_VIDEO_BYTES ||
    !/^[a-f0-9]{64}$/.test(info.sha256)
  )
    throw new Error("Video storage verification failed.");
  return info as { bytes: number; sha256: string };
}
export async function hostedPlaybackUrl(
  uploadId: string,
  courseId: string,
  lessonId: string,
) {
  const db = createServiceSupabaseClient();
  const { data, error } = await db
    .from("course_video_uploads")
    .select("id")
    .eq("id", uploadId)
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .eq("status", "attached")
    .maybeSingle();
  if (error || !data) return null;
  return signedUrl(data.id.replaceAll("-", ""), "stream");
}
