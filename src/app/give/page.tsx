import Link from "next/link";
import { Heart, Building2, Globe, BookOpen, ArrowRight } from "lucide-react";

const cardStyle = {
  background: "linear-gradient(135deg, #0d1535, #111a3e)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

const givingOptions = [
  {
    icon: Heart,
    title: "Tithe & Offering",
    desc: "Your tithe is the foundation of your giving. Honor God with the firstfruits of your increase and support the ministry of Andrews Chapel.",
    href: "https://www.zeffy.com",
    cta: "Give Online via Zeffy",
    gradient: "linear-gradient(135deg, #0033A0, #0047CC 50%, #1A5FE0)",
    note: "0% platform fees — 100% goes to the church",
  },
  {
    icon: Building2,
    title: "Building Fund",
    desc: "Help us steward and grow the place where we gather, worship, and serve our community for generations to come.",
    href: "/give/building-fund",
    cta: "Support the Building Fund",
    gradient: "linear-gradient(135deg, #B8860B, #D4AF37 50%, #F0C040)",
    note: "Dedicated fund for facility improvements",
  },
  {
    icon: Globe,
    title: "Community Outreach",
    desc: "Support our efforts to serve the Bunnlevel community through food drives, assistance programs, and neighborhood partnerships.",
    href: "https://www.zeffy.com",
    cta: "Give to Outreach",
    gradient: "linear-gradient(135deg, #0033A0, #1A5FE0 50%, #0047CC)",
    note: "Serving our neighbors in Jesus' name",
  },
  {
    icon: BookOpen,
    title: "Missionary Fund",
    desc: "Partner with missionaries spreading the Gospel beyond our walls. Your gift supports the global mission of the A.M.E. Zion Church.",
    href: "https://www.zeffy.com",
    cta: "Give to Missions",
    gradient: "linear-gradient(135deg, #B8860B, #F0C040 50%, #D4AF37)",
    note: "Supporting the global A.M.E. Zion mission",
  },
];

export default function GivePage() {
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
            Generosity
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Give & Tithe
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Your generous gift supports our church family and helps bring the love of
            Christ to our community. Every gift makes a difference.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          {/* Zeffy notice */}
          <div
            className="p-5 rounded-lg mb-10 text-center"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: "0.75rem",
            }}
          >
            <p className="text-[#D4AF37] text-sm font-medium">
              ✛ We use Zeffy for online giving — a platform with 0% platform fees, meaning
              100% of your gift goes directly to Andrews Chapel. ✛
            </p>
          </div>

          {/* Giving options */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {givingOptions.map((option) => (
              <div key={option.title} className="rounded-xl overflow-hidden" style={{
                background: "#0d1535",
                border: "1px solid rgba(212,175,55,0.15)",
              }}>
                {/* Gradient top */}
                <div
                  className="h-24 flex items-center justify-center"
                  style={{ background: option.gradient }}
                >
                  <option.icon className="h-10 w-10 text-white/90" strokeWidth={1.5} />
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{option.desc}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/60 mb-4">
                    {option.note}
                  </p>
                  <Link
                    href={option.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:text-[#F0C040] transition-colors"
                    {...(option.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {option.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Other ways to give */}
          <div className="p-8 rounded-xl" style={cardStyle}>
            <h2 className="font-serif text-xl font-bold text-white mb-5">
              Other Ways to Give
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-[#D4AF37] font-semibold mb-2">In Person</div>
                <p className="text-white/60 leading-relaxed">
                  Offering plates are passed during Sunday Morning Worship at 10:00 AM.
                  Envelopes are available at the welcome table.
                </p>
              </div>
              <div>
                <div className="text-[#D4AF37] font-semibold mb-2">By Mail</div>
                <p className="text-white/60 leading-relaxed">
                  Send checks payable to <span className="text-white/80">Andrews Chapel A.M.E. Zion Church</span> to
                  3009 McLean Chapel Church Rd, Bunnlevel, NC 28323.
                </p>
              </div>
              <div>
                <div className="text-[#D4AF37] font-semibold mb-2">Questions?</div>
                <p className="text-white/60 leading-relaxed">
                  Contact us at{" "}
                  <a href="tel:9108935162" className="text-[#D4AF37] hover:text-[#F0C040] transition-colors">
                    (910) 893-5162
                  </a>{" "}
                  or{" "}
                  <a href="mailto:contact@andrewschapelame.org" className="text-[#D4AF37] hover:text-[#F0C040] transition-colors">
                    contact@andrewschapelame.org
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Scripture */}
          <div className="mt-12 text-center">
            <blockquote className="font-serif text-xl sm:text-2xl italic text-white/70 leading-relaxed">
              &ldquo;Each of you should give what you have decided in your heart to give,
              not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            </blockquote>
            <div className="mt-3 text-sm uppercase tracking-[0.18em] text-[#D4AF37]">
              2 Corinthians 9:7 · NIV
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
