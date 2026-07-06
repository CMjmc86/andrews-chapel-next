"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  end_time: string | null;
  location: string | null;
  is_published: boolean;
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) return null;
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true });
      setEvents((data as Event[]) || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

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
            <h2 className="font-serif text-2xl font-bold text-white mb-6">Regular Services</h2>
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

          {/* Upcoming Events from Supabase */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-white">All Upcoming Events</h2>
              <Link href="/bulletin" className="text-xs text-[#D4AF37] hover:text-[#F0C040] transition-colors">
                View Bulletin →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-lg animate-pulse" style={cardStyle}>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                        <div className="h-3 bg-white/10 rounded w-1/3" />
                        <div className="h-3 bg-white/10 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No upcoming events at this time. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-6 rounded-lg" style={cardStyle}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Date box */}
                      <div
                        className="shrink-0 h-14 w-14 rounded-lg grid place-items-center text-center"
                        style={{ background: "linear-gradient(135deg, #102460, #0033A0)" }}
                      >
                        <p className="text-[#D4AF37] text-[10px] font-bold uppercase leading-none">
                          {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                        </p>
                        <p className="text-white text-xl font-bold leading-none">
                          {new Date(event.event_date + "T00:00:00").getDate()}
                        </p>
                      </div>

                      {/* Event info */}
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-white mb-1">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
                            {formatDate(event.event_date)}
                            {event.event_time && ` · ${formatTime(event.event_time)}`}
                            {event.end_time && ` – ${formatTime(event.end_time)}`}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-white/60 leading-relaxed">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
