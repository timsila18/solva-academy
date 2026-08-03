export type EnterpriseAssignment = {
  status: "assigned" | "started" | "in_progress" | "completed" | "overdue" | "expired" | "cancelled" | "waived" | "failed" | "reassigned";
  mandatory?: boolean;
};

export type ComplianceRecord = {
  status: "assigned" | "completed" | "overdue" | "expiring" | "expired" | "waived" | "failed";
  riskLevel?: "low" | "normal" | "high" | "critical";
};

export function calculateCompletionRate(assignments: EnterpriseAssignment[]) {
  const active = assignments.filter((assignment) => !["cancelled", "waived"].includes(assignment.status));
  if (!active.length) return 0;
  return Math.round((active.filter((assignment) => assignment.status === "completed").length / active.length) * 100);
}

export function calculateComplianceScore(records: ComplianceRecord[]) {
  const applicable = records.filter((record) => record.status !== "waived");
  if (!applicable.length) return 0;
  const completed = applicable.filter((record) => record.status === "completed").length;
  const criticalPenalty = applicable.filter((record) => record.riskLevel === "critical" && record.status !== "completed").length * 10;
  return Math.max(0, Math.round((completed / applicable.length) * 100) - criticalPenalty);
}

export function getAssignmentStatus(nextDueAt?: Date | null, completedAt?: Date | null, now = new Date()) {
  if (completedAt) return "completed";
  if (nextDueAt && nextDueAt < now) return "overdue";
  return "assigned";
}

export function validateEmployeeImportRows(rows: Array<{ email?: string; employeeNumber?: string; department?: string }>) {
  const seenEmails = new Set<string>();
  const seenNumbers = new Set<string>();
  return rows.map((row, index) => {
    const errors: string[] = [];
    const email = row.email?.trim().toLowerCase();
    const number = row.employeeNumber?.trim();
    if (!email) errors.push("missing_email");
    if (email && seenEmails.has(email)) errors.push("duplicate_email");
    if (number && seenNumbers.has(number)) errors.push("duplicate_employee_number");
    if (!row.department?.trim()) errors.push("missing_department_mapping");
    if (email) seenEmails.add(email);
    if (number) seenNumbers.add(number);
    return { rowNumber: index + 1, valid: errors.length === 0, errors };
  });
}
