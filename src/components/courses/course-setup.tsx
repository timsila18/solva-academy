"use client";
import { useActionState, useState } from "react";
import { studioAction } from "@/features/courses/studio-actions";
import { StudioDetails } from "./studio-details";
import { Field, Select, TextArea } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
type Choice = { id: string; name: string };
export function CourseSetup({
  workspaces,
  schools,
  levels,
  templates,
}: {
  workspaces: Choice[];
  schools: Choice[];
  levels: Choice[];
  templates: Choice[];
}) {
  const [step, setStep] = useState(0);
  const [state, action, pending] = useActionState(studioAction, {});
  return (
    <form
      action={action}
      className="max-w-4xl space-y-6"
      onSubmit={(event) => {
        if (step !== 1) event.preventDefault();
      }}
    >
      <input type="hidden" name="command" value="create" />
      <ol className="flex gap-8 border-b border-border pb-4 text-sm">
        <li aria-current={step === 0 ? "step" : undefined}>
          1. Course details & pricing
        </li>
        <li aria-current={step === 1 ? "step" : undefined}>2. Classes</li>
      </ol>
      <fieldset disabled={pending} hidden={step !== 0} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Workspace">
            <Select name="workspaceId" required>
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Course format">
            <Select name="templateId" required>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <StudioDetails schools={schools} levels={levels} />
      </fieldset>
      <fieldset hidden={step !== 1} disabled={pending}>
        <Field label="Class titles (one per line)">
          <TextArea name="titles" rows={10} />
        </Field>
      </fieldset>
      {state.error && (
        <p role="alert" className="text-error">
          {state.error}
        </p>
      )}
      <div className="flex gap-3">
        {step === 1 && (
          <Button type="button" variant="outline" onClick={() => setStep(0)}>
            Back
          </Button>
        )}
        {step === 0 ? (
          <Button
            type="button"
            onClick={(event) => {
              const fields = event.currentTarget.form!.querySelectorAll<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >(
                "fieldset:not([hidden]) input,fieldset:not([hidden]) select,fieldset:not([hidden]) textarea",
              );
              for (const field of fields) {
                if (!field.reportValidity()) return;
              }
              setStep(1);
            }}
          >
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create draft"}
          </Button>
        )}
      </div>
    </form>
  );
}
