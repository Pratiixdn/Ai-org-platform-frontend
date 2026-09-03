"use client";

import { useState } from "react";
import { Network, Plus, MessageSquare } from "lucide-react";
import { OrgChart } from "@/components/org-chart";
import { CEOChat } from "@/components/ceo-chat";
import type { OrgNode } from "@/lib/types";

export default function OrganizationPage() {
  const [chatOpen, setChatOpen] = useState(false);

  const [treeData, setTreeData] = useState<OrgNode>({
    id: "ceo-1",
    name: "Apex (CEO AI)",
    role: "Chief Executive Officer",
    type: "ceo",
    status: "working",
    currentTask: "Overseeing e-commerce platform build",
    children: [
      {
        id: "dept-eng",
        name: "Engineering",
        role: "Department",
        type: "department",
        status: "working",
        children: [
          {
            id: "mgr-eng",
            name: "Sarah (Engineering Manager)",
            role: "Manager",
            type: "manager",
            status: "working",
            currentTask: "Planning sprint architecture",
            children: [
              {
                id: "lead-fe",
                name: "Marcus (Frontend Leader)",
                role: "Team Leader",
                type: "leader",
                status: "working",
                currentTask: "Building React components",
                children: [
                  { id: "staff-react", name: "React Developer AI", role: "Developer", type: "staff", status: "working", currentTask: "Implementing product grid", children: [] },
                  { id: "staff-css", name: "CSS Developer AI", role: "Stylist", type: "staff", status: "idle", children: [] },
                ],
              },
              {
                id: "lead-be",
                name: "Elena (Backend Leader)",
                role: "Team Leader",
                type: "leader",
                status: "idle",
                children: [
                  { id: "staff-api", name: "API Developer AI", role: "Developer", type: "staff", status: "idle", children: [] },
                  { id: "staff-db", name: "Database Developer AI", role: "Developer", type: "staff", status: "idle", children: [] },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "dept-prod",
        name: "Product",
        role: "Department",
        type: "department",
        status: "working",
        children: [
          {
            id: "mgr-prod",
            name: "David (Product Manager)",
            role: "Manager",
            type: "manager",
            status: "working",
            children: [
              {
                id: "lead-ux",
                name: "Lisa (UX Leader)",
                role: "Team Leader",
                type: "leader",
                status: "working",
                children: [
                  { id: "staff-ui", name: "UI Designer AI", role: "Designer", type: "staff", status: "working", children: [] },
                  { id: "staff-uxr", name: "UX Researcher AI", role: "Researcher", type: "staff", status: "idle", children: [] },
                ],
              },
              { id: "staff-analyst", name: "Product Analyst AI", role: "Analyst", type: "staff", status: "idle", children: [] },
            ],
          },
        ],
      },
      {
        id: "dept-mkt",
        name: "Marketing",
        role: "Department",
        type: "department",
        status: "idle",
        children: [
          {
            id: "mgr-mkt",
            name: "James (Marketing Manager)",
            role: "Manager",
            type: "manager",
            status: "idle",
            children: [
              { id: "lead-content", name: "Content Leader", role: "Team Leader", type: "leader", status: "idle", children: [] },
              { id: "staff-seo", name: "SEO Staff AI", role: "Specialist", type: "staff", status: "idle", children: [] },
            ],
          },
        ],
      },
      {
        id: "dept-qa",
        name: "QA",
        role: "Department",
        type: "department",
        status: "idle",
        children: [
          {
            id: "mgr-qa",
            name: "Rachel (QA Manager)",
            role: "Manager",
            type: "manager",
            status: "idle",
            children: [
              { id: "lead-test", name: "Testing Leader", role: "Team Leader", type: "leader", status: "idle", children: [] },
              { id: "staff-qa", name: "QA Staff AI", role: "Tester", type: "staff", status: "idle", children: [] },
            ],
          },
        ],
      },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Organization</h1>
          <p className="text-sm text-secondary mt-1">AI agent hierarchy and reporting structure</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Talk to CEO
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-hover hover:bg-surface-elevated text-primary text-sm font-medium rounded-lg border border-border transition-colors">
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs px-2 py-1 bg-info/10 text-info rounded-full">Demo Data</span>
        <span className="text-xs text-muted">Zoom with controls on the chart. Click "Talk to CEO" to delegate tasks.</span>
      </div>

      <OrgChart
        data={treeData}
        onAddChild={(parentId, type) => alert(`Add ${type} to ${parentId} - TODO`)}
        onEdit={(node) => alert(`Edit ${node.name} - TODO`)}
        onDelete={(node) => alert(`Delete ${node.name} - TODO`)}
        onToggleEnable={(node) => alert(`Toggle ${node.name} - TODO`)}
        onChatWithCEO={() => setChatOpen(true)}
      />

      <CEOChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        orgData={treeData}
        onTaskCreated={(task) => {
          alert(`Task created: ${task.title} with ${task.subtasks.length} subtasks!`);
          setChatOpen(false);
        }}
      />
    </div>
  );
}
