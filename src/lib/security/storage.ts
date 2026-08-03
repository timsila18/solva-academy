import { slugify } from "@/lib/utils";

const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export type StoragePurpose =
  | "profile_avatar"
  | "platform_branding"
  | "school_image"
  | "academy_logo"
  | "academy_banner"
  | "organization_logo"
  | "course_thumbnail"
  | "course_media"
  | "course_resource";

const limits: Record<StoragePurpose, { bucket: string; maxBytes: number; allowedTypes: string[] }> = {
  profile_avatar: { bucket: "profile-avatars", maxBytes: 2 * 1024 * 1024, allowedTypes: imageTypes.filter((type) => type !== "image/svg+xml") },
  platform_branding: { bucket: "platform-branding", maxBytes: 2 * 1024 * 1024, allowedTypes: imageTypes },
  school_image: { bucket: "school-images", maxBytes: 5 * 1024 * 1024, allowedTypes: imageTypes.filter((type) => type !== "image/svg+xml") },
  academy_logo: { bucket: "academy-branding", maxBytes: 5 * 1024 * 1024, allowedTypes: imageTypes.filter((type) => type !== "image/svg+xml") },
  academy_banner: { bucket: "academy-branding", maxBytes: 5 * 1024 * 1024, allowedTypes: imageTypes.filter((type) => type !== "image/svg+xml") },
  organization_logo: { bucket: "organization-branding", maxBytes: 5 * 1024 * 1024, allowedTypes: imageTypes.filter((type) => type !== "image/svg+xml") },
  course_thumbnail: { bucket: "course-media", maxBytes: 5 * 1024 * 1024, allowedTypes: imageTypes.filter((type) => type !== "image/svg+xml") },
  course_media: { bucket: "course-media", maxBytes: 100 * 1024 * 1024, allowedTypes: ["image/png", "image/jpeg", "image/webp", "audio/mpeg", "audio/mp4", "video/mp4", "application/pdf"] },
  course_resource: { bucket: "course-resources", maxBytes: 50 * 1024 * 1024, allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "image/png", "image/jpeg", "image/webp", "text/plain", "application/zip"] },
};

export function validateUpload(file: Pick<File, "name" | "size" | "type">, purpose: StoragePurpose) {
  const rule = limits[purpose];
  if (!rule.allowedTypes.includes(file.type)) {
    return { ok: false, error: "Unsupported file type." };
  }
  if (file.size > rule.maxBytes) {
    return { ok: false, error: "File is too large." };
  }
  return { ok: true, error: null };
}

export function buildStoragePath({
  purpose,
  ownerId,
  fileName,
}: {
  purpose: StoragePurpose;
  ownerId: string;
  fileName: string;
}) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName = slugify(fileName.replace(/\.[^.]+$/, "")) || "upload";
  return {
    bucket: limits[purpose].bucket,
    path: `${purpose}/${ownerId}/${Date.now()}-${safeName}.${extension}`,
  };
}
