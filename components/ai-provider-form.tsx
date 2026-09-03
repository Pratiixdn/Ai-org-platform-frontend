"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { cn, maskApiKey } from "@/lib/utils";
import type { AIProvider } from "@/lib/types";

interface AIProviderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (provider: Partial<AIProvider>) => void;
  provider?: AIProvider | null;
}

const apiTypes = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "gemini", label: "Google Gemini" },
  { value: "kimi", label: "Kimi" },
  { value: "openrouter", label: "OpenRouter" },
  { value: "custom", label: "Custom / OpenAI-compatible" },
];

export function AIProviderForm({ isOpen, onClose, onSubmit, provider }: AIProviderFormProps) {
  const [name, setName] = useState(provider?.name || "");
  const [model, setModel] = useState(provider?.model || "");
  const [apiKey, setApiKey] = useState(provider?.apiKey || "");
  const [baseUrl, setBaseUrl] = useState(provider?.baseUrl || "");
  const [apiType, setApiType] = useState<AIProvider["apiType"]>(provider?.apiType || "openai");
  const [showKey, setShowKey] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Provider name is required";
    if (!model.trim()) newErrors.model = "Model name is required";
    if (!apiKey.trim() && !provider) newErrors.apiKey = "API key is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      model: model.trim(),
      apiKey: apiKey.trim() || undefined,
      baseUrl: baseUrl.trim() || undefined,
      apiType,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface-elevated border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">{provider ? "Edit Provider" : "Add AI Provider"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-md">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Provider Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., OpenAI"
                className={cn("w-full px-3 py-2 bg-surface border rounded-lg text-sm", errors.name ? "border-error" : "border-border")}
              />
              {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Model *</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., gpt-4o"
                className={cn("w-full px-3 py-2 bg-surface border rounded-lg text-sm", errors.model ? "border-error" : "border-border")}
              />
              {errors.model && <p className="text-xs text-error mt-1">{errors.model}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">API Type</label>
            <select
              value={apiType}
              onChange={(e) => setApiType(e.target.value as AIProvider["apiType"])}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
            >
              {apiTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">API Key {!provider && "*"}</label>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider ? "Leave empty to keep existing" : "sk-..."}
                className={cn("flex-1 px-3 py-2 bg-surface border rounded-lg text-sm font-mono", errors.apiKey ? "border-error" : "border-border")}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.apiKey && <p className="text-xs text-error mt-1">{errors.apiKey}</p>}
            <p className="text-xs text-muted mt-1">API keys are encrypted and never exposed in the UI after saving.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Base URL (optional)</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-secondary bg-surface-hover rounded-lg border border-border">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg">
              {provider ? "Save" : "Add Provider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
