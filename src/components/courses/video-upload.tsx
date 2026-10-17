"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";

export function VideoUpload({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  return <form className="mt-3 flex flex-wrap items-center gap-3" onSubmit={async (event) => {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get("video");
    if (!(file instanceof File) || !file.size || file.type !== "video/mp4" || file.size > 100 * 1024 * 1024) {
      setMessage("Choose an MP4 video up to 100 MB."); return;
    }
    setBusy(true); setMessage("Uploading video...");
    try {
      const response = await fetch("/api/courses/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId, lessonId, name: file.name, size: file.size, type: file.type }) });
      const upload = await response.json();
      if (!response.ok) throw new Error(upload.error);
      const db = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { error } = await db.storage.from("course-media").uploadToSignedUrl(upload.path, upload.token, file, { contentType: "video/mp4" });
      if (error) throw new Error("Upload failed. Check your connection and try again.");
      const saved = await fetch("/api/courses/media", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId, lessonId, path: upload.path }) });
      if (!saved.ok) throw new Error((await saved.json()).error);
      setMessage("Video saved."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); }
  }}>
    <input aria-label="Lesson MP4 video" type="file" name="video" accept="video/mp4" disabled={busy} required className="max-w-full text-sm" />
    <Button type="submit" disabled={busy} variant="outline"><Upload size={16} aria-hidden="true" /> {busy ? "Uploading..." : "Upload video"}</Button>
    <p role="status" className="w-full text-sm text-muted-foreground">{message}</p>
  </form>;
}
