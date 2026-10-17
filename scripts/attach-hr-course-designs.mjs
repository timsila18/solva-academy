import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
function check(r){if(r.error)throw new Error(r.error.message);return r.data;}
const course=check(await db.from("courses").select("id,owner_id,status,owning_workspace_id").eq("slug","hr-practice-from-a-to-z").single());
if(course.status!=="draft")throw new Error("Only the initial draft may be prepared by this script.");
const bucket="course-authoring";
const existingBucket=await db.storage.getBucket(bucket);
if(existingBucket.error)check(await db.storage.createBucket(bucket,{public:false,fileSizeLimit:10*1024*1024,allowedMimeTypes:["application/pdf"]}));
else if(existingBucket.data.public)throw new Error("Authoring bucket must remain private.");
const entries=[
  ["Solva-HR-Academy-Certificate-Specimen.pdf","Certificate design - Practical Human Resource Management","certificate_specimen"],
  ["HR-Practice-Knowledge-Checks-and-Answer-Key.pdf","Knowledge checks and instructor answer key","instructor_answer_key"],
];
for(const [filename,title,kind] of entries){
  const bytes=await readFile(resolve("../course-materials/hr-masterclass",filename));
  const hash=createHash("sha256").update(bytes).digest("hex");
  const path=`${course.id}/${kind}-${hash.slice(0,16)}.pdf`;
  const found=check(await db.from("course_resources").select("id").eq("course_id",course.id).eq("file_path",path).maybeSingle());
  if(!found){
    const files=check(await db.storage.from(bucket).list(course.id,{search:path.split("/").pop()}));
    if(!files.some(f=>f.name===path.split("/").pop()))check(await db.storage.from(bucket).upload(path,bytes,{contentType:"application/pdf",upsert:false}));
    check(await db.from("course_resources").insert({course_id:course.id,title,resource_type:"pdf",file_path:path,file_size_bytes:bytes.length,
      owner_id:course.owner_id,copyright_declaration:"academy_owned",visibility:"private",download_permission:"instructor_only",metadata:{bucket,kind,sha256:hash}}));
  }
  if(kind==="certificate_specimen"){
    const template=check(await db.from("certificate_templates").select("id,template").eq("template->>course_id",course.id).eq("template->>design_key","solva-hr-completion-v1").single());
    check(await db.from("certificate_templates").update({template:{...template.template,specimen_bucket:bucket,specimen_path:path}}).eq("id",template.id));
  }
}
console.log(JSON.stringify({courseId:course.id,privateMaterialsAttached:2,certificateIssued:false}));
