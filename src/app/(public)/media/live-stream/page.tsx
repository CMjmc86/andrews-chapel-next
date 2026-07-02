"use client";

import { Radio, Calendar, Clock } from "lucide-react";
import { useState } from "react";

const schedule = [
  { day: "Sunday", service: "Morning Worship", time: "10:00 AM" },
  { day: "Thursday", service: "Bible Study", time: "7:00 PM" },
  { day: "Friday", service: "Hour of Prayer", time: "6:00 PM" },
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

function ScheduleCard({ item }: { item: typeof schedule[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? cardHover : cardDefault}
      className="p-6 text-center transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Calendar className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
      <h3 className="font-serif text-lg font-bold text-white">{item.day}</h3>
      <p className="text-white/60 text-sm mt-1">{item.service}</p>
      <p className="text-[#D4AF37] font-semibold mt-2 flex items-center justify-center gap-1">
        <Clock className="w-4 h-4" />{item.time}
      </p>
    </div>
  );
}

export default function LiveStreamPage() {
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
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Live Stream</h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Join us for worship from anywhere in the world.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="overflow-hidden aspect-video flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderLeft: "4px solid #D4AF37",
            borderRadius: "1rem",
          }}
        >
          <div className="text-center space-y-4 p-8">
            <Radio className="w-16 h-16 text-[#D4AF37] mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">Stream Coming Soon</h2>
            <p className="text-white/60 max-w-sm mx-auto">
              Our live stream will appear here. Subscribe to our YouTube channel to get notified when we go live.
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
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="font-serif text-2xl font-bold text-[#D4AF37] text-center mb-8">Worship Schedule</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {schedule.map((item) => <ScheduleCard key={item.day} item={item} />)}
        </div>
      </section>
    </main>
  );
}
