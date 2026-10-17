import { expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { encodingArguments } from "../../scripts/video-compressor/engine.mjs";
it("uses bounded 1080p H264 encoding without upscaling or forcing a new frame rate",()=>{
  const args=encodingArguments("source.mov","output.mp4","balanced",false);
  expect(args).toContain("libx264");expect(args).toContain("2000k");expect(args).toContain("128k");
  expect(args).toContain("+faststart");expect(args).not.toContain("-r");
  expect(args.find(x=>x.startsWith("scale="))).toContain("min(1920,iw)");
  expect(args).toContain("file,pipe");expect(args).not.toContain("-t");
});
it("supports a real sample encode and rejects arbitrary profiles",()=>{
  const args=encodingArguments("input","output","compact",true);
  expect(args).toContain("60");expect(args).toContain("1000k");
  expect(()=>encodingArguments("input","output","custom-shell-command",false)).toThrow();
});
it("has labelled controls, accessible progress and no third-party scripts",async()=>{
  const html=await readFile("scripts/video-compressor/index.html","utf8");
  document.body.innerHTML=html;
  expect(document.querySelector("#choose")?.textContent).toContain("Choose video");
  expect(document.querySelector("input[type=file]")).toBeNull();
  expect(document.querySelector("select")?.options).toHaveLength(3);
  expect(document.querySelector("progress")?.getAttribute("aria-label")).toBe("Compression progress");
  expect(document.querySelector("[role=alert]")).not.toBeNull();
  expect(document.querySelectorAll("script[src]")).toHaveLength(0);
  expect(document.querySelector("#sample").checked).toBe(true);
  expect(html).toContain("100 MB upload limit");
  expect(html).toContain("No original-file copy or upload");
  expect(html).not.toContain("xhr.send(file)");
  const script=/<script nonce="__NONCE__">([\s\S]+)<\/script>/.exec(html)?.[1];
  expect(()=>new Function(script)).not.toThrow();
});
