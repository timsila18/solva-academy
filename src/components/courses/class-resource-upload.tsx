"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-fields";
export function ClassResourceUpload({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="mt-5 grid max-w-xl gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const file = form.get("file");
        if (
          !(file instanceof File) ||
          !file.size ||
          file.size > 50 * 1024 * 1024
        ) {
          setMessage("Choose a file up to 50 MB.");
          return;
        }
        setBusy(true);
        setMessage("Uploading...");
        try {
          const response = await fetch("/api/courses/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId,
              lessonId,
              size: file.size,
              type: file.type,
              rights: form.get("rights") === "on",
            }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          const db = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          );
          const { error } = await db.storage
            .from("course-resources")
            .uploadToSignedUrl(result.path, result.token, file, {
              contentType: file.type,
            });
          if (error) throw new Error("Upload failed. Please try again.");
          const saved = await fetch("/api/courses/resources", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId,
              lessonId,
              path: result.path,
              title: form.get("title"),
              rights: true,
            }),
          });
          if (!saved.ok) throw new Error((await saved.json()).error);
          setMessage("Resource added.");
          router.refresh();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Upload failed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <fieldset className="contents" disabled={busy}>
        <Field label="Resource title">
          <Input name="title" required maxLength={200} />
        </Field>
        <Field label="File">
          <input
            name="file"
            type="file"
            accept=".pdf,.pptx,.png,.jpg,.jpeg"
            required
            className="max-w-full text-sm"
          />
        </Field>
        <label className="flex gap-3 text-sm">
          <input type="checkbox" name="rights" required />I own this material or
          have permission to share it.
        </label>
        <Button type="submit" variant="outline" className="justify-self-start">
          <Upload size={16} />
          {busy ? "Uploading..." : "Add resource"}
        </Button>
      </fieldset>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </form>
  );
}
