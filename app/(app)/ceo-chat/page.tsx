"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { CEOChat } from "@/components/ceo-chat";
import type { OrgNode } from "@/lib/types";

const orgData: OrgNode = {
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
};

export default function CEOChatPage() {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">CEO Chat</h1>
          <p className="text-sm text-secondary mt-1">Delegate tasks to Apex, your CEO AI</p>
        </div>
        <button
          onClick={() => setChatOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Start New Task
        </button>
      </div>

      <div className="p-8 bg-surface border border-border rounded-xl text-center">
        <p className="text-sm text-secondary mb-4">
          Click "Start New Task" to open the CEO Chat interface. Describe your project, and Apex will break it down and delegate to the right departments.
        </p>
      </div>

      <CEOChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        orgData={orgData}
        onTaskCreated={(task) => {
          alert(`Task created: ${task.title} with ${task.subtasks.length} subtasks!`);
          setChatOpen(false);
        }}
      />
    </div>
  );
}
