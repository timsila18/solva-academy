import { getEnv } from "@/lib/config/env";

export type PublicSystemSettings = {
  platformName: string;
  publicUrl: string;
  supportEmail: string;
  defaultCurrency: string;
  defaultCountry: string;
  defaultLanguage: string;
  registrationEnabled: boolean;
  maintenanceMode: boolean;
};

export function getFallbackSystemSettings(): PublicSystemSettings {
  const env = getEnv();
  return {
    platformName: "Solva Academy",
    publicUrl: env.NEXT_PUBLIC_APP_URL,
    supportEmail: env.SUPPORT_EMAIL,
    defaultCurrency: env.DEFAULT_CURRENCY,
    defaultCountry: env.DEFAULT_COUNTRY,
    defaultLanguage: env.DEFAULT_LANGUAGE,
    registrationEnabled: true,
    maintenanceMode: false,
  };
}
