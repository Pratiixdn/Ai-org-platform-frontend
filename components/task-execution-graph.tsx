"use client";

import { useEffect, useRef, useState } from "react";
import { cn, getStatusColor } from "@/lib/utils";
import type { TaskStep } from "@/lib/types";

interface TaskExecutionGraphProps {
  steps: TaskStep[];
  currentStepId?: string;
}

interface NodePosition {
  x: number;
  y: number;
  step: TaskStep;
}

export function TaskExecutionGraph({ steps, currentStepId }: TaskExecutionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePosition[]>([]);

  useEffect(() => {
    if (!containerRef.current || steps.length === 0) return;
    const width = containerRef.current.offsetWidth;
    const height = Math.max(400, steps.length * 100);
    const cols = width > 600 ? 3 : 2;

    const newPositions = steps.map((step, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const isEvenRow = row % 2 === 0;
      const x = isEvenRow 
        ? (col * (width / cols)) + (width / cols / 2)
        : width - ((col * (width / cols)) + (width / cols / 2));
      return { x, y: row * 100 + 50, step };
    });
    setPositions(newPositions);
  }, [steps]);

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-surface border border-border rounded-xl">
        <p className="text-sm text-secondary">No execution steps yet</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto">
      <div className="min-w-[600px] relative" style={{ height: `${Math.max(400, steps.length * 100)}px` }}>
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {positions.map((pos, i) => {
            if (i === 0) return null;
            const prev = positions[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={prev.x}
                y1={prev.y}
                x2={pos.x}
                y2={pos.y}
                stroke="#1F1F2E"
                strokeWidth="2"
                strokeDasharray={pos.step.status === "pending" ? "5,5" : undefined}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {positions.map((pos) => {
          const isActive = pos.step.id === currentStepId;
          const statusColor = getStatusColor(pos.step.status).replace("text-", "");

          return (
            <div
              key={pos.step.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 w-48 p-3 rounded-xl border bg-surface transition-all duration-500",
                isActive 
                  ? "border-accent shadow-lg shadow-accent/10 scale-105 z-10" 
                  : "border-border hover:border-border-strong"
              )}
              style={{ left: pos.x, top: pos.y }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full", `bg-${statusColor}`)} />
                <span className="text-xs font-medium text-primary truncate">{pos.step.agentName}</span>
              </div>
              <p className="text-xs text-secondary line-clamp-2">{pos.step.action}</p>
              {pos.step.qualityScore !== undefined && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs text-muted">Quality:</span>
                  <span className={cn(
                    "text-xs font-medium",
                    pos.step.qualityScore >= 80 ? "text-success" : pos.step.qualityScore >= 50 ? "text-warning" : "text-error"
                  )}>
                    {pos.step.qualityScore}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
