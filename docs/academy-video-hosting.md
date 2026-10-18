# Academy Video Hosting

## Deployment boundaries

- App: Academy Vercel project only (`timsila18s-projects/solva-academy`).
- Public receiver: `https://images.solfit.co.ke/academy-media.php`.
- Private config: `/domains/images.solfit.co.ke/academy-media-config.php`, owner-only 0600.
- Private video directory: `/domains/images.solfit.co.ke/academy-video-media`, 0700.
- Temporary compressed chunks: `/domains/images.solfit.co.ke/academy-video-staging`, 0700.
- No Solfit, Sauti, Solco or SolvaOne receiver/configuration files are modified.

## Flow

The app authenticates the user and checks current course authoring access before creating an expiring upload receipt in Supabase. A server-only Academy secret signs a ticket binding the receipt ID, course, lesson, actor, expiry and 350,000,000-byte ceiling. The secret is never included in browser tickets.

For large originals, Course Studio opens the locally installed helper. The ticket is passed in a URL fragment, removed from the helper address bar after parsing, and retained only in memory. The helper reads the original directly through FFmpeg without copying or uploading the original. Two-pass H.264 encoding budgets audio and mux overhead, then verifies the output codec, duration and actual byte count. Unusable-duration budgets and HDR sources require a suitable export or shorter classes instead of promising lossless compression.

The browser or helper sends compressed data directly to HostAfrica in 2 MiB chunks. Vercel receives only small control requests. SHA-256 verifies every chunk; the host assembles and validates MP4 output outside the public web root. A scoped checkpoint resumes complete chunks after a connection interruption. Tickets last four hours. Incomplete expired chunks are removed opportunistically after a further hour when a new upload starts.

The app obtains signed server-to-server completion metadata, validates scope and byte count, and uses a service-only database function to attach the video under a course-row lock. The operation re-checks current owner/workspace permissions and draft status. Completed uploads become immutable private files. Publication/purchase freezes still apply.

Playback URLs expire and support byte ranges. Learner URLs are generated only after existing enrollment/episode entitlement checks; owner previews require Studio read access. A signed playback URL can be shared until expiry, and a legitimate viewer can still record/download content. This is access control, not DRM.

## Configuration and checks

`node scripts/academy-media/configure.mjs` creates an Academy-only secret locally and an ignored private deployment artifact. Upload that artifact outside public_html; deploy the receiver separately inside public_html. `node --env-file=.env.local scripts/academy-media/configure-vercel.mjs` sets only the Academy production variables.

Run `node --env-file=.env.local scripts/academy-media/verify-live.mjs` for a synthetic private upload, checksum/scope checks, unsigned/expired denial, range playback and cleanup. It never attaches its clip to a real course. The administrative purge signature is separate from client upload signatures and is not exposed through any app route.

Database migrations 0027-0029 cover the 350 MB fallback bucket limit, scoped hosted upload receipts, service-only attachment, readiness compatibility and cancellation. `supabase/tests/hosted_video.sql` uses rollback-only course fixtures to test the exact byte boundary, trusted verification requirement, audit and review freeze.

## Operational limits

- DirectAdmin showed 1.52 GB used of 20 GB during setup. Quotas are shared with the other products. Sixteen 350 MB videos consume about 5.6 GB before temporary assembly headroom.
- Shared-host CPU, connection and PHP worker limits still apply even when the bandwidth quota is labelled Unlimited. Monitor concurrent playback; move the storage provider to object storage/CDN if usage grows.
- There is no artificial local source-file size ceiling, but available disk, supported codecs, operating-system limits, duration and processing time impose real limits. Output size and maximum quality cannot both be guaranteed for every source.
- A compatible local helper must be installed/running on the uploader's computer. This release does not provide a desktop installer or mobile/cloud transcoder.
- Keep the class page open during helper upload for immediate attachment. Reopening an editable class checks its latest unexpired pending receipt and can finish the verified attachment. If an interrupted direct browser upload has no running helper, cancel it and reselect the compressed file.
- The original remains where the user selected it; the system does not delete it. Only compressed output and compressed staging chunks are created.
- Do not rotate an existing Academy signing secret without a coordinated deployment. Existing uploads/links rely on that secret until expiry.
# Upload Recovery

Compressed MP4s are retained in the local `compressed-videos` folder. An upload
failure never requires another encode. The helper shows **Retry upload only** and
resumes from the host's acknowledged chunk checkpoint. Reopening the helper also
recovers completed outputs; small sidecar files preserve class bindings without
storing upload signatures, signing secrets, or original recording paths.

If authorization expires, reconnect from the same Academy class and retry the
saved output. A renewed ticket must match the original actor, course, and lesson.
The destination is checked before starting a connected compression job, but a
later outage can still interrupt transfer. Keep the compressed output until the
class shows its saved video.

Chunks use base64 text transport to avoid raw MP4 byte sequences being mistaken
for malicious request bodies by shared-host request filters. The receiver strictly
decodes each bounded chunk and verifies its original SHA-256 digest. Transfer
encoding adds approximately one third to network bytes, not to the stored MP4
size. Existing raw chunk clients remain supported. Authentication, private paths,
expiry, byte ceilings, and final MP4 validation are unchanged.

