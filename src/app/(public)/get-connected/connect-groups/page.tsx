"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

const groups = [
  { name: "Young Adults Bible Study", desc: "Ages 18–35 · Weekly studyand fellowship" },
  { name: "Senior Saints Fellowship", desc: "55+ · Monthly gatherings and outings" },
  { name: "Men's Brotherhood", desc: "Men of all ages · Monthly meetings" },
  { name: "Women's Circle", desc: "Women of all ages · Monthly gatherings" },
  { name: "Youth Group", desc: "Ages 13–17 · Weekly meetings" },
  { name: "Couples Ministry", desc: "Married couples · Quarterly events" },
];

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/70 mb-1.5uppercase tracking-wider">
        {label}{required && <span className="text-[#D4AF37] ml-1">*</span>}
      </label>
      <div style={{ background: "rgba(255,255,255,0.05)", border: error ? "1px solid rgba(239,68,68,0.5)" : "1pxsolid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits.length ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ConnectGroupsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // general, non-field errors only
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [form, setForm] = useState({ group_name: "", first_name: "", last_name: "", email: "", phone: "", contact_preference: "", notes: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const fe: Record<string, string> = {};
    if (!form.group_name) fe.group_name = "Please select a group to join.";
    if (!form.first_name.trim()) fe.first_name = "Please enter your first name.";
    if (!form.last_name.trim()) fe.last_name = "Please enter your last name.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.trim() && !emailPattern.test(form.email.trim())) {
      fe.email = "Please enter a valid email address.";
    }
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length > 0 && phoneDigits.length < 10) {
      fe.phone = "Please enter a complete 10-digit phone number.";
    }
    if (Object.keys(fe).length > 0) {
      setFieldErrors(fe);
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);

    const verifyRes = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      setError("Security check failed. Please try again.");
      turnstileRef.current?.reset();
      setTurnstileToken("");
      setLoading(false);
      return;
    }

    const payload = {
      group_name: form.group_name, first_name: form.first_name, last_name: form.last_name,
      email: form.email || null, phone: form.phone || null,
      contact_preference: form.contact_preference || null, notes: form.notes || null,
    };
    const { error: sbError } = await supabase.from("connect_group_signups").insert([payload]);
    if (sbError) { console.error("Supabase error:", sbError); setError(sbError.message); setLoading(false); return; }

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "connect_group", data: payload }),
    }).catch((err) => console.error("Notification error:", err));

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">You&apos;re In!</h2>
        <p className="text-white/60 leading-relaxed">A group leader will reach out with the next meeting details. We look forward to doing life together with you at Andrews Chapel!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">Join a Connect Group</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">Connect Groups meet regularly for Bible study, fellowship, and life together.There is a place for everyone at Andrews Chapel.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {groups.map((g) => (
          <div key={g.name} className="p-4 rounded-lg" style={{ background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)", border: "1pxsolid rgba(212,175,55,0.15)", borderLeft: "3px solid #D4AF37" }}>
            <div className="font-serif text-sm font-semibold text-white mb-0.5">{g.name}</div>
            <div className="text-[11px] text-white/50">{g.desc}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Which group would you like to join?" required error={fieldErrors.group_name}>
          <select name="group_name" value={form.group_name} onChange={handleChange} className={inputCls}>
            <option value="">Select a group...</option>
            {groups.map((g) => <option key={g.name} value={g.name}>{g.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required error={fieldErrors.first_name}><input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First" className={inputCls} /></Field>
          <Field label="Last Name" required error={fieldErrors.last_name}><input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last" className={inputCls} /></Field>
        </div>
        <Field label="Email Address" error={fieldErrors.email}><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} /></Field>
        <Field label="Phone Number" error={fieldErrors.phone}><input name="phone" type="tel" value={form.phone} onChange={handlePhone} placeholder="(910) 555-0100" maxLength={14} className={inputCls} /></Field>
        <Field label="Preferred Contact Method">
          <select name="contact_preference" value={form.contact_preference} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="text">Text Message</option>
          </select>
        </Field>
        <Field label="Anything else you'd like us to know?"><textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Questions, schedule constraints, etc." className={inputCls} /></Field>

        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "dark" }}
        />

        {error && <p className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Signing up..." : "Sign Me Up"}
        </button>
      </form>
    </div>
  );
}
