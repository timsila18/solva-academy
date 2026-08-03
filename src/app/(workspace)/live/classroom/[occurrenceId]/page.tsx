import { createLivePollAction, generateJoinTokenAction, reportLiveIncidentAction, sendLiveChatMessageAction } from "@/features/live/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default async function SolcoClassroomPage({ params }: { params: Promise<{ occurrenceId: string }> }) {
  const { occurrenceId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Solco classroom" description="Premium classroom shell with provider-adapter controls, waiting room, chat, polls, whiteboard, resources, attendance, recording state, and host controls." />
      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="grid gap-5">
          <Card className="min-h-[24rem]">
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="font-semibold">Main video stage</h2><p className="mt-2 text-sm text-muted-foreground">Provider video surface mounts here. Mock provider verifies room/token flows without WebRTC infrastructure.</p></div>
              <span className="rounded-md border border-border px-3 py-2 text-xs">Network: adaptive</span>
            </div>
            <div className="mt-8 grid min-h-60 place-items-center rounded-lg border border-dashed border-border bg-muted text-center text-sm text-muted-foreground">Video provider frame placeholder</div>
          </Card>
          <Card>
            <h2 className="font-semibold">Host controls</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {["Admit", "Deny", "Mute", "Disable camera", "Promote", "Lock", "Record", "Breakouts", "End"].map((control) => <button key={control} className="rounded-md border border-border px-3 py-2 text-sm">{control}</button>)}
            </div>
          </Card>
        </div>
        <div className="grid gap-5">
          <Card>
            <h2 className="font-semibold">Join token</h2>
            <form action={generateJoinTokenAction} className="mt-4 grid gap-3">
              <Field label="Session ID"><Input name="sessionId" required /></Field>
              <input type="hidden" name="occurrenceId" value={occurrenceId} />
              <Field label="Role"><Select name="role" defaultValue="attendee"><option value="attendee">Attendee</option><option value="host">Host</option><option value="moderator">Moderator</option><option value="presenter">Presenter</option><option value="child_participant">Child participant</option></Select></Field>
              <Button type="submit">Generate short-lived token</Button>
            </form>
          </Card>
          <Card>
            <h2 className="font-semibold">Chat</h2>
            <form action={sendLiveChatMessageAction} className="mt-4 grid gap-3">
              <Field label="Session ID"><Input name="sessionId" required /></Field>
              <input type="hidden" name="occurrenceId" value={occurrenceId} />
              <Field label="Message"><TextArea name="message" required /></Field>
              <Button type="submit">Send</Button>
            </form>
          </Card>
          <Card>
            <h2 className="font-semibold">Poll</h2>
            <form action={createLivePollAction} className="mt-4 grid gap-3">
              <Field label="Session ID"><Input name="sessionId" required /></Field>
              <Field label="Question"><Input name="question" required /></Field>
              <Field label="Options"><TextArea name="options" placeholder={"One option per line"} /></Field>
              <Button type="submit">Launch poll</Button>
            </form>
          </Card>
          <Card>
            <h2 className="font-semibold">Report incident</h2>
            <form action={reportLiveIncidentAction} className="mt-4 grid gap-3">
              <Field label="Session ID"><Input name="sessionId" required /></Field>
              <input type="hidden" name="occurrenceId" value={occurrenceId} />
              <Field label="Type"><Select name="incidentType" defaultValue="other"><option value="child_safety_concern">Child safety</option><option value="harassment">Harassment</option><option value="privacy_breach">Privacy breach</option><option value="technical_abuse">Technical abuse</option><option value="other">Other</option></Select></Field>
              <Field label="Description"><TextArea name="description" required /></Field>
              <Button type="submit" variant="outline">Report</Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
