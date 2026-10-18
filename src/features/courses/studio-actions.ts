"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  parseClassTitles,
  studioClassSchema,
  studioDetailsSchema,
  studioQuestionSchema,
} from "@/lib/courses/studio-validation";
import type { StudioState } from "./studio-state";

function details(form: FormData) {
  const parsed = studioDetailsSchema.parse(Object.fromEntries(form));
  return {
    ...parsed,
    sellClasses: parsed.sellClasses === "on",
    coursePriceMinor: parsed.coursePriceKes * 100,
    classPriceMinor: parsed.classPriceKes * 100,
  };
}
export async function studioAction(
  _state: StudioState,
  form: FormData,
): Promise<StudioState> {
  const db = await createServerSupabaseClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "Please sign in again before saving." };
  let payload: Record<string, unknown>;
  let courseId: string | null = null;
  let command: string;
  try {
    command = z
      .enum([
        "create",
        "details",
        "add",
        "edit",
        "duplicate",
        "move_up",
        "move_down",
        "remove",
        "restore",
        "question_save",
        "question_remove",
        "submit",
      ])
      .parse(form.get("command"));
    if (command !== "create") courseId = z.uuid().parse(form.get("courseId"));
    payload = {};
    if (command === "create")
      payload = {
        ...details(form),
        workspaceId: z.uuid().parse(form.get("workspaceId")),
        templateId: z.uuid().parse(form.get("templateId")),
        titles: parseClassTitles(String(form.get("titles") ?? "")),
      };
    else if (command === "details") payload = details(form);
    else if (command === "add")
      payload = { titles: parseClassTitles(String(form.get("titles") ?? "")) };
    else if (command === "edit") {
      const value = studioClassSchema.parse(Object.fromEntries(form));
      payload = {
        ...value,
        priceMinor: value.priceKes * 100,
        lessonId: z.uuid().parse(form.get("lessonId")),
      };
    } else if (command === "question_save")
      payload = {
        ...studioQuestionSchema.parse({
          prompt: form.get("prompt"),
          explanation: form.get("explanation") ?? "",
          options: [0, 1, 2, 3].map((i) => form.get(`option${i}`)),
          correct: form.get("correct"),
        }),
        lessonId: z.uuid().parse(form.get("lessonId")),
        questionId: form.get("questionId")
          ? z.uuid().parse(form.get("questionId"))
          : null,
      };
    else if (command === "question_remove")
      payload = { questionId: z.uuid().parse(form.get("questionId")) };
    else if (command !== "submit")
      payload = { lessonId: z.uuid().parse(form.get("lessonId")) };
  } catch {
    return {
      error:
        "Check the required fields. Titles need at least 3 characters, prices must be whole KES amounts, and bulk lists may contain up to 100 classes.",
    };
  }
  const { data, error } = await db.rpc("studio_command", {
    target_course: courseId,
    command,
    payload,
  });
  if (error) {
    console.error("Course Studio save failed", error.code);
    return {
      error:
        error.code === "P0001"
          ? error.message
          : "The change could not be saved. Refresh and try again.",
    };
  }
  revalidatePath(`/courses/builder/${data.courseId}`);
  revalidatePath("/courses/builder/[courseId]/classes/[lessonId]", "page");
  revalidatePath("/instructor/courses");
  revalidatePath("/academy/courses");
  if (payload.lessonId)
    revalidatePath(
      `/courses/builder/${data.courseId}/classes/${payload.lessonId}`,
    );
  if (command === "create") redirect(`/courses/builder/${data.courseId}`);
  return {
    success:
      command === "submit"
        ? "Submitted for review. This draft is now read-only."
        : "Saved.",
  };
}
