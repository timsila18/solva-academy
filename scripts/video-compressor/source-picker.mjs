import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

export function pickSource() {
  // Only the native smoke-test process opts into a fixture picker at startup.
  if (process.env.VIDEO_COMPRESSOR_TEST_MODE === "1" && process.env.VIDEO_COMPRESSOR_TEST_SOURCE) {
    return Promise.resolve({ path: process.env.VIDEO_COMPRESSOR_TEST_SOURCE });
  }
  if (process.platform !== "win32") throw new Error("The direct-file picker currently requires Windows.");
  return new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", ["-NoProfile", "-STA", "-WindowStyle", "Hidden", "-File",
      fileURLToPath(new URL("./pick-source.ps1", import.meta.url))], { windowsHide: true, timeout: 300000 });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; if (output.length > 32768) child.kill(); });
    child.stderr.resume();
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error("The file picker could not open. Please try again."));
      try { resolve(JSON.parse(output.replace(/^\uFEFF/, ""))); } catch { reject(new Error("The file selection was not returned.")); }
    });
  });
}
