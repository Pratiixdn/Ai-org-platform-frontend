"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, CheckCircle2, XCircle, Loader2, ArrowRight, Building2, Cpu, AlertTriangle } from "lucide-react";
import { cn, getStatusColor } from "@/lib/utils";
import { ProgressIndicator } from "./progress-indicator";
import type { OrgNode } from "@/lib/types";

interface ChatMessage {
  id: string;
  role: "user" | "ceo" | "system";
  content: string;
  type?: "text" | "breakdown" | "delegation" | "approval" | "error";
  breakdown?: BreakdownItem[];
  delegation?: DelegationItem[];
  timestamp: Date;
}

interface BreakdownItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  complexity: "low" | "medium" | "high" | "critical";
  requiredSkills: string[];
}

interface DelegationItem {
  breakdownId: string;
  department: string;
  departmentCapacity: number;
  departmentLoad: number;
  assigned: boolean;
  reason: string;
}

interface DepartmentCapacity {
  name: string;
  totalAgents: number;
  activeTasks: number;
  maxCapacity: number;
  skills: string[];
}

interface CEOChatProps {
  isOpen: boolean;
  onClose: () => void;
  orgData: OrgNode;
  onTaskCreated?: (task: { title: string; description: string; subtasks: any[] }) => void;
}

