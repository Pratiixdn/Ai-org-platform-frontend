"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Department } from "@/lib/types";

interface DepartmentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dept: Partial<Department>) => void;
  department?: Department | null;
}

export function DepartmentEditor({ isOpen, onClose, onSubmit, department }: DepartmentEditorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description || "");
      setInstructions(department.instructions || "");
    } else {
      setName("");
      setDescription("");
      setInstructions("");
    }
    setErrors({});
  }, [department, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      instructions: instructions.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface-elevated border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">{department ? "Edit Department" : "Add Department"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-md">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Engineering"
              className={cn("w-full px-3 py-2 bg-surface border rounded-lg text-sm", errors.name ? "border-error" : "border-border")}
            />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this department handles..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Department Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Special instructions for all agents in this department..."
              rows={4}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-secondary bg-surface-hover rounded-lg border border-border">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg">
              {department ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
