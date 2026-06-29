"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function MessagePastorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", subject: "", message: "", anonymous: false });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase.from("pastor_messages").insert([{
      first_name: form.anonymous ? null : form.first_name,
      last_name: form.anonymous ? null : form.last_name,
      email: form.email, phone: form.phone || null,
      subject: form.subject || null, message: form.message, anonymous: form.anonymous,
    }]);
    if (sbError) { console.error("Supabase error:", sbError); setError(sbError.message); setLoading(false); return; }
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Message Sent!</h2>
        <p className="text-white/60 leading-relaxed">Pastor Kathy has received your message and will respond personally. If your matter is urgent, please call the church office at (910) 893-5162.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">Message Pastor Kathy</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">This message is completely private. Only Pastor Kathy will see your message. She personally responds to each one.</p>
      {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {!form.anonymous && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required><input name="first_name" value={form.first_name} onChange={handleChange} required={!form.anonymous} placeholder="First" className={inputCls} /></Field>
            <Field label="Last Name" required><input name="last_name" value={form.last_name} onChange={handleChange} required={!form.anonymous} placeholder="Last" className={inputCls} /></Field>
          </div>
        )}
        <Field label="Email Address" required><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputCls} /></Field>
        <Field label="Phone Number"><input name="phone" type="tel" value={form.phone} onChange={handlePhone} placeholder="(910) 555-0100" maxLength={14} className={inputCls} /></Field>
        <Field label="Subject">
          <select name="subject" value={form.subject} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="counseling">Pastoral Counseling</option>
            <option value="prayer">Prayer Request</option>
            <option value="marriage_family">Marriage / Family</option>
            <option value="grief">Grief & Bereavement</option>
            <option value="membership">Church Membership</option>
            <option value="ministry">Ministry Question</option>
            <option value="personal">Personal Matter</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Your Message" required><textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Write your message here..." className={inputCls} /></Field>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="anonymous" id="anonymous" checked={form.anonymous} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="anonymous" className="text-sm text-white/70">Send anonymously (name hidden from Pastor)</label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
