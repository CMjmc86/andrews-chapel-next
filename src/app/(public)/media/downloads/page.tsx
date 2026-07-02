"use client";

import { Download, FileText, BookOpen, Music } from "lucide-react";
import { useState } from "react";

const downloads = [
  {
    category: "Bulletins",
    icon: FileText,
    items: [
      { name: "Sunday Bulletin — June 22, 2026", file: "#" },
      { name: "Sunday Bulletin — June 15, 2026", file: "#" },
      { name: "Sunday Bulletin — June 8, 2026", file: "#" },
    ],
  },
  {
    category: "Ministry Resources",
    icon: BookOpen,
    items: [
      { name: "New Member Handbook", file: "#" },
      { name: "Bible Study Guide — Summer 2026", file: "#" },
      { name: "Youth Ministry Curriculum", file: "#" },
    ],
  },
  {
    category: "Music & Worship",
    icon: Music,
    items: [
      { name: "Hymn of the Month — June 2026", file: "#" },
      { name: "Choir Rehearsal Schedule", file: "#" },
    ],
  },
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

function DownloadItem({ item }: { item: { name: string; file: string } }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={item.file}
      style={hovered ? cardHover : cardDefault}
      className="flex items-center justify-between px-5 py-4 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-sm transition-colors" style={{ color: hovered ? "white" : "rgba(255,255,255,0.7)" }}>
        {item.name}
      </span>
      <Download className="w-4 h-4 text-[#D4AF37] shrink-0 ml-4" />
    </a>
  );
}

export default function DownloadsPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Downloads</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Bulletins, ministry guides, and church documents available to download.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        {downloads.map(({ category, icon: Icon, items }) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-5">
              <Icon className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">{category}</h2>
            </div>
            <div className="space-y-3">
              {items.map((item) => <DownloadItem key={item.name} item={item} />)}
            </div>
          </div>
        ))}
      </section>

      <section className="text-center pb-16 px-4">
        <p className="text-white/40 text-sm">
          Need a document not listed here? Email us at{" "}
          <a href="mailto:contact@andrewschapelame.org" className="text-[#D4AF37] hover:underline">
            contact@andrewschapelame.org
          </a>
        </p>
      </section>
    </main>
  );
}
