"use client";

import Link from "next/link";
import { Video, Radio, Images, Download, Music } from "lucide-react";
import { useState } from "react";

const sections = [
  {
    href: "/media/sermons",
    icon: Video,
    title: "Sermons",
    description: "Watch or listen to recent messages from Pastor Kathy Grace and guest ministers.",
  },
  {
    href: "/media/worship-music",
    icon: Music,
    title: "Worship Music",
    description: "Praise and worship music from Andrews Chapel's music ministry.",
  },
  {
    href: "/media/live-stream",
    icon: Radio,
    title: "Live Stream",
    description: "Join us live every Sunday at 10:00 AM and Friday Hour of Prayer at 6:00 PM.",
  },
  {
    href: "/media/gallery",
    icon: Images,
    title: "Photo Gallery",
    description: "Photos from worship services, community events, and church milestones.",
  },
  {
    href: "/media/downloads",
    icon: Download,
    title: "Downloads",
    description: "Download bulletins, ministry resources, and church documents.",
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

function MediaCard({ href, icon: Icon, title, description }: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      style={hovered ? cardHover : cardDefault}
      className="p-8 flex flex-col gap-4 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
        style={{ background: hovered ? "#D4AF37" : "#0033A0" }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">{title}</h2>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      <span className="text-[#D4AF37] text-sm font-semibold mt-auto">
        View {title} →
      </span>
    </Link>
  );
}

export default function MediaPage() {
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
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
            Media
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Media &amp; Resources
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Sermons, live worship, photos, and downloadable resources — all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {sections.map((s) => (
          <MediaCard key={s.href} {...s} />
        ))}
      </section>
    </main>
  );
}
