"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, ArrowLeft, ClipboardList } from "lucide-react";
import Link from "next/link";
import { getUserRole, type Role } from "@/lib/roles";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  assigned_by: string;
  assigned_to_email: string | null;
  assigned_by_email: string | null;
  related_table: string | null;
  related_id: string | null;
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

const completedCardStyle = {
  background: "linear-gradient(135deg, #0a1a0a 0%, #051005 100%)",
  border: "1px solid rgba(34,197,94,0.15)",
  borderLeft: "4px solid rgba(34,197,94,0.5)",
  borderRadius: "0.75rem",
  opacity: 0.75,
};

const STATUS_COLORS = {
  pending: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "rgba(251,191,36,0.3)", label: "Pending" },
  in_progress: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)", label: "In Progress" },
  completed: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)", label: "Completed" },
};

function StatusBadge({ status }: { status: Task["status"] }) {
  const s = STATUS_COLORS[status];
  return (
    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatTable(table: string | null) {
  if (!table) return null;
  const map: Record<string, string> = {
    visitor_cards: "Visitor Card",
    prayer_requests: "Prayer Request",
    praise_reports: "Praise Report",
    join_applications: "Membership Application",
    pastor_messages: "Pastor Message",
    connect_group_signups: "Connect Group Signup",
  };
  return map[table] || table;
}

export default function TasksPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    setTasks((data as Task[]) || []);
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const role = await getUserRole();
    if (!role) { router.push("/auth"); return; }
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchTasks();
  }, [checkAuth, fetchTasks]);

  async function handleStatusChange(task: Task, newStatus: Task["status"]) {
    setUpdatingId(task.id);
    const updates: Record<string, string> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    await supabase.from("tasks").update(updates).eq("id", task.id);

    if (newStatus === "completed") {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "task_completed",
          data: {
            title: task.title,
            description: task.description,
            assigned_to_email: task.assigned_to_email,
            assigned_by_email: task.assigned_by_email,
          },
        }),
      }).catch((err) => console.error("Notification error:", err));
    }

    setUpdatingId(null);
    fetchTasks();
  }

  const isLeader = userRole === "leader";
  const filteredTasks = tasks.filter((t) => filter === "all" || t.status === filter);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  if (!userRole) return null;

  return (
    <main className="min-h-dvh bg-[#000D26] text-white">
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(16,36,96,0.5)" }}
      >
        <div className="flex items-center gap-3">
          {!isLeader && (
            <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#D4AF37]" />
              {isLeader ? "My Tasks" : "Task Management"}
            </h1>
            <p className="text-white/40 text-xs">
              {isLeader ? "Tasks assigned to you" : "All assigned tasks"}
            </p>
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs bg-[#D4AF37] text-[#000D26] font-bold px-2.5 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pending", count: pendingCount, color: "#fbbf24" },
            { label: "In Progress", count: inProgressCount, color: "#3b82f6" },
            { label: "Completed", count: completedCount, color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "in_progress", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === f ? "linear-gradient(135deg, #D4AF37, #B8860B)" : "rgba(255,255,255,0.05)",
                color: filter === f ? "#000D26" : "rgba(255,255,255,0.6)",
                border: filter === f ? "none" : "1px solid rgba(212,175,55,0.2)",
              }}
            >
              {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded mb-3 w-1/3" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-6 rounded-xl" style={task.status === "completed" ? completedCardStyle : cardStyle}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={task.status} />
                      {task.related_table && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-[#D4AF37] border border-[#D4AF37]/30">
                          {formatTable(task.related_table)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">{task.title}</h3>
                    {task.description && <p className="text-white/60 text-sm leading-relaxed">{task.description}</p>}
                    <div className="flex flex-wrap gap-4 text-xs text-white/40">
                      {task.assigned_by_email && <span>Assigned by: {task.assigned_by_email}</span>}
                      {task.assigned_to_email && !isLeader && <span>Assigned to: {task.assigned_to_email}</span>}
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due: {formatDate(task.due_date)}
                        </span>
                      )}
                      <span>Created: {formatDate(task.created_at)}</span>
                      {task.completed_at && <span>Completed: {formatDate(task.completed_at)}</span>}
                    </div>
                  </div>

                  {task.status !== "completed" && (
                    <div className="flex gap-2 flex-wrap shrink-0">
                      {task.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(task, "in_progress")}
                          disabled={updatingId === task.id}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(task, "completed")}
                        disabled={updatingId === task.id}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {updatingId === task.id ? "Saving..." : "Mark Complete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
