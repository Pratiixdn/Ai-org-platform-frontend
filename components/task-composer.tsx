"use client";

import { useState } from "react";
import { X, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface TaskComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  departments: string[];
}

export function TaskComposer({ isOpen, onClose, onSubmit, departments }: TaskComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [constraints, setConstraints] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (selectedDepts.length === 0) newErrors.departments = "Select at least one department";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.filter((r) => r.trim()),
      constraints: constraints.trim() || undefined,
      priority,
      allowedDepartments: selectedDepts,
      approvalRequired,
    });

    // Reset
    setTitle("");
    setDescription("");
    setRequirements([""]);
    setConstraints("");
    setPriority("medium");
    setSelectedDepts([]);
    setApprovalRequired(true);
    setErrors({});
    onClose();
  };

  const addRequirement = () => setRequirements([...requirements, ""]);
  const updateRequirement = (i: number, val: string) => {
    const next = [...requirements];
    next[i] = val;
    setRequirements(next);
  };
  const removeRequirement = (i: number) => {
    setRequirements(requirements.filter((_, idx) => idx !== i));
  };

  const toggleDept = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-elevated border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface-elevated z-10">
          <h2 className="text-lg font-semibold">Create New Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-md transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build a complete e-commerce website"
              className={cn(
                "w-full px-3 py-2 bg-surface border rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors",
                errors.title ? "border-error" : "border-border"
              )}
            />
            {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what needs to be built..."
              rows={4}
              className={cn(
                "w-full px-3 py-2 bg-surface border rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none",
                errors.description ? "border-error" : "border-border"
              )}
            />
            {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Requirements</label>
            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder={`Requirement ${i + 1}`}
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-accent/50"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(i)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center gap-1 mt-2 text-xs text-accent hover:text-accent-hover transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add requirement
            </button>
          </div>

          {/* Constraints */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Constraints</label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g., Must use React, budget limit, deadline..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <div className="flex gap-2">
              {(["low", "medium", "high", "critical"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                    priority === p
                      ? "bg-accent text-white"
                      : "bg-surface-hover text-secondary hover:text-primary border border-border"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Allowed Departments *</label>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border",
                    selectedDepts.includes(dept)
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-surface border-border text-secondary hover:text-primary"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
            {errors.departments && <p className="text-xs text-error mt-1">{errors.departments}</p>}
          </div>

          {/* Approval */}
          <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg border border-border">
            <input
              type="checkbox"
              id="approval"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-surface accent-accent"
            />
            <label htmlFor="approval" className="text-sm flex-1">
              Require approval before final delivery
            </label>
            {approvalRequired && <AlertTriangle className="w-4 h-4 text-warning shrink-0" />}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary bg-surface-hover hover:bg-surface-elevated rounded-lg border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
