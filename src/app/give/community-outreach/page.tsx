import Link from "next/link";
import { Globe, Heart, ShoppingBag, Users, HandHeart } from "lucide-react";

const programs = [
  {
    icon: ShoppingBag,
    title: "Food Pantry & Assistance",
    description:
      "Andrews Chapel operates a food pantry serving families in need throughout the Bunnlevel and Harnett County area. Your gift helps stock shelves and provide emergency assistance.",
  },
  {
    icon: Users,
    title: "Community Partnerships",
    description:
      "We partner with local schools, nonprofits, and agencies to extend the reach of our outreach ministry and serve our neighbors more effectively.",
  },
  {
    icon: Heart,
    title: "Neighborhood Ministry",
    description:
      "From back-to-school drives to holiday outreach, our congregation shows up for the community year-round in the name of Jesus Christ.",
  },
];

export default function CommunityOutreachPage() {
  return (
    <main className="min-h-screen bg-[#000D26] text-white">
      {/* Hero */}
      <section
        className="py-16 text-center"
        style={{
          background: "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
            Give
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Community Outreach
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Support our efforts to serve the Bunnlevel community through food drives,
            assistance programs, and neighborhood partnerships.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className=" border border-[#0047CC] rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #0a1a42 0%, #060f25 100%)" }}>
          <div className="w-12 h-12 rounded-xl bg-[#0033A0] flex items-center justify-center mb-5">
            <Globe className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Serving Our Neighbors in Jesus&apos; Name
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Andrews Chapel A.M.E. Zion Church believes that the Church is called to be a
            blessing to the community around it. Our Community Outreach ministry carries the
            love of Christ beyond our walls and into the streets, homes, and lives of those
            in need.
          </p>
          <p className="text-white/60 leading-relaxed">
            Every gift to Community Outreach goes directly toward tangible help for real
            people — families facing food insecurity, individuals in crisis, and neighbors
            who need to know they are not alone.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="max-w-3xl mx-auto px-4 pb-10 space-y-4">
        {programs.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className=" border border-[#0047CC] rounded-2xl p-6 flex gap-5 hover:border-[#D4AF37] transition-all" style={{ background: "linear-gradient(135deg, #0a1a42 0%, #060f25 100%)" }}
          >
            <div className="w-10 h-10 rounded-full bg-[#0033A0] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#D4AF37] mb-1">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Give CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-8 text-center">
        <a
          href="https://www.zeffy.com/andrews-chapel-outreach"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#000D26] font-bold px-8 py-4 rounded-full hover:bg-[#F0C040] transition-colors text-lg"
        >
          <HandHeart className="w-5 h-5" />
          Give to Community Outreach
        </a>
        <p className="text-white/30 text-sm mt-3">Secure giving via Zeffy · 0% platform fees</p>
      </section>

      {/* Mail-in option */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="border-l-2 border-[#D4AF37]/30 pl-5 text-white/40 text-sm leading-relaxed">
          You may also give in person during Sunday Morning Worship or mail a check payable to{" "}
          <span className="text-white/60 font-semibold">Andrews Chapel A.M.E. Zion Church</span>{" "}
          — Community Outreach Fund, 3009 McLean Chapel Church Rd, Bunnlevel, NC 28323.
        </div>
      </section>

      {/* Back link */}
      <section className="text-center pb-16">
        <Link
          href="/give"
          className="text-[#D4AF37] text-sm hover:underline"
        >
          ← Back to All Giving Options
        </Link>
      </section>
    </main>
  );
}
