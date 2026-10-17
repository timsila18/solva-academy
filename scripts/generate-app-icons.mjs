import { writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GraduationCap } from "lucide-react";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const svg = renderToStaticMarkup(createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", role: "img", "aria-label": "Solva Academy" },
  createElement("rect", { width: 512, height: 512, rx: 80, fill: "#05070a" }),
  createElement(GraduationCap, { x: 72, y: 72, width: 368, height: 368, color: "#006bff", strokeWidth: 1.8 }),
));
await writeFile(new URL("../public/icon.svg", import.meta.url), svg + "\n");
for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(fileURLToPath(new URL(`../public/${name}`, import.meta.url)));
}

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([header, ...images]));
console.log("Generated graduation-cap favicon and app icons.");
