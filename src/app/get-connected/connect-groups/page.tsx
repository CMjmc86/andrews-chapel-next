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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits.length ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const groups = [
  { name: "Young Adults Bible Study", desc: "Ages 18–35 · Weekly study and fellowship" },
  { name: "Senior Saints Fellowship", desc: "55+ · Monthly gatherings and outings" },
  { name: "Men's Brotherhood", desc: "Men of all ages · Monthly meetings" },
  { name: "Women's Circle", desc: "Women of all ages · Monthly gatherings" },
  { name: "Youth Group", desc: "Ages 13–17 · Weekly meetings" },
  { name: "Couples Ministry", desc: "Married couples · Quarterly events" },
];

export default function ConnectGroupsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    group_name: "", first_name: "", last_name: "",
    email: "", phone: "", contact_preference: "", notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase.from("connect_group_signups").insert([{
      group_name: form.group_name,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email || null,
      phone: form.phone || null,
      contact_preference: form.contact_preference || null,
      notes: form.notes || null,
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
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">You&apos;re In!</h2>
        <p className="text-white/60 leading-relaxed">
          A group leader will reach out with the next meeting details. We look forward to doing
          life together with you at Andrews Chapel!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">Join a Connect Group</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">
        Connect Groups meet regularly for Bible study, fellowship, and life together.
        There is a place for everyone at Andrews Chapel.
      </p>
      {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}

      <div className="grid grid-cols-2 gap-3 mb-8">
        {groups.map((g) => (
          <div key={g.name} className="p-4 rounded-lg" style={{ background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)", border: "1px solid rgba(212,175,55,0.15)", borderLeft: "3px solid #D4AF37" }}>
            <div className="font-serif text-sm font-semibold text-white mb-0.5">{g.name}</div>
            <div className="text-[11px] text-white/50">{g.desc}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Which group would you like to join?" required>
          <select name="group_name" value={form.group_name} onChange={handleChange} required className={inputCls}>
            <option value="">Select a group...</option>
            {groups.map((g) => <option key={g.name} value={g.name}>{g.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required>
            <input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="First" className={inputCls} />
          </Field>
          <Field label="Last Name" required>
            <input name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Last" className={inputCls} />
          </Field>
        </div>
        <Field label="Email Address">
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} />
        </Field>
        <Field label="Phone Number">
          <input name="phone" type="tel" value={form.phone} onChange={handlePhone} placeholder="(910) 555-0100" maxLength={14} className={inputCls} />
        </Field>
        <Field label="Preferred Contact Method">
          <select name="contact_preference" value={form.contact_preference} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="text">Text Message</option>
          </select>
        </Field>
        <Field label="Anything else you'd like us to know?">
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Questions, schedule constraints, etc." className={inputCls} />
        </Field>
        <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Signing up..." : "Sign Me Up"}
        </button>
      </form>
    </div>
  );
}
