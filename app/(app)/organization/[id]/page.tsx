"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Network, Users, ListTodo, Bot } from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { OrganizationTree } from "@/components/organization-tree";
import { AgentStatusBadge } from "@/components/agent-status";
import { ProgressIndicator } from "@/components/progress-indicator";
import type { Organization, Agent, Department, OrgNode } from "@/lib/types";

function buildOrgTree(org: Organization, agents: Agent[], departments: Department[]): OrgNode {
  const ceo = agents.find((a) => a.id === org.ceoAgentId);

  function buildDepartmentNode(dept: Department): OrgNode {
    const manager = agents.find((a) => a.id === dept.managerId);
    const deptAgents = agents.filter((a) => a.departmentId === dept.id && a.id !== dept.managerId);

    function buildAgentNode(agent: Agent): OrgNode {
      const children = agents.filter((a) => a.parentId === agent.id);
      return {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        type: agent.parentId ? (children.length > 0 ? "leader" : "staff") : "manager",
        status: agent.status,
        currentTask: agent.currentTask,
        agentId: agent.id,
        children: children.map(buildAgentNode),
      };
    }

    return {
      id: dept.id,
      name: dept.name,
      role: "Department",
      type: "department",
      status: "working",
      departmentId: dept.id,
      children: manager ? [buildAgentNode(manager)] : deptAgents.map(buildAgentNode),
    };
  }

  return {
    id: org.ceoAgentId,
    name: ceo?.name || "CEO AI",
    role: "Chief Executive Officer",
    type: "ceo",
    status: ceo?.status || "idle",
    currentTask: ceo?.currentTask,
    agentId: org.ceoAgentId,
    children: departments.map(buildDepartmentNode),
  };
}

export default function OrganizationDetailPage() {
  const params = useParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // TODO: Load from API
        const mockOrg: Organization = {
          id: params.id as string,
          name: "Nexus AI Corp",
          description: "AI-driven software development organization",
          ceoAgentId: "ceo",
          leadershipStyle: "supportive",
          approvalPolicy: "before_delivery",
          departments: [],
          agents: [],
          providers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockDepts: Department[] = [
          { id: "eng", name: "Engineering", description: "Software development", permissions: ["code", "deploy"], createdAt: "", updatedAt: "" },
          { id: "prod", name: "Product", description: "Product design", permissions: ["design", "research"], createdAt: "", updatedAt: "" },
          { id: "mkt", name: "Marketing", description: "Growth", permissions: ["content", "seo"], createdAt: "", updatedAt: "" },
          { id: "qa", name: "QA", description: "Quality assurance", permissions: ["test", "review"], createdAt: "", updatedAt: "" },
        ];

        const mockAgents: Agent[] = [
          { id: "ceo", name: "Apex", role: "CEO AI", departmentId: "exec", status: "working", progress: 75, currentTask: "Overseeing platform build", responsibilities: ["Strategy"], leadershipAuthority: 100, enabled: true, maxAutonomy: 100, allowedTools: ["all"], createdAt: "", updatedAt: "" },
          { id: "eng-mgr", name: "Sarah", role: "Engineering Manager", departmentId: "eng", parentId: "ceo", status: "working", progress: 60, currentTask: "Sprint planning", responsibilities: ["Code review"], leadershipAuthority: 80, enabled: true, maxAutonomy: 75, allowedTools: ["github"], createdAt: "", updatedAt: "" },
          { id: "frontend-lead", name: "Marcus", role: "Frontend Leader", departmentId: "eng", parentId: "eng-mgr", status: "working", progress: 45, currentTask: "Component library", responsibilities: ["UI"], leadershipAuthority: 60, enabled: true, maxAutonomy: 60, allowedTools: ["github"], createdAt: "", updatedAt: "" },
          { id: "react-dev", name: "React Developer AI", role: "Developer", departmentId: "eng", parentId: "frontend-lead", status: "working", progress: 30, currentTask: "Product grid", responsibilities: ["Components"], leadershipAuthority: 20, enabled: true, maxAutonomy: 40, allowedTools: ["github"], createdAt: "", updatedAt: "" },
        ];

        setOrg(mockOrg);
        setAgents(mockAgents);
        setDepartments(mockDepts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load organization");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!org) return <ErrorState message="Organization not found" />;

  const treeData = buildOrgTree(org, agents, departments);
  const activeAgents = agents.filter((a) => a.status === "working").length;
  const avgProgress = agents.length > 0 
    ? Math.round(agents.reduce((sum, a) => sum + a.progress, 0) / agents.length) 
    : 0;

  return (
    <div className="space-y-6">
      <Link href="/organization" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Organizations
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
            <Network className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{org.name}</h1>
            <p className="text-sm text-secondary">{org.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-xs text-secondary">Agents</span>
          </div>
          <p className="text-2xl font-bold">{agents.length}</p>
          <p className="text-xs text-muted">{activeAgents} active</p>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-info" />
            <span className="text-xs text-secondary">Departments</span>
          </div>
          <p className="text-2xl font-bold">{departments.length}</p>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <ListTodo className="w-4 h-4 text-warning" />
            <span className="text-xs text-secondary">Tasks</span>
          </div>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-success" />
            <span className="text-xs text-secondary">Avg Progress</span>
          </div>
          <p className="text-2xl font-bold">{avgProgress}%</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Organization Structure</h2>
        <OrganizationTree
          data={treeData}
          onAddChild={(parentId, type) => alert(`Add ${type} to ${parentId} - TODO`)}
          onEdit={(node) => alert(`Edit ${node.name} - TODO`)}
          onDelete={(node) => alert(`Delete ${node.name} - TODO`)}
          onToggleEnable={(node) => alert(`Toggle ${node.name} - TODO`)}
        />
      </div>
    </div>
  );
}
