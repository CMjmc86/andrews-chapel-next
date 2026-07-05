"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit3, X, Check } from "lucide-react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { getUserRole, canManageBulletins, type Role } from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Bulletin = {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  published_at: string | null;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

const activeCardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(34,197,94,0.3)",
  borderLeft: "4px solid #22c55e",
  borderRadius: "0.75rem",
};

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 rounded text-xs font-medium transition-colors"
      style={{
        background: active ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.05)",
        color: active ? "#D4AF37" : "rgba(255,255,255,0.6)",
        border: `1px solid ${active ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.1)"}`,
      }}
    >
      {children}
    </button>
  );
}

function BulletinEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 text-white/80 text-sm leading-relaxed outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1.5 p-2 border-b border-white/10">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><em>I</em></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>" Quote</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>— Rule</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>↩ Undo</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>↪ Redo</ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export default function BulletinsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchBulletins = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bulletins")
      .select("*")
      .order("created_at", { ascending: false });
    setBulletins((data as Bulletin[]) || []);
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const role = await getUserRole();
    if (!role) { router.push("/auth"); return; }
    if (!canManageBulletins(role)) { router.push("/admin"); return; }
    setUserRole(role);
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchBulletins();
  }, [checkAuth, fetchBulletins]);

  async function handleSave() {
    if (!form.title || !form.content) return;
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (editingId) {
      await supabase.from("bulletins").update({
        title: form.title,
        content: form.content,
        updated_at: new Date().toISOString(),
      }).eq("id", editingId);
    } else {
      await supabase.from("bulletins").insert([{
        title: form.title,
        content: form.content,
        is_active: false,
        created_by: session?.user.id,
        created_by_email: session?.user.email,
      }]);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", content: "" });
    fetchBulletins();
  }

  async function toggleActive(bulletin: Bulletin) {
    const activeCount = bulletins.filter((b) => b.is_active && b.id !== bulletin.id).length;

    if (!bulletin.is_active && activeCount >= 2) {
      alert("Only 2 bulletins can be active at once. Please deactivate one first.");
      return;
    }

    await supabase.from("bulletins").update({
      is_active: !bulletin.is_active,
      published_at: !bulletin.is_active ? new Date().toISOString() : null,
    }).eq("id", bulletin.id);

    fetchBulletins();
  }

  async function handleDelete(id: string) {
    await supabase.from("bulletins").delete().eq("id", id);
    setConfirmDelete(null);
    fetchBulletins();
  }

  function startEdit(bulletin: Bulletin) {
    setEditingId(bulletin.id);
    setForm({ title: bulletin.title, content: bulletin.content });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeBulletins = bulletins.filter((b) => b.is_active);

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
            <h1 className="font-serif text-xl font-bold text-white">Bulletin Management</h1>
            <p className="text-white/40 text-xs">{activeBulletins.length}/2 bulletins active</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: "", content: "" }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#000D26" }}
        >
          <Plus className="w-4 h-4" /> New Bulletin
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Create / Edit Form */}
        {showForm && (
          <div className="p-6 rounded-xl space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">
                {editingId ? "Edit Bulletin" : "New Bulletin"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Title</label>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Sunday Bulletin — July 6, 2026"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Content</label>
              <BulletinEditor
                content={form.content}
                onChange={(html) => setForm((p) => ({ ...p, content: html }))}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.content}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)", color: "#000D26" }}
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving..." : editingId ? "Update Bulletin" : "Save Bulletin"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-6 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bulletins list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded mb-3 w-1/3" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : bulletins.length === 0 ? (
          <div className="text-center py-16 text-white/30">No bulletins yet. Create your first one!</div>
        ) : (
          <div className="space-y-4">
            {bulletins.map((bulletin) => (
              <div key={bulletin.id} className="p-6 rounded-xl" style={bulletin.is_active ? activeCardStyle : cardStyle}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {bulletin.is_active && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                          Active
                        </span>
                      )}
                      <span className="text-white/25 text-xs">
                        {bulletin.is_active && bulletin.published_at
                          ? `Published ${formatDate(bulletin.published_at)}`
                          : `Created ${formatDate(bulletin.created_at)}`}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">{bulletin.title}</h3>
                    <p className="text-white/40 text-xs">
                      By {bulletin.created_by_email || "Unknown"} · Last updated {formatDate(bulletin.updated_at)}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap shrink-0">
                    {/* Toggle active */}
                    <button
                      onClick={() => toggleActive(bulletin)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{
                        background: bulletin.is_active ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                        color: bulletin.is_active ? "#ef4444" : "#22c55e",
                        border: `1px solid ${bulletin.is_active ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                      }}
                    >
                      {bulletin.is_active ? <><EyeOff className="w-3 h-3" /> Deactivate</> : <><Eye className="w-3 h-3" /> Publish</>}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => startEdit(bulletin)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>

                    {/* Delete */}
                    {confirmDelete === bulletin.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(bulletin.id)}
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
                        onClick={() => setConfirmDelete(bulletin.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
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
