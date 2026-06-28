import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";

// Placeholder events — will be replaced with Supabase data later
const placeholderEvents = [
  {
    id: "1",
    title: "Sunday Morning Worship",
    starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Andrews Chapel A.M.E. Zion Church",
    description: "Join us every Sunday for Spirit-filled worship, prayer, and the Word of God. All are welcome.",
    category: "worship",
  },
  {
    id: "2",
    title: "Thursday Bible Study",
    starts_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Andrews Chapel A.M.E. Zion Church",
    description: "Midweek Bible study with Pastor Kathy Grace. Come ready to dig into the Word.",
    category: "study",
  },
  {
    id: "3",
    title: "Friday Hour of Prayer",
    starts_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Andrews Chapel A.M.E. Zion Church",
    description: "A dedicated hour of corporate prayer. Bring your requests and join us in seeking God together.",
    category: "prayer",
  },
];

const categoryColors: Record<string, string> = {
  worship: "#0047CC",
  study: "#B8860B",
  prayer: "#0033A0",
  youth: "#1A5FE0",
  special: "#D4AF37",
};

const cardStyle = {
  background: "linear-gradient(135deg, #0d1535, #111a3e)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventsPage() {
  return (
    <>
      {/* Page Hero */}
      <section
        className="py-16 text-center"
        style={{
          background: "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
            What&apos;s Coming Up
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Stay connected with what&apos;s happening at Andrews Chapel. All are welcome
            to worship, study, and fellowship with us.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Regular Services */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              Regular Services
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { day: "Sunday", service: "Morning Worship", time: "10:00 AM" },
                { day: "Thursday", service: "Bible Study", time: "7:00 PM" },
                { day: "Friday", service: "Hour of Prayer", time: "6:00 PM" },
              ].map((s) => (
                <div key={s.day} className="p-5 rounded-lg" style={cardStyle}>
                  <div className="text-xs uppercase tracking-wider text-[#D4AF37] mb-1">{s.day}</div>
                  <div className="font-serif text-lg font-semibold text-white">{s.service}</div>
                  <div className="font-serif text-xl font-bold text-[#D4AF37] mt-1">{s.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-white">All Upcoming Events</h2>
              <Link
                href="/bulletin"
                className="text-xs text-[#D4AF37] hover:text-[#F0C040] transition-colors"
              >
                View Bulletin →
              </Link>
            </div>

            <div className="space-y-4">
              {placeholderEvents.map((event) => (
                <div key={event.id} className="p-6 rounded-lg" style={cardStyle}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Date box */}
                    <div
                      className="shrink-0 h-14 w-14 rounded-lg grid place-items-center text-center"
                      style={{ background: categoryColors[event.category] ?? "#0033A0" }}
                    >
                      <Calendar className="h-6 w-6 text-white" />
                    </div>

                    {/* Event info */}
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-white mb-1">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {formatDate(event.starts_at)} · {formatTime(event.starts_at)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-white/60 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-white/30 text-xs mt-8">
              More events will be added as they are scheduled. Check back soon or{" "}
              <Link href="/bulletin" className="text-[#D4AF37] hover:text-[#F0C040] transition-colors">
                read the bulletin
              </Link>{" "}
              for announcements.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
