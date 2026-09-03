"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, ListTodo, CheckCircle2, XCircle, MessageSquare, RotateCcw, GitBranch, Clock } from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { TaskTimeline } from "@/components/task-timeline";
import { TaskExecutionGraph } from "@/components/task-execution-graph";
import { cn, getStatusColor, getStatusBg, getPriorityColor, getPriorityBg, formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";

export default function TaskDetailPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "graph">("timeline");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const mockTask: Task = {
          id: params.id as string,
          title: "Build complete e-commerce website for selling shoes",
          description: "Full-stack SaaS platform with product management, cart, checkout, and admin dashboard",
          requirements: ["Responsive design", "Payment integration", "Inventory management", "User authentication"],
          constraints: "Must be completed within 2 weeks",
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          priority: "high",
          allowedDepartments: ["engineering", "product", "marketing", "qa"],
          approvalRequired: true,
          status: "executing",
          organizationId: "demo-org",
          steps: [
            { id: "s1", taskId: params.id as string, agentId: "ceo", agentName: "CEO AI", action: "Analyzing requirements and project scope", status: "completed", output: "Project identified as full-stack e-commerce platform. Departments: Engineering, Product, Marketing, QA.", revisionCount: 0, qualityScore: 95, createdAt: new Date().toISOString() },
            { id: "s2", taskId: params.id as string, agentId: "ceo", agentName: "CEO AI", action: "Decomposing into departmental tasks", status: "completed", output: "4 sub-tasks created and assigned to respective departments.", revisionCount: 0, qualityScore: 92, createdAt: new Date().toISOString() },
            { id: "s3", taskId: params.id as string, agentId: "eng-mgr", agentName: "Engineering Manager", action: "Planning frontend and backend architecture", status: "completed", output: "React + Node.js stack selected. Database schema designed.", revisionCount: 1, reviewComments: "Consider using Next.js instead of plain React", qualityScore: 88, createdAt: new Date().toISOString() },
            { id: "s4", taskId: params.id as string, agentId: "frontend-lead", agentName: "Frontend Leader", action: "Building React components and pages", status: "executing", revisionCount: 0, createdAt: new Date().toISOString() },
            { id: "s5", taskId: params.id as string, agentId: "qa-lead", agentName: "QA Leader", action: "Waiting for frontend completion to begin testing", status: "pending", revisionCount: 0, createdAt: new Date().toISOString() },
          ],
          currentStepId: "s4",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTask(mockTask);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load task");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!task) return <ErrorState message="Task not found" />;

  const progress = task.steps.length > 0
    ? Math.round((task.steps.filter((s) => s.status === "completed").length / task.steps.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{task.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusBg(task.status), getStatusColor(task.status))}>
                {task.status.replace("_", " ")}
              </span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusBg(task.priority), getStatusColor(task.priority))}>
                {task.priority}
              </span>
              {task.approvalRequired && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  Approval Required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {task.description && (
        <div className="p-5 bg-surface border border-border rounded-xl">
          <h3 className="text-sm font-semibold mb-2">Description</h3>
          <p className="text-sm text-secondary">{task.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-surface border border-border rounded-xl">
          <h3 className="text-sm font-semibold mb-3">Requirements</h3>
          <ul className="space-y-2">
            {task.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 bg-surface border border-border rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Constraints</h3>
            <p className="text-sm text-secondary">{task.constraints || "None specified"}</p>
          </div>
          {task.deadline && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Deadline</h3>
              <p className="text-sm text-secondary">{formatDate(task.deadline)}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold mb-1">Allowed Departments</h3>
            <div className="flex flex-wrap gap-2">
              {task.allowedDepartments.map((dept) => (
                <span key={dept} className="px-2 py-0.5 bg-surface-hover border border-border rounded-md text-xs text-secondary capitalize">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-surface border border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Execution</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("timeline")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "timeline" ? "bg-accent text-white" : "bg-surface-hover text-secondary"
              )}
            >
              <Clock className="w-3 h-3" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "graph" ? "bg-accent text-white" : "bg-surface-hover text-secondary"
              )}
            >
              <GitBranch className="w-3 h-3" />
              Graph
            </button>
          </div>
        </div>

        {viewMode === "timeline" ? (
          <TaskTimeline steps={task.steps} currentStepId={task.currentStepId} />
        ) : (
          <TaskExecutionGraph steps={task.steps} currentStepId={task.currentStepId} />
        )}
      </div>

      {task.status === "waiting_approval" && (
        <div className="p-5 bg-warning/5 border border-warning/20 rounded-xl">
          <h3 className="text-sm font-semibold text-warning mb-3">Approval Required</h3>
          <p className="text-sm text-secondary mb-4">This task requires your approval before proceeding.</p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-colors">
              Approve
            </button>
            <button className="px-4 py-2 bg-error hover:bg-error/90 text-white text-sm font-medium rounded-lg transition-colors">
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
