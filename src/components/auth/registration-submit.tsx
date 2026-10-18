"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function RegistrationSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="sm:col-span-2"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Creating your account..." : "Create account"}
    </Button>
  );
}
