import { describe, expect, it } from "vitest";
import { calculateCompletionRate, calculateComplianceScore, getAssignmentStatus, validateEmployeeImportRows } from "@/lib/enterprise/analytics";

describe("enterprise analytics", () => {
  it("calculates assignment completion rate without cancelled and waived records", () => {
    expect(calculateCompletionRate([
      { status: "completed" },
      { status: "assigned" },
      { status: "waived" },
      { status: "cancelled" },
    ])).toBe(50);
  });

  it("calculates compliance score with critical risk penalty", () => {
    expect(calculateComplianceScore([
      { status: "completed", riskLevel: "normal" },
      { status: "overdue", riskLevel: "critical" },
    ])).toBe(40);
  });

  it("derives assignment status from dates", () => {
    const now = new Date("2026-07-25T12:00:00Z");
    expect(getAssignmentStatus(new Date("2026-07-24T12:00:00Z"), null, now)).toBe("overdue");
    expect(getAssignmentStatus(new Date("2026-07-26T12:00:00Z"), null, now)).toBe("assigned");
    expect(getAssignmentStatus(new Date("2026-07-24T12:00:00Z"), new Date("2026-07-25T10:00:00Z"), now)).toBe("completed");
  });

  it("validates employee import rows for duplicate and missing fields", () => {
    const results = validateEmployeeImportRows([
      { email: "a@example.com", employeeNumber: "001", department: "HR" },
      { email: "a@example.com", employeeNumber: "001", department: "" },
      { employeeNumber: "002", department: "ICT" },
    ]);

    expect(results[0].valid).toBe(true);
    expect(results[1].errors).toEqual(["duplicate_email", "duplicate_employee_number", "missing_department_mapping"]);
    expect(results[2].errors).toContain("missing_email");
  });
});
