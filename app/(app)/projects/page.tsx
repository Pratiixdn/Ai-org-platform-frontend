"use client";

import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { useAppStore } from "@/lib/store";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const { projects, setProjects } = useAppStore();
  const [loading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<Project | null>(null);
  const [showDemo, setShowDemo] = useState(true);

  const demoProjects: Project[] = [
    {
      id: "demo-proj-1",
      name: "E-Commerce Platform",
      description: "Complete shoe retail website with inventory and payments",
      organizationId: "demo-org",
      status: "active",
      taskCount: 12,
      completedTaskCount: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "demo-proj-2",
      name: "SaaS Dashboard",
      description: "Analytics dashboard for internal metrics",
      organizationId: "demo-org",
      status: "active",
      taskCount: 8,
      completedTaskCount: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayProjects = projects.length > 0 ? projects : (showDemo ? demoProjects : []);

  const handleCreate = () => {
    alert("Create project - TODO: implement modal form");
  };

  const handleDelete = (project: Project) => {
    setDeleteModal(project);
  };

  const confirmDelete = () => {
    if (deleteModal) {
      setProjects(projects.filter((p) => p.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Projects</h1>
          <p className="text-sm text-secondary mt-1">Manage your AI-driven projects</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {displayProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start delegating tasks to your AI organization."
          action={{ label: "Create Project", onClick: handleCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.map((project) => (
            <div key={project.id} className="relative group">
              <ProjectCard project={project} />
              {projects.length > 0 && (
                <button
                  onClick={() => handleDelete(project)}
                  className="absolute top-3 right-3 p-1.5 bg-surface-hover border border-border rounded-md text-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showDemo && projects.length === 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowDemo(false)}
            className="text-sm text-muted hover:text-secondary transition-colors"
          >
            Hide demo data
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteModal?.name}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
