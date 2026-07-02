"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ email: "", password: "", confirm_password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchMode(newMode: "signin" | "signup") {
    setMode(newMode);
    setError("");
    setSuccess("");
    setForm({ email: "", password: "", confirm_password: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (form.password !== form.confirm_password) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      const { error: sbError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (sbError) {
        setError(sbError.message);
        setLoading(false);
        return;
      }
      setSuccess("Account created! You can now be assigned a role by the admin. Sign in below.");
      switchMode("signin");
      setLoading(false);
      return;
    }

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

  return (
    <main className="min-h-screen bg-[#000D26] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center" style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}>
            <span className="text-[#F0C040] font-bold text-2xl">✛</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Andrews Chapel</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">Admin Portal</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)", border: "1px solid rgba(212,175,55,0.2)", borderLeft: "4px solid #D4AF37" }}>
          {/* Mode toggle */}
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
              Create Account
            </button>
          </div>

          <h2 className="font-serif text-xl font-bold text-white mb-6">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h2>

          {error && <p className="text-red-400 text-sm mb-5 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-5 p-3 rounded-lg bg-green-400/10 border border-green-400/30">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Password</label>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className={inputCls} />
              </div>
            </div>
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required placeholder="••••••••" className={inputCls} />
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60 mt-2" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
              {loading ? (mode === "signin" ? "Signing in..." : "Creating account...") : (mode === "signin" ? "Sign In" : "Create Account")}
            </button>
          </form>
          <p className="text-center text-white/30 text-xs mt-6">
            {mode === "signup"
              ? "After creating your account, an admin will assign your role before you can access the dashboard."
              : "Access restricted to authorized church staff only."}
          </p>
        </div>
      </div>
    </main>
  );
}
