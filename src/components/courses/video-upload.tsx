"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload as TusUpload } from "tus-js-client";
import { Upload, Pause, Play, X, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MAX_CLASS_VIDEO_BYTES,
  resumableStorageEndpoint,
} from "@/lib/courses/video-policy";
import { uploadHostedVideo } from "@/lib/courses/hosted-upload";
export function VideoUpload({
  courseId,
  lessonId,
  pendingUploadId,
}: {
  courseId: string;
  lessonId: string;
  pendingUploadId?: string;
}) {
  const [busy, setBusy] = useState(Boolean(pendingUploadId));
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(pendingUploadId ? "Checking the earlier upload. Keep the compressor running, or cancel to choose another video." : "");
  const [pendingPath, setPendingPath] = useState<string | null>(pendingUploadId ? `hostafrica:${pendingUploadId}` : null);
  const upload = useRef<{
    abort: () => Promise<void>;
    start: () => void;
  } | null>(null);
  const router = useRouter();
  const attach = async (path: string) => {
    const response = await fetch("/api/courses/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, lessonId, path }),
    });
    if (!response.ok)
      throw new Error(
        (await response.json()).error ?? "Could not attach the video.",
      );
  };
  useEffect(() => {
    if (!pendingPath) return;
    let stopped = false;
    let inFlight = false;
    const check = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch(
          "/api/courses/media?" +
            new URLSearchParams({ courseId, lessonId, path: pendingPath }),
          { cache: "no-store" },
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (result.ready) {
          await attach(pendingPath);
          if (!stopped) {
            setPendingPath(null);
            setBusy(false);
            setMessage("Video saved to this class.");
            router.refresh();
          }
        }
      } catch (error) {
        if (!stopped) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not check the upload.",
          );
          setPendingPath(null);
          setBusy(false);
        }
      } finally {
        inFlight = false;
      }
    };
    const timer = setInterval(() => void check(), 7000);
    void check();
    return () => {
      stopped = true;
      clearInterval(timer);
    };
    // Attachment uses the identifiers captured for this upload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPath, courseId, lessonId, router]);
  useEffect(
    () => () => {
      void upload.current?.abort();
    },
    [],
  );
  async function authorization(size: number, name: string) {
    const response = await fetch("/api/courses/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        lessonId,
        name,
        size,
        type: "video/mp4",
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }
  async function compressOriginal() {
    // Open synchronously so browsers do not block the local helper as a popup.
    const helper = window.open("about:blank", "_blank");
    if (!helper) {
      setMessage("Allow the compressor window to open, then try again.");
      return;
    }
    setBusy(true);
    setMessage("Connecting to the compressor on this computer...");
    try {
      const target = await authorization(
        MAX_CLASS_VIDEO_BYTES,
        "compressed-class.mp4",
      );
      helper.opener = null;
      helper.location.href =
        "http://127.0.0.1:4318/?academySession=" +
        crypto.randomUUID() +
        "#academy=" +
        encodeURIComponent(JSON.stringify(target));
      setPendingPath(target.path);
      setMessage(
        "Choose the original in the compressor window. Keep this class page open until the video is saved.",
      );
    } catch (error) {
      helper.close();
      setBusy(false);
      setMessage(
        error instanceof Error ? error.message : "Could not open compression.",
      );
    }
  }
  return (
    <div className="mt-4 max-w-3xl space-y-4">
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const file = new FormData(event.currentTarget).get("video");
          if (!(file instanceof File) || !file.size) {
            setMessage("Choose a video first.");
            return;
          }
          if (file.size > MAX_CLASS_VIDEO_BYTES || file.type !== "video/mp4") {
            await compressOriginal();
            return;
          }
          setBusy(true);
          setPaused(false);
          setProgress(0);
          setMessage("Starting upload...");
          try {
            const target = await authorization(file.size, file.name);
            if (target.provider === "hostafrica") {
              let controller = new AbortController();
              const start = () => {
                controller = new AbortController();
                const signal = controller.signal;
                void uploadHostedVideo(file, target, signal, (percent) => {
                  setProgress(percent);
                  setMessage("Uploading compressed video...");
                })
                  .then(() => attach(target.path))
                  .then(() => {
                    if (signal.aborted) return;
                    setMessage("Video saved to this class.");
                    setBusy(false);
                    setPaused(false);
                    upload.current = null;
                    router.refresh();
                  })
                  .catch((error) => {
                    if (signal.aborted) return;
                    setBusy(false);
                    setPaused(true);
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Upload interrupted. Resume to retry.",
                    );
                  });
              };
              upload.current = {
                start,
                abort: async () => {
                  controller.abort();
                },
              };
              start();
              return;
            }
            const task = new TusUpload(file, {
              endpoint: resumableStorageEndpoint(target.storageOrigin),
              chunkSize: 6 * 1024 * 1024,
              retryDelays: [0, 3000, 5000, 10000, 20000],
              headers: {
                "x-signature": target.token,
                apikey: target.publishableKey,
              },
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: true,
              metadata: {
                bucketName: "course-media",
                objectName: target.path,
                contentType: "video/mp4",
                cacheControl: "3600",
              },
              onProgress: (done, total) => {
                setProgress(Math.floor((done / total) * 100));
                setMessage("Uploading compressed video...");
              },
              onError: () => {
                setBusy(false);
                setPaused(true);
                setMessage(
                  "Upload interrupted. Resume to retry, or cancel and start again.",
                );
              },
              onSuccess: () => {
                void attach(target.path)
                  .then(() => {
                    setMessage("Video saved to this class.");
                    setBusy(false);
                    setPaused(false);
                    upload.current = null;
                    router.refresh();
                  })
                  .catch((error) => {
                    setMessage(error.message);
                    setBusy(false);
                  });
              },
            });
            upload.current = task;
            task.start();
          } catch (error) {
            setBusy(false);
            setMessage(
              error instanceof Error ? error.message : "Upload failed.",
            );
          }
        }}
      >
        <input
          aria-label="Class video"
          type="file"
          name="video"
          accept="video/*,.mkv,.avi,.mov"
          disabled={busy || paused}
          required
          className="max-w-full text-sm"
        />
        <Button type="submit" variant="outline" disabled={busy || paused}>
          <Upload size={16} />
          Upload video
        </Button>
      </form>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={busy || paused}
          onClick={() => void compressOriginal()}
        >
          <FileVideo size={16} />
          Compress original
        </Button>
        {busy && !pendingPath && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void upload.current?.abort().then(() => {
                setBusy(false);
                setPaused(true);
                setMessage("Upload paused.");
              });
            }}
          >
            <Pause size={16} />
            Pause
          </Button>
        )}
        {paused && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPaused(false);
              setBusy(true);
              upload.current?.start();
            }}
          >
            <Play size={16} />
            Resume
          </Button>
        )}
        {(busy || paused) && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void upload.current?.abort();
              upload.current = null;
              if (pendingPath?.startsWith("hostafrica:"))
                void fetch("/api/courses/media", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ path: pendingPath }),
                });
              setPendingPath(null);
              setBusy(false);
              setPaused(false);
              setMessage(
                pendingPath
                  ? "Stopped checking. Cancel any running job in the compressor window too."
                  : "Upload cancelled.",
              );
            }}
          >
            <X size={16} />
            Cancel
          </Button>
        )}
      </div>
      {busy && !pendingPath && (
        <progress
          aria-label="Video upload progress"
          max={100}
          value={progress}
          className="h-2 w-full accent-primary"
        />
      )}
      {pendingPath && (
        <a
          href="http://127.0.0.1:4318/"
          target="solva-video-compressor"
          className="inline-block text-sm text-primary underline"
        >
          Open local compressor
        </a>
      )}
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
