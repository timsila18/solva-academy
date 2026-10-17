import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const source = process.argv[2];
if (!source) throw new Error("Pass the path to the owner's masterclass PowerPoint.");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
function check(result) { if (result.error) throw new Error(result.error.message); return result.data; }
const course = check(await db.from("courses").select("id,owner_id,owning_workspace_id,status").eq("slug", "hr-practice-from-a-to-z").single());
if (course.status !== "draft") throw new Error("This setup script only attaches slides to the initial draft.");
const bytes = await readFile(source);
if (bytes.length > 50 * 1024 * 1024) throw new Error("Presentation exceeds the resource storage limit.");
const hash = createHash("sha256").update(bytes).digest("hex");
const filename = `masterclass-slides-${hash.slice(0, 16)}.pptx`;
const path = `${course.id}/${filename}`;
const existing = check(await db.from("course_resources").select("id").eq("course_id", course.id).eq("file_path", path).maybeSingle());
if (!existing) {
  const files = check(await db.storage.from("course-resources").list(course.id, { search: filename }));
  if (!files.some((file) => file.name === filename)) check(await db.storage.from("course-resources").upload(path, bytes, {
    contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", upsert: false,
  }));
  check(await db.from("course_resources").insert({ course_id: course.id, title: "HR Practice from A to Z - Masterclass Slides",
    description: "The owner's 448-slide presentation supporting all 16 classes. Includes class exercises and the final HR-manager capstone.",
    resource_type: "presentation", file_path: path, file_size_bytes: bytes.length, owner_id: course.owner_id,
    copyright_declaration: "academy_owned", visibility: "private", download_permission: "enrolled",
    metadata: { source_filename: "HR_Practice_From_A_to_Z_Solva_Academy_Masterclass.pptx", sha256: hash, slide_count: 448 },
  }));
  check(await db.from("audit_logs").insert({ actor_id: course.owner_id, action: "course_presentation_attached", resource_type: "course",
    resource_id: course.id, workspace_id: course.owning_workspace_id, new_data: { path, sha256: hash },
    reason: "Owner supplied the presentation for their masterclass.", success: true,
  }));
}
console.log(JSON.stringify({ courseId: course.id, resourceAttached: true, bytes: bytes.length, builder: `https://academy.solvaone.co.ke/courses/builder/${course.id}` }));
