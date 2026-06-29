import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/AndrewsChapelAMEZion",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AndrewsChapelAMEZion",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="#000D26" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/andrewschapelamezion",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/10" style={{ background: "#000D26" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">

        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* ── Brand ── */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl shrink-0" style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}>
                <span className="text-[#F0C040] font-bold text-xl">✛</span>
              </div>
              <div className="leading-tight">
                <div className="font-serif text-xl font-bold text-white">Andrews Chapel A.M.E. Zion</div>
                <div className="text-xs text-[#D4AF37] mt-0.5">✛ Church Family &amp; Pastor Kathy Grace ✛</div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-white/60 mt-6">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37] mt-0.5" />
                <a href="https://maps.google.com/?q=3009+McLean+Chapel+Church+Rd+Bunnlevel+NC+28323"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors">
                  3009 McLean Chapel Church Rd<br />Bunnlevel, NC 28323
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a href="tel:9108935162" className="hover:text-[#D4AF37] transition-colors">(910) 893-5162</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a href="mailto:contact@andrewschapelame.org" className="hover:text-[#D4AF37] transition-colors">
                  contact@andrewschapelame.org
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 text-[#D4AF37] hover:bg-[#D4AF37]/15"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 pb-2" style={{ color: "#D4AF37", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
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
                  <Link href={href} className="text-white/60 hover:text-[#D4AF37] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Get Involved ── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 pb-2" style={{ color: "#D4AF37", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
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
                  <Link href={href} className="text-white/60 hover:text-[#D4AF37] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Service Times ── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 pb-2" style={{ color: "#D4AF37", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
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
                  <div className="text-white/60">{s.time} — {s.service}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>&copy; 2026 Andrews Chapel A.M.E. Zion Church. All rights reserved.</span>
          <div className="flex gap-4">
            {socials.map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/30 hover:text-[#D4AF37] transition-colors"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
