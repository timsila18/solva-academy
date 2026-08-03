import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function collectTsx(dir) {
  const entries = readdirSync(join(root, dir));
  return entries.flatMap((entry) => {
    const relative = `${dir}/${entry}`;
    const absolute = join(root, relative);
    if (statSync(absolute).isDirectory()) return collectTsx(relative);
    return relative.endsWith(".tsx") ? [relative] : [];
  });
}

const files = [...collectTsx("src/app"), ...collectTsx("src/components")];

const issues = [];
for (const file of files) {
  const text = readFileSync(join(root, file), "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes('type="button"') && !line.includes("disabled")) issues.push(`${file}:${index + 1} clickable type=button without disabled`);
    if (line.includes('href="#"')) issues.push(`${file}:${index + 1} href="#"`);
    if (/Save .*placeholder|placeholder button|AI coded/i.test(line)) issues.push(`${file}:${index + 1} placeholder-like clickable copy`);
  });
}

if (issues.length) {
  console.error("UI control audit found issues:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`UI control audit passed across ${files.length} TSX files.`);
