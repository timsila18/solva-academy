import { EmptyState } from "@/components/feedback/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default function HelpPage() {
  return <EmptyState title="Help centre" description="Find support for accounts, courses, payments, live learning, certificates, and organization workspaces." action={<ButtonLink href="/support" variant="outline">Contact support</ButtonLink>} />;
}
