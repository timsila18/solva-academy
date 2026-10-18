import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  parseClassTitles,
  studioClassSchema,
  studioDetailsSchema,
  studioQuestionSchema,
} from "@/lib/courses/studio-validation";
const mocks = vi.hoisted(() => ({
  user: { id: "owner" } as { id: string } | null,
  rpc: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({
    auth: { getUser: async () => ({ data: { user: mocks.user } }) },
    rpc: mocks.rpc,
  }),
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
import { studioAction } from "@/features/courses/studio-actions";
const id = "37fc22f0-b065-4e13-bdd5-02852c3f950b";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user = { id: "owner" };
  mocks.rpc.mockResolvedValue({ data: { courseId: id }, error: null });
});
describe("Course Studio validation", () => {
  it("accepts any number of titles up to the per-request limit, not a fixed sixteen", () => {
    expect(parseClassTitles(" First class\r\n\nSecond class ")).toEqual([
      "First class",
      "Second class",
    ]);
    expect(parseClassTitles("")).toEqual([]);
    expect(() =>
      parseClassTitles(Array(101).fill("A class").join("\n")),
    ).toThrow();
  });
  it("rejects negative and fractional prices", () => {
    const details = {
      title: "New course",
      description: "A sufficiently long course description",
      schoolId: id,
      levelId: id,
      language: "en",
      coursePriceKes: -1,
      classPriceKes: 1000,
    };
    expect(studioDetailsSchema.safeParse(details).success).toBe(false);
    expect(
      studioDetailsSchema.safeParse({ ...details, coursePriceKes: 16000 })
        .success,
    ).toBe(true);
    expect(
      studioClassSchema.safeParse({
        title: "Class",
        summary: "",
        outcomes: "",
        exercise: "",
        minutes: 15,
        priceKes: 1.5,
      }).success,
    ).toBe(false);
  });
  it("requires four answers and a valid correct-answer index", () => {
    expect(
      studioQuestionSchema.safeParse({
        prompt: "A question?",
        options: ["A", "B", "C", "D"],
        correct: 4,
      }).success,
    ).toBe(false);
    expect(
      studioQuestionSchema.safeParse({
        prompt: "A question?",
        options: ["A", "B", "C", "D"],
        correct: 0,
        explanation: "",
      }).success,
    ).toBe(true);
  });
});
describe("Studio server action", () => {
  it("does not mutate for signed-out users", async () => {
    mocks.user = null;
    expect((await studioAction({}, new FormData())).error).toMatch(/sign in/i);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("rejects malformed course IDs before reaching the database", async () => {
    const f = new FormData();
    f.set("command", "add");
    f.set("courseId", "foreign");
    expect((await studioAction({}, f)).error).toBeTruthy();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("passes bulk titles through the guarded transaction", async () => {
    const f = new FormData();
    f.set("command", "add");
    f.set("courseId", id);
    f.set("titles", "First class\nSecond class");
    expect((await studioAction({}, f)).success).toBe("Saved.");
    expect(mocks.rpc).toHaveBeenCalledWith("studio_command", {
      target_course: id,
      command: "add",
      payload: { titles: ["First class", "Second class"] },
    });
  });
  it("does not claim success when the database rejects a change", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.rpc.mockResolvedValue({
      data: null,
      error: {
        code: "P0001",
        message: "Course is read-only or access was denied",
      },
    });
    const f = new FormData();
    f.set("command", "submit");
    f.set("courseId", id);
    expect((await studioAction({}, f)).error).toMatch(/read-only/);
    expect(mocks.revalidate).not.toHaveBeenCalled();
    log.mockRestore();
  });
});
