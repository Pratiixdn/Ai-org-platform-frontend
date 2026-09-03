import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "•".repeat(key.length);
  return key.slice(0, 4) + "•".repeat(key.length - 8) + key.slice(-4);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    idle: "text-muted",
    working: "text-accent",
    reviewing: "text-warning",
    blocked: "text-error",
    disabled: "text-muted",
    error: "text-error",
    pending: "text-muted",
    analyzing: "text-info",
    decomposing: "text-info",
    delegating: "text-accent",
    executing: "text-accent",
    completed: "text-success",
    failed: "text-error",
    cancelled: "text-muted",
    waiting_approval: "text-warning",
    healthy: "text-success",
    degraded: "text-warning",
    critical: "text-error",
  };
  return colors[status] || "text-muted";
}

export function getStatusBg(status: string): string {
  const bgs: Record<string, string> = {
    idle: "bg-muted/10",
    working: "bg-accent/10",
    reviewing: "bg-warning/10",
    blocked: "bg-error/10",
    disabled: "bg-muted/10",
    error: "bg-error/10",
    pending: "bg-muted/10",
    analyzing: "bg-info/10",
    decomposing: "bg-info/10",
    delegating: "bg-accent/10",
    executing: "bg-accent/10",
    completed: "bg-success/10",
    failed: "bg-error/10",
    cancelled: "bg-muted/10",
    waiting_approval: "bg-warning/10",
  };
  return bgs[status] || "bg-muted/10";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "text-muted",
    medium: "text-info",
    high: "text-warning",
    critical: "text-error",
  };
  return colors[priority] || "text-muted";
}

export function getPriorityBg(priority: string): string {
  const bgs: Record<string, string> = {
    low: "bg-muted/10",
    medium: "bg-info/10",
    high: "bg-warning/10",
    critical: "bg-error/10",
  };
  return bgs[priority] || "bg-muted/10";
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
