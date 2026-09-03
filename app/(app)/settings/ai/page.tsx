"use client";

import { useState } from "react";
import { Cpu, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { AIProviderForm } from "@/components/ai-provider-form";
import { maskApiKey } from "@/lib/utils";
import { ConfirmationModal } from "@/components/confirmation-modal";
import type { AIProvider } from "@/lib/types";

const demoProviders: AIProvider[] = [
  { id: "1", name: "OpenAI", model: "gpt-4o", apiKey: "sk-abc123xyz789", apiType: "openai", createdAt: "", updatedAt: "" },
  { id: "2", name: "Anthropic", model: "claude-3-5-sonnet", apiType: "anthropic", createdAt: "", updatedAt: "" },
];

export default function AISettingsPage() {
  const [providers, setProviders] = useState(demoProviders);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);

  const toggleKey = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (data: Partial<AIProvider>) => {
    if (editingProvider) {
      setProviders(providers.map((p) => (p.id === editingProvider.id ? { ...p, ...data } : p)));
    } else {
      const newProvider: AIProvider = {
        id: `provider-${Date.now()}`,
        name: data.name || "",
        model: data.model || "",
        apiKey: data.apiKey,
        baseUrl: data.baseUrl,
        apiType: data.apiType || "openai",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProviders([...providers, newProvider]);
    }
    setEditingProvider(null);
  };

  const handleEdit = (provider: AIProvider) => {
    setEditingProvider(provider);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">AI Providers</h1>
          <p className="text-sm text-secondary mt-1">Manage API keys and model assignments</p>
        </div>
        <button
          onClick={() => { setEditingProvider(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Provider
        </button>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id} className="p-5 bg-surface border border-border rounded-xl group hover:border-border-strong transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-primary">{provider.name}</h3>
                  <p className="text-xs text-secondary">{provider.model}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(provider)}
                  className="px-3 py-1.5 text-xs font-medium text-secondary bg-surface-hover border border-border rounded-lg hover:text-primary transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(provider.id)}
                  className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {provider.apiKey && (
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3 py-2 bg-background border border-border rounded-lg font-mono text-sm text-secondary">
                  {showKey[provider.id] ? provider.apiKey : maskApiKey(provider.apiKey)}
                </div>
                <button
                  onClick={() => toggleKey(provider.id)}
                  className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                >
                  {showKey[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AIProviderForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        provider={editingProvider}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          setProviders(providers.filter((p) => p.id !== deleteId));
          setDeleteId(null);
        }}
        title="Delete Provider"
        description="Are you sure you want to remove this AI provider?"
        variant="danger"
      />
    </div>
  );
}
