function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function createIcsEvent({
  uid,
  title,
  description,
  startsAt,
  endsAt,
  url,
}: {
  uid: string;
  title: string;
  description?: string | null;
  startsAt: Date;
  endsAt: Date;
  url?: string | null;
}) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Solva Academy//Solco Live Learning//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcs(uid)}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startsAt)}`,
    `DTEND:${formatIcsDate(endsAt)}`,
    `SUMMARY:${escapeIcs(title)}`,
    description ? `DESCRIPTION:${escapeIcs(description)}` : null,
    url ? `URL:${escapeIcs(url)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

export function getJoinWindowState({
  now = new Date(),
  startsAt,
  endsAt,
  earlyAccessMinutes,
  lateJoinMinutes,
}: {
  now?: Date;
  startsAt: Date;
  endsAt: Date;
  earlyAccessMinutes: number;
  lateJoinMinutes: number;
}) {
  const opensAt = new Date(startsAt.getTime() - earlyAccessMinutes * 60_000);
  const locksAt = new Date(startsAt.getTime() + lateJoinMinutes * 60_000);
  if (now < opensAt) return "too_early";
  if (now > endsAt) return "ended";
  if (now > locksAt) return "locked";
  return "open";
}
