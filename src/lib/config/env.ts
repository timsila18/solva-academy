import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  SITE_ENV: z.enum(["local", "preview", "staging", "production"]).default("local"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  SUPPORT_EMAIL: z.string().email().default("support@solvaone.co.ke"),
  DEFAULT_COUNTRY: z.string().default("KE"),
  DEFAULT_LANGUAGE: z.string().default("en"),
  DEFAULT_CURRENCY: z.string().default("KES"),
  FOUNDING_ADMIN_EMAIL: z.string().email().default("timsila18@gmail.com"),
  SOLCO_API_URL: z.string().url().optional().or(z.literal("")),
  AI_GATEWAY_URL: z.string().url().optional().or(z.literal("")),
  AI_PROVIDER: z.enum(["mock", "openai", "azure-openai", "anthropic", "gemini", "local"]).default("mock"),
  AI_DEFAULT_MODEL: z.string().default("solco-mock-v1"),
  AI_OPENAI_API_KEY: z.string().optional(),
  AI_AZURE_OPENAI_ENDPOINT: z.string().url().optional().or(z.literal("")),
  AI_AZURE_OPENAI_API_KEY: z.string().optional(),
  AI_ANTHROPIC_API_KEY: z.string().optional(),
  AI_GEMINI_API_KEY: z.string().optional(),
  AI_REQUEST_DAILY_LIMIT: z.coerce.number().int().positive().default(100),
  AI_COST_LIMIT_MINOR: z.coerce.number().nonnegative().default(0),
  PAYMENT_PROVIDER: z.string().optional(),
  EMAIL_PROVIDER: z.string().optional(),
  MONITORING_PROVIDER: z.string().default("local"),
  ERROR_REPORTING_DSN: z.string().optional(),
  BACKUP_PROVIDER: z.string().default("supabase"),
  BACKUP_RETENTION_DAYS: z.coerce.number().int().positive().default(30),
  MAINTENANCE_MODE: z.coerce.boolean().default(false),
  PLATFORM_BILLING_EMAIL: z.email().default("billing@solvaone.co.ke"),
});

export type AppEnv = z.infer<typeof envSchema>;

let parsedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (!parsedEnv) {
    parsedEnv = envSchema.parse(process.env);
  }

  return parsedEnv;
}

export function hasSupabaseBrowserEnv() {
  const env = getEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function requireSupabaseServerEnv() {
  const env = getEnv();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase public environment variables are required.");
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function requireSupabaseServiceEnv() {
  const env = getEnv();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service-role environment variables are required server-side.");
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
