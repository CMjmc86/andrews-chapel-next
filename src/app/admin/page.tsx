"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, Users, UserPlus, MessageSquare, CheckCircle, XCircle, LogOut, Mail } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = "prayer" | "praise" | "visitors" | "join" | "messages" | "groups";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "prayer", label: "Prayer Requests", icon: Heart },
  { id: "praise", label: "Praise Reports", icon: Sparkles },
  { id: "visitors", label: "Visitor Cards", icon: Users },
  { id: "join", label: "Join Applications", icon: UserPlus },
  { id: "messages", label: "Pastor Messages", icon: MessageSquare },
  { id: "groups", label: "Connect Groups", icon: Mail },
];

function Badge({ approved }: { approved: boolean }) {
  return (
    <span
      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
      style={{
        background: approved ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
        color: approved ? "#22c55e" : "#fbbf24",
        border: `1px solid ${approved ? "rgba(34,197,94,0.3)" : "rgba(251,191,36,0.3)"}`,
      }}
    >
      {approved ? "Approved" : "Pending"}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("prayer");
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkAuth();
    fetchAll();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth"); return; }
    setUserEmail(session.user.email || "");
  }

  async function fetchAll() {
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
  }

  async function toggleApproval(table: string, id: string, current: boolean) {
    await supabase.from(table).update({ approved: !current }).eq("id", id);
    fetchAll();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const tableMap: Record<Tab, string> = {
    prayer: "prayer_requests",
    praise: "praise_reports",
    visitors: "visitor_cards",
    join: "join_applications",
    messages: "pastor_messages",
    groups: "connect_group_signups",
  };

  const currentData = data[activeTab] || [];
  const pendingCount = (data.prayer || []).filter((r) => !r.approved).length +
    (data.praise || []).filter((r) => !r.approved).length;

  return (
    <main className="min-h-screen bg-[#000D26] text-white">
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
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => {
            const count = (data[id] || []).length;
            const pending = ["prayer", "praise"].includes(id)
              ? (data[id] || []).filter((r) => !r.approved).length
              : 0;
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
          <div className="text-center py-16 text-white/30">No records found.</div>
        ) : (
          <div className="space-y-4">
            {currentData.map((row) => (
              <div key={row.id} className="p-6 rounded-xl" style={cardStyle}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-1">

                    {/* Name */}
                    {(row.first_name || row.display_name) && (
                      <p className="font-serif font-bold text-white text-lg">
                        {row.first_name ? `${row.first_name} ${row.last_name || ""}` : row.display_name || "Anonymous"}
                      </p>
                    )}

                    {/* Email / Phone */}
                    <div className="flex flex-wrap gap-4 text-xs text-white/50">
                      {row.email && <span>✉ {row.email}</span>}
                      {row.phone && <span>📞 {row.phone}</span>}
                      {row.address && <span>📍 {row.address}</span>}
                      {row.birthdate && <span>🎂 {row.birthdate}</span>}
                      {row.home_church && <span>⛪ {row.home_church}</span>}
                    </div>

                    {/* Prayer / Praise / Message content */}
                    {row.request && (
                      <p className="text-white/70 text-sm mt-2 leading-relaxed">{row.request}</p>
                    )}
                    {row.report && (
                      <p className="text-white/70 text-sm mt-2 leading-relaxed">{row.report}</p>
                    )}
                    {row.message && (
                      <p className="text-white/70 text-sm mt-2 leading-relaxed">{row.message}</p>
                    )}

                    {/* Extra fields */}
                    {row.category && (
                      <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-[#D4AF37] border border-[#D4AF37]/30">
                        {row.category.replace(/_/g, " ")}
                      </span>
                    )}
                    {row.how_joining && <p className="text-white/40 text-xs">Joining via: {row.how_joining}</p>}
                    {row.group_name && <p className="text-white/40 text-xs">Group: {row.group_name}</p>}
                    {row.subject && <p className="text-white/40 text-xs">Subject: {row.subject}</p>}
                    {row.how_did_you_hear && <p className="text-white/40 text-xs">Heard via: {row.how_did_you_hear}</p>}
                    {row.interests && <p className="text-white/40 text-xs">Interest: {row.interests}</p>}
                    {row.ministry_interests && <p className="text-white/40 text-xs">Serve: {row.ministry_interests}</p>}
                    {row.testimony && <p className="text-white/50 text-xs mt-1 italic">{row.testimony}</p>}
                    {row.notes && <p className="text-white/40 text-xs mt-1">Notes: {row.notes}</p>}
                    {row.prayer_needs && <p className="text-white/40 text-xs mt-1">Prayer needs: {row.prayer_needs}</p>}
                    {row.is_anonymous && <p className="text-white/30 text-xs">Anonymous submission</p>}
                    {row.is_private && <p className="text-white/30 text-xs">Private request</p>}
                    {row.first_visit && <p className="text-[#D4AF37] text-xs">⭐ First visit</p>}
                    {row.follow_up && <p className="text-[#D4AF37] text-xs">📬 Requested follow-up</p>}
                    {row.baptized === true && <p className="text-white/40 text-xs">✓ Baptized</p>}

                    <p className="text-white/25 text-xs mt-2">{formatDate(row.created_at)}</p>
                  </div>

                  {/* Approve/Reject for prayer and praise */}
                  {["prayer", "praise"].includes(activeTab) && (
                    <div className="flex gap-2 shrink-0">
                      {"approved" in row && (
                        <>
                          <Badge approved={row.approved} />
                          <button
                            onClick={() => toggleApproval(tableMap[activeTab], row.id, row.approved)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{
                              background: row.approved ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                              color: row.approved ? "#ef4444" : "#22c55e",
                              border: `1px solid ${row.approved ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                            }}
                          >
                            {row.approved ? <><XCircle className="w-3 h-3" /> Unapprove</> : <><CheckCircle className="w-3 h-3" /> Approve</>}
                          </button>
                        </>
                      )}
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
