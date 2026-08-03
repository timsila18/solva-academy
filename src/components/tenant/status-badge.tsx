import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  changes_requested: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  archived: "Archived",
  closed: "Closed",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge>{labels[status] ?? status}</Badge>;
}
