"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

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

export default function PortalAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // general, non-field errors only
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchMode(newMode: "signin" | "signup") {
    setMode(newMode);
    setError("");
    setFieldErrors({});
    setSuccess("");
    setForm({ full_name: "", email: "", password: "", confirm_password: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");

    if (mode === "signup") {
      const fe: Record<string, string> = {};
      if (!form.full_name.trim()) {
        fe.full_name = "Please enter your full name.";
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email.trim())) {
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
        options: {
          data: { full_name: form.full_name.trim() },
        },
      });
      if (sbError) {
        setError(sbError.message);
        setLoading(false);
        return;
      }

      // Member record is created automatically by a database trigger
      // (handle_new_member) when the auth user is created, so no
      // client-side insert is needed here.

      setMode("signin");
      setForm({ full_name: "", email: "", password: "", confirm_password: "" });
      setSuccess("Account created! Check your email to confirm your address, then an admin will review and approve your account. You'll be able to sign in once both steps are complete.");
      setLoading(false);
      return;
    }

    // Sign in
    const signinErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      signinErrors.email = "Please enter your email address.";
    } else if (!emailPattern.test(form.email.trim())) {
      signinErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      signinErrors.password = "Please enter your password.";
    }
    if (Object.keys(signinErrors).length > 0) {
      setFieldErrors(signinErrors);
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

    // Check member status before letting them into the portal
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: member } = await supabase
        .from("members")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!member) {
        setError("No member profile found. Please contact the church office.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      if (member.status === "pending") {
        setError("Your account is still pending admin approval. Please check back soon.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      if (member.status === "rejected") {
        setError("Your account request was not approved. Please contact the church office.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
    }

    router.push("/portal/account");
  }

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
          <p className="text-white/40 text-sm uppercase tracking-widest">Member Portal</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)", border: "1px solid rgba(212,175,55,0.2)", borderLeft: "4px solid #D4AF37" }}>
          <div className="flex rounded-lg overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
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
              Join / Sign Up
            </button>
          </div>

          <h2 className="font-serif text-xl font-bold text-white mb-6">
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h2>

          {success && <p className="text-green-400 text-sm mb-5 p-3 rounded-lg bg-green-400/10 border border-green-400/30">{success}</p>}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {mode === "signup" && (
              <Field label="Full Name" error={fieldErrors.full_name}>
                <input name="full_name" type="text" value={form.full_name} onChange={handleChange} placeholder="Jane Doe" className={inputCls} />
              </Field>
            )}
            <Field label="Email Address" error={fieldErrors.email}>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} />
            </Field>
            <Field label="Password" error={fieldErrors.password}>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputCls} />
            </Field>
            {mode === "signup" && (
              <Field label="Confirm Password" error={fieldErrors.confirm_password}>
                <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="••••••••" className={inputCls} />
              </Field>
            )}

            {error && <p className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}

            <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60 mt-2" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
              {loading ? (mode === "signin" ? "Signing in..." : "Creating account...") : (mode === "signin" ? "Sign In" : "Create Account")}
            </button>
          </form>
          <p className="text-center text-white/30 text-xs mt-6">
            {mode === "signup"
              ? "After signing up, an admin will review and approve your account."
              : "New here? Click \"Join / Sign Up\" above to create a member account."}
          </p>
        </div>
      </div>
    </main>
  );
}
