"use client";
import { useRef, useState } from "react";

export function LessonVideo({ src, courseId, lessonId, initialPosition }: { src: string; courseId: string; lessonId: string; initialPosition: number }) {
  const lastSaved = useRef(0);
  const [message, setMessage] = useState("");
  async function save(video: HTMLVideoElement, completed = false) {
    if (!Number.isFinite(video.currentTime)) return;
    const response = await fetch("/api/courses/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId, lessonId, position: Math.floor(video.currentTime), completed }), keepalive: true });
    setMessage(response.ok ? (completed ? "Lesson completed." : "Progress saved.") : "Progress could not be saved. Check your connection.");
  }
  return <>
    <video controls playsInline preload="metadata" className="aspect-video w-full bg-black" src={src}
      onLoadedMetadata={(event) => { if (initialPosition > 0 && initialPosition < event.currentTarget.duration) event.currentTarget.currentTime = initialPosition; }}
      onTimeUpdate={(event) => { if (Date.now() - lastSaved.current > 15000) { lastSaved.current = Date.now(); void save(event.currentTarget).catch(() => setMessage("Progress could not be saved.")); } }}
      onPause={(event) => { void save(event.currentTarget).catch(() => setMessage("Progress could not be saved.")); }}
      onEnded={(event) => { void save(event.currentTarget, true).catch(() => setMessage("Progress could not be saved.")); }}
      onError={() => setMessage("This video could not load. Refresh the page and try again.")}
    />
    <p role="status" className="mt-2 text-sm text-muted-foreground">{message}</p>
  </>;
}
