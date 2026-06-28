import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default function BuildingFundPage() {
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
            Give
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Building Fund
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Help us steward and grow the place where we gather, worship, and serve
            our community for generations to come.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Building Fund info */}
          <div
            className="p-8 rounded-xl mb-8"
            style={{
              background: "linear-gradient(135deg, #0d1535, #111a3e)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <div
              className="h-16 w-16 rounded-xl grid place-items-center mb-6"
              style={{ background: "linear-gradient(135deg, #B8860B, #D4AF37 50%, #F0C040)" }}
            >
              <Building2 className="h-8 w-8 text-[#000D26]" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">
              Investing in Our Future
            </h2>
            <div className="space-y-4 text-white/70 text-sm leading-relaxed">
              <p>
                The Building Fund supports the maintenance, renovation, and growth of our
                church facilities at Andrews Chapel A.M.E. Zion. Our building is more than
                just walls — it is the place where lives are changed, families are strengthened,
                and the community is served.
              </p>
              <p>
                Every gift to the Building Fund is an investment in the future of Andrews Chapel
                and the generations who will worship here after us. We are grateful for every
                contribution, large or small.
              </p>
            </div>
          </div>

          {/* Give CTA */}
          <div className="text-center mb-8">
            <Link
              href="https://www.zeffy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              Give to the Building Fund <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-white/40 text-xs mt-3">
              Secure giving via Zeffy · 0% platform fees
            </p>
          </div>

          {/* Other ways */}
          <div
            className="p-6 rounded-lg text-center"
            style={{
              background: "linear-gradient(135deg, #0d1535, #111a3e)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderLeft: "4px solid #D4AF37",
            }}
          >
            <p className="text-white/60 text-sm leading-relaxed">
              You may also give in person during Sunday Morning Worship or mail a check
              payable to <span className="text-white/80">Andrews Chapel A.M.E. Zion Church</span> — Building Fund,
              3009 McLean Chapel Church Rd, Bunnlevel, NC 28323.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/give"
              className="text-sm text-[#D4AF37] hover:text-[#F0C040] transition-colors"
            >
              ← Back to All Giving Options
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
