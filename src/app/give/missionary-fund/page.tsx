import Link from "next/link";
import { BookOpen, Globe, Cross, HandHeart, Church } from "lucide-react";

const initiatives = [
  {
    icon: Globe,
    title: "Global A.M.E. Zion Missions",
    description:
      "The A.M.E. Zion Church supports missionaries across Africa, the Caribbean, and beyond. Your gift partners with the denomination's global mission effort.",
  },
  {
    icon: BookOpen,
    title: "Evangelism & Church Planting",
    description:
      "Gifts to the Missionary Fund help support the planting of new A.M.E. Zion congregations and the spread of the Gospel in underserved communities.",
  },
  {
    icon: Church,
    title: "Local Mission Support",
    description:
      "Andrews Chapel supports local missionaries and ministry workers serving in Harnett County and the surrounding region through prayer and financial partnership.",
  },
];

export default function MissionaryFundPage() {
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
            Missionary Fund
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Partner with missionaries spreading the Gospel beyond our walls. Your gift
            supports the global mission of the A.M.E. Zion Church.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className=" border border-[#0047CC] rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #0a1a42 0%, #060f25 100%)" }}>
          <div className="w-12 h-12 rounded-xl bg-[#0033A0] flex items-center justify-center mb-5">
            <Cross className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Supporting the Global A.M.E. Zion Mission
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            The African Methodist Episcopal Zion Church has a rich legacy of missionary work
            stretching back generations. Known as the "Freedom Church," A.M.E. Zion has always
            been at the forefront of carrying the Gospel to those who need it most — both at home
            and around the world.
          </p>
          <p className="text-white/60 leading-relaxed">
            When you give to the Missionary Fund at Andrews Chapel, you join a movement much
            larger than our congregation — one that spans continents and carries the transforming
            message of Jesus Christ to the ends of the earth.
          </p>
        </div>
      </section>

      {/* Initiatives */}
      <section className="max-w-3xl mx-auto px-4 pb-10 space-y-4">
        {initiatives.map(({ icon: Icon, title, description }) => (
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
          href="https://www.zeffy.com/andrews-chapel-missions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#000D26] font-bold px-8 py-4 rounded-full hover:bg-[#F0C040] transition-colors text-lg"
        >
          <HandHeart className="w-5 h-5" />
          Give to Missions
        </a>
        <p className="text-white/30 text-sm mt-3">Secure giving via Zeffy · 0% platform fees</p>
      </section>

      {/* Mail-in option */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="border-l-2 border-[#D4AF37]/30 pl-5 text-white/40 text-sm leading-relaxed">
          You may also give in person during Sunday Morning Worship or mail a check payable to{" "}
          <span className="text-white/60 font-semibold">Andrews Chapel A.M.E. Zion Church</span>{" "}
          — Missionary Fund, 3009 McLean Chapel Church Rd, Bunnlevel, NC 28323.
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
