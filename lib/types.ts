export type TaskStatus = 
  | "pending" 
  | "analyzing" 
  | "decomposing" 
  | "delegating" 
  | "executing" 
  | "reviewing" 
  | "revising" 
  | "completed" 
  | "failed" 
  | "cancelled" 
  | "blocked" 
  | "waiting_approval";

export type AgentStatus = 
  | "idle" 
  | "working" 
  | "reviewing" 
  | "blocked" 
  | "disabled" 
  | "error";

export type LeadershipStyle = 
  | "autocratic" 
  | "democratic" 
  | "supportive" 
  | "participative" 
  | "transformational" 
  | "delegative" 
  | "custom";

export type ApprovalPolicy = 
  | "every_major" 
  | "before_external" 
  | "before_delivery" 
  | "when_blocked" 
  | "never";

export interface AIProvider {
  id: string;
  name: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  apiType: "openai" | "anthropic" | "gemini" | "kimi" | "openrouter" | "custom";
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  parentId?: string;
  providerId?: string;
  model?: string;
  status: AgentStatus;
  currentTask?: string;
  progress: number;
  systemInstructions?: string;
  responsibilities: string[];
  leadershipAuthority: number; // 0-100
  enabled: boolean;
  maxAutonomy: number; // 0-100
  allowedTools: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  managerId?: string;
  instructions?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  ceoAgentId: string;
  leadershipStyle: LeadershipStyle;
  approvalPolicy: ApprovalPolicy;
  departments: Department[];
  agents: Agent[];
  providers: AIProvider[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskStep {
  id: string;
  taskId: string;
  agentId: string;
  agentName: string;
  action: string;
  status: TaskStatus;
  output?: string;
  error?: string;
  reviewComments?: string;
  revisionCount: number;
  qualityScore?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  constraints?: string;
  deadline?: string;
  priority: "low" | "medium" | "high" | "critical";
  allowedDepartments: string[];
  approvalRequired: boolean;
  status: TaskStatus;
  organizationId: string;
  projectId?: string;
  steps: TaskStep[];
  currentStepId?: string;
  deliverable?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  status: "active" | "paused" | "completed" | "archived";
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  type: 
    | "task_created" 
    | "task_assigned" 
    | "task_started" 
    | "task_completed" 
    | "task_failed" 
    | "task_revised" 
    | "agent_assigned" 
    | "agent_completed" 
    | "issue_detected" 
    | "fix_applied" 
    | "approval_required" 
    | "approval_given" 
    | "approval_denied";
  message: string;
  agentId?: string;
  agentName?: string;
  taskId?: string;
  taskTitle?: string;
  projectId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  taskId: string;
  projectId?: string;
  name: string;
  type: "code" | "document" | "design" | "data" | "other";
  content?: string;
  url?: string;
  status: "draft" | "reviewing" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  activeProjects: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingApprovals: number;
  totalAgents: number;
  activeAgents: number;
  departmentsCount: number;
  tokenUsage?: {
    current: number;
    limit: number;
    unit: string;
  };
  systemHealth: "healthy" | "degraded" | "critical";
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}


// UI-specific types
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  type: "ceo" | "department" | "manager" | "leader" | "staff";
  status: string;
  currentTask?: string;
  children: OrgNode[];
  agentId?: string;
  departmentId?: string;
}


// UI-specific types
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  type: "ceo" | "department" | "manager" | "leader" | "staff";
  status: string;
  currentTask?: string;
  children: OrgNode[];
  agentId?: string;
  departmentId?: string;
}


// UI-specific types
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  type: "ceo" | "department" | "manager" | "leader" | "staff";
  status: string;
  currentTask?: string;
  children: OrgNode[];
  agentId?: string;
  departmentId?: string;
}
