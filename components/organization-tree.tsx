"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, Power } from "lucide-react";
import { cn, getStatusColor } from "@/lib/utils";
import type { OrgNode } from "@/lib/types";

export type { OrgNode };

interface OrganizationTreeProps {
  data: OrgNode;
  onAddChild?: (parentId: string, type: string) => void;
  onEdit?: (node: OrgNode) => void;
  onDelete?: (node: OrgNode) => void;
  onToggleEnable?: (node: OrgNode) => void;
}

function TreeNode({ node, depth = 0, onAddChild, onEdit, onDelete, onToggleEnable }: {
  node: OrgNode;
  depth?: number;
  onAddChild?: (parentId: string, type: string) => void;
  onEdit?: (node: OrgNode) => void;
  onDelete?: (node: OrgNode) => void;
  onToggleEnable?: (node: OrgNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  const typeColors: Record<string, string> = {
    ceo: "text-accent border-accent/30 bg-accent/5",
    department: "text-info border-info/30 bg-info/5",
    manager: "text-warning border-warning/30 bg-warning/5",
    leader: "text-success border-success/30 bg-success/5",
    staff: "text-secondary border-border bg-surface",
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg border transition-colors group relative",
          typeColors[node.type],
          depth > 0 && "ml-6"
        )}
      >
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={cn("w-4 h-4 flex items-center justify-center", !hasChildren && "invisible")}
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{node.name}</span>
            <span className="text-xs text-muted capitalize">({node.role})</span>
          </div>
          {node.currentTask && (
            <p className="text-xs text-muted truncate">{node.currentTask}</p>
          )}
        </div>

        <span className={cn("w-2 h-2 rounded-full shrink-0", getStatusColor(node.status).replace("text-", "bg-"))} />

        <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.type !== "ceo" && onToggleEnable && (
            <button onClick={() => onToggleEnable(node)} className="p-1 hover:bg-white/10 rounded">
              <Power className="w-3 h-3" />
            </button>
          )}
          {onEdit && (
            <button onClick={() => onEdit(node)} className="p-1 hover:bg-white/10 rounded">
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          {node.type !== "ceo" && onDelete && (
            <button onClick={() => onDelete(node)} className="p-1 hover:bg-white/10 rounded text-error">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          {(node.type === "ceo" || node.type === "department" || node.type === "manager") && onAddChild && (
            <button onClick={() => onAddChild(node.id, node.type === "department" ? "manager" : "staff")} className="p-1 hover:bg-white/10 rounded">
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleEnable={onToggleEnable}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganizationTree({ data, onAddChild, onEdit, onDelete, onToggleEnable }: OrganizationTreeProps) {
  return (
    <div className="p-4 bg-surface border border-border rounded-xl overflow-x-auto">
      <TreeNode
        node={data}
        onAddChild={onAddChild}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleEnable={onToggleEnable}
      />
    </div>
  );
}
