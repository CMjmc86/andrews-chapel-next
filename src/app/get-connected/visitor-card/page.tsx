"use client";

import { useState } from "react";

export default function VisitorCardPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    how_did_you_hear: "",
    first_visit: false,
    prayer_needs: "",
    interests: "",
    follow_up: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Welcome to the Family!</h2>
        <p className="text-white/60 leading-relaxed">
          Thank you for filling out a visitor card. Pastor Kathy and our team will be in touch soon.
          We are so glad you are here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">New Visitor Card</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">
        First time with us? Fill this out and we&apos;ll make sure to welcome you personally.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full Name" required>
          <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="e.g. Kathy Grace" className={inputCls} />
        </Field>
        <Field label="Email Address">
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} />
        </Field>
        <Field label="Phone Number">
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(910) 555-0100" className={inputCls} />
        </Field>
        <Field label="Home Address">
          <input name="address" value={form.address} onChange={handleChange} placeholder="Street, City, State, ZIP" className={inputCls} />
        </Field>
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
        <Field label="Interests">
          <textarea name="interests" value={form.interests} onChange={handleChange} rows={3} placeholder="e.g. Youth Ministry, Choir, Community Outreach..." className={inputCls} />
        </Field>
        <Field label="Prayer Needs">
          <textarea name="prayer_needs" value={form.prayer_needs} onChange={handleChange} rows={3} placeholder="Share any prayer requests..." className={inputCls} />
        </Field>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="first_visit" id="first_visit" checked={form.first_visit} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="first_visit" className="text-sm text-white/70">This is my first visit to Andrews Chapel</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="follow_up" id="follow_up" checked={form.follow_up} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="follow_up" className="text-sm text-white/70">I would like someone to follow up with me</label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Submitting..." : "Submit Visitor Card"}
        </button>
      </form>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all";

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
