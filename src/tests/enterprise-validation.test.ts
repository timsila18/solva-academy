import { describe, expect, it } from "vitest";
import { employeeSchema, learningAssignmentSchema, skillSchema } from "@/lib/validation/enterprise";

const organizationId = "00000000-0000-4000-8000-000000000001";

describe("enterprise validation", () => {
  it("accepts employee learning directory records", () => {
    const employee = employeeSchema.parse({
      organizationId,
      fullName: "Jane Wanjiku",
      email: "jane@example.com",
      employmentType: "employee",
    });

    expect(employee.email).toBe("jane@example.com");
  });

  it("rejects invalid employee email", () => {
    expect(() => employeeSchema.parse({ organizationId, fullName: "Jane", email: "bad" })).toThrow();
  });

  it("accepts organization-wide mandatory assignments", () => {
    const assignment = learningAssignmentSchema.parse({
      organizationId,
      title: "Cyber Security Month",
      targetType: "organization",
      mandatory: "true",
      priority: "high",
      certificateRequired: "true",
    });

    expect(assignment.mandatory).toBe(true);
    expect(assignment.certificateRequired).toBe(true);
  });

  it("accepts organization skills", () => {
    expect(skillSchema.parse({ organizationId, name: "Payroll Processing" }).name).toBe("Payroll Processing");
  });
});
