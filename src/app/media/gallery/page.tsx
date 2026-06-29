"use client";

import { Images } from "lucide-react";
import { useState } from "react";

const categories = [
  "All",
  "Sunday Worship",
  "Community Outreach",
  "Youth Ministry",
  "Special Events",
  "Church Anniversaries",
  "Baptisms & Confirmations",
];

const cardDefault = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  borderTop: "1px solid rgba(212,175,55,0.15)",
  borderRight: "1px solid rgba(212,175,55,0.15)",
  borderBottom: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

const cardHover = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  borderTop: "1px solid #D4AF37",
  borderRight: "1px solid #D4AF37",
  borderBottom: "1px solid #D4AF37",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

function PhotoCard({ i }: { i: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="aspect-square flex items-center justify-center cursor-pointer transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Images className="w-8 h-8 text-[#0047CC]" />
    </div>
  );
}

export default function GalleryPage() {
  const [active, setActive] = useState("All");

  return (
    <main className="min-h-screen bg-[#000D26] text-white">
      <section
        className="py-16 text-center"
        style={{
          background: "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">Media</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Celebrating life, faith, and community at Andrews Chapel.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-4 py-2 rounded-full text-sm transition-colors"
              style={{
                border: active === cat ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.3)",
                color: active === cat ? "#D4AF37" : "rgba(255,255,255,0.6)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <PhotoCard key={i} />)}
        </div>

        <p className="text-center text-white/30 text-sm mt-10">
          Photos will be uploaded here. Contact the church office to submit photos at{" "}
          <a href="mailto:contact@andrewschapelame.org" className="text-[#D4AF37] hover:underline">
            contact@andrewschapelame.org
          </a>
        </p>
      </section>
    </main>
  );
}
