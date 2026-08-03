import { registerForLiveSessionAction } from "@/features/live/actions";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LiveSessionDetailPage({ params }: { params: Promise<{ sessionSlug: string }> }) {
  const { sessionSlug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("live_sessions").select("id,title,short_description,full_description,starts_at,ends_at,timezone,duration_minutes,capacity,visibility,registration_mode,recording_policy,status,child_safety_enabled,waiting_room_enabled,code_of_conduct").eq("slug", sessionSlug).maybeSingle();
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Card>
        <p className="text-sm font-medium text-primary">Solco live learning</p>
        <h1 className="mt-2 text-3xl font-semibold">{data?.title ?? sessionSlug.replaceAll("-", " ")}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{data?.short_description ?? "This session is private, unavailable, or not yet published."}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{data?.status ?? "not found"}</Badge>
          <Badge>{data?.timezone ?? "Africa/Nairobi"}</Badge>
          <Badge>{data?.registration_mode ?? "private"}</Badge>
          {data?.child_safety_enabled ? <Badge>Child-safe controls</Badge> : null}
          {data?.waiting_room_enabled ? <Badge>Waiting room</Badge> : null}
        </div>
        {data ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <p className="text-sm text-muted-foreground">Starts: {new Date(data.starts_at).toLocaleString("en-KE", { timeZone: data.timezone })}</p>
            <p className="text-sm text-muted-foreground">Duration: {data.duration_minutes} minutes</p>
            <p className="text-sm text-muted-foreground">Capacity: {data.capacity ?? "Not capped"}</p>
            <p className="text-sm text-muted-foreground">Recording: {data.recording_policy}</p>
          </div>
        ) : null}
        {data ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href={`/api/live/sessions/${data.id}/ics`} variant="outline">Download ICS</ButtonLink>
            <ButtonLink href={`/live/classroom/${data.id}`} variant="outline">Open classroom</ButtonLink>
          </div>
        ) : null}
      </Card>
      {data ? (
        <Card className="mt-6">
          <h2 className="font-semibold">Register</h2>
          <form action={registerForLiveSessionAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="sessionId" value={data.id} />
            <Field label="Name"><Input name="name" /></Field>
            <Field label="Email"><Input name="email" type="email" /></Field>
            <Field label="Terms"><Select name="termsAccepted" defaultValue="true"><option value="true">Accepted</option></Select></Field>
            <Field label="Guardian consent"><Select name="guardianConsent" defaultValue="false"><option value="false">Not required</option><option value="true">Provided</option></Select></Field>
            <Button type="submit" className="md:col-span-2">Register or join waitlist</Button>
          </form>
        </Card>
      ) : null}
    </section>
  );
}
