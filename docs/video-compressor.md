# Local Video Compressor

Start with `npm run video:compressor`, then open `http://127.0.0.1:4318`.
This is a local native-FFmpeg companion, not a Vercel encoding service and not a
browser-WASM compressor. It does not upload originals or results to any cloud.

## Workflow

1. Click Choose video and select the recording in the Windows file picker.
   The owner window is explicitly shown and activated so the picker can appear
   above the browser. Cancel selection aborts the native picker request. The
   selected-file panel shows name, size, duration and resolution, with optional
   range-streamed source preview and approximate preset-based output estimates.
2. Choose Balanced (up to 1080p, 2 Mbps), Higher quality (1080p CRF 21, variable
   size), or Smaller file (up to 720p, 1 Mbps).
3. Leave the 60-second sample checkbox selected for the first quality check.
4. Inspect slide text, camera footage and audio in the preview. Uncheck the
   sample option and compress the full lesson once the settings are suitable.
5. Output copies are saved in `C:\Solva Academy\compressed-videos` on this machine.

Source files are never modified, copied, staged or uploaded. Native FFmpeg reads
the selected original directly and writes only the compressed output. The browser
sends an opaque selected-file reference and compression settings, not video bytes.
There is no source-sized temporary copy. Only output space is required. Logs remain
under `.local/video-compressor`; completed compressed outputs remain available
on disk. The direct-file picker currently requires Windows. Only one encoding
job runs at a time. Refresh reconnects to the current
session; a server restart clears in-memory history but preserves saved outputs.

The previous artificial 8 GB input cap was removed for direct local processing.
Non-files, empty recordings and unreadable sources have distinct error messages.
This does not change the Academy's separate 100 MB cloud-upload limit. Very large
files still depend on the native decoder, file accessibility and output disk space.

HDR inputs are rejected to avoid silently producing incorrect colours. Ask the
editor for a colour-managed SDR export. High quality cannot be guaranteed from a
bitrate alone: test real slides and sound. Frames are not intentionally upsampled,
and source frame rate is not overridden. Output is H.264/AAC MP4 with faststart.

## Security

The helper binds only to 127.0.0.1, validates Host and mutation Origin, requires a
per-process random API token, embeds no cloud credentials, and disables framing.
Native processes use argument arrays with no shell interpolation. Only files
explicitly chosen in the native picker can be submitted; arbitrary input paths
in HTTP requests and raw video uploads are rejected. Native media decoders use a
file/pipe protocol allowlist. Only the uploader's own trusted recordings should
be processed; keep native decoder binaries patched. Files never transit Vercel.

The default port can be changed through `VIDEO_COMPRESSOR_PORT` if occupied.
The server must keep running during compression. A laptop should remain awake.

## Academy Upload Boundary

The Academy uploader and bucket still have their previous 100 MB limits. This
tool does not change those limits, activate paid storage, or attach outputs to
lessons automatically. Outputs above the limit show an explicit warning. A
roughly 15-minute balanced encode may be around 240 MB, depending on content.
Production upload-size/quota and resumable-upload changes are a separate task.

## Verification

`node scripts/video-compressor/smoke-test.mjs` generates and compresses a real
six-second video, checks H.264 and duration, confirms source hash preservation
and absence of original-copy staging, and tests raw-upload/path rejection,
range playback, cancellation, invalid-video handling, token enforcement
and cross-origin rejection. Vitest covers encoding presets and form semantics.
A real 4 GB recording has not yet been supplied, so its visual quality, duration
and encoding time remain unverified. No browser screenshot QA was performed.

Dependency installation also reported existing Next.js/runtime security advisories.
Those are outside this local-compressor change; no forced framework upgrade or
production deployment was performed here. Review them before a public launch.
