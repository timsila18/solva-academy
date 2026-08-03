import { getEnv } from "@/lib/config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(level: LogLevel) {
  return levelOrder[level] >= levelOrder[getEnv().LOG_LEVEL];
}

export function log(level: LogLevel, message: string, payload: LogPayload = {}) {
  if (!shouldLog(level)) return;

  const entry = {
    level,
    message,
    siteEnv: getEnv().SITE_ENV,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(entry));
    return;
  }

  console.log(JSON.stringify(entry));
}
