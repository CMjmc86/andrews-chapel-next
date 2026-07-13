"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Users, CheckCircle, XCircle, ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { getUserRole, type Role } from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MemberStatus = "pending" | "approved" | "rejected";

type MemberRow = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: MemberStatus;
  directory_opt_in: boolean;
  created_at: string;
};

type Tab = "pending" | "approved" | "rejected";

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// Only pastor / super_admin can approve or reject members.
// This mirrors the same restriction enforced in the database
// via RLS (see members_admin_policies.sql) — this check is
// the UI-level gate, RLS is the real security boundary.
function canApproveMembers(role: Role | null): boolean {
  return role === "pastor" || role === "super_admin";
}

export default function AdminMembersPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [confirmReject, setConfirmReject] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMembers(data as MemberRow[]);
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth"); return; }
    const role = await getUserRole();
    if (!canApproveMembers(role)) {
      router.push("/admin");
      return;
    }
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchMembers();
  }, [checkAuth, fetchMembers]);

  async function handleApprove(id: string) {
    setActionLoading(id);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("members")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
      })
      .eq("id", id);
    await fetchMembers();
    setActionLoading(null);
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    await supabase
      .from("members")
      .update({ status: "rejected" })
      .eq("id", id);
    await fetchMembers();
    setConfirmReject(null);
    setActionLoading(null);
  }

  if (!userRole) return null;

  const filtered = members.filter((m) => m.status === activeTab);
  const pendingCount = members.filter((m) => m.status === "pending").length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <main className="min-h-dvh bg-[#000D26] text-white">
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(16,36,96,0.5)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" /> Member Approvals
            </h1>
            <p className="text-white/40 text-xs">Review member portal sign-up requests</p>
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs bg-[#D4AF37] text-[#000D26] font-bold px-2.5 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(({ id, label }) => {
            const count = members.filter((m) => m.status === id).length;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === id ? "linear-gradient(135deg, #D4AF37, #B8860B)" : "rgba(255,255,255,0.05)",
                  color: activeTab === id ? "#000D26" : "rgba(255,255,255,0.7)",
                  border: activeTab === id ? "none" : "1px solid rgba(212,175,55,0.2)",
                }}
              >
                {label}
                <span className="text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            No {activeTab} member requests.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((member) => (
              <div key={member.id} className="p-5 rounded-xl flex items-start justify-between gap-4 flex-wrap" style={cardStyle}>
                <div className="space-y-1.5">
                  <p className="font-serif font-bold text-white text-lg">
                    {member.full_name || "Unnamed"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {member.email}
                    </span>
                    {member.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {member.phone}
                      </span>
                    )}
                  </div>
                  <p className="text-white/25 text-xs">
                    Requested {formatDate(member.created_at)}
                    {member.directory_opt_in && " · Opted into public directory"}
                  </p>
                </div>

                {activeTab === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(member.id)}
                      disabled={actionLoading === member.id}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    {confirmReject === member.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(member.id)}
                          disabled={actionLoading === member.id}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmReject(null)}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmReject(member.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
