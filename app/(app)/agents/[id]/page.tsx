"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Bot, Power, Edit2, Cpu, Shield, Wrench } from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { AgentStatusBadge } from "@/components/agent-status";
import { ProgressIndicator } from "@/components/progress-indicator";
import type { Agent } from "@/lib/types";

export default function AgentDetailPage() {
  const params = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const mockAgent: Agent = {
          id: params.id as string,
          name: "React Developer AI",
          role: "Frontend Developer",
          departmentId: "eng",
          parentId: "frontend-lead",
          providerId: "p1",
          model: "gpt-4o-mini",
          status: "working",
          progress: 45,
          currentTask: "Implementing product grid component",
          systemInstructions: "You are a senior React developer. Write clean, performant components using TypeScript and modern React patterns.",
          responsibilities: ["Component development", "State management", "Performance optimization"],
          leadershipAuthority: 20,
          enabled: true,
          maxAutonomy: 40,
          allowedTools: ["github", "code_execution"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAgent(mockAgent);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load agent");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!agent) return <ErrorState message="Agent not found" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/agents" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
            <Bot className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{agent.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <AgentStatusBadge status={agent.status} />
              <span className="text-sm text-secondary">{agent.role}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-surface-hover border border-border rounded-lg text-sm hover:bg-surface-elevated transition-colors">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-surface-hover border border-border rounded-lg text-sm hover:bg-surface-elevated transition-colors">
            <Power className="w-4 h-4" />
            {agent.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>

      {agent.currentTask && (
        <div className="p-5 bg-surface border border-border rounded-xl">
          <h3 className="text-sm font-semibold mb-2">Current Task</h3>
          <p className="text-sm text-secondary">{agent.currentTask}</p>
          <div className="mt-3">
            <ProgressIndicator progress={agent.progress} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-surface border border-border rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold">AI Configuration</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Provider</span>
              <span className="text-primary">{agent.providerId || "Default"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Model</span>
              <span className="text-primary">{agent.model || "Default"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Max Autonomy</span>
              <span className="text-primary">{agent.maxAutonomy}%</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold">Authority</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Leadership Authority</span>
              <span className="text-primary">{agent.leadershipAuthority}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Can Delegate</span>
              <span className="text-primary">{agent.leadershipAuthority > 50 ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Status</span>
              <span className="text-primary capitalize">{agent.status}</span>
            </div>
          </div>
        </div>
      </div>

      {agent.systemInstructions && (
        <div className="p-5 bg-surface border border-border rounded-xl">
          <h3 className="text-sm font-semibold mb-2">System Instructions</h3>
          <p className="text-sm text-secondary font-mono whitespace-pre-wrap">{agent.systemInstructions}</p>
        </div>
      )}

      <div className="p-5 bg-surface border border-border rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4 text-info" />
          <h3 className="text-sm font-semibold">Allowed Tools</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {agent.allowedTools.map((tool) => (
            <span key={tool} className="px-2 py-1 bg-surface-hover border border-border rounded-md text-xs text-secondary capitalize">
              {tool.replace("_", " ")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
