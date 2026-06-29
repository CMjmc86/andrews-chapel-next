"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">
        {label}{required && <span className="text-[#D4AF37] ml-1">*</span>}
      </label>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
        {children}
      </div>
    </div>
  );
}

export default function SubmitPrayerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    display_name: "", category: "", request: "",
    is_anonymous: false, is_private: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase.from("prayer_requests").insert([{
      display_name: form.is_anonymous ? null : (form.display_name || null),
      category: form.category || null,
      request: form.request,
      is_anonymous: form.is_anonymous,
      is_private: form.is_private,
      approved: false,
    }]);
    if (sbError) {
      console.error("Supabase error:", sbError);
      setError(sbError.message);
      setLoading(false);
      return;
    }
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Prayer Request Received!</h2>
        <p className="text-white/60 leading-relaxed">
          Your request has been sent to Pastor Kathy. The Andrews Chapel prayer team will be
          lifting you up. You are not alone — we are standing in agreement with you.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">Submit a Prayer Request</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">
        Your request will go to Pastor Kathy first. She personally reviews each one. Public
        requests appear on the Prayer Wall after approval. Private requests go only to the
        pastor and prayer team.
      </p>
      {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Your Name (optional)">
          <input name="display_name" value={form.display_name} onChange={handleChange} placeholder="Leave blank to post anonymously" className={inputCls} />
        </Field>
        <Field label="Request Type">
          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="health">Health & Healing</option>
            <option value="family">Family & Relationships</option>
            <option value="financial">Financial & Employment</option>
            <option value="grief">Grief & Loss</option>
            <option value="spiritual">Spiritual Growth</option>
            <option value="community">Community & World</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Your Prayer Request" required>
          <textarea name="request" value={form.request} onChange={handleChange} required rows={5} placeholder="Share what is on your heart..." className={inputCls} />
        </Field>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_anonymous" id="is_anonymous" checked={form.is_anonymous} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
            <label htmlFor="is_anonymous" className="text-sm text-white/70">Post anonymously on the Prayer Wall</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_private" id="is_private" checked={form.is_private} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
            <label htmlFor="is_private" className="text-sm text-white/70">Keep this request private (pastor and prayer team only)</label>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Submitting..." : "Submit Prayer Request"}
        </button>
      </form>
    </div>
  );
}
