"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Bulletin = {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

export default function BulletinPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBulletins() {
      const { data } = await supabase
        .from("bulletins")
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false });
      setBulletins((data as Bulletin[]) || []);
      setLoading(false);
    }
    fetchBulletins();
  }, []);

  const latest = bulletins[0];
  const older = bulletins.slice(1);

  return (
    <>
      {/* Page Hero */}
      <section
        className="py-16 text-center"
        style={{
          background: "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
            From Pastor Kathy
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Church Bulletin
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Weekly announcements, devotionals, and updates from Pastor Kathy Grace
            and the Andrews Chapel family.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="p-8 rounded-xl animate-pulse" style={cardStyle}>
                  <div className="h-3 bg-white/10 rounded mb-4 w-1/4" />
                  <div className="h-5 bg-white/10 rounded mb-4 w-2/3" />
                  <div className="h-3 bg-white/10 rounded mb-2" />
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : bulletins.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No bulletin available at this time. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Latest bulletin */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                  <h2 className="font-serif text-xl font-bold text-white">Latest Bulletin</h2>
                </div>
                <div className="p-8 rounded-xl" style={{
                  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                    {latest.published_at && new Date(latest.published_at).toLocaleDateString("en-US", {
                      weekday: "long", month: "long", day: "numeric", year: "numeric",
                    })}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-6">
                    {latest.title}
                  </h3>
                  <div
                    className="text-white/70 text-sm leading-relaxed bulletin-content"
                    dangerouslySetInnerHTML={{ __html: latest.content }}
                  />
                </div>
              </div>

              {/* Older active bulletins */}
              {older.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-bold text-white mb-5">More Bulletins</h2>
                  <div className="space-y-4">
                    {older.map((b) => (
                      <div key={b.id} className="p-6 rounded-lg" style={cardStyle}>
                        <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                          <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {b.published_at && new Date(b.published_at).toLocaleDateString("en-US", {
                            month: "long", day: "numeric", year: "numeric",
                          })}
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-white mb-3">
                          {b.title}
                        </h3>
                        <div
                          className="text-white/60 text-sm leading-relaxed line-clamp-3 bulletin-content"
                          dangerouslySetInnerHTML={{ __html: b.content }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm mb-4">
              Want to receive the bulletin by email each week?
            </p>
            <Link
              href="/get-connected/visitor-card"
              className="inline-block px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              Fill Out a Visitor Card
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
