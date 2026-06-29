"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  borderTop: "1px solid rgba(212,175,55,0.15)",
  borderRight: "1px solid rgba(212,175,55,0.15)",
  borderBottom: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

type PrayerRequest = {
  id: string;
  display_name: string | null;
  request: string;
  category: string | null;
  is_anonymous: boolean;
  created_at: string;
};

export default function PrayerWallPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      const { data, error: sbError } = await supabase
        .from("prayer_requests")
        .select("id, display_name, request, category, is_anonymous, created_at")
        .eq("approved", true)
        .eq("is_private", false)
        .order("created_at", { ascending: false });

      if (sbError) {
        console.error("Supabase error:", sbError);
        setError("Could not load prayer requests.");
      } else {
        setRequests(data || []);
      }
      setLoading(false);
    }
    fetchRequests();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-white/50 text-sm">
          {loading ? "Loading..." : `${requests.length} request${requests.length !== 1 ? "s" : ""} on the wall`}
        </p>
        <Link
          href="/prayer-wall/submit"
          className="px-4 py-2 text-xs font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
        >
          Submit a Request
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm mb-6 p-3 rounded-lg bg-red-400/10 border border-red-400/30">{error}</p>}

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 animate-pulse" style={cardStyle}>
              <div className="h-4 bg-white/10 rounded mb-3 w-1/4" />
              <div className="h-3 bg-white/10 rounded mb-2" />
              <div className="h-3 bg-white/10 rounded mb-2 w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <p className="text-white/50 text-sm">No prayer requests yet. Be the first to share.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {requests.map((r) => (
            <div key={r.id} className="p-6" style={cardStyle}>
              <div className="flex items-start justify-between mb-3">
                <Heart className="h-5 w-5 text-[#D4AF37] shrink-0" />
                {r.category && (
                  <span
                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)" }}
                  >
                    {r.category.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              <p className="text-white/80 leading-relaxed mb-4 whitespace-pre-line text-sm">
                {r.request}
              </p>
              <p className="text-xs text-white/40">
                — {r.is_anonymous || !r.display_name ? "Anonymous" : r.display_name} ·{" "}
                {new Date(r.created_at).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-white/30 text-xs mt-8">
        Prayer requests are reviewed by Pastor Kathy before appearing on the wall.
      </p>
    </div>
  );
}
