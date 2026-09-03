"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalPolicy } from "@/lib/types";

const policies: { id: ApprovalPolicy; label: string; description: string }[] = [
  { id: "every_major", label: "Every Major Decision", description: "Require approval for all significant task assignments and strategy changes." },
  { id: "before_external", label: "Before External Actions", description: "Approve before any agent interacts with external systems or APIs." },
  { id: "before_delivery", label: "Before Final Delivery", description: "Only require approval before tasks are marked complete." },
  { id: "when_blocked", label: "When Agents Are Blocked", description: "Only notify when an agent cannot proceed autonomously." },
  { id: "never", label: "Never Automatically Approve", description: "All decisions require explicit human approval." },
];

export default function ApprovalSettingsPage() {
  const [selected, setSelected] = useState<ApprovalPolicy>("before_delivery");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Approval Settings</h1>
        <p className="text-sm text-secondary mt-1">Control when human approval is required</p>
      </div>

      <div className="space-y-3">
        {policies.map((policy) => (
          <button
            key={policy.id}
            onClick={() => setSelected(policy.id)}
            className={cn(
              "w-full flex items-start gap-4 p-5 bg-surface border rounded-xl text-left transition-colors",
              selected === policy.id
                ? "border-accent bg-accent/5"
                : "border-border hover:border-border-strong"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
              selected === policy.id ? "border-accent bg-accent" : "border-muted"
            )}>
              {selected === policy.id && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary">{policy.label}</h3>
              <p className="text-xs text-secondary mt-1">{policy.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
