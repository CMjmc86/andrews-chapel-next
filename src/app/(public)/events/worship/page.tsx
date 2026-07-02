"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { useState } from "react";

const services = [
  {
    day: "Sunday",
    title: "Morning Worship",
    time: "10:00 AM",
    description: "Spirit-filled worship, prayer, and the preached Word. All are welcome to join us every Sunday morning.",
    category: "worship",
  },
  {
    day: "Thursday",
    title: "Bible Study",
    time: "7:00 PM",
    description: "Midweek Bible study with Pastor Kathy Grace. Come ready to dig into the Word and grow in your faith.",
    category: "study",
  },
  {
    day: "Friday",
    title: "Hour of Prayer",
    time: "6:00 PM",
    description: "A dedicated hour of corporate prayer. Bring your requests and join us in seeking God together.",
    category: "prayer",
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

function ServiceCard({ s }: { s: typeof services[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 flex gap-5 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-14 h-14 rounded-xl bg-[#0033A0] flex items-center justify-center shrink-0">
        <Calendar className="w-6 h-6 text-[#D4AF37]" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] mb-1">{s.day}</div>
        <h3 className="font-serif text-xl font-bold text-white mb-1">{s.title}</h3>
        <p className="text-[#D4AF37] font-semibold flex items-center gap-1 mb-3 text-sm">
          <Clock className="w-4 h-4" />{s.time}
        </p>
        <p className="text-white/60 text-sm leading-relaxed">{s.description}</p>
        <p className="text-white/40 text-xs flex items-center gap-1 mt-3">
          <MapPin className="w-3 h-3" />Andrews Chapel A.M.E. Zion Church · 3009 McLean Chapel Church Rd, Bunnlevel, NC
        </p>
      </div>
    </div>
  );
}

export default function WorshipServicesPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Worship Services</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Join us for weekly worship, study, and prayer at Andrews Chapel A.M.E. Zion Church.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        {services.map((s) => <ServiceCard key={s.day} s={s} />)}
      </section>

      <section className="text-center pb-16 px-4">
        <p className="text-white/40 text-sm">
          3009 McLean Chapel Church Rd, Bunnlevel, NC 28323 ·{" "}
          <a href="tel:+19105551234" className="text-[#D4AF37] hover:underline">
            (910) 555-1234
          </a>
        </p>
      </section>
    </main>
  );
}
