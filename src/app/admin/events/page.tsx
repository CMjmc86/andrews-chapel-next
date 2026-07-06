"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit3, X, Check, Calendar } from "lucide-react";
import Link from "next/link";
import { getUserRole, canManageEvents, type Role } from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  end_time: string | null;
  location: string | null;
  is_published: boolean;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
};

type FormState = {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  event_time_ampm: string;
  end_time: string;
  end_time_ampm: string;
  location: string;
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

const publishedCardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(34,197,94,0.3)",
  borderLeft: "4px solid #22c55e",
  borderRadius: "0.75rem",
};

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

const timeOptions = [
  "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
  "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30",
  "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
];

const emptyForm: FormState = {
  title: "", description: "", event_date: "",
  event_time: "", event_time_ampm: "AM",
  end_time: "", end_time_ampm: "AM", location: "",
};

function formatDisplayDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function formatDisplayTime(time: string | null) {
  if (!time) return null;
  // Handle "11:30 AM" format stored directly
  if (time.includes("AM") || time.includes("PM")) return time;
  // Handle "11:30:00" 24hr format from DB
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function formatCreatedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function TimeSelect({
  timeValue, ampmValue, onTimeChange, onAmpmChange,
}: {
  timeValue: string;
  ampmValue: string;
  onTimeChange: (v: string) => void;
  onAmpmChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
        <select value={timeValue} onChange={(e) => onTimeChange(e.target.value)} className={inputCls}>
          <option value="">--:--</option>
          {timeOptions.map((t) => (
            <option key={t} value={t} style={{ background: "#0a1840" }}>{t}</option>
          ))}
        </select>
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
        <select value={ampmValue} onChange={(e) => onAmpmChange(e.target.value)} className={inputCls}>
          <option value="AM" style={{ background: "#0a1840" }}>AM</option>
          <option value="PM" style={{ background: "#0a1840" }}>PM</option>
        </select>
      </div>
    </div>
  );
}

export default function EventsAdminPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    setEvents((data as Event[]) || []);
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const role = await getUserRole();
    if (!role) { router.push("/auth"); return; }
    if (!canManageEvents(role)) { router.push("/admin"); return; }
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchEvents();
  }, [checkAuth, fetchEvents]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function parseStoredTime(stored: string | null): { time: string; ampm: string } {
    if (!stored) return { time: "", ampm: "AM" };
    const parts = stored.split(" ");
    if (parts.length === 2) return { time: parts[0], ampm: parts[1] };
    // Handle 24hr format from DB
    const [h, m] = stored.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return { time: `${displayHour}:${m}`, ampm };
  }

  async function handleSave() {
    if (!form.title || !form.event_date) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    const payload = {
      title: form.title,
      description: form.description || null,
      event_date: form.event_date,
      event_time: form.event_time ? `${form.event_time} ${form.event_time_ampm}` : null,
      end_time: form.end_time ? `${form.end_time} ${form.end_time_ampm}` : null,
      location: form.location || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from("events").update(payload).eq("id", editingId);
    } else {
      await supabase.from("events").insert([{
        ...payload,
        is_published: false,
        created_by: session?.user.id,
        created_by_email: session?.user.email,
      }]);
    }

    setSaving(false);
    resetForm();
    fetchEvents();
  }

  async function togglePublish(event: Event) {
    await supabase.from("events").update({
      is_published: !event.is_published,
      updated_at: new Date().toISOString(),
    }).eq("id", event.id);
    fetchEvents();
  }

  async function handleDelete(id: string) {
    await supabase.from("events").delete().eq("id", id);
    setConfirmDelete(null);
    fetchEvents();
  }

  function startEdit(event: Event) {
    const startTime = parseStoredTime(event.event_time);
    const endTime = parseStoredTime(event.end_time);
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      event_time: startTime.time,
      event_time_ampm: startTime.ampm,
      end_time: endTime.time,
      end_time_ampm: endTime.ampm,
      location: event.location || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const today = new Date().toDateString();
  const upcomingEvents = events.filter((e) => new Date(e.event_date + "T00:00:00") >= new Date(today));
  const pastEvents = events.filter((e) => new Date(e.event_date + "T00:00:00") < new Date(today));
  const publishedCount = events.filter((e) => e.is_published).length;

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
            <h1 className="font-serif text-xl font-bold text-white">Event Management</h1>
            <p className="text-white/40 text-xs">{publishedCount} published · {upcomingEvents.length} upcoming</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#000D26" }}
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Create / Edit Form */}
        {showForm && (
          <div className="p-6 rounded-xl space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">
                {editingId ? "Edit Event" : "New Event"}
              </h2>
              <button onClick={resetForm} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Event Title *</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Sunday Morning Worship" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Date *</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                    <input type="date" value={form.event_date} onChange={(e) => setForm((p) => ({ ...p, event_date: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Location</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                    <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Main Sanctuary" className={inputCls} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Start Time</label>
                  <TimeSelect
                    timeValue={form.event_time}
                    ampmValue={form.event_time_ampm}
                    onTimeChange={(v) => setForm((p) => ({ ...p, event_time: v }))}
                    onAmpmChange={(v) => setForm((p) => ({ ...p, event_time_ampm: v }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">End Time</label>
                  <TimeSelect
                    timeValue={form.end_time}
                    ampmValue={form.end_time_ampm}
                    onTimeChange={(v) => setForm((p) => ({ ...p, end_time: v }))}
                    onAmpmChange={(v) => setForm((p) => ({ ...p, end_time_ampm: v }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Description</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Event details..." className={inputCls} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.event_date}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)", color: "#000D26" }}
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving..." : editingId ? "Update Event" : "Save Event"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Events list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded mb-3 w-1/3" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-white/30">No events yet. Create your first one!</div>
        ) : (
          <div className="space-y-8">
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="font-serif text-lg font-bold text-white mb-4">Upcoming Events ({upcomingEvents.length})</h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-5 rounded-xl" style={event.is_published ? publishedCardStyle : cardStyle}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex gap-4">
                          <div className="text-center min-w-[48px]">
                            <p className="text-[#D4AF37] text-xs font-bold uppercase">
                              {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                            </p>
                            <p className="text-white text-2xl font-bold leading-none">
                              {new Date(event.event_date + "T00:00:00").getDate()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {event.is_published && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
                                  style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                                  Published
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif text-lg font-bold text-white">{event.title}</h3>
                            <div className="flex flex-wrap gap-3 text-xs text-white/40">
                              <span>{formatDisplayDate(event.event_date)}</span>
                              {event.event_time && (
                                <span>🕐 {formatDisplayTime(event.event_time)}{event.end_time ? ` – ${formatDisplayTime(event.end_time)}` : ""}</span>
                              )}
                              {event.location && <span>📍 {event.location}</span>}
                            </div>
                            {event.description && <p className="text-white/50 text-xs mt-1 line-clamp-2">{event.description}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap shrink-0">
                          <button
                            onClick={() => togglePublish(event)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{
                              background: event.is_published ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                              color: event.is_published ? "#ef4444" : "#22c55e",
                              border: `1px solid ${event.is_published ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                            }}
                          >
                            {event.is_published ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}
                          </button>
                          <button
                            onClick={() => startEdit(event)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          {confirmDelete === event.id ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete(event.id)} className="text-xs px-3 py-1.5 rounded-lg"
                                style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}>
                                Confirm
                              </button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs px-3 py-1.5 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(event.id)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="font-serif text-lg font-bold text-white/50 mb-4">Past Events ({pastEvents.length})</h2>
                <div className="space-y-3 opacity-60">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="p-5 rounded-xl" style={cardStyle}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex gap-4">
                          <div className="text-center min-w-[48px]">
                            <p className="text-white/40 text-xs font-bold uppercase">
                              {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                            </p>
                            <p className="text-white/50 text-2xl font-bold leading-none">
                              {new Date(event.event_date + "T00:00:00").getDate()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-serif text-lg font-bold text-white/70">{event.title}</h3>
                            <div className="flex flex-wrap gap-3 text-xs text-white/30">
                              <span>{formatDisplayDate(event.event_date)}</span>
                              {event.location && <span>📍 {event.location}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {confirmDelete === event.id ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete(event.id)} className="text-xs px-3 py-1.5 rounded-lg"
                                style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}>
                                Confirm
                              </button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs px-3 py-1.5 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(event.id)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="text-center mt-4">
            <Calendar className="w-12 h-12 mx-auto text-white/10" />
          </div>
        )}
      </div>
    </main>
  );
}
