"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Supabase's password-reset email link logs the user into a
    // temporary "recovery" session automatically when it's opened.
    // We just need to confirm a session exists before letting them
    // set a new password.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("This reset link is invalid or has expired. Please request a new one.");
      }
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const { error: sbError } = await supabase.auth.updateUser({ password });
    if (sbError) {
      setError(sbError.message);
      setLoading(false);
      return;
    }

    setSuccess("Password updated! Redirecting to sign in...");
    setLoading(false);
    setTimeout(() => {
      router.push("/auth");
    }, 1800);
  }

  return (
    <main className="min-h-dvh bg-[#000D26] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center" style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}>
            <span className="text-[#F0C040] font-bold text-2xl">✛</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Andrews Chapel</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">Reset Password</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)", border: "1px solid rgba(212,175,55,0.2)", borderLeft: "4px solid #D4AF37" }}>
          {!ready ? (
            <p className="text-white/40 text-sm text-center py-6">Verifying reset link...</p>
          ) : (
            <>
              <h2 className="font-serif text-xl font-bold text-white mb-6">Set a New Password</h2>

              {error && <p className="text-red-400 text-sm mb-5 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
              {success && <p className="text-green-400 text-sm mb-5 p-3 rounded-lg bg-green-400/10 border border-green-400/30">{success}</p>}

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">New Password</label>
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className={inputCls} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60 mt-2" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
