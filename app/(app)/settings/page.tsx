"use client";

import Link from "next/link";
import { Cpu, Users, Building2, ShieldCheck, ChevronRight } from "lucide-react";

const settingsItems = [
  { href: "/settings/ai", label: "AI Providers", description: "Configure API keys and models", icon: Cpu },
  { href: "/settings/leadership", label: "Leadership Style", description: "Choose how your CEO AI manages", icon: Users },
  { href: "/settings/organization", label: "Organization", description: "Departments and permissions", icon: Building2 },
  { href: "/settings/approvals", label: "Approvals", description: "When human approval is required", icon: ShieldCheck },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-secondary mt-1">Configure your AI organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-5 bg-surface border border-border rounded-xl hover:border-border-strong transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">{item.label}</h3>
                <p className="text-xs text-secondary mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
