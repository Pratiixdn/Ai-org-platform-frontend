"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { cn, getStatusColor, getStatusBg, getPriorityColor, getPriorityBg, formatRelativeTime } from "@/lib/utils";
import { type Task } from "@/lib/types";
import { ProgressIndicator } from "./progress-indicator";

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export function TaskCard({ task, compact = false }: TaskCardProps) {
  const currentStep = task.steps?.find((s) => s.id === task.currentStepId);
  const progress = task.steps?.length
    ? Math.round((task.steps.filter((s) => s.status === "completed").length / task.steps.length) * 100)
    : 0;

  if (compact) {
    return (
      <Link
        href={`/tasks/${task.id}`}
        className="block p-4 bg-surface border border-border rounded-lg hover:border-border-strong transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-primary truncate">{task.title}</h4>
            <p className="text-xs text-secondary mt-0.5">{currentStep?.agentName || "Not started"}</p>
          </div>
          <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-xs font-medium", getStatusBg(task.status), getStatusColor(task.status))}>
            {task.status.replace("_", " ")}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block p-5 bg-surface border border-border rounded-xl hover:border-border-strong transition-colors group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-primary group-hover:text-accent transition-colors truncate">
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getStatusBg(task.status), getStatusColor(task.status))}>
              {task.status.replace("_", " ")}
            </span>
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getPriorityBg(task.priority), getPriorityColor(task.priority))}>
              {task.priority}
            </span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
      </div>

      {task.description && (
        <p className="text-sm text-secondary line-clamp-2 mb-4">{task.description}</p>
      )}

      <div className="space-y-3">
        <ProgressIndicator progress={progress} size="sm" showLabel={false} />
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{currentStep?.action || "Waiting to start"}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(task.updatedAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
