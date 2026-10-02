import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-primary">Forgot password</h1>
        <p className="text-sm text-secondary mt-1">
          Password reset is coming soon.
        </p>
      </div>
      <Link
        href="/login"
        className="text-xs text-accent hover:text-accent-hover transition-colors"
      >
        Back to login
      </Link>
    </div>
  );
}