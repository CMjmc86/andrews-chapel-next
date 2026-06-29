"use client";

import { Star, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

const youthEvents = [
  {
    title: "Youth Bible Study",
    day: "Sunday",
    time: "9:00 AM",
    ageGroup: "Ages 13–17",
    description: "Youth gather before morning worship for age-appropriate Bible study, discussion, and prayer.",
  },
  {
    title: "Youth Fellowship Night",
    day: "Friday",
    time: "6:00 PM",
    ageGroup: "Ages 13–17",
    description: "Fun, faith, and friendship. Youth come together for games, worship, and devotional time.",
  },
  {
    title: "Children's Church",
    day: "Sunday",
    time: "10:00 AM",
    ageGroup: "Ages 4–12",
    description: "While adults worship, children experience an engaging, age-appropriate worship experience of their own.",
  },
  {
    title: "Youth Choir Rehearsal",
    day: "Saturday",
    time: "10:00 AM",
    ageGroup: "Ages 8–17",
    description: "Youth choir rehearsal for Sunday morning worship. New members always welcome.",
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

function YouthCard({ e }: { e: typeof youthEvents[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 flex gap-5 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors"
        style={{ background: hovered ? "#D4AF37" : "#0033A0" }}
      >
        <Star className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] mb-1">{e.day}</div>
        <h3 className="font-serif text-xl font-bold text-white mb-1">{e.title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#D4AF37]" />{e.time}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#D4AF37]" />{e.ageGroup}</span>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{e.description}</p>
        <p className="text-white/40 text-xs flex items-center gap-1 mt-3">
          <MapPin className="w-3 h-3" />Andrews Chapel A.M.E. Zion Church
        </p>
      </div>
    </div>
  );
}

export default function YouthEventsPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Youth Events</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Empowering the next generation through faith, fellowship, and fun at Andrews Chapel.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        {youthEvents.map((e) => <YouthCard key={e.title} e={e} />)}
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "radial-gradient(ellipse at center, #001A5C 0%, #000D26 100%)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <h3 className="font-serif text-2xl font-bold text-white mb-3">Get Your Youth Involved</h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Contact us to learn more about youth ministry opportunities at Andrews Chapel.
          </p>
          <a
            href="mailto:contact@andrewschapelame.org"
            className="inline-block bg-[#D4AF37] text-[#000D26] font-bold px-8 py-3 rounded-lg hover:bg-[#F0C040] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
