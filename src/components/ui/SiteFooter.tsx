import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/10" style={{ background: "#000D26" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">

        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* ── Brand ── */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="grid h-12 w-12 place-items-center rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}
              >
                <span className="text-[#F0C040] font-bold text-xl">✛</span>
              </div>
              <div className="leading-tight">
                <div className="font-serif text-xl font-bold text-white">
                  Andrews Chapel A.M.E. Zion
                </div>
                <div className="text-xs text-[#D4AF37] mt-0.5">
                  ✛ Church Family &amp; Pastor Kathy Grace ✛
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-white/60 mt-6">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37] mt-0.5" />
                <span>
                  3009 McLean Chapel Church Rd<br />
                  Bunnlevel, NC 28323
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a href="tel:9108935162" className="hover:text-[#D4AF37] transition-colors">
                  (910) 893-5162
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a
                  href="mailto:contact@andrewschapelame.org"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  contact@andrewschapelame.org
                </a>
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-5 pb-2"
              style={{
                color: "#D4AF37",
                borderBottom: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Home", "/"],
                ["About Us", "/about/our-story"],
                ["Events", "/events"],
                ["Bulletin", "/bulletin"],
                ["Sermons", "/media/sermons"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-[#D4AF37] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Get Involved ── */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-5 pb-2"
              style={{
                color: "#D4AF37",
                borderBottom: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              Get Involved
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ["I'm New Here", "/get-connected/visitor-card"],
                ["Join the Church", "/get-connected/join"],
                ["Our Ministries", "/ministries"],
                ["Prayer Request", "/prayer-wall/submit"],
                ["Give Online", "/give"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-[#D4AF37] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Service Times ── */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-5 pb-2"
              style={{
                color: "#D4AF37",
                borderBottom: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              Service Times
            </h4>
            <div className="space-y-5 text-sm">
              {[
                { day: "Sunday", service: "Morning Worship", time: "10:00 AM" },
                { day: "Thursday", service: "Bible Study", time: "7:00 PM" },
                { day: "Friday", service: "Hour of Prayer", time: "6:00 PM" },
              ].map((s) => (
                <div key={s.day}>
                  <div className="font-semibold text-[#D4AF37] mb-0.5">{s.day}</div>
                  <div className="text-white/60">
                    {s.time} — {s.service}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-14 pt-8 text-center text-xs text-white/40"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          &copy; 2026 Andrews Chapel A.M.E. Zion Church. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
