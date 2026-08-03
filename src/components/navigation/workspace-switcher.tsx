"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const fallbackRoles = [
  "Learner",
  "Instructor",
  "Academy Owner",
  "Academy Admin",
  "Organization Administrator",
  "HR Manager",
  "Founding Super Admin",
];
const fallbackWorkspaces = [
  "Personal Learning",
  "Tutor Workspace",
  "Academy Workspace",
  "Organization Workspace",
  "Platform Administration",
];

export function WorkspaceSwitcher() {
  const [role, setRole] = useState(fallbackRoles[0]);
  const [workspace, setWorkspace] = useState(fallbackWorkspaces[0]);
  const adminMode = role.includes("Admin") || role.includes("Administrator");

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={adminMode ? "border-primary bg-[#061a3d] text-white" : ""}>{role}</Badge>
        <Badge>{workspace}</Badge>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="text-xs font-medium text-muted-foreground">
          Active role
          <select
            className="mt-1 min-h-10 w-full rounded-md border border-border bg-[#05070a] px-2 text-sm text-foreground"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {fallbackRoles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Active workspace
          <select
            className="mt-1 min-h-10 w-full rounded-md border border-border bg-[#05070a] px-2 text-sm text-foreground"
            value={workspace}
            onChange={(event) => setWorkspace(event.target.value)}
          >
            {fallbackWorkspaces.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Preview the workspace view from the menu below.</p>
    </div>
  );
}
