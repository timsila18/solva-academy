import { notFound } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { addSupportMessageAction } from "@/features/platform-ops/actions";
import { Button } from "@/components/ui/button";
export default async function SupportTicket({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { ticketId } = await params;
  const db = await createServerSupabaseClient();
  const { data: t } = await db
    .from("support_tickets")
    .select("id,ticket_number,subject,description,status")
    .eq("id", ticketId)
    .eq("requester_id", user.id)
    .single();
  if (!t) notFound();
  const { data: messages, error } = await db
    .from("support_messages")
    .select("id,body,message_type,created_at")
    .eq("ticket_id", ticketId)
    .eq("visibility", "customer")
    .order("created_at");
  return (
    <DashboardShell>
      <section className="max-w-3xl">
        <Link href="/support" className="text-primary underline">
          All support tickets
        </Link>
        <p className="mt-5 text-xs text-muted-foreground">
          {t.ticket_number} · {t.status.replaceAll("_", " ")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{t.subject}</h1>
        <p className="mt-5 whitespace-pre-wrap border-b border-border pb-5 text-sm">
          {t.description}
        </p>
        <div className="divide-y divide-border">
          {messages?.map((m) => (
            <article key={m.id} className="py-5">
              <p className="text-xs text-muted-foreground">
                {m.message_type === "support_reply" ? "Solva support" : "You"} ·{" "}
                {new Date(m.created_at).toLocaleString("en-KE")}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.body}</p>
            </article>
          ))}
        </div>
        {error && <p role="alert">Replies could not load. Please refresh.</p>}
        <form action={addSupportMessageAction} className="mt-6 grid gap-3">
          <input type="hidden" name="ticketId" value={ticketId} />
          <input type="hidden" name="messageType" value="customer_reply" />
          <label className="text-sm">
            Your reply
            <textarea
              name="body"
              required
              maxLength={5000}
              rows={5}
              className="mt-2 w-full rounded border border-border bg-background px-3 py-2"
            />
          </label>
          <Button type="submit">Send reply</Button>
        </form>
      </section>
    </DashboardShell>
  );
}
