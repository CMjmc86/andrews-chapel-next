"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LogOut, User, Mail, Phone, Users, Home } from "lucide-react";

type MemberStatus = "pending" | "approved" | "rejected";

type Member = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: MemberStatus;
  directory_opt_in: boolean;
  created_at: string;
};

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.2)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "1rem",
};

export default function PortalAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", directory_opt_in: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMember = useCallback(async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/portal");
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (fetchError || !data) {
      router.push("/portal");
      return;
    }

    const memberData = data as Member;

    if (memberData.status !== "approved") {
      await supabase.auth.signOut();
      router.push("/portal");
      return;
    }

    setMember(memberData);
    setForm({
      full_name: memberData.full_name || "",
      phone: memberData.phone || "",
      directory_opt_in: memberData.directory_opt_in,
    });
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("members")
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        directory_opt_in: form.directory_opt_in,
      })
      .eq("id", member.id);

    if (updateError) {
      setError("Could not save your changes. Please try again.");
      setSaving(false);
      return;
    }

    setSuccess("Your information has been updated.");
    setMember({ ...member, ...form });
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/portal");
  }

  if (loading) {
    return (
      <main className="min-h-dvh bg-[#000D26] text-white flex items-center justify-center">
        <p className="text-white/40 text-sm">Loading your account...</p>
      </main>
    );
  }

  if (!member) return null;

  return (
    <main className="min-h-dvh bg-[#000D26] text-white">
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(16,36,96,0.5)" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#D4AF37] hover:opacity-80 transition-opacity" title="Back to Home">
            <Home className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-white">Member Portal</h1>
            <p className="text-white/40 text-xs">{member.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="p-8 rounded-2xl" style={cardStyle}>
          <h2 className="font-serif text-2xl font-bold text-white mb-1">
            Welcome, {member.full_name?.split(" ")[0] || "friend"}
          </h2>
          <p className="text-white/40 text-sm mb-5">
            Member since {new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <Link
            href="/portal/directory"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
          >
            <Users className="w-4 h-4" /> View Member Directory
          </Link>
        </div>

        <div className="p-8 rounded-2xl space-y-6" style={cardStyle}>
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4AF37]" /> Your Information
          </h3>

          {error && <p className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
          {success && <p className="text-green-400 text-sm p-3 rounded-lg bg-green-400/10 border border-green-400/30">{success}</p>}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                  className={inputCls}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">
                <Mail className="w-3 h-3 inline mr-1" /> Email
              </label>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem" }}>
                <input
                  type="email"
                  value={member.email}
                  disabled
                  className={`${inputCls} opacity-50 cursor-not-allowed`}
                />
              </div>
              <p className="text-white/25 text-xs mt-1">Contact the church office to change your email.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">
                <Phone className="w-3 h-3 inline mr-1" /> Phone
              </label>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className={inputCls}
                  placeholder="(910) 555-0100"
                />
              </div>
            </div>

            <div
              className="flex items-center justify-between gap-4 p-4 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}
            >
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Show me in the member directory</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Other approved members will be able to see your name and contact info.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, directory_opt_in: !p.directory_opt_in }))}
                className="shrink-0 w-11 h-6 rounded-full relative transition-colors"
                style={{ background: form.directory_opt_in ? "#D4AF37" : "rgba(255,255,255,0.15)" }}
                aria-pressed={form.directory_opt_in}
                aria-label="Toggle directory visibility"
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                  style={{ left: form.directory_opt_in ? "22px" : "2px" }}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
