"use client";

import { cn, getStatusColor, formatRelativeTime } from "@/lib/utils";
import type { TaskStep } from "@/lib/types";
import { CheckCircle2, XCircle, Clock, AlertCircle, RotateCcw } from "lucide-react";

interface TaskTimelineProps {
  steps: TaskStep[];
  currentStepId?: string;
}

export function TaskTimeline({ steps, currentStepId }: TaskTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-secondary">
        Task timeline will appear once execution begins
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-0">
        {steps.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isLast = index === steps.length - 1;

          const icons = {
            completed: CheckCircle2,
            failed: XCircle,
            pending: Clock,
            executing: AlertCircle,
            reviewing: AlertCircle,
            revising: RotateCcw,
          };
          const Icon = icons[step.status] || Clock;

          return (
            <div
              key={step.id}
              className={cn(
                "relative pl-12 py-4 transition-colors",
                isActive && "bg-accent/5 -mx-4 px-4 pl-16 rounded-lg"
              )}
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-2.5 top-5 w-3 h-3 rounded-full border-2 z-10",
                isActive 
                  ? "bg-accent border-accent animate-pulse" 
                  : step.status === "completed" 
                    ? "bg-success border-success" 
                    : step.status === "failed"
                      ? "bg-error border-error"
                      : "bg-surface border-border"
              )} />

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary">{step.agentName}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                      getStatusColor(step.status).replace("text-", "bg-") + "/10",
                      getStatusColor(step.status)
                    )}>
                      {step.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-sm text-secondary mb-2">{step.action}</p>

                  {step.output && (
                    <div className="p-3 bg-background rounded-lg border border-border mb-2">
                      <p className="text-xs text-secondary font-mono whitespace-pre-wrap">{step.output}</p>
                    </div>
                  )}

                  {step.error && (
                    <div className="p-3 bg-error/5 rounded-lg border border-error/20 mb-2">
                      <p className="text-xs text-error font-mono">{step.error}</p>
                    </div>
                  )}

                  {step.reviewComments && (
                    <div className="p-3 bg-warning/5 rounded-lg border border-warning/20">
                      <p className="text-xs text-warning">Review: {step.reviewComments}</p>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {step.startedAt && (
                    <span className="text-xs text-muted block">
                      {formatRelativeTime(step.startedAt)}
                    </span>
                  )}
                  {step.revisionCount > 0 && (
                    <span className="text-xs text-warning mt-1 block">
                      {step.revisionCount} revision{step.revisionCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
