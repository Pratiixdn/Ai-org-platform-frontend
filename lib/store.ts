"use client";

import { create } from "zustand";
import {
  type Agent,
  type Department,
  type Organization,
  type Task,
  type Project,
  type ActivityEvent,
  type AIProvider,
  type DashboardStats,
  type LeadershipStyle,
  type ApprovalPolicy,
} from "./types";

interface AppState {
  // Data
  organizations: Organization[];
  currentOrganization: Organization | null;
  departments: Department[];
  agents: Agent[];
  tasks: Task[];
  projects: Project[];
  activities: ActivityEvent[];
  providers: AIProvider[];
  dashboardStats: DashboardStats | null;

  // UI State
  sidebarOpen: boolean;
  selectedAgentId: string | null;
  selectedDepartmentId: string | null;
  selectedTaskId: string | null;
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setOrganizations: (orgs: Organization[]) => void;
  setCurrentOrganization: (org: Organization | null) => void;
  setDepartments: (depts: Department[]) => void;
  setAgents: (agents: Agent[]) => void;
  setTasks: (tasks: Task[]) => void;
  setProjects: (projects: Project[]) => void;
  setActivities: (activities: ActivityEvent[]) => void;
  addActivity: (activity: ActivityEvent) => void;
  setProviders: (providers: AIProvider[]) => void;
  setDashboardStats: (stats: DashboardStats | null) => void;
  toggleSidebar: () => void;
  setSelectedAgent: (id: string | null) => void;
  setSelectedDepartment: (id: string | null) => void;
  setSelectedTask: (id: string | null) => void;
  setSelectedProject: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateTask: (task: Task) => void;
  updateAgent: (agent: Agent) => void;
}

export const useAppStore = create<AppState>((set) => ({
  organizations: [],
  currentOrganization: null,
  departments: [],
  agents: [],
  tasks: [],
  projects: [],
  activities: [],
  providers: [],
  dashboardStats: null,
  sidebarOpen: true,
  selectedAgentId: null,
  selectedDepartmentId: null,
  selectedTaskId: null,
  selectedProjectId: null,
  isLoading: false,
  error: null,

  setOrganizations: (orgs) => set({ organizations: orgs }),
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setDepartments: (depts) => set({ departments: depts }),
  setAgents: (agents) => set({ agents }),
  setTasks: (tasks) => set({ tasks }),
  setProjects: (projects) => set({ projects }),
  setActivities: (activities) => set({ activities }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 100),
  })),
  setProviders: (providers) => set({ providers }),
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedAgent: (id) => set({ selectedAgentId: id }),
  setSelectedDepartment: (id) => set({ selectedDepartmentId: id }),
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setSelectedProject: (id) => set({ selectedProjectId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  updateAgent: (agent) => set((state) => ({
    agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
  })),
}));
