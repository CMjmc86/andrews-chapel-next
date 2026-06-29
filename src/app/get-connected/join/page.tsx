"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

const ministryOptions = [
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

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", birthdate: "",
    address: "", how_joining: "", previous_church: "", baptized: false,
    ministry_interest: "", ministry_interest_other: "", testimony: "", notes: "",
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
    const ministry_interests = form.ministry_interest === "Other"
      ? form.ministry_interest_other || "Other"
      : form.ministry_interest || null;
    const { error: sbError } = await supabase.from("join_applications").insert([{
      first_name: form.first_name, last_name: form.last_name, email: form.email,
      phone: form.phone || null, birthdate: form.birthdate || null,
      address: form.address || null, how_joining: form.how_joining || null,
      previous_church: form.previous_church || null, baptized: form.baptized,
      ministry_interests, testimony: form.testimony || null, notes: form.notes || null,
    }]);
    if (sbError) { console.error("Supabase error:", sbError); setError(sbError.message); setLoading(false); return; }
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Application Received!</h2>
        <p className="text-white/60 leading-relaxed">Thank you for your desire to join Andrews Chapel A.M.E. Zion. Pastor Kathy will contact you within 3 business days to discuss next steps. Welcome to the family!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">Begin Your Membership Journey</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">We&apos;d be honored to walk with you as part of the Andrews Chapel A.M.E. Zion family.</p>
      {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required><input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="First" className={inputCls} /></Field>
          <Field label="Last Name" required><input name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Last" className={inputCls} /></Field>
        </div>
        <Field label="Email Address" required><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputCls} /></Field>
        <Field label="Phone Number"><input name="phone" type="tel" value={form.phone} onChange={handlePhone} placeholder="(910) 555-0100" maxLength={14} className={inputCls} /></Field>
        <div>
          <Field label="Date of Birth">
            <input name="birthdate" type="date" value={form.birthdate} onChange={handleBirthdate} max={new Date().toISOString().split("T")[0]} min={`${new Date().getFullYear() - 120}-01-01`} className={inputCls} />
          </Field>
          {birthdateError && <p className="text-red-400 text-xs mt-1 ml-1">{birthdateError}</p>}
        </div>
        <Field label="Home Address"><input name="address" value={form.address} onChange={handleChange} placeholder="Street, City, State, ZIP" className={inputCls} /></Field>
        <Field label="How are you joining?">
          <select name="how_joining" value={form.how_joining} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="baptism">New believer / Baptism</option>
            <option value="transfer">Transfer of letter from previous church</option>
            <option value="restoration">Restoration (returning to church)</option>
            <option value="statement">Statement of faith</option>
          </select>
        </Field>
        <Field label="Previous Church (if any)"><input name="previous_church" value={form.previous_church} onChange={handleChange} placeholder="Name of church" className={inputCls} /></Field>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="baptized" id="baptized" checked={form.baptized} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="baptized" className="text-sm text-white/70">I have been baptized</label>
        </div>
        <Field label="Where would you like to serve?">
          <select name="ministry_interest" value={form.ministry_interest} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            {ministryOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </Field>
        {form.ministry_interest === "Other" && (
          <Field label="Please describe where you'd like to serve">
            <input name="ministry_interest_other" value={form.ministry_interest_other} onChange={handleChange} placeholder="Tell us how you'd like to get involved..." className={inputCls} />
          </Field>
        )}
        <Field label="Briefly share your faith story"><textarea name="testimony" value={form.testimony} onChange={handleChange} rows={4} placeholder="Tell us a little about your journey with God..." className={inputCls} /></Field>
        <Field label="Additional notes or questions"><textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Anything you'd like Pastor Kathy to know..." className={inputCls} /></Field>
        <button type="submit" disabled={loading || !!birthdateError} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
