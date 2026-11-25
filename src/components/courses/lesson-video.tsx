"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function LessonVideo({
  src,
  courseId,
  lessonId,
  initialPosition,
}: {
  src: string;
  courseId: string;
  lessonId: string;
  initialPosition: number;
}) {
  const lastSaved = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState("1");
  const router = useRouter();
  const queue = useRef<Promise<void>>(Promise.resolve());
  const [message, setMessage] = useState("");
  async function save(video: HTMLVideoElement, completed = false) {
    if (!Number.isFinite(video.currentTime)) return;
    const position = Math.floor(video.currentTime);
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        const response = await fetch("/api/courses/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, lessonId, position, completed }),
          keepalive: true,
        });
        setMessage(
          response.ok
            ? completed
              ? "Lesson completed."
              : "Progress saved."
            : "Progress could not be saved. Check your connection.",
        );
        if (response.ok && completed) router.refresh();
      });
    await queue.current;
  }
  return (
    <>
      <video
        ref={videoRef}
        aria-label="Class video"
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-black"
        src={src}
        onLoadedMetadata={(event) => {
          if (
            initialPosition > 0 &&
            initialPosition < event.currentTarget.duration
          )
            event.currentTarget.currentTime = initialPosition;
        }}
        onTimeUpdate={(event) => {
          if (Date.now() - lastSaved.current > 15000) {
            lastSaved.current = Date.now();
            void save(event.currentTarget).catch(() =>
              setMessage("Progress could not be saved."),
            );
          }
        }}
        onPause={(event) => {
          void save(event.currentTarget).catch(() =>
            setMessage("Progress could not be saved."),
          );
        }}
        onEnded={(event) => {
          void save(event.currentTarget, true).catch(() =>
            setMessage("Progress could not be saved."),
          );
        }}
        onError={() =>
          setMessage(
            "This video could not load. Refresh the page and try again.",
          )
        }
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          Playback speed
          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(e) => {
              setSpeed(e.target.value);
              if (videoRef.current)
                videoRef.current.playbackRate = Number(e.target.value);
            }}
            className="rounded border border-border bg-background px-2 py-1"
          >
            {["0.75", "1", "1.25", "1.5", "1.75", "2"].map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-muted-foreground">
          Your place is saved as you learn.
        </span>
      </div>
      <p role="status" className="mt-2 text-sm text-muted-foreground">
        {message}
      </p>
    </>
  );
}
