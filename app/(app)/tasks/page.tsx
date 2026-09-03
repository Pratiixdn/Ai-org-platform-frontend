"use client";

import { useState } from "react";
import { Plus, ListTodo, SlidersHorizontal } from "lucide-react";
import { TaskCard } from "@/components/task-card";
import { TaskComposer } from "@/components/task-composer";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { useAppStore } from "@/lib/store";
import { cn, getStatusColor, getStatusBg } from "@/lib/utils";
import type { Task, TaskStatus } from "@/lib/types";

const statusFilters: TaskStatus[] = ["pending", "analyzing", "executing", "reviewing", "waiting_approval", "completed", "failed"];

const demoTasks: Task[] = [
  {
    id: "demo-task-1",
    title: "Build complete e-commerce website for selling shoes",
    description: "Full-stack SaaS platform with product management, cart, checkout, and admin dashboard",
    requirements: ["Responsive design", "Payment integration", "Inventory management", "User authentication"],
    constraints: "Must be completed within 2 weeks",
    priority: "high",
    allowedDepartments: ["engineering", "product", "marketing", "qa"],
    approvalRequired: true,
    status: "executing",
    organizationId: "demo-org",
    steps: [
      { id: "s1", taskId: "demo-task-1", agentId: "ceo", agentName: "CEO AI", action: "Analyzing requirements and scope", status: "completed", revisionCount: 0, createdAt: new Date().toISOString() },
      { id: "s2", taskId: "demo-task-1", agentId: "ceo", agentName: "CEO AI", action: "Decomposing into departmental tasks", status: "completed", revisionCount: 0, createdAt: new Date().toISOString() },
      { id: "s3", taskId: "demo-task-1", agentId: "eng-mgr", agentName: "Engineering Manager", action: "Planning frontend architecture", status: "completed", revisionCount: 0, createdAt: new Date().toISOString() },
      { id: "s4", taskId: "demo-task-1", agentId: "frontend-lead", agentName: "Frontend Leader", action: "Building React components", status: "executing", revisionCount: 0, createdAt: new Date().toISOString() },
    ],
    currentStepId: "s4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-task-2",
    title: "Design marketing landing page",
    description: "High-conversion landing page for product launch",
    requirements: ["A/B test ready", "SEO optimized", "Fast load times"],
    priority: "medium",
    allowedDepartments: ["marketing", "product"],
    approvalRequired: false,
    status: "completed",
    organizationId: "demo-org",
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-task-3",
    title: "Set up CI/CD pipeline",
    description: "Automated testing and deployment pipeline",
    requirements: ["GitHub Actions", "Automated tests", "Staging environment"],
    priority: "critical",
    allowedDepartments: ["engineering"],
    approvalRequired: true,
    status: "waiting_approval",
    organizationId: "demo-org",
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function TasksPage() {
  const { tasks, setTasks } = useAppStore();
  const [loading] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [deleteModal, setDeleteModal] = useState<Task | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const displayTasks = tasks.length > 0 ? tasks : (showDemo ? demoTasks : []);
  const filteredTasks = filter === "all" ? displayTasks : displayTasks.filter((t) => t.status === filter);

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title || "",
      description: taskData.description || "",
      requirements: taskData.requirements || [],
      constraints: taskData.constraints,
      priority: taskData.priority || "medium",
      allowedDepartments: taskData.allowedDepartments || [],
      approvalRequired: taskData.approvalRequired ?? true,
      status: "pending",
      organizationId: "demo-org",
      steps: [
        { id: `s-${Date.now()}`, taskId: `task-${Date.now()}`, agentId: "ceo", agentName: "CEO AI", action: "Received task, beginning analysis", status: "analyzing", revisionCount: 0, createdAt: new Date().toISOString() },
      ],
      currentStepId: `s-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const confirmDelete = () => {
    if (deleteModal) {
      setTasks(tasks.filter((t) => t.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tasks</h1>
          <p className="text-sm text-secondary mt-1">Track and manage AI-delegated tasks</p>
        </div>
        <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <SlidersHorizontal className="w-4 h-4 text-muted shrink-0" />
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
            filter === "all" ? "bg-accent text-white" : "bg-surface-hover text-secondary hover:text-primary"
          )}
        >
          All
        </button>
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap capitalize",
              filter === status ? "bg-accent text-white" : "bg-surface-hover text-secondary hover:text-primary"
            )}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="Create a task to see your AI organization in action."
          action={{ label: "Create Task", onClick: () => setComposerOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="relative group">
              <TaskCard task={task} />
              {tasks.length > 0 && (
                <button
                  onClick={() => setDeleteModal(task)}
                  className="absolute top-3 right-3 p-1.5 bg-surface-hover border border-border rounded-md text-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showDemo && tasks.length === 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowDemo(false)}
            className="text-sm text-muted hover:text-secondary transition-colors"
          >
            Hide demo data
          </button>
        </div>
      )}

      <TaskComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreateTask}
        departments={["engineering", "product", "marketing", "qa"]}
      />

      <ConfirmationModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteModal?.title}"?`}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
