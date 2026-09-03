"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent, AIProvider } from "@/lib/types";

interface AgentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agent: Partial<Agent>) => void;
  agent?: Agent | null;
  departments: { id: string; name: string }[];
  agents: { id: string; name: string }[];
  providers: AIProvider[];
}

export function AgentEditor({ isOpen, onClose, onSubmit, agent, departments, agents, providers }: AgentEditorProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [parentId, setParentId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [model, setModel] = useState("");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [leadershipAuthority, setLeadershipAuthority] = useState(50);
  const [maxAutonomy, setMaxAutonomy] = useState(50);
  const [allowedTools, setAllowedTools] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setRole(agent.role);
      setDepartmentId(agent.departmentId);
      setParentId(agent.parentId || "");
      setProviderId(agent.providerId || "");
      setModel(agent.model || "");
      setSystemInstructions(agent.systemInstructions || "");
      setResponsibilities(agent.responsibilities.length ? agent.responsibilities : [""]);
      setLeadershipAuthority(agent.leadershipAuthority);
      setMaxAutonomy(agent.maxAutonomy);
      setAllowedTools(agent.allowedTools);
      setEnabled(agent.enabled);
    } else {
      setName("");
      setRole("");
      setDepartmentId(departments[0]?.id || "");
      setParentId("");
      setProviderId("");
      setModel("");
      setSystemInstructions("");
      setResponsibilities([""]);
      setLeadershipAuthority(50);
      setMaxAutonomy(50);
      setAllowedTools([]);
      setEnabled(true);
    }
    setErrors({});
  }, [agent, isOpen, departments]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!role.trim()) newErrors.role = "Role is required";
    if (!departmentId) newErrors.department = "Department is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      role: role.trim(),
      departmentId,
      parentId: parentId || undefined,
      providerId: providerId || undefined,
      model: model || undefined,
      systemInstructions: systemInstructions || undefined,
      responsibilities: responsibilities.filter((r) => r.trim()),
      leadershipAuthority,
      maxAutonomy,
      allowedTools,
      enabled,
    });
    onClose();
  };

  const addResponsibility = () => setResponsibilities([...responsibilities, ""]);
  const updateResp = (i: number, val: string) => {
    const next = [...responsibilities];
    next[i] = val;
    setResponsibilities(next);
  };
  const removeResp = (i: number) => setResponsibilities(responsibilities.filter((_, idx) => idx !== i));

  const toolOptions = ["github", "jira", "slack", "figma", "notion", "api", "database", "file_system", "web_search", "code_execution"];
  const toggleTool = (tool: string) => {
    setAllowedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-elevated border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface-elevated z-10">
          <h2 className="text-lg font-semibold">{agent ? "Edit Agent" : "Add AI Agent"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-md transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex"
                className={cn("w-full px-3 py-2 bg-surface border rounded-lg text-sm", errors.name ? "border-error" : "border-border")}
              />
              {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Backend Manager"
                className={cn("w-full px-3 py-2 bg-surface border rounded-lg text-sm", errors.role ? "border-error" : "border-border")}
              />
              {errors.role && <p className="text-xs text-error mt-1">{errors.role}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className={cn("w-full px-3 py-2 bg-surface border rounded-lg text-sm", errors.department ? "border-error" : "border-border")}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Reports To</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
              >
                <option value="">No parent (top-level)</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">AI Provider</label>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
              >
                <option value="">Select provider</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.model})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Model Override</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., gpt-4o-mini"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">System Instructions</label>
            <textarea
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              placeholder="Custom instructions for this agent..."
              rows={3}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Responsibilities</label>
            <div className="space-y-2">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => updateResp(i, e.target.value)}
                    placeholder={`Responsibility ${i + 1}`}
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm"
                  />
                  {responsibilities.length > 1 && (
                    <button type="button" onClick={() => removeResp(i)} className="p-2 text-error hover:bg-error/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addResponsibility} className="flex items-center gap-1 mt-2 text-xs text-accent">
              <Plus className="w-3 h-3" /> Add responsibility
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Leadership Authority: {leadershipAuthority}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={leadershipAuthority}
                onChange={(e) => setLeadershipAuthority(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Max Autonomy: {maxAutonomy}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={maxAutonomy}
                onChange={(e) => setMaxAutonomy(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Allowed Tools</label>
            <div className="flex flex-wrap gap-2">
              {toolOptions.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors",
                    allowedTools.includes(tool)
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-surface border-border text-secondary"
                  )}
                >
                  {tool.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg border border-border">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            <label htmlFor="enabled" className="text-sm">Agent enabled</label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-secondary bg-surface-hover rounded-lg border border-border">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg">
              {agent ? "Save Changes" : "Create Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
