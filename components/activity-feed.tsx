"use client";

import { Activity, CheckCircle2, XCircle, Clock, AlertCircle, RotateCcw, MessageSquare, UserPlus, FileCheck } from "lucide-react";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/types";

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxHeight?: string;
  emptyMessage?: string;
}

const eventConfig: Record<string, { icon: React.ElementType; color: string }> = {
  task_created: { icon: Activity, color: "text-accent" },
  task_assigned: { icon: UserPlus, color: "text-info" },
  task_started: { icon: Clock, color: "text-warning" },
  task_completed: { icon: CheckCircle2, color: "text-success" },
  task_failed: { icon: XCircle, color: "text-error" },
  task_revised: { icon: RotateCcw, color: "text-warning" },
  agent_assigned: { icon: UserPlus, color: "text-info" },
  agent_completed: { icon: CheckCircle2, color: "text-success" },
  issue_detected: { icon: AlertCircle, color: "text-error" },
  fix_applied: { icon: CheckCircle2, color: "text-success" },
  approval_required: { icon: MessageSquare, color: "text-warning" },
  approval_given: { icon: FileCheck, color: "text-success" },
  approval_denied: { icon: XCircle, color: "text-error" },
};

export function ActivityFeed({ events, maxHeight = "400px", emptyMessage = "No activity yet" }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Activity className="w-8 h-8 text-muted mb-2" />
        <p className="text-sm text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0" style={{ maxHeight, overflowY: "auto" }}>
      {events.map((event) => {
        const config = eventConfig[event.type] || { icon: Activity, color: "text-muted" };
        const Icon = config.icon;

        return (
          <div
            key={event.id}
            className="flex items-start gap-3 py-3 px-4 border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
          >
            <div className={cn("w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center shrink-0 mt-0.5")}>
              <Icon className={cn("w-4 h-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-primary">{event.message}</p>
              <div className="flex items-center gap-3 mt-1">
                {event.agentName && (
                  <span className="text-xs text-accent">{event.agentName}</span>
                )}
                {event.taskTitle && (
                  <span className="text-xs text-info truncate max-w-[150px]">{event.taskTitle}</span>
                )}
                <span className="text-xs text-muted ml-auto">
                  {formatRelativeTime(event.createdAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
