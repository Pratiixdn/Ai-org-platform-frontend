"use client";

import Link from "next/link";
import { FolderKanban, ArrowRight } from "lucide-react";
import { cn, getStatusColor, getStatusBg } from "@/lib/utils";
import { type Project } from "@/lib/types";
import { ProgressIndicator } from "./progress-indicator";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block p-5 bg-surface border border-border rounded-xl hover:border-border-strong transition-colors group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-primary group-hover:text-accent transition-colors truncate">
              {project.name}
            </h3>
            <p className="text-sm text-secondary truncate">{project.description || "No description"}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0 mt-2" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusBg(project.status), getStatusColor(project.status))}>
          {project.status}
        </span>
        <span className="text-xs text-muted">
          {project.completedTaskCount} / {project.taskCount} tasks
        </span>
      </div>

      <ProgressIndicator progress={progress} size="sm" />
    </Link>
  );
}
