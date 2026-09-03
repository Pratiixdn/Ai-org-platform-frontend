"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, Check, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleButton } from "@/components/auth/google-button";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
}

function validateEmail(value: string): string | undefined {
  if (!value) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
}

const PASSWORD_RULES = [
  { test: (v: string) => v.length >= 8, label: "At least 8 characters" },
  { test: (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v), label: "Upper & lowercase letters" },
  { test: (v: string) => /\d/.test(v), label: "At least one number" },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordChecks = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })), [password]);
  const passwordValid = passwordChecks.every((c) => c.passed);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: FormErrors = {
      name: name.trim() ? undefined : "Name is required.",
      email: validateEmail(email),
      password: passwordValid ? undefined : "Password doesn't meet the requirements.",
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    const res = await api.register({ email, password, name: name.trim() });
    setSubmitting(false);

    if (!res.success) {
      setErrors({ form: res.error?.message ?? "Something went wrong. Please try again." });
      return;
    }
    router.push("/dashboard");
  }

  function handleGoogle() {
    setGoogleLoading(true);
    window.location.href = api.getGoogleAuthUrl("signup");
  }

  return (
    <div className="w-full max-w-sm" style={{ animation: "auth-enter 300ms ease-out" }}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-primary">Create your account</h1>
        <p className="mt-1 text-sm text-secondary">Stand up an AI organization in minutes.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40">
        <GoogleButton
          label={googleLoading ? "Redirecting..." : "Sign up with Google"}
          onClick={handleGoogle}
          disabled={googleLoading || submitting}
        />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or sign up with email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthInput
            icon={User}
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoFocus
          />
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
          />
          <div>
            <AuthInput
              icon={Lock}
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              error={passwordFocused ? undefined : errors.password}
            />
            {passwordFocused && (
              <ul className="mt-2 space-y-1">
                {passwordChecks.map((rule) => (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs transition-colors",
                      rule.passed ? "text-success" : "text-muted"
                    )}
                  >
                    <Check className={cn("h-3 w-3", !rule.passed && "opacity-30")} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
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
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-xs text-muted">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-secondary hover:text-primary transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-secondary hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
