export const MAX_CLASS_VIDEO_BYTES = 350_000_000;
export const CLASS_VIDEO_LIMIT_LABEL = "350 MB";
export function resumableStorageEndpoint(origin: string) {
  const url = new URL(origin);
  if (/^[a-z0-9]+\.supabase\.co$/.test(url.hostname)) {
    url.hostname = url.hostname.replace(".supabase.co", ".storage.supabase.co");
  }
  return `${url.origin}/storage/v1/upload/resumable/sign`;
}
