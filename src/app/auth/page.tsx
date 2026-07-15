"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50transition-all";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">{label}</label>
      <div style={{ background: "rgba(255,255,255,0.05)", border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // general, non-field errors only
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ email: "", password: "", confirm_password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchMode(newMode: "signin" | "signup" | "forgot") {
    setMode(newMode);
    setError("");
    setFieldErrors({});
    setSuccess("");
    setForm({ email: "", password: "", confirm_password: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === "forgot") {
      const fe: Record<string, string> = {};
      if (!form.email.trim()) {
        fe.email = "Please enter your email address.";
      } else if (!emailPattern.test(form.email.trim())) {
        fe.email = "Please enter a valid email address.";
      }
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
        return;
      }

      setLoading(true);
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (sbError) {
        setError(sbError.message);
        setLoading(false);
        return;
      }
      setSuccess("If an account exists for that email, a password reset link has been sent. Check your inbox.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const fe: Record<string, string> = {};
      if (!form.email.trim()) {
        fe.email = "Please enter your email address.";
      } else if (!emailPattern.test(form.email.trim())) {
        fe.email = "Please enter a valid email address.";
      }
      if (form.password.length < 8) {
        fe.password = "Password must be at least 8 characters.";
      }
      if (form.password !== form.confirm_password) {
        fe.confirm_password = "Passwords do not match.";
      }
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
        return;
      }

      setLoading(true);
      const { error: sbError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (sbError) {
        setError(sbError.message);
        setLoading(false);
        return;
      }
      setMode("signin");
      setForm({ email: "", password: "", confirm_password: "" });
      setSuccess("Account created! You can now be assigned a role by the admin. Sign in below.");
      setLoading(false);
      return;
    }

    // Sign in
    const fe: Record<string, string> = {};
    if (!form.email.trim()) {
      fe.email = "Please enter your email address.";
    } else if (!emailPattern.test(form.email.trim())) {
      fe.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      fe.password = "Please enter your password.";
    }
    if (Object.keys(fe).length > 0) {
      setFieldErrors(fe);
      return;
    }

    setLoading(true);
    const { error: sbError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (sbError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }
    router.push("/admin");
  }

  const title =
    mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password";

  return (
    <main className="min-h-dvh bg-[#000D26] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-[#D4AF37] text-sm mb-6 transition-colors">
          ← Back to Home
        </Link>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center" style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}>
            <span className="text-[#F0C040] font-bold text-2xl">✛</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Andrews Chapel</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">Admin Portal</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)", border: "1px solid rgba(212,175,55,0.2)", borderLeft: "4px solid #D4AF37" }}>
          {mode !== "forgot" && (
            <div className="flex rounded-lg overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)"}}>
              <button
                onClick={() => switchMode("signin")}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === "signin" ? "linear-gradient(135deg, #D4AF37, #B8860B)" : "transparent",
                  color: mode === "signin" ? "#000D26" : "rgba(255,255,255,0.5)",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode("signup")}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === "signup" ? "linear-gradient(135deg, #D4AF37, #B8860B)" : "transparent",
                  color: mode === "signup" ? "#000D26" : "rgba(255,255,255,0.5)",
                }}
              >
                Create Account
              </button>
            </div>
          )}

          <h2 className="font-serif text-xl font-bold text-white mb-6">
            {title}
          </h2>

          {success && <p className="text-green-400 text-sm mb-5 p-3 rounded-lg bg-green-400/10 border border-green-400/30">{success}</p>}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Field label="Email Address" error={fieldErrors.email}>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} />
            </Field>

            {mode !== "forgot" && (
              <Field label="Password" error={fieldErrors.password}>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputCls} />
              </Field>
            )}

            {mode === "signup" && (
              <Field label="Confirm Password" error={fieldErrors.confirm_password}>
                <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="••••••••" className={inputCls} />
              </Field>
            )}

            {mode === "signin" && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}

            <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60 mt-2" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
              {loading
                ? (mode === "signin" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending link...")
                : (mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link")}
            </button>
          </form>

          {mode === "forgot" ? (
            <p className="text-center text-white/30 text-xs mt-6">
              <button onClick={() => switchMode("signin")} className="hover:text-[#D4AF37] transition-colors">
                ← Back to Sign In
              </button>
            </p>
          ) : (
            <p className="text-center text-white/30 text-xs mt-6">
              {mode === "signup"
                ? "After creating your account, an admin will assign your role before you can access the dashboard."
                : "Access restricted to authorized church staff only."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
