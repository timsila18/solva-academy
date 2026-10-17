import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ records: {} as Record<string, unknown>, filters: [] as unknown[][] }));
vi.mock("@/lib/supabase/server", () => ({ createServiceSupabaseClient: () => ({ from: (table: string) => {
  const query = {
    select: () => query,
    eq: (...args: unknown[]) => { state.filters.push([table, ...args]); return query; },
    in: () => query, or: () => query,
    maybeSingle: async () => ({ data: state.records[table] ?? null }),
    single: async () => ({ data: state.records[table] ?? null }),
    order: async () => ({ data: state.records[table] ?? null }),
  }; return query;
} }) }));
import { getLearningAccess } from "@/lib/courses/access";
beforeEach(() => { state.records = {}; state.filters = []; });
describe("course and class access", () => {
  it("denies access without a purchased entitlement", async () => {
    expect(await getLearningAccess("course", "user")).toBeNull();
  });
  it("limits a class purchase to its purchased lesson and version", async () => {
    state.records.episode_entitlements = [{ id: "access", lesson_id: "lesson-1", version_id: "v1" }];
    const access = await getLearningAccess("course", "user", "lesson-1");
    expect(access?.episodeOnly).toBe(true);
    expect(access?.allowedLessonIds).toEqual(["lesson-1"]);
    expect(access?.allowedLessonIds?.includes("lesson-2")).toBe(false);
    expect(state.filters).toContainEqual(["episode_entitlements", "learner_id", "user"]);
    expect(state.filters).toContainEqual(["episode_entitlements", "lesson_id", "lesson-1"]);
  });
  it("does not treat an expired course enrollment as full access", async () => {
    state.records.enrollments = { id: "enr", course_version_id: "v1", access_ends_at: "2000-01-01" };
    expect(await getLearningAccess("course", "user")).toBeNull();
  });
  it("requires the full-course entitlement to remain active", async () => {
    state.records.enrollments = { id: "enr", course_version_id: "v1", entitlement_id: "e1" };
    state.records.entitlements = { status: "revoked" };
    expect(await getLearningAccess("course", "user")).toBeNull();
    state.records.entitlements = { status: "active" };
    expect((await getLearningAccess("course", "user"))?.episodeOnly).toBe(false);
  });
});
