"use client";

import { Building2, Plus } from "lucide-react";

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Organization Settings</h1>
        <p className="text-sm text-secondary mt-1">Manage departments, roles, and reporting</p>
      </div>

      <div className="p-6 bg-surface border border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Departments</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-lg hover:bg-accent/20 transition-colors">
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <p className="text-sm text-secondary">Department management interface - TODO: Implement drag-and-drop editor</p>
      </div>

      <div className="p-6 bg-surface border border-border rounded-xl">
        <h2 className="text-sm font-semibold mb-4">Role Templates</h2>
        <p className="text-sm text-secondary">Define default responsibilities for each role type - TODO: Implement role editor</p>
      </div>
    </div>
  );
}
