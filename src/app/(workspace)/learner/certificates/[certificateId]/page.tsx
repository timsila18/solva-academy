import { notFound } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PrintRecord } from "@/components/learning/print-record";
export default async function CertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { certificateId } = await params;
  const db = createServiceSupabaseClient();
  const { data: c } = await db
    .from("certificates")
    .select("*")
    .eq("id", certificateId)
    .eq("learner_id", user.id)
    .maybeSingle();
  if (!c) notFound();
  const url = `https://academy.solvaone.co.ke/certificates/verify/${encodeURIComponent(c.verification_code)}`;
  const qr = await QRCode.toDataURL(url, { width: 128, margin: 2 });
  return (
    <DashboardShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={`/learn/enrollment/${c.enrollment_id}`}
          className="text-primary underline"
        >
          Learning record
        </Link>
        <PrintRecord />
      </div>
      <article className="mx-auto max-w-4xl border border-gray-300 bg-white p-6 text-center text-black sm:p-12 print:border-0">
        <p className="text-lg font-semibold text-[#0066ff]">
          {c.snapshot.issuer ?? "Solva Academy"}
        </p>
        <h1 className="mt-8 font-serif text-3xl sm:text-4xl">
          Certificate of Completion
        </h1>
        {c.status !== "issued" && (
          <p role="alert" className="mt-5 font-semibold text-red-700">
            Certificate status: {c.status}
          </p>
        )}
        <p className="mt-8 text-sm text-gray-600">This certifies that</p>
        <p className="mt-4 break-words font-serif text-3xl">
          {c.snapshot.learner_name ?? "Name not recorded"}
        </p>
        <p className="mt-6 text-sm text-gray-600">
          has completed the required learning for
        </p>
        <h2 className="mt-4 text-2xl font-semibold">
          {c.snapshot.programme_title ??
            c.snapshot.course_title ??
            "Course completion"}
        </h2>
        <p className="mt-8 text-sm">
          Issued{" "}
          {new Date(c.issued_at).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-gray-300 pt-6 text-left">
          <div className="min-w-0">
            <p className="text-xs text-gray-600">Certificate number</p>
            <p className="mt-1 break-all text-xs">{c.certificate_number}</p>
            <Link
              href={url}
              className="mt-3 inline-block text-sm text-[#0066ff] underline"
            >
              Verify this certificate
            </Link>
          </div>
          {/* Generated locally, without sharing learner data with a QR service. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            width={112}
            height={112}
            alt="QR code for certificate verification"
          />
        </div>
        <p className="mt-6 text-xs text-gray-500">
          A Solva Academy course-completion award. Not a university degree or
          professional licence.
        </p>
      </article>
    </DashboardShell>
  );
}
