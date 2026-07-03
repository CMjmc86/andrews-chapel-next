"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart, Sparkles, Users, UserPlus, MessageSquare,
  CheckCircle, XCircle, LogOut, Mail, Trash2, Shield,
  ClipboardList, X
} from "lucide-react";
import { getUserRole, canAssignTasks, canManageRoles, type Role } from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = "prayer" | "praise" | "visitors" | "join" | "messages" | "groups";
type RowData = Record<string, string | number | boolean | null | undefined>;

type Leader = {
  id: string;
  user_id: string;
  email: string;
  role: Role;
};

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "prayer", label: "Prayer Requests", icon: Heart },
  { id: "praise", label: "Praise Reports", icon: Sparkles },
  { id: "visitors", label: "Visitor Cards", icon: Users },
  { id: "join", label: "Join Applications", icon: UserPlus },
  { id: "messages", label: "Pastor Messages", icon: MessageSquare },
  { id: "groups", label: "Connect Groups", icon: Mail },
];

const tableMap: Record<Tab, string> = {
  prayer: "prayer_requests",
  praise: "praise_reports",
  visitors: "visitor_cards",
  join: "join_applications",
  messages: "pastor_messages",
  groups: "connect_group_signups",
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

const deletedCardStyle = {
  background: "linear-gradient(135deg, #1a0a0a 0%, #0f0505 100%)",
  border: "1px solid rgba(239,68,68,0.15)",
  borderLeft: "4px solid rgba(239,68,68,0.5)",
  borderRadius: "0.75rem",
  opacity: 0.65,
};

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("prayer");
  const [showDeleted, setShowDeleted] = useState(false);
  const [data, setData] = useState<Record<string, RowData[]>>({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  // Task assignment modal state
  const [assigningRow, setAssigningRow] = useState<RowData | null>(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assigned_to: "", due_date: "" });
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskSuccess, setTaskSuccess] = useState("");
  const [taskError, setTaskError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [prayer, praise, visitors, join, messages, groups] = await Promise.all([
      supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("praise_reports").select("*").order("created_at", { ascending: false }),
      supabase.from("visitor_cards").select("*").order("created_at", { ascending: false }),
      supabase.from("join_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("pastor_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("connect_group_signups").select("*").order("created_at", { ascending: false }),
    ]);
    setData({
      prayer: prayer.data || [],
      praise: praise.data || [],
      visitors: visitors.data || [],
      join: join.data || [],
      messages: messages.data || [],
      groups: groups.data || [],
    });
    setLoading(false);
  }, []);

  const fetchLeaders = useCallback(async () => {
    const { data: leadersData } = await supabase
      .from("admin_roles")
      .select("*")
      .in("role", ["leader", "pastor", "tech_admin"]);
    setLeaders((leadersData as Leader[]) || []);
  }, []);

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth"); return; }
    setUserEmail(session.user.email || "");
    const role = await getUserRole();
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchAll();
    fetchLeaders();
  }, [checkAuth, fetchAll, fetchLeaders]);

  async function toggleApproval(table: string, id: string, current: boolean) {
    await supabase.from(table).update({ approved: !current }).eq("id", id);
    fetchAll();
  }

  async function softDelete(table: string, id: string) {
    await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq("id", id);
    setConfirmDelete(null);
    fetchAll();
  }

  async function restoreRecord(table: string, id: string) {
    await supabase.from(table).update({ deleted_at: null }).eq("id", id);
    fetchAll();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  function openAssignTask(row: RowData) {
    const name = row.first_name
      ? `${row.first_name} ${row.last_name || ""}`
      : row.display_name || "Submission";
    setAssigningRow(row);
    setTaskForm({
      title: `Follow up with ${name}`,
      description: "",
      assigned_to: "",
      due_date: "",
    });
    setTaskSuccess("");
    setTaskError("");
  }

  async function handleAssignTask() {
    if (!taskForm.assigned_to || !taskForm.title) {
      setTaskError("Please fill in the title and select a leader.");
      return;
    }
    setTaskLoading(true);
    setTaskError("");

    const { data: { session } } = await supabase.auth.getSession();
    const assignedLeader = leaders.find((l) => l.user_id === taskForm.assigned_to);

    const { error: insertError } = await supabase.from("tasks").insert([{
      title: taskForm.title,
      description: taskForm.description || null,
      assigned_to: taskForm.assigned_to,
      assigned_by: session?.user.id,
      assigned_to_email: assignedLeader?.email || null,
      assigned_by_email: session?.user.email || null,
      related_table: tableMap[activeTab],
      related_id: assigningRow?.id as string,
      status: "pending",
      due_date: taskForm.due_date || null,
    }]);

    if (insertError) {
      setTaskError(insertError.message);
      setTaskLoading(false);
      return;
    }

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "task_assigned",
        data: {
          title: taskForm.title,
          description: taskForm.description || null,
          assigned_to_email: assignedLeader?.email || null,
          assigned_by_email: session?.user.email || null,
          due_date: taskForm.due_date || null,
        },
      }),
    }).catch((err) => console.error("Notification error:", err));

    setTaskSuccess(`Task assigned to ${assignedLeader?.email || "leader"} successfully.`);
    setTaskLoading(false);
    setTimeout(() => {
      setAssigningRow(null);
      setTaskSuccess("");
    }, 2000);
  }

  const allCurrent = data[activeTab] || [];
  const activeRecords = allCurrent.filter((r) => !r.deleted_at);
  const deletedRecords = allCurrent.filter((r) => r.deleted_at);
  const currentData = showDeleted ? deletedRecords : activeRecords;

  const pendingCount =
    (data.prayer || []).filter((r) => !r.approved && !r.deleted_at).length +
    (data.praise || []).filter((r) => !r.approved && !r.deleted_at).length;

  return (
    <main className="min-h-screen bg-[#000D26] text-white">
      {/* Task Assignment Modal */}
      {assigningRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">Assign Task</h2>
              <button onClick={() => setAssigningRow(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {taskError && <p className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/30">{taskError}</p>}
            {taskSuccess && <p className="text-green-400 text-sm p-3 rounded-lg bg-green-400/10 border border-green-400/30">{taskSuccess}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Task Title</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} placeholder="Task title..." className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Details / Instructions</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <textarea value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="What should the leader do?" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Assign To</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <select value={taskForm.assigned_to} onChange={(e) => setTaskForm((p) => ({ ...p, assigned_to: e.target.value }))} className={inputCls}>
                    <option value="">Select a leader...</option>
                    {leaders.map((l) => (
                      <option key={l.user_id} value={l.user_id} style={{ background: "#0a1840" }}>
                        {l.email} ({l.role.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Due Date (optional)</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input type="date" value={taskForm.due_date} onChange={(e) => setTaskForm((p) => ({ ...p, due_date: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAssignTask}
                  disabled={taskLoading}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)", color: "#000D26" }}
                >
                  {taskLoading ? "Assigning..." : "Assign Task"}
                </button>
                <button
                  onClick={() => setAssigningRow(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(16,36,96,0.5)" }}
      >
        <div>
          <h1 className="font-serif text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-xs">{userEmail}</p>
        </div>
        <div className="flex items-center gap-4">
          {pendingCount > 0 && (
            <span className="text-xs bg-[#D4AF37] text-[#000D26] font-bold px-2.5 py-1 rounded-full">
              {pendingCount} pending
            </span>
          )}
          <Link href="/admin/tasks" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ClipboardList className="w-4 h-4" /> Tasks
          </Link>
          {canManageRoles(userRole) && (
            <Link href="/admin/roles" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
              <Shield className="w-4 h-4" /> Roles
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => {
            const count = (data[id] || []).filter((r) => !r.deleted_at).length;
            const pending = ["prayer", "praise"].includes(id)
              ? (data[id] || []).filter((r) => !r.approved && !r.deleted_at).length
              : 0;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setShowDeleted(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === id ? "linear-gradient(135deg, #D4AF37, #B8860B)" : "rgba(255,255,255,0.05)",
                  color: activeTab === id ? "#000D26" : "rgba(255,255,255,0.7)",
                  border: activeTab === id ? "none" : "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className="ml-1 text-xs opacity-70">{count}</span>
                {pending > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pending}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active / Deleted toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">
            {showDeleted
              ? `${deletedRecords.length} deleted record${deletedRecords.length !== 1 ? "s" : ""}`
              : `${activeRecords.length} active record${activeRecords.length !== 1 ? "s" : ""}`}
          </p>
          {deletedRecords.length > 0 && (
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: showDeleted ? "rgba(212,175,55,0.15)" : "rgba(239,68,68,0.15)",
                color: showDeleted ? "#D4AF37" : "#ef4444",
                border: `1px solid ${showDeleted ? "rgba(212,175,55,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}
            >
              {showDeleted ? "Show Active" : `Show Deleted (${deletedRecords.length})`}
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded mb-3 w-1/4" />
                <div className="h-3 bg-white/10 rounded mb-2" />
                <div className="h-3 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            {showDeleted ? "No deleted records." : "No records found."}
          </div>
        ) : (
          <div className="space-y-4">
            {currentData.map((row) => {
              const id = row.id as string;
              const isDeleted = !!row.deleted_at;
              const approved = row.approved as boolean;

              return (
                <div key={id} className="p-6 rounded-xl" style={isDeleted ? deletedCardStyle : cardStyle}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 space-y-1">
                      {isDeleted && (
                        <p className="text-red-400 text-xs mb-2">
                          🗑 Deleted {formatDate(row.deleted_at as string)}
                        </p>
                      )}
                      {(row.first_name || row.display_name) && (
                        <p className="font-serif font-bold text-white text-lg">
                          {row.first_name
                            ? `${row.first_name} ${row.last_name || ""}`
                            : (row.display_name as string) || "Anonymous"}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-white/50">
                        {row.email && <span>✉ {row.email as string}</span>}
                        {row.phone && <span>📞 {row.phone as string}</span>}
                        {row.address && <span>📍 {row.address as string}</span>}
                        {row.birthdate && <span>🎂 {row.birthdate as string}</span>}
                        {row.home_church && <span>⛪ {row.home_church as string}</span>}
                      </div>
                      {row.request && <p className="text-white/70 text-sm mt-2 leading-relaxed">{row.request as string}</p>}
                      {row.report && <p className="text-white/70 text-sm mt-2 leading-relaxed">{row.report as string}</p>}
                      {row.message && <p className="text-white/70 text-sm mt-2 leading-relaxed">{row.message as string}</p>}
                      {row.category && (
                        <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-[#D4AF37] border border-[#D4AF37]/30">
                          {(row.category as string).replace(/_/g, " ")}
                        </span>
                      )}
                      {row.how_joining && <p className="text-white/40 text-xs">Joining via: {row.how_joining as string}</p>}
                      {row.group_name && <p className="text-white/40 text-xs">Group: {row.group_name as string}</p>}
                      {row.subject && <p className="text-white/40 text-xs">Subject: {row.subject as string}</p>}
                      {row.how_did_you_hear && <p className="text-white/40 text-xs">Heard via: {row.how_did_you_hear as string}</p>}
                      {row.interests && <p className="text-white/40 text-xs">Interest: {row.interests as string}</p>}
                      {row.ministry_interests && <p className="text-white/40 text-xs">Serve: {row.ministry_interests as string}</p>}
                      {row.testimony && <p className="text-white/50 text-xs mt-1 italic">{row.testimony as string}</p>}
                      {row.notes && <p className="text-white/40 text-xs mt-1">Notes: {row.notes as string}</p>}
                      {row.prayer_needs && <p className="text-white/40 text-xs mt-1">Prayer needs: {row.prayer_needs as string}</p>}
                      {row.is_anonymous && <p className="text-white/30 text-xs">Anonymous submission</p>}
                      {row.is_private && <p className="text-white/30 text-xs">Private request</p>}
                      {row.first_visit && <p className="text-[#D4AF37] text-xs">⭐ First visit</p>}
                      {row.follow_up && <p className="text-[#D4AF37] text-xs">📬 Requested follow-up</p>}
                      {row.baptized === true && <p className="text-white/40 text-xs">✓ Baptized</p>}
                      <p className="text-white/25 text-xs mt-2">{formatDate(row.created_at as string)}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {/* Assign Task */}
                      {!isDeleted && canAssignTasks(userRole) && (
                        <button
                          onClick={() => openAssignTask(row)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
                        >
                          <ClipboardList className="w-3 h-3" /> Assign Task
                        </button>
                      )}

                      {/* Approve/Unapprove */}
                      {["prayer", "praise"].includes(activeTab) && !isDeleted && (
                        <button
                          onClick={() => toggleApproval(tableMap[activeTab], id, approved)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            background: approved ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                            color: approved ? "#ef4444" : "#22c55e",
                            border: `1px solid ${approved ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                          }}
                        >
                          {approved
                            ? <><XCircle className="w-3 h-3" /> Unapprove</>
                            : <><CheckCircle className="w-3 h-3" /> Approve</>}
                        </button>
                      )}

                      {/* Delete / Restore */}
                      {isDeleted ? (
                        <button
                          onClick={() => restoreRecord(tableMap[activeTab], id)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
                        >
                          <CheckCircle className="w-3 h-3" /> Restore
                        </button>
                      ) : confirmDelete === id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => softDelete(tableMap[activeTab], id)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
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
                          onClick={() => setConfirmDelete(id)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
