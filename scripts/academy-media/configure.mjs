import { randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
const root = resolve(import.meta.dirname, "../..");
const envPath = resolve(root, ".env.local");
const text = await readFile(envPath, "utf8");
const env = parseEnv(text);
const secret = env.ACADEMY_MEDIA_SECRET ?? randomBytes(32).toString("hex");
if (!/^[a-f0-9]{64}$/.test(secret))
  throw new Error("Invalid existing Academy media secret.");
const additions = {
  ACADEMY_VIDEO_PROVIDER: "hostafrica",
  ACADEMY_MEDIA_ENDPOINT: "https://images.solfit.co.ke/academy-media.php",
  ACADEMY_MEDIA_SECRET: secret,
};
let updated = text;
for (const [name, value] of Object.entries(additions)) {
  const line = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");
  updated = pattern.test(updated)
    ? updated.replace(pattern, line)
    : updated.trimEnd() + "\n" + line + "\n";
}
await writeFile(envPath, updated, { mode: 0o600 });
const privateDir = resolve(root, ".local/academy-media");
await mkdir(privateDir, { recursive: true });
await writeFile(
  resolve(privateDir, "academy-media-config.php"),
  `<?php\ndeclare(strict_types=1);\nreturn ['secret' => '${secret}'];\n`,
  { mode: 0o600 },
);
console.log(
  "Academy-only environment configured. Private artifact: .local/academy-media/academy-media-config.php. Upload outside public_html and set permissions to 0600. No existing product secrets were read or changed.",
);
