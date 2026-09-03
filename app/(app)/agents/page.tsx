"use client";

import { useState } from "react";
import { Plus, Bot, Search } from "lucide-react";
import { AgentEditor } from "@/components/agent-editor";
import { AgentStatusBadge } from "@/components/agent-status";
import { ProgressIndicator } from "@/components/progress-indicator";
import { EmptyState } from "@/components/empty-state";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import type { Agent, AIProvider } from "@/lib/types";

const demoAgents: Agent[] = [
  { id: "ceo", name: "Apex", role: "CEO AI", departmentId: "exec", status: "working", progress: 75, responsibilities: ["Strategic planning", "Task delegation"], leadershipAuthority: 100, enabled: true, maxAutonomy: 100, allowedTools: ["all"], createdAt: "", updatedAt: "" },
  { id: "eng-mgr", name: "Sarah", role: "Engineering Manager", departmentId: "eng", parentId: "ceo", status: "working", progress: 60, currentTask: "Sprint planning", responsibilities: ["Code review", "Architecture decisions"], leadershipAuthority: 80, enabled: true, maxAutonomy: 75, allowedTools: ["github", "jira"], createdAt: "", updatedAt: "" },
  { id: "frontend-lead", name: "Marcus", role: "Frontend Leader", departmentId: "eng", parentId: "eng-mgr", status: "working", progress: 45, currentTask: "Component library", responsibilities: ["UI implementation", "Performance"], leadershipAuthority: 60, enabled: true, maxAutonomy: 60, allowedTools: ["github", "figma"], createdAt: "", updatedAt: "" },
  { id: "react-dev", name: "React Developer AI", role: "Developer", departmentId: "eng", parentId: "frontend-lead", status: "working", progress: 30, currentTask: "Product grid component", responsibilities: ["Component development"], leadershipAuthority: 20, enabled: true, maxAutonomy: 40, allowedTools: ["github"], createdAt: "", updatedAt: "" },
  { id: "css-dev", name: "CSS Developer AI", role: "Stylist", departmentId: "eng", parentId: "frontend-lead", status: "idle", progress: 0, responsibilities: ["Styling", "Responsive design"], leadershipAuthority: 15, enabled: true, maxAutonomy: 35, allowedTools: ["github"], createdAt: "", updatedAt: "" },
];

const demoDepts = [
  { id: "exec", name: "Executive" },
  { id: "eng", name: "Engineering" },
  { id: "prod", name: "Product" },
  { id: "mkt", name: "Marketing" },
  { id: "qa", name: "QA" },
];

const demoProviders: AIProvider[] = [
  { id: "p1", name: "OpenAI", model: "gpt-4o", apiType: "openai", createdAt: "", updatedAt: "" },
  { id: "p2", name: "Anthropic", model: "claude-3-5-sonnet", apiType: "anthropic", createdAt: "", updatedAt: "" },
];

export default function AgentsPage() {
  const { agents, setAgents } = useAppStore();
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deleteModal, setDeleteModal] = useState<Agent | null>(null);

  const displayAgents = agents.length > 0 ? agents : demoAgents;
  const filtered = displayAgents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (data: Partial<Agent>) => {
    if (editingAgent) {
      setAgents(agents.map((a) => (a.id === editingAgent.id ? { ...a, ...data } : a)));
    } else {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: data.name || "",
        role: data.role || "",
        departmentId: data.departmentId || "",
        parentId: data.parentId,
        providerId: data.providerId,
        model: data.model,
        status: "idle",
        progress: 0,
        systemInstructions: data.systemInstructions,
        responsibilities: data.responsibilities || [],
        leadershipAuthority: data.leadershipAuthority || 50,
        enabled: data.enabled ?? true,
        maxAutonomy: data.maxAutonomy || 50,
        allowedTools: data.allowedTools || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAgents([...agents, newAgent]);
    }
    setEditingAgent(null);
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setEditorOpen(true);
  };

  const handleDelete = () => {
    if (deleteModal) {
      setAgents(agents.filter((a) => a.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agents</h1>
          <p className="text-sm text-secondary mt-1">Manage your AI workforce</p>
        </div>
        <button
          onClick={() => { setEditingAgent(null); setEditorOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-accent/50"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bot} title="No agents found" description="Add AI agents to your organization." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <div key={agent.id} className="relative group">
              <Link
                href={`/agents/${agent.id}`}
                className="block p-5 bg-surface border border-border rounded-xl hover:border-border-strong transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary">{agent.name}</h3>
                      <p className="text-xs text-secondary">{agent.role}</p>
                    </div>
                  </div>
                  <AgentStatusBadge status={agent.status} />
                </div>
                {agent.currentTask && (
                  <p className="text-xs text-muted mb-3">{agent.currentTask}</p>
                )}
                <ProgressIndicator progress={agent.progress} size="sm" showLabel={false} />
                <div className="flex items-center justify-between mt-3 text-xs text-muted">
                  <span>Autonomy: {agent.maxAutonomy}%</span>
                  <span>Auth: {agent.leadershipAuthority}%</span>
                </div>
              </Link>
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(agent)}
                  className="p-1.5 bg-surface-hover border border-border rounded-md text-secondary hover:text-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal(agent)}
                  className="p-1.5 bg-surface-hover border border-border rounded-md text-error"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AgentEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSubmit={handleSubmit}
        agent={editingAgent}
        departments={demoDepts}
        agents={displayAgents}
        providers={demoProviders}
      />

      <ConfirmationModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete Agent"
        description={`Are you sure you want to delete "${deleteModal?.name}"?`}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
