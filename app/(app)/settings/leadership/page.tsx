"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeadershipStyle } from "@/lib/types";

const styles: { id: LeadershipStyle; label: string; description: string }[] = [
  { id: "autocratic", label: "Autocratic", description: "Higher-level agents make decisions and lower-level agents follow instructions without question." },
  { id: "democratic", label: "Democratic", description: "Agents can provide recommendations before decisions are finalized by managers." },
  { id: "supportive", label: "Supportive", description: "Managers provide guidance and allow agents more autonomy in their work." },
  { id: "participative", label: "Participative", description: "All agents participate in decision-making processes collaboratively." },
  { id: "transformational", label: "Transformational", description: "Leaders inspire agents to innovate and exceed expectations." },
  { id: "delegative", label: "Delegative / Laissez-faire", description: "Minimal oversight. Agents have maximum autonomy to complete tasks." },
  { id: "custom", label: "Custom", description: "Define your own leadership parameters and rules." },
];

export default function LeadershipSettingsPage() {
  const [selected, setSelected] = useState<LeadershipStyle>("supportive");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Leadership Style</h1>
        <p className="text-sm text-secondary mt-1">Choose how your CEO AI manages the organization</p>
      </div>

      <div className="space-y-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelected(style.id)}
            className={cn(
              "w-full flex items-start gap-4 p-5 bg-surface border rounded-xl text-left transition-colors",
              selected === style.id
                ? "border-accent bg-accent/5"
                : "border-border hover:border-border-strong"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
              selected === style.id ? "border-accent bg-accent" : "border-muted"
            )}>
              {selected === style.id && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary">{style.label}</h3>
              <p className="text-xs text-secondary mt-1">{style.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
