"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
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

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  borderTop: "1px solid rgba(212,175,55,0.15)",
  borderRight: "1px solid rgba(212,175,55,0.15)",
  borderBottom: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

type PraiseReport = {
  id: string;
  display_name: string | null;
  report: string;
  is_anonymous: boolean;
  created_at: string;
};

export default function PraisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reports, setReports] = useState<PraiseReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [form, setForm] = useState({
    display_name: "", report: "", is_anonymous: false,
  });

  useEffect(() => {
    async function fetchReports() {
      const { data, error: sbError } = await supabase
        .from("praise_reports")
        .select("id, display_name, report, is_anonymous, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (!sbError) setReports(data || []);
      setReportsLoading(false);
    }
    fetchReports();
  }, [submitted]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: sbError } = await supabase.from("praise_reports").insert([{
      display_name: form.is_anonymous ? null : (form.display_name || null),
      report: form.report,
      is_anonymous: form.is_anonymous,
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
            {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}
            <Field label="Your Name">
              <input name="display_name" value={form.display_name} onChange={handleChange} placeholder="Leave blank to post anonymously" className={inputCls} />
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
        {reportsLoading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 animate-pulse" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded mb-3 w-1/4" />
                <div className="h-3 bg-white/10 rounded mb-2" />
                <div className="h-3 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <p className="text-white/50 text-sm">No praise reports yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {reports.map((p) => (
              <div key={p.id} className="p-6" style={cardStyle}>
                <Sparkles className="h-5 w-5 text-[#D4AF37] mb-3" />
                <p className="text-white/80 mb-4 whitespace-pre-line leading-relaxed text-sm">
                  {p.report}
                </p>
                <p className="text-xs text-white/40">
                  — {p.is_anonymous || !p.display_name ? "Anonymous" : p.display_name} ·{" "}
                  {new Date(p.created_at).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
