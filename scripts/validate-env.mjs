const requiredByEnv = {
  production: [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
    "FOUNDING_ADMIN_EMAIL",
    "SUPPORT_EMAIL",
  ],
  staging: ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "DATABASE_URL"],
  preview: ["NEXT_PUBLIC_APP_URL"],
  local: ["NEXT_PUBLIC_APP_URL"],
};

const siteEnv = process.env.SITE_ENV || "local";
if (siteEnv === "local" && !process.env.NEXT_PUBLIC_APP_URL) {
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
}
const required = requiredByEnv[siteEnv] || requiredByEnv.local;
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required ${siteEnv} environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`Environment validation passed for ${siteEnv}. Secrets were not printed.`);