export function CEOChat({ isOpen, onClose, orgData, onTaskCreated }: CEOChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ceo",
      content: "Hello, I'm Apex, your CEO AI. Describe the project or task you want me to handle, and I'll break it down and delegate it to the right departments based on their current capacity and expertise.",
      type: "text",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"idle" | "analyzing" | "breaking_down" | "delegating" | "awaiting_approval">("idle");
  const [pendingBreakdown, setPendingBreakdown] = useState<BreakdownItem[] | null>(null);
  const [pendingDelegation, setPendingDelegation] = useState<DelegationItem[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Department capacity data (would come from backend)
  const departmentCapacities: DepartmentCapacity[] = [
    { name: "Engineering", totalAgents: 6, activeTasks: 4, maxCapacity: 10, skills: ["coding", "architecture", "devops", "testing"] },
    { name: "Product", totalAgents: 4, activeTasks: 2, maxCapacity: 6, skills: ["design", "research", "ux", "prototyping"] },
    { name: "Marketing", totalAgents: 3, activeTasks: 1, maxCapacity: 5, skills: ["content", "seo", "social", "analytics"] },
    { name: "QA", totalAgents: 3, activeTasks: 0, maxCapacity: 6, skills: ["testing", "automation", "review", "bug-tracking"] },
  ];

  const simulateCEOProcessing = async (userGoal: string) => {
    setIsProcessing(true);
    setCurrentPhase("analyzing");

    // Phase 1: Analyzing
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((prev) => [
      ...prev,
      {
        id: `analyze-${Date.now()}`,
        role: "ceo",
        content: `I've analyzed your request: "${userGoal}". This appears to be a full-stack project requiring frontend, backend, design, and quality assurance. Let me break this down into manageable components.`,
        type: "text",
        timestamp: new Date(),
      },
    ]);

    // Phase 2: Breaking down
    setCurrentPhase("breaking_down");
    await new Promise((r) => setTimeout(r, 2000));

    const breakdown: BreakdownItem[] = [
      {
        id: "bd-1",
        title: "Frontend Development",
        description: "Build responsive React components, product pages, cart, checkout flow, and user dashboard",
        estimatedHours: 80,
        complexity: "high",
        requiredSkills: ["coding", "architecture"],
      },
      {
        id: "bd-2",
        title: "Backend API Development",
        description: "Design and implement RESTful APIs for products, orders, users, payments, and inventory",
        estimatedHours: 60,
        complexity: "high",
        requiredSkills: ["coding", "architecture", "devops"],
      },
      {
        id: "bd-3",
        title: "Database Design",
        description: "Design schema for products, users, orders, and set up database with migrations",
        estimatedHours: 20,
        complexity: "medium",
        requiredSkills: ["coding", "architecture"],
      },
      {
        id: "bd-4",
        title: "UI/UX Design",
        description: "Create wireframes, high-fidelity mockups, design system, and component library",
        estimatedHours: 40,
        complexity: "medium",
        requiredSkills: ["design", "research", "ux", "prototyping"],
      },
      {
        id: "bd-5",
        title: "Payment Integration",
        description: "Integrate Stripe for payments, handle webhooks, and implement order processing",
        estimatedHours: 24,
        complexity: "high",
        requiredSkills: ["coding", "devops"],
      },
      {
        id: "bd-6",
        title: "Quality Assurance",
        description: "Write test suites, perform integration testing, and validate all user flows",
        estimatedHours: 32,
        complexity: "medium",
        requiredSkills: ["testing", "automation", "bug-tracking"],
      },
      {
        id: "bd-7",
        title: "Marketing Content",
        description: "Create product descriptions, SEO content, landing page copy, and email templates",
        estimatedHours: 16,
        complexity: "low",
        requiredSkills: ["content", "seo"],
      },
    ];

    setPendingBreakdown(breakdown);
    setMessages((prev) => [
      ...prev,
      {
        id: `breakdown-${Date.now()}`,
        role: "ceo",
        content: "I've broken your project into 7 components. Here's the breakdown:",
        type: "breakdown",
        breakdown,
        timestamp: new Date(),
      },
    ]);

    // Phase 3: Delegating
    setCurrentPhase("delegating");
    await new Promise((r) => setTimeout(r, 2000));

    const delegation: DelegationItem[] = breakdown.map((item) => {
      // Find best department based on skills and capacity
      const bestDept = departmentCapacities
        .filter((d) => item.requiredSkills.some((s) => d.skills.includes(s)))
        .sort((a, b) => {
          const aLoad = a.activeTasks / a.maxCapacity;
          const bLoad = b.activeTasks / b.maxCapacity;
          return aLoad - bLoad;
        })[0];

      const dept = bestDept || departmentCapacities[0];
      const loadPercent = Math.round((dept.activeTasks / dept.maxCapacity) * 100);

      return {
        breakdownId: item.id,
        department: dept.name,
        departmentCapacity: dept.maxCapacity,
        departmentLoad: loadPercent,
        assigned: true,
        reason: `Best match: ${item.requiredSkills.filter((s) => dept.skills.includes(s)).join(", ")}. Current load: ${loadPercent}%`,
      };
    });

    setPendingDelegation(delegation);
    setMessages((prev) => [
      ...prev,
      {
        id: `delegation-${Date.now()}`,
        role: "ceo",
        content: "Based on each department's current capacity and expertise, here's my delegation plan:",
        type: "delegation",
        delegation,
        timestamp: new Date(),
      },
    ]);

    // Phase 4: Awaiting approval
    setCurrentPhase("awaiting_approval");
    setMessages((prev) => [
      ...prev,
      {
        id: `approval-${Date.now()}`,
        role: "ceo",
        content: "Please review the breakdown and delegation above. You can approve to create the tasks, or tell me to modify anything.",
        type: "approval",
        timestamp: new Date(),
      },
    ]);

    setIsProcessing(false);
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      type: "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Check if user is approving
    if (input.toLowerCase().includes("approve") || input.toLowerCase().includes("yes") || input.toLowerCase().includes("go ahead")) {
      handleApproval();
      return;
    }

    simulateCEOProcessing(input.trim());
  };

  const handleApproval = () => {
    if (!pendingBreakdown || !pendingDelegation) return;

    setIsProcessing(true);
    setCurrentPhase("idle");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `approved-${Date.now()}`,
          role: "system",
          content: "Tasks created and delegated successfully!",
          type: "text",
          timestamp: new Date(),
        },
      ]);

      if (onTaskCreated) {
        onTaskCreated({
          title: "E-Commerce Platform Build",
          description: "Full-stack e-commerce website for selling shoes",
          subtasks: pendingBreakdown.map((b, i) => ({
            ...b,
            department: pendingDelegation[i]?.department,
          })),
        });
      }

      setPendingBreakdown(null);
      setPendingDelegation(null);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[85vh] bg-surface-elevated border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-primary">CEO AI - Apex</h2>
              <div className="flex items-center gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full", currentPhase === "idle" ? "bg-success" : "bg-accent animate-pulse")} />
                <span className="text-xs text-secondary capitalize">
                  {currentPhase === "idle" ? "Ready" : currentPhase.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg text-secondary transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role !== "user" && (
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                  {msg.role === "ceo" ? <Bot className="w-4 h-4 text-accent" /> : <Sparkles className="w-4 h-4 text-success" />}
                </div>
              )}

              <div className={cn("max-w-[80%] space-y-2", msg.role === "user" && "items-end")}>
                {msg.type === "text" && (
                  <div
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-accent text-white"
                        : msg.role === "system"
                        ? "bg-success/10 border border-success/20 text-success"
                        : "bg-surface border border-border text-primary"
                    )}
                  >
                    {msg.content}
                  </div>
                )}

                {msg.type === "breakdown" && msg.breakdown && (
                  <div className="space-y-2">
                    <p className="text-sm text-secondary mb-2">{msg.content}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.breakdown.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-surface border border-border rounded-lg hover:border-border-strong transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-primary">{item.title}</h4>
                              <p className="text-xs text-secondary mt-1">{item.description}</p>
                            </div>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                              item.complexity === "critical" ? "bg-error/10 text-error" :
                              item.complexity === "high" ? "bg-warning/10 text-warning" :
                              item.complexity === "medium" ? "bg-info/10 text-info" :
                              "bg-success/10 text-success"
                            )}>
                              {item.complexity}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                            <span>~{item.estimatedHours}h</span>
                            <span>{item.requiredSkills.join(", ")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.type === "delegation" && msg.delegation && (
                  <div className="space-y-2">
                    <p className="text-sm text-secondary mb-2">{msg.content}</p>
                    <div className="space-y-2">
                      {msg.delegation.map((del, i) => {
                        const dept = departmentCapacities.find((d) => d.name === del.department);
                        const loadColor = del.departmentLoad > 80 ? "text-error" : del.departmentLoad > 50 ? "text-warning" : "text-success";
                        return (
                          <div
                            key={i}
                            className="p-3 bg-surface border border-border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-info" />
                                <span className="text-sm font-medium text-primary">{del.department}</span>
                              </div>
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <ProgressIndicator
                                progress={del.departmentLoad}
                                size="sm"
                                showLabel={false}
                                variant={del.departmentLoad > 80 ? "error" : del.departmentLoad > 50 ? "warning" : "success"}
                              />
                              <span className={cn("text-xs font-medium shrink-0", loadColor)}>
                                {del.departmentLoad}% load
                              </span>
                            </div>
                            <p className="text-xs text-muted">{del.reason}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {msg.type === "approval" && (
                  <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-primary font-medium mb-1">Approval Required</p>
                        <p className="text-sm text-secondary mb-3">{msg.content}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleApproval}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve & Create Tasks
                          </button>
                          <button
                            onClick={() => {
                              setMessages((prev) => [
                                ...prev,
                                {
                                  id: `modify-${Date.now()}`,
                                  role: "user",
                                  content: "I want to modify the delegation.",
                                  type: "text",
                                  timestamp: new Date(),
                                },
                              ]);
                            }}
                            className="px-4 py-2 bg-surface-hover hover:bg-surface-elevated text-secondary text-sm font-medium rounded-lg border border-border transition-colors"
                          >
                            Request Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <span className="text-xs text-muted block">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl">
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
                <span className="text-sm text-secondary">
                  {currentPhase === "analyzing" && "CEO AI is analyzing your request..."}
                  {currentPhase === "breaking_down" && "Breaking down into components..."}
                  {currentPhase === "delegating" && "Matching tasks to department capacities..."}
                  {currentPhase === "awaiting_approval" && "Finalizing delegation plan..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border bg-surface">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentPhase === "awaiting_approval" ? "Type 'approve' to confirm, or describe changes..." : "Describe your project or task to the CEO AI..."}
              rows={1}
              className="flex-1 px-4 py-3 bg-surface-hover border border-border rounded-xl text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none max-h-32"
              style={{ minHeight: "48px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="p-3 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
