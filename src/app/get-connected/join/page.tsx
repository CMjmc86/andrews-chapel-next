"use client";

import { useState } from "react";

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

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", birthdate: "", address: "",
    how_joining: "", previous_church: "", baptized: false,
    ministry_interests: "", testimony: "", notes: "",
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
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Application Received!</h2>
        <p className="text-white/60 leading-relaxed">
          Thank you for your desire to join Andrews Chapel A.M.E. Zion. Pastor Kathy will contact
          you within 3 business days to discuss next steps. Welcome to the family!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">Begin Your Membership Journey</h2>
      <p className="text-white/60 mb-8 text-sm leading-relaxed">
        We&apos;d be honored to walk with you as part of the Andrews Chapel A.M.E. Zion family.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full Name" required>
          <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="e.g. Kathy Grace" className={inputCls} />
        </Field>
        <Field label="Email Address" required>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputCls} />
        </Field>
        <Field label="Phone Number">
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(910) 555-0100" className={inputCls} />
        </Field>
        <Field label="Date of Birth">
          <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} className={inputCls} />
        </Field>
        <Field label="Home Address">
          <input name="address" value={form.address} onChange={handleChange} placeholder="Street, City, State, ZIP" className={inputCls} />
        </Field>
        <Field label="How are you joining?">
          <select name="how_joining" value={form.how_joining} onChange={handleChange} className={inputCls}>
            <option value="">Select one...</option>
            <option value="baptism">New believer / Baptism</option>
            <option value="transfer">Transfer of letter from previous church</option>
            <option value="restoration">Restoration (returning to church)</option>
            <option value="statement">Statement of faith</option>
          </select>
        </Field>
        <Field label="Previous Church (if any)">
          <input name="previous_church" value={form.previous_church} onChange={handleChange} placeholder="Name of church" className={inputCls} />
        </Field>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="baptized" id="baptized" checked={form.baptized} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
          <label htmlFor="baptized" className="text-sm text-white/70">I have been baptized</label>
        </div>
        <Field label="Where would you like to serve?">
          <textarea name="ministry_interests" value={form.ministry_interests} onChange={handleChange} rows={3} placeholder="e.g. Worship Team, Youth Ministry, Community Outreach..." className={inputCls} />
        </Field>
        <Field label="Briefly share your faith story">
          <textarea name="testimony" value={form.testimony} onChange={handleChange} rows={4} placeholder="Tell us a little about your journey with God..." className={inputCls} />
        </Field>
        <Field label="Additional notes or questions">
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Anything you'd like Pastor Kathy to know..." className={inputCls} />
        </Field>
        <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
