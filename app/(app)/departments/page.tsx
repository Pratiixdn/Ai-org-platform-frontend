"use client";

import { useState } from "react";
import { Building2, Plus, Users, ListTodo, Edit2, Trash2 } from "lucide-react";
import { DepartmentEditor } from "@/components/department-editor";
import { ConfirmationModal } from "@/components/confirmation-modal";
import type { Department } from "@/lib/types";

const demoDepartments: Department[] = [
  { id: "eng", name: "Engineering", description: "Software development and infrastructure", permissions: ["code", "deploy"], createdAt: "", updatedAt: "" },
  { id: "prod", name: "Product", description: "Product design and user experience", permissions: ["design", "research"], createdAt: "", updatedAt: "" },
  { id: "mkt", name: "Marketing", description: "Growth and content strategy", permissions: ["content", "seo"], createdAt: "", updatedAt: "" },
  { id: "qa", name: "QA", description: "Quality assurance and testing", permissions: ["test", "review"], createdAt: "", updatedAt: "" },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(demoDepartments);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteModal, setDeleteModal] = useState<Department | null>(null);

  const handleSubmit = (data: Partial<Department>) => {
    if (editingDept) {
      setDepartments(departments.map((d) => (d.id === editingDept.id ? { ...d, ...data } : d)));
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: data.name || "",
        description: data.description,
        instructions: data.instructions,
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDepartments([...departments, newDept]);
    }
    setEditingDept(null);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setEditorOpen(true);
  };

  const handleDelete = () => {
    if (deleteModal) {
      setDepartments(departments.filter((d) => d.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Departments</h1>
          <p className="text-sm text-secondary mt-1">Organize your AI agents by function</p>
        </div>
        <button
          onClick={() => { setEditingDept(null); setEditorOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="p-5 bg-surface border border-border rounded-xl hover:border-border-strong transition-colors group relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-primary">{dept.name}</h3>
                <p className="text-xs text-secondary truncate">{dept.description || "No description"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted mb-3">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>4 agents</span>
              </div>
              <div className="flex items-center gap-1">
                <ListTodo className="w-4 h-4" />
                <span>3 tasks</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(dept)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-secondary bg-surface-hover border border-border rounded-lg hover:text-primary transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => setDeleteModal(dept)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-error bg-error/5 border border-error/20 rounded-lg hover:bg-error/10 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <DepartmentEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSubmit={handleSubmit}
        department={editingDept}
      />

      <ConfirmationModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteModal?.name}"? All agents in this department will be unassigned.`}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
