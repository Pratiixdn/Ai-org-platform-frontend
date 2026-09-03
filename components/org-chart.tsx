"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, Edit2, Trash2, Power, ChevronDown, ChevronUp, MessageSquare, Bot, Building2, Users, Cpu } from "lucide-react";
import { cn, getStatusColor } from "@/lib/utils";
import type { OrgNode } from "@/lib/types";

interface OrgChartProps {
  data: OrgNode;
  onAddChild?: (parentId: string, type: string) => void;
  onEdit?: (node: OrgNode) => void;
  onDelete?: (node: OrgNode) => void;
  onToggleEnable?: (node: OrgNode) => void;
  onChatWithCEO?: () => void;
}

interface NodeCardProps {
  node: OrgNode;
  onAddChild?: (parentId: string, type: string) => void;
  onEdit?: (node: OrgNode) => void;
  onDelete?: (node: OrgNode) => void;
  onToggleEnable?: (node: OrgNode) => void;
  onChatWithCEO?: () => void;
}

function NodeCard({ node, onAddChild, onEdit, onDelete, onToggleEnable, onChatWithCEO }: NodeCardProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
    ceo: { icon: Bot, color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
    department: { icon: Building2, color: "text-info", bg: "bg-info/10", border: "border-info/30" },
    manager: { icon: Users, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
    leader: { icon: Cpu, color: "text-success", bg: "bg-success/10", border: "border-success/30" },
    staff: { icon: Bot, color: "text-secondary", bg: "bg-surface-hover", border: "border-border" },
  };

  const config = typeConfig[node.type] || typeConfig.staff;
  const Icon = config.icon;
  const statusColor = getStatusColor(node.status).replace("text-", "");

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className={cn(
          "relative w-56 p-4 rounded-xl border transition-all duration-300 group",
          config.bg,
          config.border,
          "hover:shadow-lg hover:shadow-accent/5 hover:scale-[1.02]"
        )}
      >
        {/* Status indicator */}
        <div className={cn("absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-background", `bg-${statusColor}`)} />

        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", config.bg, config.border, "border")}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-primary truncate">{node.name}</h3>
            <p className="text-xs text-muted capitalize">{node.role}</p>
          </div>
        </div>

        {/* Current Task */}
        {node.currentTask && (
          <div className="mb-2 p-2 bg-background/50 rounded-lg border border-border/50">
            <p className="text-xs text-secondary truncate">{node.currentTask}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {node.type === "ceo" && onChatWithCEO && (
              <button
                onClick={onChatWithCEO}
                className="flex items-center gap-1 px-2 py-1 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent-hover transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                Chat
              </button>
            )}
            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.type !== "ceo" && onToggleEnable && (
              <button onClick={() => onToggleEnable(node)} className="p-1.5 hover:bg-white/10 rounded-md text-secondary">
                <Power className="w-3 h-3" />
              </button>
            )}
            {onEdit && (
              <button onClick={() => onEdit(node)} className="p-1.5 hover:bg-white/10 rounded-md text-secondary">
                <Edit2 className="w-3 h-3" />
              </button>
            )}
            {node.type !== "ceo" && onDelete && (
              <button onClick={() => onDelete(node)} className="p-1.5 hover:bg-white/10 rounded-md text-error">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            {(node.type === "ceo" || node.type === "department" || node.type === "manager") && onAddChild && (
              <button onClick={() => onAddChild(node.id, node.type === "department" ? "manager" : "staff")} className="p-1.5 hover:bg-white/10 rounded-md text-accent">
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Children with connectors */}
      {expanded && hasChildren && (
        <div className="mt-6 relative">
          {/* Vertical line from parent to children row */}
          <div className="absolute left-1/2 -top-6 w-px h-6 bg-border -translate-x-1/2" />

          <div className="flex items-start gap-6">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Horizontal connector line */}
                {node.children.length > 1 && (
                  <>
                    {index === 0 && (
                      <div className="absolute -top-6 left-1/2 w-1/2 h-px bg-border" />
                    )}
                    {index === node.children.length - 1 && (
                      <div className="absolute -top-6 right-1/2 w-1/2 h-px bg-border" />
                    )}
                    {index > 0 && index < node.children.length - 1 && (
                      <div className="absolute -top-6 left-0 right-0 h-px bg-border" />
                    )}
                  </>
                )}
                {/* Vertical line to child */}
                <div className="absolute -top-6 left-1/2 w-px h-6 bg-border -translate-x-1/2" />

                <NodeCard
                  node={child}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleEnable={onToggleEnable}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrgChart({ data, onAddChild, onEdit, onDelete, onToggleEnable, onChatWithCEO }: OrgChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const handleZoom = useCallback((delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-surface border border-border rounded-xl">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-surface-elevated border border-border rounded-lg p-1">
        <button onClick={() => handleZoom(-0.1)} className="px-2 py-1 text-sm hover:bg-surface-hover rounded transition-colors">−</button>
        <span className="text-xs text-muted w-10 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => handleZoom(0.1)} className="px-2 py-1 text-sm hover:bg-surface-hover rounded transition-colors">+</button>
      </div>

      <div
        ref={containerRef}
        className="overflow-auto p-8 min-h-[500px] flex justify-center"
        style={{ cursor: "grab" }}
      >
        <div
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
          className="transition-transform duration-200"
        >
          <NodeCard
            node={data}
            onAddChild={onAddChild}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleEnable={onToggleEnable}
            onChatWithCEO={onChatWithCEO}
          />
        </div>
      </div>
    </div>
  );
}
