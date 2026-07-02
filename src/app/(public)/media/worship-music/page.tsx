"use client";

import { Music, Mic2, Piano, Users } from "lucide-react";
import { useState } from "react";

const YOUTUBE_PLAYLIST_ID = "PLxxxxxxxxxxxxxxxx";

const musicians = [
  {
    name: "Minister of Music",
    role: "Music Director",
    description: "Leads the congregation in worship through song and coordinates all musical ministries at Andrews Chapel.",
    icon: Music,
  },
  {
    name: "Praise & Worship Team",
    role: "Lead Vocalists",
    description: "Our gifted vocalists usher the congregation into the presence of God each Sunday morning.",
    icon: Mic2,
  },
  {
    name: "Sanctuary Choir",
    role: "Choral Ministry",
    description: "The Sanctuary Choir brings rich harmonies and traditional hymns rooted in the A.M.E. Zion tradition.",
    icon: Users,
  },
  {
    name: "Musicians",
    role: "Instrumental Ministry",
    description: "Our talented instrumentalists provide the musical foundation for worship, rehearsals, and special events.",
    icon: Piano,
  },
];

const genres = ["Traditional Hymns", "Gospel", "Contemporary Worship", "Spirituals", "Inspirational"];

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

function MusicianCard({ name, role, description, icon: Icon }: {
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 flex gap-5 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
        style={{ background: hovered ? "#D4AF37" : "#0033A0" }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-serif text-lg font-bold text-[#D4AF37]">{name}</h3>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{role}</p>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function WorshipMusicPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Worship Music</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom,
            singing psalms and hymns and spiritual songs. — Colossians 3:16
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pt-12 flex flex-wrap gap-3 justify-center">
        {genres.map((g) => (
          <span key={g} className="border border-[#0047CC] text-white/60 px-4 py-2 rounded-full text-sm">
            {g}
          </span>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <div
          className="overflow-hidden aspect-video"
          style={{
            background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
            borderTop: "1px solid rgba(212,175,55,0.15)",
            borderRight: "1px solid rgba(212,175,55,0.15)",
            borderBottom: "1px solid rgba(212,175,55,0.15)",
            borderLeft: "4px solid #D4AF37",
            borderRadius: "1rem",
          }}
        >
          {YOUTUBE_PLAYLIST_ID === "PLxxxxxxxxxxxxxxxx" ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
              <Music className="w-16 h-16 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">Worship Playlist Coming Soon</h2>
              <p className="text-white/50 max-w-sm">
                Our worship music playlist will appear here. Subscribe to our YouTube channel to stay connected.
              </p>
              <a
                href="https://www.youtube.com/@AndrewsChapelAMEZion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#D4AF37] text-[#000D26] font-bold px-6 py-3 rounded-lg hover:bg-[#F0C040] transition-colors"
              >
                Subscribe on YouTube
              </a>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}&autoplay=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Andrews Chapel Worship Music"
            />
          )}
        </div>
        <p className="text-white/30 text-xs text-center mt-3">New worship music added weekly. Subscribe to get notified.</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">Our Team</div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Music Ministry</h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
            Our dedicated musicians and vocalists serve faithfully to create an atmosphere of worship
            that glorifies God and edifies the body of Christ.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {musicians.map((m) => <MusicianCard key={m.name} {...m} />)}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "radial-gradient(ellipse at center, #001A5C 0%, #000D26 100%)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <Music className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-white mb-3">Join the Music Ministry</h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Do you have a gift for music or singing? We welcome all who want to use their talents
            to glorify God. Reach out to learn about our rehearsal schedule.
          </p>
          <a
            href="mailto:contact@andrewschapelame.org"
            className="inline-block bg-[#D4AF37] text-[#000D26] font-bold px-8 py-3 rounded-lg hover:bg-[#F0C040] transition-colors"
          >
            Contact Us to Get Involved
          </a>
        </div>
      </section>
    </main>
  );
}
