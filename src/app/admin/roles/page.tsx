"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Shield, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getUserRole, canManageRoles, type Role } from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AdminUser = {
  id: string;
  user_id: string;
  role: Role;
  created_at: string;
  email?: string;
};

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  tech_admin: "Tech Admin",
  pastor: "Pastor",
  leader: "Leader",
};

const ROLE_COLORS: Record<Role, { bg: string; color: string; border: string }> = {
  super_admin: { bg: "rgba(168,85,247,0.15)", color: "#a855f7", border: "rgba(168,85,247,0.3)" },
  tech_admin: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  pastor: { bg: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "rgba(212,175,55,0.3)" },
  leader: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

function RoleBadge({ role }: { role: Role }) {
  const colors = ROLE_COLORS[role];
  return (
    <span
      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
      style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function RolesPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("leader");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_roles")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) {
      // Fetch emails from auth.users via a server call would be ideal,
      // but for now we show user_id truncated
      setAdmins(data as AdminUser[]);
    }
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const role = await getUserRole();
    if (!role) { router.push("/auth"); return; }
    if (!canManageRoles(role)) { router.push("/admin"); return; }
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchAdmins();
  }, [checkAuth, fetchAdmins]);

  async function handleAddUser() {
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");

    // Look up user by email using admin_roles join — 
    // We need the user's UUID from their email. 
    // Since we can't query auth.users directly from client, 
    // we'll use a Supabase RPC or prompt for user_id.
    // For now, call our API route to handle this server-side.
    const res = await fetch("/api/admin/add-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, role: newRole }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      setAddError(result.error || "Failed to add user. Make sure they have an existing account.");
    } else {
      setAddSuccess(`${newEmail} has been added as ${ROLE_LABELS[newRole]}.`);
      setNewEmail("");
      setNewRole("leader");
      setShowAddForm(false);
      fetchAdmins();
    }
    setAddLoading(false);
  }

  async function handleDeleteRole(id: string) {
    await supabase.from("admin_roles").delete().eq("id", id);
    setConfirmDelete(null);
    fetchAdmins();
  }

  async function handleChangeRole(id: string, newRoleValue: Role) {
    await supabase.from("admin_roles").update({ role: newRoleValue }).eq("id", id);
    fetchAdmins();
  }

  if (!userRole) return null;

  return (
    <main className="min-h-screen bg-[#000D26] text-white">
      {/* Header */}
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
              <Shield className="w-5 h-5 text-[#D4AF37]" /> Role Management
            </h1>
            <p className="text-white/40 text-xs">Manage admin access and permissions</p>
          </div>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setAddError(""); setAddSuccess(""); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#000D26" }}
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Add User Form */}
        {showAddForm && (
          <div className="p-6 rounded-xl" style={cardStyle}>
            <h2 className="font-serif text-lg font-bold text-white mb-4">Add Admin User</h2>
            {addError && <p className="text-red-400 text-sm mb-3 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{addError}</p>}
            {addSuccess && <p className="text-green-400 text-sm mb-3 p-3 rounded-lg bg-green-400/10 border border-green-400/30">{addSuccess}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@email.com"
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>
                <p className="text-white/30 text-xs mt-1">User must already have an account at /auth</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Role</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  >
                    <option value="pastor" style={{ background: "#0a1840" }}>Pastor</option>
                    <option value="tech_admin" style={{ background: "#0a1840" }}>Tech Admin</option>
                    <option value="leader" style={{ background: "#0a1840" }}>Leader</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddUser}
                  disabled={addLoading || !newEmail}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)", color: "#000D26" }}
                >
                  {addLoading ? "Adding..." : "Add User"}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(ROLE_LABELS) as Role[]).map((role) => {
            const colors = ROLE_COLORS[role];
            const descriptions: Record<Role, string> = {
              super_admin: "Full access + role management",
              tech_admin: "Full access except role management",
              pastor: "Submissions, approvals, bulletins, tasks",
              leader: "Assigned tasks only",
            };
            return (
              <div key={role} className="p-3 rounded-lg" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: colors.color }}>{ROLE_LABELS[role]}</p>
                <p className="text-[10px] text-white/40 leading-relaxed">{descriptions[role]}</p>
              </div>
            );
          })}
        </div>

        {/* Admin Users List */}
        <div>
          <h2 className="font-serif text-lg font-bold text-white mb-4">Admin Users ({admins.length})</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 animate-pulse rounded-xl" style={cardStyle}>
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-12 text-white/30">No admin users found.</div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.id} className="p-5 rounded-xl flex items-center justify-between gap-4 flex-wrap" style={cardStyle}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <RoleBadge role={admin.role} />
                      <p className="text-white/25 text-xs">Added {formatDate(admin.created_at)}</p>
                    </div>
                    <p className="text-white/50 text-xs font-mono">User ID: {admin.user_id.slice(0, 16)}...</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Change role — can't change your own role or other super_admins */}
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                      <select
                        value={admin.role}
                        onChange={(e) => handleChangeRole(admin.id, e.target.value as Role)}
                        className="px-3 py-1.5 text-xs text-white bg-transparent outline-none rounded-lg"
                      >
                        <option value="super_admin" style={{ background: "#0a1840" }}>Super Admin</option>
                        <option value="tech_admin" style={{ background: "#0a1840" }}>Tech Admin</option>
                        <option value="pastor" style={{ background: "#0a1840" }}>Pastor</option>
                        <option value="leader" style={{ background: "#0a1840" }}>Leader</option>
                      </select>
                    </div>

                    {/* Delete */}
                    {confirmDelete === admin.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteRole(admin.id)}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(admin.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
