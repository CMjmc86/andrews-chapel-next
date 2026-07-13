"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { getUserRole, type Role } from "@/lib/roles";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

export default function SettingsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const checkAuth = useCallback(async () => {
    const role = await getUserRole();
    if (!role) { router.push("/auth"); return; }
    setUserRole(role);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setUserEmail(session.user.email || "");
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.new_password !== form.confirm_password) {
      setError("New passwords do not match.");
      return;
    }
    if (form.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.new_password === form.current_password) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);

    // Re-authenticate with current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: form.current_password,
    });

    if (signInError) {
      setError("Current password is incorrect.");
      setLoading(false);
      return;
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: form.new_password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess("Password updated successfully!");
    setForm({ current_password: "", new_password: "", confirm_password: "" });
    setLoading(false);
  }

  if (!userRole) return null;

  return (
    <main className="min-h-screen bg-[#000D26] text-white">
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(16,36,96,0.5)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-white">Settings</h1>
            <p className="text-white/40 text-xs">{userEmail}</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Change Password */}
        <div className="p-6 rounded-xl space-y-4" style={cardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-lg font-bold text-white">Change Password</h2>
          </div>

          {error && <p className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm p-3 rounded-lg bg-green-400/10 border border-green-400/30">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Current Password</label>
              <div className="relative" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.current_password}
                  onChange={(e) => setForm((p) => ({ ...p, current_password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className={inputCls + " pr-10"}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={form.new_password}
                  onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className={inputCls + " pr-10"}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/30 text-xs mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className={inputCls + " pr-10"}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-xl" style={cardStyle}>
          <h2 className="font-serif text-lg font-bold text-white mb-4">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white">{userEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50">Role</span>
              <span className="text-white capitalize">{userRole?.replace("_", " ")}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
