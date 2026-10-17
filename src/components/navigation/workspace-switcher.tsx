import { selectWorkspaceAction } from "@/features/auth/workspace-actions";
import { ArrowRight } from "lucide-react";

export function WorkspaceSwitcher({ workspaces, activeId }: { workspaces: { id: string; name: string; type: string }[]; activeId: string }) {
  if (workspaces.length <= 1) return <p className="px-3 text-sm font-medium">{workspaces[0]?.name ?? "My account"}</p>;
  return <form action={selectWorkspaceAction} className="flex items-end gap-2"><label className="grid min-w-0 flex-1 gap-2 text-xs text-muted-foreground">Workspace<select name="workspaceId" defaultValue={activeId} className="min-h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground">{workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}</select></label><button type="submit" aria-label="Open workspace" title="Open workspace" className="grid size-10 shrink-0 place-items-center rounded-md border border-border hover:bg-muted"><ArrowRight size={17} /></button></form>;
}
