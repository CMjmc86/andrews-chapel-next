"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

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

const placeholderReports = [
  {
    id: "1",
    display_name: "Sister Marie",
    report: "God healed my mother completely! The doctors are amazed. All glory to God!",
    is_anonymous: false,
    created_at: new Date().toISOString(),
  },
];

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

export default function PraisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    display_name: "", report: "", is_anonymous: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

  return (
    <div className="space-y-12">
      {/* Submit form */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Share a Praise Report</h2>
        <p className="text-white/60 mb-8 text-sm leading-relaxed">
          Give God the glory! Share what He has done in your life and let the congregation
          rejoice with you.
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">Praise the Lord!</h3>
            <p className="text-white/60 text-sm">
              Thank you for sharing what God has done! Your report will be posted after pastor review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full Name">
              <input name="display_name" value={form.display_name} onChange={handleChange} placeholder="Your name (leave blank to post anonymously)" className={inputCls} />
            </Field>
            <Field label="What is God doing in your life?" required>
              <textarea name="report" value={form.report} onChange={handleChange} required rows={5} placeholder="Share what God has done..." className={inputCls} />
            </Field>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="is_anonymous" id="praise_anonymous" checked={form.is_anonymous} onChange={handleChange} className="h-4 w-4 accent-[#D4AF37]" />
              <label htmlFor="praise_anonymous" className="text-sm text-white/70">Post anonymously</label>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}>
              {loading ? "Sharing..." : "Share Praise Report"}
            </button>
          </form>
        )}
      </div>

      {/* Recent praise reports */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">Recent Praise</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {placeholderReports.map((p) => (
            <div key={p.id} className="p-6" style={cardStyle}>
              <Sparkles className="h-5 w-5 text-[#D4AF37] mb-3" />
              <p className="text-white/80 mb-4 whitespace-pre-line leading-relaxed text-sm">
                {p.report}
              </p>
              <p className="text-xs text-white/40">
                — {p.is_anonymous ? "Anonymous" : p.display_name} ·{" "}
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
