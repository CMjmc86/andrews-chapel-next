"use client";

import { Video, Calendar, Clock } from "lucide-react";
import { useState } from "react";

const sermons = [
  {
    title: "Walking in the Spirit",
    date: "June 22, 2026",
    duration: "42 min",
    scripture: "Galatians 5:16–25",
    preacher: "Pastor Kathy Grace",
    youtubeId: "",
  },
  {
    title: "The Power of Prayer",
    date: "June 15, 2026",
    duration: "38 min",
    scripture: "Matthew 6:5–15",
    preacher: "Pastor Kathy Grace",
    youtubeId: "",
  },
  {
    title: "Faith That Moves Mountains",
    date: "June 8, 2026",
    duration: "45 min",
    scripture: "Matthew 17:20",
    preacher: "Pastor Kathy Grace",
    youtubeId: "",
  },
  {
    title: "Rooted in the Word",
    date: "June 1, 2026",
    duration: "40 min",
    scripture: "Psalm 1:1–3",
    preacher: "Pastor Kathy Grace",
    youtubeId: "",
  },
];

const cardDefault = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  borderTop: "1px solid rgba(212,175,55,0.15)",
  borderRight: "1px solid rgba(212,175,55,0.15)",
  borderBottom: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "1rem",
};

const cardHover = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  borderTop: "1px solid #D4AF37",
  borderRight: "1px solid #D4AF37",
  borderBottom: "1px solid #D4AF37",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "1rem",
};

function SermonCard({ s }: { s: typeof sermons[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 flex flex-col md:flex-row md:items-center gap-6 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full md:w-40 h-24 bg-[#0033A0] rounded-xl flex items-center justify-center shrink-0">
        <Video className="w-8 h-8 text-[#D4AF37]" />
      </div>
      <div className="flex-1 space-y-1">
        <h2 className="font-serif text-xl font-bold text-[#D4AF37]">{s.title}</h2>
        <p className="text-white/70 text-sm">{s.preacher}</p>
        <p className="text-white/50 text-sm italic">{s.scripture}</p>
        <div className="flex gap-4 text-xs text-white/40 pt-1">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration}</span>
        </div>
      </div>
      <div className="shrink-0">
        {s.youtubeId ? (
          <a
            href={`https://www.youtube.com/watch?v=${s.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D4AF37] text-[#000D26] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#F0C040] transition-colors"
          >
            Watch
          </a>
        ) : (
          <span className="text-white/40 text-xs border border-white/20 px-4 py-2 rounded-lg">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function SermonsPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Sermons</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Be encouraged by the Word of God. Watch recent messages from Andrews Chapel.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        {sermons.map((s) => <SermonCard key={s.title} s={s} />)}
      </section>

      <section className="text-center pb-16 px-4">
        <p className="text-white/50 mb-4">Subscribe to our YouTube channel for new sermons every week.</p>
        <a
          href="https://www.youtube.com/@AndrewsChapelAMEZion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#0033A0] border border-[#D4AF37] text-[#D4AF37] font-bold px-8 py-3 rounded-lg hover:bg-[#0047CC] transition-colors"
        >
          Visit Our YouTube Channel
        </a>
      </section>
    </main>
  );
}
