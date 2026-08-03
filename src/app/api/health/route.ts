import { NextResponse } from "next/server";
import { getEnv, hasSupabaseBrowserEnv } from "@/lib/config/env";

export async function GET() {
  const env = getEnv();
  return NextResponse.json({
    ok: true,
    application: "Solva Academy",
    environment: env.SITE_ENV,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    databaseConfigured: Boolean(env.DATABASE_URL),
    authConfigured: hasSupabaseBrowserEnv(),
    storageConfigured: hasSupabaseBrowserEnv(),
    monitoringProvider: env.MONITORING_PROVIDER,
    backupProvider: env.BACKUP_PROVIDER,
    maintenanceMode: env.MAINTENANCE_MODE,
    aiProvider: env.AI_PROVIDER,
    paymentProvider: env.PAYMENT_PROVIDER || "not-configured",
    buildVersion: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  });
}
