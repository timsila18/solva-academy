"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitAcademyApplicationAction } from "@/features/tenants/actions";
import type { AcademyApplicationState } from "@/features/tenants/application-state";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

const initialValues = { academyName: "", slug: "", schoolId: "", website: "", country: "KE", county: "", shortDescription: "", experience: "", whyTeach: "", expectedAudience: "" };

export function AcademyApplicationForm({ schools, loadFailed, signedIn }: { schools: { id: string; name: string }[]; loadFailed: boolean; signedIn: boolean }) {
  const initialState: AcademyApplicationState = signedIn ? {} : { needsSignIn: true, error: "Sign in before submitting your academy application. You can keep this form open while you sign in." };
  const [state, action, pending] = useActionState(submitAcademyApplicationAction, initialState);
  const [values, setValues] = useState(initialValues);
  const [accepted, setAccepted] = useState(false);
  const available = !loadFailed && schools.length > 0;
  const field = (name: keyof typeof initialValues) => ({ name, value: values[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setValues((previous) => ({ ...previous, [name]: event.target.value })) });

  if (state.success) return <section role="status" className="mt-6 border-t border-border pt-6"><h2 className="text-xl font-semibold">Application submitted</h2><p className="mt-3 text-muted-foreground">Your academy application has been saved and sent for review. Your academy workspace will become available once approved.</p><Link href="/welcome" className="mt-4 inline-block text-primary underline">View application status</Link></section>;

  return <form action={action} className="mt-6 grid gap-4 md:grid-cols-2">
    {state.error && <div role="alert" className="border border-border p-4 text-sm md:col-span-2"><p>{state.error}</p>{state.needsSignIn && <div className="mt-2 flex flex-wrap gap-4"><Link href="/auth/sign-in?next=%2Facademies%2Fstart" target="_blank" rel="noopener noreferrer" className="text-primary underline">Sign in in a new tab, then return here and submit</Link><Link href="/auth/sign-up?intent=academy&next=%2Facademies%2Fstart" target="_blank" rel="noopener noreferrer" className="text-primary underline">Create account</Link></div>}</div>}
    <Field label="Academy name"><Input {...field("academyName")} required /></Field>
    <Field label="Preferred slug"><Input {...field("slug")} required /></Field>
    <Field label="School"><Select {...field("schoolId")} required disabled={!available}><option value="" disabled>{available ? "Select a school" : "Schools unavailable"}</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</Select>{!available && <p role="alert" className="text-sm text-muted-foreground">{loadFailed ? "We could not load schools. Please refresh the page and try again." : "No schools are available yet. Please try again later."}</p>}</Field>
    <Field label="Website"><Input {...field("website")} type="url" placeholder="https://example.com" /></Field>
    <Field label="Country"><Input {...field("country")} required /></Field>
    <Field label="County"><Input {...field("county")} /></Field>
    <Field label="Short description"><TextArea {...field("shortDescription")} minLength={20} required /></Field>
    <Field label="Experience"><TextArea {...field("experience")} /></Field>
    <Field label="Why do you want to teach?"><TextArea {...field("whyTeach")} minLength={20} required /></Field>
    <Field label="Expected audience"><TextArea {...field("expectedAudience")} minLength={10} required /></Field>
    <label className="flex gap-3 text-sm md:col-span-2"><input type="checkbox" name="termsAccepted" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} required /><span>I accept the academy owner terms and understand the application will be reviewed.</span></label>
    <Button className="md:col-span-2" type="submit" disabled={!available || pending}>{pending ? "Submitting application..." : "Submit academy application"}</Button>
  </form>;
}
