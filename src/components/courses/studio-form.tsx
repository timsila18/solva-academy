"use client";
import { useActionState } from "react";
import { studioAction } from "@/features/courses/studio-actions";
import { Button } from "@/components/ui/button";
export function StudioForm({
  children,
  className = "grid gap-4",
  submitLabel = "Save changes",
  confirm,
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  confirm?: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(studioAction, {});
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      <fieldset disabled={pending} className="contents">
        {children}
        {!compact && (
          <Button
            type="submit"
            disabled={pending}
            className="justify-self-start"
          >
            {pending ? "Saving..." : submitLabel}
          </Button>
        )}
      </fieldset>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      {state.success && !compact && (
        <p role="status" className="text-sm text-muted-foreground">
          {state.success}
        </p>
      )}
    </form>
  );
}
