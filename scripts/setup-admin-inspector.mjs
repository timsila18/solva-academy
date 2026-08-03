import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_INSPECTOR_EMAIL || "admin@solvaacademy.local";
const password = process.env.ADMIN_INSPECTOR_PASSWORD || `Solva-${randomBytes(12).toString("base64url")}!`;

if (!url || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. Secrets were not printed.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw listError;
let user = listData.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());

if (user) {
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: { full_name: "Solva Academy Admin Inspector" },
  });
  if (error) throw error;
  user = data.user;
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Solva Academy Admin Inspector" },
  });
  if (error) throw error;
  user = data.user;
}

await supabase.from("profiles").upsert({
  id: user.id,
  full_name: "Solva Academy Admin Inspector",
  display_name: "Admin Inspector",
  email,
  country: "KE",
  preferred_language: "en",
  account_status: "active",
});

const { data: workspace, error: workspaceError } = await supabase
  .from("workspaces")
  .upsert({
    name: "Solva Academy Platform Administration",
    slug: "platform-administration",
    type: "platform_admin",
    owner_id: user.id,
    status: "active",
  }, { onConflict: "slug" })
  .select("id")
  .single();
if (workspaceError) throw workspaceError;

await supabase.from("workspace_members").upsert({
  workspace_id: workspace.id,
  user_id: user.id,
  status: "active",
  joined_at: new Date().toISOString(),
}, { onConflict: "workspace_id,user_id" });

const roleSlugs = [
  "super-admin",
  "platform-administrator",
  "finance-officer",
  "support-agent",
  "course-reviewer",
  "quality-reviewer",
  "academy-owner",
  "organization-administrator",
  "instructor",
  "learner",
];

const { data: roles, error: rolesError } = await supabase.from("roles").select("id,slug,scope").in("slug", roleSlugs);
if (rolesError) throw rolesError;

for (const role of roles ?? []) {
  const { data: existing } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("user_id", user.id)
    .eq("role_id", role.id)
    .eq("workspace_id", workspace.id)
    .eq("status", "active")
    .maybeSingle();
  if (!existing) {
    await supabase.from("user_role_assignments").insert({
      user_id: user.id,
      role_id: role.id,
      workspace_id: workspace.id,
      scope: role.scope,
      status: "active",
      reason: "admin inspector setup",
    });
  }
}

await supabase.from("user_preferences").upsert({
  user_id: user.id,
  active_workspace_id: workspace.id,
});

console.log("Admin inspector account is ready.");
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
console.log("Use only for local/staging inspection. Rotate or disable before production.");
