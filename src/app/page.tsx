import Link from "next/link";
import {
  HeartHandshake,
  HandCoins,
  Building2,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  BookOpen,
} from "lucide-react";

// ── Shared card style ─────────────────────────────────────────────────
const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

// ── Divider ───────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), rgba(0,71,204,0.3), rgba(212,175,55,0.2), transparent)",
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-[85vh] flex items-center"
        style={{
          background: "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)",
        }}
      >
        {/* Glow overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(0,71,204,0.6) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(212,175,55,0.12) 0%, transparent 55%)",
          }}
        />
        {/* Decorative cross */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden lg:block">
          <svg width="420" height="420" viewBox="0 0 100 100" fill="#D4AF37">
            <rect x="42" y="5" width="16" height="90" rx="4" />
            <rect x="5" y="32" width="90" height="16" rx="4" />
          </svg>
        </div>

        <div className="relative w-full mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-36 text-center">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{
              border: "1px solid rgba(212,175,55,0.3)",
              background: "rgba(212,175,55,0.05)",
            }}
          >
            <span className="text-[#D4AF37] text-sm">✛</span>
            <span className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">
              Andrews Chapel A.M.E. Zion Church
            </span>
            <span className="text-[#D4AF37] text-sm">✛</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-white">
            Rooted in{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Faith
            </span>
            .
            <br />
            Growing in{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Love
            </span>
            .
            <br />
            Serving{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Together
            </span>
            .
          </h1>

          <p className="mt-6 text-xl sm:text-2xl font-serif italic text-white/80">
            We Welcome You!
          </p>
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Know that we are always here for you — praying for and with you always.
            <br className="hidden sm:block" />
            Bunnlevel, North Carolina · Pastor Kathy Grace
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/get-connected/visitor-card"
              className="px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              Plan Your Visit
            </Link>
            <Link
              href="/get-connected/visitor-card"
              className="px-6 py-3 text-sm font-semibold rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(212,175,55,0.4)" }}
            >
              I&apos;m New Here
            </Link>
            <Link
              href="/media/live-stream"
              className="px-6 py-3 text-sm font-semibold rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(212,175,55,0.4)" }}
            >
              Watch Live
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 2. FEATURE CARDS ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
              We&apos;re Here For You
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              How Can We Serve You?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: HeartHandshake,
                title: "Prayer Request",
                body: "Let our prayer team stand with you. Submit a request — public or private — and we'll lift it in prayer.",
                href: "/prayer-wall/submit",
                cta: "Submit a Request",
                gradient: "linear-gradient(135deg, #0033A0, #0047CC 50%, #1A5FE0)",
              },
              {
                icon: HandCoins,
                title: "Give & Tithe",
                body: "Support the work of the Lord through tithes and offerings. Secure giving with 0% platform fees via Zeffy.",
                href: "/give",
                cta: "Give Online",
                gradient: "linear-gradient(135deg, #B8860B, #D4AF37 50%, #F0C040)",
              },
              {
                icon: Building2,
                title: "Building Fund",
                body: "Help us steward and grow the place where we gather, worship and serve our community for generations to come.",
                href: "/give/building-fund",
                cta: "Support the Build",
                gradient: "linear-gradient(135deg, #0033A0, #1A5FE0 50%, #0047CC)",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* Gradient top */}
                <div
                  className="h-44 flex items-center justify-center"
                  style={{ background: card.gradient }}
                >
                  <card.icon
                    className="h-16 w-16 text-white/90 transition-transform duration-200 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{card.body}</p>
                  <div className="inline-flex items-center gap-1 text-[#D4AF37] text-sm font-medium group-hover:gap-2 transition-all">
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 3. WORSHIP TIMES / FIND US ────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
                Come Worship With Us
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                Our Worship Experience Is One of a Kind
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Every service at Andrews Chapel A.M.E. Zion is a warm, Spirit-filled experience.
                May the Lord bless you and keep you — come as you are.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  3009 McLean Chapel Church Rd · Bunnlevel, NC 28323
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <a href="tel:9108935162" className="hover:text-[#D4AF37] transition-colors">
                    (910) 893-5162
                  </a>
                </div>
              </div>
              <Link
                href="/get-connected/visitor-card"
                className="inline-block px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
              >
                Plan Your Visit
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { day: "Sunday", service: "Morning Worship", time: "10:00 AM" },
                { day: "Thursday", service: "Bible Study", time: "7:00 PM" },
                { day: "Friday", service: "Hour of Prayer", time: "6:00 PM" },
              ].map((s) => (
                <div key={s.day} className="rounded-lg px-5 py-4" style={cardStyle}>
                  <div className="text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                    {s.day}
                  </div>
                  <div className="font-serif text-lg font-semibold text-white">{s.service}</div>
                  <div className="font-serif text-xl font-bold text-[#D4AF37] mt-1">{s.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 4. UPCOMING EVENTS ────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-2">
                What&apos;s Coming Up
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Upcoming Events
              </h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/bulletin"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
                style={{ border: "1px solid rgba(212,175,55,0.3)" }}
              >
                <BookOpen className="h-4 w-4" /> View Bulletin
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
                style={{ border: "1px solid rgba(212,175,55,0.3)" }}
              >
                View All Events
              </Link>
            </div>
          </div>

          {/* Empty state — replace with Supabase data later */}
          <div className="rounded-lg p-10 text-center" style={cardStyle}>
            <Calendar className="h-8 w-8 text-[#D4AF37] mx-auto mb-3 opacity-50" />
            <p className="text-white/60 mb-2">
              Check back soon for upcoming events.
            </p>
            <p className="text-sm text-white/40">
              In the meantime, join us Sunday at 10 AM for Morning Worship.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 5. PASTOR QUOTE + BIBLE VERSE ────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-6">
            A Word from Pastor Kathy Grace
          </div>
          <div
            className="w-24 h-0.5 mx-auto mb-8"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-white leading-snug italic mb-6">
            &ldquo;You are God&apos;s masterpiece, created to do good works, which God prepared in
            advance for you.&rdquo;
          </blockquote>
          <div className="text-sm uppercase tracking-[0.18em] text-[#D4AF37] mb-12">
            Ephesians 2:10 · NIV
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/get-connected/visitor-card"
              className="px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              I&apos;m New Here
            </Link>
            <Link
              href="/about/our-story"
              className="px-6 py-3 text-sm font-semibold rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(212,175,55,0.4)" }}
            >
              Our Story
            </Link>
            <Link
              href="/prayer-wall/submit"
              className="px-6 py-3 text-sm font-semibold rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(212,175,55,0.4)" }}
            >
              Submit a Prayer Request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
