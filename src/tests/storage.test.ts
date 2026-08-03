import { describe, expect, it } from "vitest";
import { buildStoragePath, validateUpload } from "@/lib/security/storage";

describe("storage foundation", () => {
  it("accepts valid profile avatar files", () => {
    const result = validateUpload({ name: "avatar.png", size: 1000, type: "image/png" }, "profile_avatar");
    expect(result.ok).toBe(true);
  });

  it("rejects unsafe file types", () => {
    const result = validateUpload({ name: "avatar.exe", size: 1000, type: "application/x-msdownload" }, "profile_avatar");
    expect(result.ok).toBe(false);
  });

  it("creates tenant-aware safe paths", () => {
    const result = buildStoragePath({ purpose: "academy_logo", ownerId: "academy-a", fileName: "My Logo.png" });
    expect(result.bucket).toBe("academy-branding");
    expect(result.path).toContain("academy_logo/academy-a/");
    expect(result.path).toMatch(/my-logo\.png$/);
  });

  it("keeps course resource paths tenant scoped", () => {
    const result = buildStoragePath({ purpose: "course_resource", ownerId: "course-a", fileName: "PAYE Worksheet.pdf" });
    expect(result.bucket).toBe("course-resources");
    expect(result.path).toContain("course_resource/course-a/");
  });
});
