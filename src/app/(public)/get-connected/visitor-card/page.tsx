"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

const interestOptions = [
  "Youth Ministry", "Choir / Worship Music", "Community Outreach", "Bible Study",
  "Men's Brotherhood", "Women's Circle", "Couples Ministry", "Ushers / Greeters",
  "Media & Technology", "Other",
];

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

function validateBirthdate(dateStr: string): string | null {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const today = new Date();
  if (birth > today) return "Date of birth cannot be in the future.";
  if (birth.getFullYear() < today.getFullYear() - 120) return "Please enter a valid date of birth.";
  return null;
}

export default function VisitorCardPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", address: "",
    birthdate: "", home_church: "", how_did_you_hear: "", first_visit: false,
    interest: "", interest_other: "", prayer_needs: "", follow_up: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
  }

  function handleBirthdate(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, birthdate: val }));
    setBirthdateError(validateBirthdate(val) || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.birthdate) {
      const bdErr = validateBirthdate(form.birthdate);
      if (bdErr) { setBirthdateError(bdErr); return; }
    }
    setLoading(true);
    setError("");
    const interests = form.interest === "Other" ? form.interest_other || "Other" : form.interest || null;
    const payload = {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email || null, phone: form.phone || null,
      address: form.address || null, birthdate: form.birthdate || null,
      home_church: form.home_church || null, how_did_you_hear: form.how_did_you_hear || null,
      interests, prayer_needs: form.prayer_needs || null,
      first_visit: form.first_visit, follow_up: form.follow_up,
    };
    const { error: sbError } = await supabase.from("visitor_cards").insert([payload]);
    if (sbError) { console.error("Supabase error:", sbError); setError(sbError.message); setLoading(false); return; }

    // Fire email notification — don't block success on this
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visitor_card", data: payload }),
    }).catch((err) => console.error("Notification error:", err));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Welcome to the Family!</h2>
        <p className="text-white/60 leading-relaxed">Thank you for filling out a visitor card. Pastor Kathy and our team will be in touch soon. We are so glad you are here!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">New Visitor Card</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">First time with us? Fill this out and we&apos;ll make sure to welcome you personally.</p>
      {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required><input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="First" className={inputCls} /></Field>
          <Field label="Last Name" required><input name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Last" className={inputCls} /></Field>
        </div>
        <Field label="Email Address"><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} /></Field>
        <Field label="Phone Number"><input name="phone" type="tel" value={form.phone} onChange={handlePhone} placeholder="(910) 555-0100" maxLength={14} className={inputCls} /></Field>
        <Field label="Home Address"><input name="address" value={form.address} onChange={handleChange} placeholder="Street, City, State, ZIP" className={inputCls} /></Field>
        <div>
          <Field label="Date of Birth">
            <input name="birthdate" type="date" value={form.birthdate} onChange={handleBirthdate} max={new Date().toISOString().split("T")[0]} min={`${new Date().getFullYear() - 120}-01-01`} className={inputCls} />
          </Field>
          {birthdateError && <p className="text-red-400 text-xs mt-1 ml-1">{birthdateError}</p>}
        </div>
        <Field label="Home Church"><input name="home_church" value={form.home_church} onChange={handleChange} placeholder="Your current or previous church (if any)" className={inputCls} /></Field>
        <Field label="How did you hear about us?">
          <select name="how_did_you_hear" value={form.how_did_you_hear} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="friend_family">Friend or Family</option>
            <option value="social_media">Social Media</option>
            <option value="website">Website</option>
            <option value="driving_by">Driving By</option>
            <option value="community_event">Community Event</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Area of Interest">
          <select name="interest" value={form.interest} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            {interestOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </Field>
        {form.interest === "Other" && (
          <Field label="Please describe your interest">
            <input name="interest_other" value={form.interest_other} onChange={handleChange} placeholder="Tell us what interests you..." className={inputCls} />
          </Field>
        )}
        <Field label="Prayer Needs"><textarea name="prayer_needs" value={form.prayer_needs} onChange={handleChange} rows={3} placeholder="Share any prayer requests..." className={inputCls} /></Field>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="first_visit" id="first_visit" checked={form.first_visit} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="first_visit" className="text-sm text-white/70">This is my first visit to Andrews Chapel</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="follow_up" id="follow_up" checked={form.follow_up} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="follow_up" className="text-sm text-white/70">I would like someone to follow up with me</label>
        </div>
        <button type="submit" disabled={loading || !!birthdateError} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Submitting..." : "Submit Visitor Card"}
        </button>
      </form>
    </div>
  );
}
