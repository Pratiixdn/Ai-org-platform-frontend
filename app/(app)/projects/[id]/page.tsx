"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, FolderKanban, ListTodo } from "lucide-react";
import Link from "next/link";
import { TaskCard } from "@/components/task-card";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ProgressIndicator } from "@/components/progress-indicator";
import type { Project, Task } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const mockProject: Project = {
          id: params.id as string,
          name: "E-Commerce Platform",
          description: "Complete shoe retail website",
          organizationId: "demo-org",
          status: "active",
          taskCount: 3,
          completedTaskCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockTasks: Task[] = [
          {
            id: "demo-task-1",
            title: "Build product catalog",
            description: "Create product listing and detail pages",
            requirements: ["Responsive", "Filterable"],
            priority: "high",
            allowedDepartments: ["engineering"],
            approvalRequired: false,
            status: "completed",
            organizationId: "demo-org",
            projectId: params.id as string,
            steps: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "demo-task-2",
            title: "Implement checkout flow",
            description: "Cart, payment, and order confirmation",
            requirements: ["Stripe integration", "Order tracking"],
            priority: "critical",
            allowedDepartments: ["engineering"],
            approvalRequired: true,
            status: "executing",
            organizationId: "demo-org",
            projectId: params.id as string,
            steps: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setProject(mockProject);
        setTasks(mockTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!project) return <ErrorState message="Project not found" />;

  const progress = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{project.name}</h1>
            <p className="text-sm text-secondary">{project.description}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium capitalize">
          {project.status}
        </span>
      </div>

      <div className="p-5 bg-surface border border-border rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-secondary">{project.completedTaskCount} / {project.taskCount} tasks</span>
        </div>
        <ProgressIndicator progress={progress} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-accent" />
          Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-secondary py-8 text-center">No tasks in this project</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
