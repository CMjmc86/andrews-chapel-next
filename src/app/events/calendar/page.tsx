"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const allEvents = [
  // Weekly recurring
  { title: "Sunday Morning Worship", day: "Every Sunday", time: "10:00 AM", category: "worship", description: "Spirit-filled worship, prayer, and the Word of God." },
  { title: "Thursday Bible Study", day: "Every Thursday", time: "7:00 PM", category: "study", description: "Midweek Bible study with Pastor Kathy Grace." },
  { title: "Friday Hour of Prayer", day: "Every Friday", time: "6:00 PM", category: "prayer", description: "Corporate prayer. Bring your requests." },
  { title: "Youth Bible Study", day: "Every Sunday", time: "9:00 AM", category: "youth", description: "Age-appropriate Bible study for teens ages 13–17." },
  { title: "Children's Church", day: "Every Sunday", time: "10:00 AM", category: "youth", description: "Engaging worship experience for children ages 4–12." },
  { title: "Youth Choir Rehearsal", day: "Every Saturday", time: "10:00 AM", category: "youth", description: "Youth choir rehearsal for Sunday morning worship." },
  // Special
  { title: "Homecoming Sunday", day: "TBA", time: "10:00 AM", category: "special", description: "Annual Homecoming celebration welcoming former members and friends." },
  { title: "Church Anniversary", day: "TBA", time: "10:00 AM", category: "special", description: "Celebrating the founding of Andrews Chapel A.M.E. Zion Church." },
  { title: "Revival Services", day: "TBA", time: "7:00 PM", category: "special", description: "Annual revival with guest evangelist. Multiple nights of worship." },
  { title: "Christmas Concert", day: "December 2026", time: "6:00 PM", category: "special", description: "Evening of Christmas music featuring all choirs and worship teams." },
  { title: "Good Friday Service", day: "April 2027", time: "12:00 PM", category: "special", description: "Solemn service commemorating the crucifixion of Jesus Christ." },
];

const categoryColors: Record<string, string> = {
  worship: "#0047CC",
  study: "#B8860B",
  prayer: "#0033A0",
  youth: "#1A5FE0",
  special: "#D4AF37",
};

const categoryLabels: Record<string, string> = {
  worship: "Worship",
  study: "Bible Study",
  prayer: "Prayer",
  youth: "Youth",
  special: "Special",
};

const filters = ["All", "Worship", "Bible Study", "Prayer", "Youth", "Special"];

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

function EventCard({ e }: { e: typeof allEvents[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 flex gap-4 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: categoryColors[e.category] ?? "#0033A0" }}
      >
        <Calendar className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-serif text-lg font-bold text-white">{e.title}</h3>
          <span
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: `${categoryColors[e.category]}33`, color: categoryColors[e.category] }}
          >
            {categoryLabels[e.category]}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-2">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#D4AF37]" />{e.day} · {e.time}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#D4AF37]" />Andrews Chapel</span>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{e.description}</p>
      </div>
    </div>
  );
}

export default function FullCalendarPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? allEvents
    : allEvents.filter((e) => categoryLabels[e.category] === active);

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
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">Events</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Full Calendar</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Every service, study, and special event at Andrews Chapel — all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-4 py-2 rounded-full text-sm transition-colors"
              style={{
                border: active === f ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.3)",
                color: active === f ? "#D4AF37" : "rgba(255,255,255,0.6)",
                background: active === f ? "rgba(212,175,55,0.1)" : "transparent",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((e) => <EventCard key={e.title} e={e} />)}
        </div>

        <p className="text-center text-white/30 text-xs mt-10">
          Check the{" "}
          <Link href="/bulletin" className="text-[#D4AF37] hover:underline">bulletin</Link>
          {" "}for the latest announcements and event updates.
        </p>
      </section>
    </main>
  );
}
