"use client";

import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "error";
}

export function ProgressIndicator({
  progress,
  size = "md",
  showLabel = true,
  variant = "default",
}: ProgressIndicatorProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const variantClasses = {
    default: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };

  return (
    <div className="w-full">
      <div className={cn("w-full bg-surface-hover rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", variantClasses[variant])}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted mt-1">{clamped}%</span>
      )}
    </div>
  );
}
