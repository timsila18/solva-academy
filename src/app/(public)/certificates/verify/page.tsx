import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";

export default function VerifyCertificatePage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Verify certificate</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter a verification code. Private learner contact details are never shown.</p>
        <form className="mt-6 grid gap-4">
          <Field label="Verification code"><Input name="code" /></Field>
        </form>
      </Card>
    </section>
  );
}
