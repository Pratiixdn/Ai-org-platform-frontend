"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleButton } from "@/components/auth/google-button";

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

function validateEmail(value: string): string | undefined {
  if (!value) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: FormErrors = {
      email: validateEmail(email),
      password: password ? undefined : "Password is required.",
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    const res = await api.login({ email, password });
    setSubmitting(false);

    if (!res.success) {
      setErrors({ form: res.error?.message ?? "Something went wrong. Please try again." });
      return;
    }
    router.push("/dashboard");
  }

  function handleGoogle() {
    setGoogleLoading(true);
    window.location.href = api.getGoogleAuthUrl("login");
  }

  return (
    <div className="w-full max-w-sm" style={{ animation: "auth-enter 300ms ease-out" }}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-secondary">Sign in to Nexus AI to run your organization.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40">
        <GoogleButton
          label={googleLoading ? "Redirecting..." : "Continue with Google"}
          onClick={handleGoogle}
          disabled={googleLoading || submitting}
        />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or sign in with email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthInput
            icon={Mail}
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoFocus
          />
          <div>
            <AuthInput
              icon={Lock}
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <div className="mt-1.5 text-right">
              <Link href="/forgot-password" className="text-xs text-accent hover:text-accent-hover transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {errors.form && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || googleLoading}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background",
              "transition-all hover:opacity-90 active:scale-[0.99]",
              "disabled:opacity-50 disabled:pointer-events-none",
              "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:text-accent transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
