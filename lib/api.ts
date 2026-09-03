import {
  type Agent,
  type Department,
  type Organization,
  type Task,
  type TaskStep,
  type Project,
  type ActivityEvent,
  type AIProvider,
  type DashboardStats,
  type Deliverable,
  type LeadershipStyle,
  type ApprovalPolicy,
  type ApiResponse,
  type PaginatedResponse,
  type User,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";

// TODO: Replace with actual backend endpoints when available
// These interfaces define the expected API contract

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: error.code || `HTTP_${response.status}`,
            message: error.message || `Request failed with status ${response.status}`,
          },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Network request failed",
        },
      };
    }
  }

  // Auth
  async register(data: { email: string; password: string; name?: string }): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/register", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse<{ loggedOut: boolean }>> {
    return this.request<{ loggedOut: boolean }>("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/me", { credentials: "include" });
  }

  // Redirects the full page to the backend's Google OAuth entry point.
  // The backend handles the code exchange and redirects back with a session cookie set.
  getGoogleAuthUrl(mode: "login" | "signup" = "login"): string {
    return `${API_BASE}/auth/google?mode=${mode}`;
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    // TODO: Implement when backend endpoint /dashboard/stats is available
    return this.request<DashboardStats>("/dashboard/stats");
  }

  // Organizations
  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.request<Organization[]>("/organizations");
  }

  async getOrganization(id: string): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/organizations/${id}`);
  }

  async createOrganization(data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return this.request<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Departments
  async getDepartments(orgId: string): Promise<ApiResponse<Department[]>> {
    return this.request<Department[]>(`/organizations/${orgId}/departments`);
  }

  async createDepartment(orgId: string, data: Partial<Department>): Promise<ApiResponse<Department>> {
    return this.request<Department>(`/organizations/${orgId}/departments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<ApiResponse<Department>> {
    return this.request<Department>(`/departments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/departments/${id}`, { method: "DELETE" });
  }

  // Agents
  async getAgents(orgId: string): Promise<ApiResponse<Agent[]>> {
    return this.request<Agent[]>(`/organizations/${orgId}/agents`);
  }

  async getAgent(id: string): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/agents/${id}`);
  }

  async createAgent(orgId: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/organizations/${orgId}/agents`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/agents/${id}`, { method: "DELETE" });
  }

  // Tasks
  async getTasks(params?: { projectId?: string; status?: string; page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const query = new URLSearchParams();
    if (params?.projectId) query.set("projectId", params.projectId);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    return this.request<PaginatedResponse<Task>>(`/tasks?${query.toString()}`);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(data: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async approveTask(id: string, approved: boolean, comments?: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ approved, comments }),
    });
  }

  // Projects
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>("/projects");
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(data: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Activity
  async getActivity(params?: { limit?: number; offset?: number }): Promise<ApiResponse<ActivityEvent[]>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    return this.request<ActivityEvent[]>(`/activity?${query.toString()}`);
  }

  // AI Providers
  async getProviders(): Promise<ApiResponse<AIProvider[]>> {
    return this.request<AIProvider[]>("/providers");
  }

  async createProvider(data: Partial<AIProvider>): Promise<ApiResponse<AIProvider>> {
    return this.request<AIProvider>("/providers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProvider(id: string, data: Partial<AIProvider>): Promise<ApiResponse<AIProvider>> {
    return this.request<AIProvider>(`/providers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/providers/${id}`, { method: "DELETE" });
  }

  // Settings
  async updateLeadershipStyle(orgId: string, style: LeadershipStyle): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/organizations/${orgId}/leadership-style`, {
      method: "PATCH",
      body: JSON.stringify({ style }),
    });
  }

  async updateApprovalPolicy(orgId: string, policy: ApprovalPolicy): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/organizations/${orgId}/approval-policy`, {
      method: "PATCH",
      body: JSON.stringify({ policy }),
    });
  }

  // WebSocket
  connectWebSocket(onMessage: (event: ActivityEvent | TaskStep) => void, onError?: (error: Event) => void): WebSocket {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        console.error("Failed to parse WebSocket message");
      }
    };
    ws.onerror = onError || ((err) => console.error("WebSocket error:", err));
    return ws;
  }
}

export const api = new ApiClient();
