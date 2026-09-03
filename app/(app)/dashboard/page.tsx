"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { TaskCard } from "@/components/task-card";
import { ActivityFeed } from "@/components/activity-feed";
import { cn } from "@/lib/utils";
import type { DashboardStats, Task, ActivityEvent } from "@/lib/types";

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}) {
  return (
    <div className="p-5 bg-surface border border-border rounded-xl hover:border-border-strong transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {subtext && <span className="text-xs text-secondary">{subtext}</span>}
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-secondary mt-0.5">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { dashboardStats, setDashboardStats, tasks, setTasks, activities, setActivities } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const mockStats: DashboardStats = {
          activeProjects: 3,
          runningTasks: 7,
          completedTasks: 24,
          failedTasks: 2,
          pendingApprovals: 1,
          totalAgents: 12,
          activeAgents: 8,
          departmentsCount: 4,
          tokenUsage: { current: 45200, limit: 100000, unit: "tokens" },
          systemHealth: "healthy",
        };

        const mockTasks: Task[] = [
          {
            id: "demo-task-1",
            title: "Build e-commerce shoe website",
            description: "Complete SaaS platform with product catalog, cart, and checkout",
            requirements: ["Responsive design", "Payment integration", "Inventory management"],
            priority: "high",
            allowedDepartments: ["engineering", "product", "marketing"],
            approvalRequired: true,
            status: "executing",
            organizationId: "demo-org",
            steps: [
              { id: "s1", taskId: "demo-task-1", agentId: "ceo", agentName: "CEO AI", action: "Analyzing requirements", status: "completed", revisionCount: 0, createdAt: new Date().toISOString() },
              { id: "s2", taskId: "demo-task-1", agentId: "eng-mgr", agentName: "Engineering Manager", action: "Decomposing into sprints", status: "completed", revisionCount: 0, createdAt: new Date().toISOString() },
              { id: "s3", taskId: "demo-task-1", agentId: "frontend-lead", agentName: "Frontend Leader", action: "Building React components", status: "executing", revisionCount: 0, createdAt: new Date().toISOString() },
            ],
            currentStepId: "s3",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        const mockActivity: ActivityEvent[] = [
          { id: "a1", type: "task_created", message: "CEO AI assigned task to Engineering Department", agentName: "CEO AI", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
          { id: "a2", type: "task_assigned", message: "Engineering Manager created frontend task", agentName: "Engineering Manager", createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
          { id: "a3", type: "task_started", message: "Frontend Leader assigned task to React Developer", agentName: "Frontend Leader", createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
          { id: "a4", type: "task_completed", message: "React Developer completed product grid component", agentName: "React Developer AI", createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
          { id: "a5", type: "issue_detected", message: "QA detected responsive issue on mobile", agentName: "QA Staff AI", createdAt: new Date(Date.now() - 1000 * 60).toISOString() },
        ];

        setDashboardStats(mockStats);
        setTasks(mockTasks);
        setActivities(mockActivity);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [setDashboardStats, setTasks, setActivities]);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!dashboardStats) return <ErrorState message="No dashboard data available" />;

  const healthColor = {
    healthy: "bg-success",
    degraded: "bg-warning",
    critical: "bg-error",
  }[dashboardStats.systemHealth];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-secondary mt-1">Overview of your AI organization</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg">
          <span className={cn("w-2 h-2 rounded-full", healthColor)} />
          <span className="text-sm text-secondary capitalize">{dashboardStats.systemHealth}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Active Projects" value={dashboardStats.activeProjects} color="bg-accent" />
        <StatCard icon={Zap} label="Running Tasks" value={dashboardStats.runningTasks} color="bg-info" />
        <StatCard icon={CheckCircle2} label="Completed" value={dashboardStats.completedTasks} color="bg-success" />
        <StatCard icon={XCircle} label="Failed" value={dashboardStats.failedTasks} color="bg-error" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending Approvals" value={dashboardStats.pendingApprovals} color="bg-warning" />
        <StatCard icon={Users} label="Active Agents" value={`${dashboardStats.activeAgents}/${dashboardStats.totalAgents}`} color="bg-accent" />
        <StatCard icon={Building2} label="Departments" value={dashboardStats.departmentsCount} color="bg-info" />
        <StatCard icon={TrendingUp} label="Token Usage" value={`${Math.round((dashboardStats.tokenUsage?.current || 0) / (dashboardStats.tokenUsage?.limit || 1) * 100)}%`} subtext={`${dashboardStats.tokenUsage?.current?.toLocaleString()} / ${dashboardStats.tokenUsage?.limit?.toLocaleString()}`} color="bg-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Tasks</h2>
            <span className="text-xs px-2 py-1 bg-info/10 text-info rounded-full">Demo Data</span>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-secondary py-8 text-center">No active tasks</p>
            ) : (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <ActivityFeed events={activities} maxHeight="500px" />
          </div>
        </div>
      </div>
    </div>
  );
}
