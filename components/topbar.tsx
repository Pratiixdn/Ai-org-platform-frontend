"use client";

import { Bell, Search, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search tasks, agents, projects..."
                className="w-80 pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Search...</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tasks?new=true"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Link>

          <button className="relative p-2 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-surface-hover">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center text-xs font-medium">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
