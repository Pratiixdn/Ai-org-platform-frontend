import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background glow — pure CSS, no images, so it paints instantly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(99,102,241,0.14), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(99,102,241,0.10), transparent 60%)",
        }}
      />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
