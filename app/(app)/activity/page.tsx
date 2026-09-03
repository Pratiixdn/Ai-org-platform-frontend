"use client";

import { ActivityFeed } from "@/components/activity-feed";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/types";

const demoEvents: ActivityEvent[] = [
  { id: "1", type: "task_created", message: "CEO AI assigned task to Engineering Department", agentName: "CEO AI", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: "2", type: "task_assigned", message: "Engineering Manager created frontend task", agentName: "Engineering Manager", createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: "3", type: "task_started", message: "Frontend Leader assigned task to React Developer", agentName: "Frontend Leader", createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: "4", type: "task_completed", message: "React Developer completed product grid component", agentName: "React Developer AI", createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: "5", type: "issue_detected", message: "QA detected responsive issue on mobile", agentName: "QA Staff AI", createdAt: new Date(Date.now() - 1000 * 60).toISOString() },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Activity Log</h1>
        <p className="text-sm text-secondary mt-1">Real-time organization events</p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium">Recent Events</span>
          <span className="text-xs px-2 py-1 bg-info/10 text-info rounded-full">Demo Data</span>
        </div>
        <ActivityFeed events={demoEvents} maxHeight="600px" />
      </div>
    </div>
  );
}
