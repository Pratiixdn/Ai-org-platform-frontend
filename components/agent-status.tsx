"use client";

import { cn, getStatusColor, getStatusBg } from "@/lib/utils";
import { type AgentStatus } from "@/lib/types";

interface AgentStatusBadgeProps {
  status: AgentStatus;
  size?: "sm" | "md";
}

export function AgentStatusBadge({ status, size = "sm" }: AgentStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium capitalize",
        sizeClasses[size],
        getStatusBg(status),
        getStatusColor(status)
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(status).replace("text-", "bg-"))} />
      {status.replace("_", " ")}
    </span>
  );
}
