"use client";

import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

const specialServices = [
  {
    title: "Homecoming Sunday",
    date: "TBA",
    time: "10:00 AM",
    description: "Our annual Homecoming celebration — a beloved tradition welcoming former members, friends, and family back to Andrews Chapel for a day of worship and fellowship.",
  },
  {
    title: "Church Anniversary",
    date: "TBA",
    time: "10:00 AM",
    description: "Celebrating the founding of Andrews Chapel A.M.E. Zion Church with a special worship service honoring our history and looking to our future.",
  },
  {
    title: "Revival Services",
    date: "TBA",
    time: "7:00 PM",
    description: "Annual revival with guest evangelist. Multiple nights of powerful preaching, worship, and spiritual renewal. All are welcome.",
  },
  {
    title: "Pastor's Anniversary",
    date: "TBA",
    time: "10:00 AM",
    description: "Honoring Pastor Kathy Grace with a special service celebrating her leadership and ministry at Andrews Chapel.",
  },
  {
    title: "Christmas Concert",
    date: "December 2026",
    time: "6:00 PM",
    description: "An evening of Christmas music, carols, and celebration featuring the Sanctuary Choir, Praise Team, and Youth Choir.",
  },
  {
    title: "Good Friday Service",
    date: "April 2027",
    time: "12:00 PM",
    description: "A solemn service of reflection and worship commemorating the crucifixion of Jesus Christ.",
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

function SpecialCard({ e }: { e: typeof specialServices[0] }) {
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
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-xl font-bold text-white mb-1">{e.title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#D4AF37]" />{e.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#D4AF37]" />{e.time}</span>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{e.description}</p>
        <p className="text-white/40 text-xs flex items-center gap-1 mt-3">
          <MapPin className="w-3 h-3" />Andrews Chapel A.M.E. Zion Church
        </p>
      </div>
    </div>
  );
}

export default function SpecialServicesPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Special Services</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Celebrate the milestones and sacred seasons of the church year with Andrews Chapel.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        {specialServices.map((e) => <SpecialCard key={e.title} e={e} />)}
      </section>

      <section className="text-center pb-16 px-4">
        <p className="text-white/30 text-sm">
          Dates marked TBA will be announced soon. Check the{" "}
          <a href="/bulletin" className="text-[#D4AF37] hover:underline">bulletin</a>{" "}
          for the latest updates.
        </p>
      </section>
    </main>
  );
}
