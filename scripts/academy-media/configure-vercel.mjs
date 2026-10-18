import { spawnSync } from "node:child_process";
const names = [
  "ACADEMY_VIDEO_PROVIDER",
  "ACADEMY_MEDIA_ENDPOINT",
  "ACADEMY_MEDIA_SECRET",
];
for (const name of names) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured locally.`);
  const args = [
    "vercel",
    "env",
    "add",
    name,
    "production",
    "--scope",
    "timsila18s-projects",
    "--project",
    "solva-academy",
    "--yes",
    "--force",
    name.endsWith("SECRET") ? "--sensitive" : "--no-sensitive",
  ];
  const result = spawnSync(
    process.platform === "win32" ? "cmd.exe" : "npx",
    process.platform === "win32"
      ? ["/d", "/s", "/c", "npx " + args.join(" ")]
      : args,
    { input: value, encoding: "utf8", windowsHide: true },
  );
  if (result.status !== 0) {
    console.error(
      `Could not configure ${name}. Vercel did not confirm the update.`,
    );
    process.exit(1);
  }
  console.log(`Configured ${name} for Solva Academy production.`);
}
