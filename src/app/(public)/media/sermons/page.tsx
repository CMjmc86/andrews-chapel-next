"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Calendar, BookOpen, Music, Play, Pause } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Sermon = {
  id: string;
  title: string;
  pastor: string;
  sermon_date: string;
  youtube_id: string | null;
  audio_url: string | null;
  facebook_url: string | null;
  scripture: string | null;
  series: string | null;
  description: string | null;
  is_published: boolean;
};

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

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  }

  return (
    <div className="flex items-center gap-3 mt-3 p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}>
      <audio ref={audioRef} src={url} onEnded={() => setPlaying(false)} />
      <button onClick={togglePlay} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.4)" }}>
        {playing ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Listen</>}
      </button>
      <p className="text-white/40 text-xs">Audio sermon</p>
    </div>
  );
}

function SermonCard({ sermon }: { sermon: Sermon }) {
  const [hovered, setHovered] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Thumbnail */}
        <div className="w-full md:w-40 h-24 rounded-xl overflow-hidden shrink-0 bg-[#0033A0] flex items-center justify-center">
          {sermon.youtube_id ? (
            <img src={`https://img.youtube.com/vi/${sermon.youtube_id}/mqdefault.jpg`} alt={sermon.title} className="w-full h-full object-cover" />
          ) : (
            <Music className="w-8 h-8 text-[#D4AF37]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1">
          {sermon.series && <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]">{sermon.series}</p>}
          <h2 className="font-serif text-xl font-bold text-[#D4AF37]">{sermon.title}</h2>
          <p className="text-white/70 text-sm">{sermon.pastor}</p>
          {sermon.scripture && (
            <p className="text-white/50 text-sm italic flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {sermon.scripture}
            </p>
          )}
          <div className="flex gap-4 text-xs text-white/40 pt-1">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(sermon.sermon_date)}</span>
          </div>
          {sermon.description && <p className="text-white/50 text-xs mt-1 line-clamp-2">{sermon.description}</p>}
          {showAudio && sermon.audio_url && <AudioPlayer url={sermon.audio_url} />}
        </div>

        {/* Action buttons */}
        <div className="shrink-0 flex flex-col gap-2">
          {sermon.youtube_id && (
            <a href={`https://www.youtube.com/watch?v=${sermon.youtube_id}`} target="_blank" rel="noopener noreferrer"
              className="bg-[#D4AF37] text-[#000D26] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#F0C040] transition-colors text-center flex items-center gap-2">
              <Video className="w-4 h-4" /> Watch
            </a>
          )}
          {sermon.facebook_url && (
            <a href={sermon.facebook_url} target="_blank" rel="noopener noreferrer"
              className="font-bold px-5 py-2 rounded-lg text-sm transition-colors text-center flex items-center gap-2"
              style={{ background: "rgba(59,89,152,0.3)", color: "#8b9dc3", border: "1px solid rgba(59,89,152,0.5)" }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          )}
          {sermon.audio_url && (
            <button onClick={() => setShowAudio(!showAudio)}
              className="font-bold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.4)" }}>
              <Music className="w-4 h-4" /> {showAudio ? "Hide Audio" : "Listen"}
            </button>
          )}
          {!sermon.youtube_id && !sermon.facebook_url && !sermon.audio_url && (
            <span className="text-white/40 text-xs border border-white/20 px-4 py-2 rounded-lg text-center">Coming Soon</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SermonSkeleton() {
  return (
    <div className="p-6 flex gap-6 animate-pulse rounded-2xl" style={cardDefault}>
      <div className="w-40 h-24 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/4" />
        <div className="h-5 bg-white/10 rounded w-2/3" />
        <div className="h-3 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      const { data } = await supabase
        .from("sermons")
        .select("*")
        .eq("is_published", true)
        .order("sermon_date", { ascending: false });
      setSermons((data as Sermon[]) || []);
      setLoading(false);
    }
    fetchSermons();
  }, []);

  return (
    <main className="min-h-screen bg-[#000D26] text-white">
      <section className="py-16 text-center"
        style={{ background: "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">Media</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Sermons</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Be encouraged by the Word of God. Watch or listen to recent messages from Andrews Chapel.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        {loading ? (
          <><SermonSkeleton /><SermonSkeleton /><SermonSkeleton /></>
        ) : sermons.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No sermons available yet. Check back soon!</p>
          </div>
        ) : (
          sermons.map((sermon) => <SermonCard key={sermon.id} sermon={sermon} />)
        )}
      </section>

      <section className="text-center pb-16 px-4">
        <p className="text-white/50 mb-4">Subscribe to our YouTube channel for new sermons every week.</p>
        <a href="https://www.youtube.com/@AndrewsChapelAMEZion" target="_blank" rel="noopener noreferrer"
          className="inline-block bg-[#D4AF37] text-[#000D26] font-bold px-8 py-3 rounded-lg hover:bg-[#F0C040] transition-colors">
          Visit Our YouTube Channel
        </a>
      </section>
    </main>
  );
}
