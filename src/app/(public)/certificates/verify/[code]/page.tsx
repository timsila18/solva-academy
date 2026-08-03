import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type CertificateVerification = {
  certificate_number: string;
  verification_code: string;
  status: string;
  issued_at: string | null;
  revoked_at: string | null;
};

export default async function CertificateVerificationResultPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.rpc("verify_certificate", { code }).maybeSingle();
  const certificate = data as CertificateVerification | null;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Card>
        <Badge>{certificate?.status ?? "Not found"}</Badge>
        <h1 className="mt-4 text-2xl font-semibold">Certificate verification</h1>
        {certificate ? (
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <p>Certificate <span className="font-mono text-foreground">{certificate.certificate_number}</span> is recorded by Solva Academy.</p>
            <p>Verification code: <span className="font-mono text-foreground">{certificate.verification_code}</span></p>
            <p>Issued: {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString("en-KE") : "Not available"}</p>
            {certificate.revoked_at ? <p>Revoked: {new Date(certificate.revoked_at).toLocaleDateString("en-KE")}</p> : null}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No public certificate record was found for <span className="font-mono text-foreground">{code}</span>.</p>
        )}
      </Card>
    </section>
  );
}
