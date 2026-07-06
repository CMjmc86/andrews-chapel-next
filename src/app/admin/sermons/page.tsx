"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit3, X, Check, Play, Upload, Music } from "lucide-react";
import Link from "next/link";
import { getUserRole, canManageSermons, type Role } from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Sermon = {
  id: string;
  title: string;
  pastor: string;
  sermon_date: string;
  youtube_id: string | null;
  audio_url: string | null;
  facebook_url: string | null;
  scripture: string | null;
  series: string | null;
  description: string | null;
  is_published: boolean;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
};

type FormState = {
  title: string;
  pastor: string;
  sermon_date: string;
  youtube_id: string;
  facebook_url: string;
  scripture: string;
  series: string;
  description: string;
};

const emptyForm: FormState = {
  title: "", pastor: "Pastor Kathy Grace", sermon_date: "",
  youtube_id: "", facebook_url: "", scripture: "", series: "", description: "",
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

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function getYouTubeThumbnail(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

function extractYouTubeId(input: string): string {
  const urlMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (urlMatch) return urlMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return input;
}

export default function SermonsAdminPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [previewId, setPreviewId] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("sermons")
      .select("*")
      .order("sermon_date", { ascending: false });
    setSermons((data as Sermon[]) || []);
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const role = await getUserRole();
    if (!role) { router.push("/auth"); return; }
    if (!canManageSermons(role)) { router.push("/admin"); return; }
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchSermons();
  }, [checkAuth, fetchSermons]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setPreviewId("");
    setAudioFile(null);
    setAudioUrl(null);
  }

  function handleYouTubeInput(value: string) {
    const extracted = extractYouTubeId(value);
    setForm((p) => ({ ...p, youtube_id: extracted }));
    setPreviewId(extracted);
  }

  async function handleAudioUpload(file: File) {
    setAudioUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { data, error } = await supabase.storage
      .from("sermon-audio")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Audio upload error:", error);
      setAudioUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("sermon-audio").getPublicUrl(data.path);
    setAudioUrl(urlData.publicUrl);
    setAudioUploading(false);
  }

  async function handleSave() {
    if (!form.title || !form.sermon_date) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    const youtubeId = form.youtube_id ? extractYouTubeId(form.youtube_id) : null;

    const payload = {
      title: form.title,
      pastor: form.pastor || "Pastor Kathy Grace",
      sermon_date: form.sermon_date,
      youtube_id: youtubeId || null,
      audio_url: audioUrl,
      facebook_url: form.facebook_url || null,
      scripture: form.scripture || null,
      series: form.series || null,
      description: form.description || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from("sermons").update(payload).eq("id", editingId);
    } else {
      await supabase.from("sermons").insert([{
        ...payload,
        is_published: false,
        created_by: session?.user.id,
        created_by_email: session?.user.email,
      }]);
    }

    setSaving(false);
    resetForm();
    fetchSermons();
  }

  async function togglePublish(sermon: Sermon) {
    await supabase.from("sermons").update({
      is_published: !sermon.is_published,
      updated_at: new Date().toISOString(),
    }).eq("id", sermon.id);
    fetchSermons();
  }

  async function handleDelete(id: string) {
    await supabase.from("sermons").delete().eq("id", id);
    setConfirmDelete(null);
    fetchSermons();
  }

  function startEdit(sermon: Sermon) {
    setEditingId(sermon.id);
    setForm({
      title: sermon.title,
      pastor: sermon.pastor,
      sermon_date: sermon.sermon_date,
      youtube_id: sermon.youtube_id || "",
      facebook_url: sermon.facebook_url || "",
      scripture: sermon.scripture || "",
      series: sermon.series || "",
      description: sermon.description || "",
    });
    setPreviewId(sermon.youtube_id || "");
    setAudioUrl(sermon.audio_url);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const publishedCount = sermons.filter((s) => s.is_published).length;

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
            <h1 className="font-serif text-xl font-bold text-white">Sermon Management</h1>
            <p className="text-white/40 text-xs">{publishedCount} published · {sermons.length} total</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#000D26" }}
        >
          <Plus className="w-4 h-4" /> Add Sermon
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {showForm && (
          <div className="p-6 rounded-xl space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">
                {editingId ? "Edit Sermon" : "Add Sermon"}
              </h2>
              <button onClick={resetForm} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Sermon Title *</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Rooted and Established in Love" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Date *</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                    <input type="date" value={form.sermon_date} onChange={(e) => setForm((p) => ({ ...p, sermon_date: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Pastor</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                    <input value={form.pastor} onChange={(e) => setForm((p) => ({ ...p, pastor: e.target.value }))} placeholder="Pastor Kathy Grace" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">YouTube ID or URL (optional)</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input value={form.youtube_id} onChange={(e) => handleYouTubeInput(e.target.value)} placeholder="e.g. dQw4w9WgXcQ or full YouTube URL" className={inputCls} />
                </div>
              </div>

              {previewId && previewId.length === 11 && (
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.2)" }}>
                  <img src={getYouTubeThumbnail(previewId)} alt="YouTube thumbnail preview" className="w-full object-cover" />
                  <p className="text-white/40 text-xs p-2 text-center">YouTube preview — ID: {previewId}</p>
                </div>
              )}

              {/* Facebook */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Facebook Live / Video URL (optional)</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <input value={form.facebook_url} onChange={(e) => setForm((p) => ({ ...p, facebook_url: e.target.value }))} placeholder="https://www.facebook.com/..." className={inputCls} />
                </div>
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Audio File (optional)</label>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setAudioFile(file); handleAudioUpload(file); }
                  }}
                />
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors w-full justify-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.6)" }}
                >
                  <Upload className="w-4 h-4" />
                  {audioFile ? audioFile.name : "Upload MP3 or Audio File"}
                </button>
                {audioUploading && <p className="text-white/40 text-xs mt-1">Uploading audio...</p>}
                {audioUrl && !audioUploading && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                    <Music className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-xs flex-1 truncate">Audio uploaded successfully</p>
                    <button onClick={() => { setAudioUrl(null); setAudioFile(null); }} className="text-white/30 hover:text-white/60">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Scripture Reference</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                    <input value={form.scripture} onChange={(e) => setForm((p) => ({ ...p, scripture: e.target.value }))} placeholder="e.g. Ephesians 3:14-21" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Series Name</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                    <input value={form.series} onChange={(e) => setForm((p) => ({ ...p, series: e.target.value }))} placeholder="e.g. Walking in Love" className={inputCls} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Description</label>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description of the sermon..." className={inputCls} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.sermon_date || audioUploading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)", color: "#000D26" }}
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving..." : editingId ? "Update Sermon" : "Save Sermon"}
              </button>
              <button onClick={resetForm} className="px-6 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded mb-3 w-1/3" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Play className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No sermons yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="p-5 rounded-xl" style={sermon.is_published ? publishedCardStyle : cardStyle}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-[#0033A0] flex items-center justify-center" style={{ border: "1px solid rgba(212,175,55,0.2)" }}>
                      {sermon.youtube_id ? (
                        <img src={getYouTubeThumbnail(sermon.youtube_id)} alt={sermon.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-6 h-6 text-[#D4AF37]" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {sermon.is_published && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                            Published
                          </span>
                        )}
                        {sermon.youtube_id && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                            Video
                          </span>
                        )}
                        {sermon.facebook_url && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(59,89,152,0.2)", color: "#8b9dc3", border: "1px solid rgba(59,89,152,0.4)" }}>
                            Facebook
                          </span>
                        )}
                        {sermon.audio_url && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
                            Audio
                          </span>
                        )}
                        {sermon.series && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-[#D4AF37] border border-[#D4AF37]/30">
                            {sermon.series}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white">{sermon.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-white/40">
                        <span>{sermon.pastor}</span>
                        <span>{formatDate(sermon.sermon_date)}</span>
                        {sermon.scripture && <span>📖 {sermon.scripture}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    <button onClick={() => togglePublish(sermon)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{
                        background: sermon.is_published ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                        color: sermon.is_published ? "#ef4444" : "#22c55e",
                        border: `1px solid ${sermon.is_published ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                      }}>
                      {sermon.is_published ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}
                    </button>
                    <button onClick={() => startEdit(sermon)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    {confirmDelete === sermon.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(sermon.id)} className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}>
                          Confirm
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(sermon.id)}
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
        )}
      </div>
    </main>
  );
}
