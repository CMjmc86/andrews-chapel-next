export default function OurStory() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
        Our Story
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
        A Legacy of Faith in Bunnlevel
      </h2>
      <div
        className="w-16 h-0.5 mb-8"
        style={{
          background: "linear-gradient(90deg, #D4AF37, transparent)",
        }}
      />
      <div className="space-y-5 text-white/70 leading-relaxed">
        <p>
          Andrews Chapel A.M.E. Zion Church has stood as a beacon of faith, hope, and community
          in Bunnlevel, North Carolina for generations. Founded on the principles of the African
          Methodist Episcopal Zion tradition, our church has been a place of worship, fellowship,
          and service for countless families across the years.
        </p>
        <p>
          From its earliest days, Andrews Chapel has been more than a building — it has been a
          family. Members have gathered here to celebrate life&apos;s joys, mourn its sorrows, and
          support one another through every season. The spirit of community that has always defined
          us continues to grow stronger with each passing year.
        </p>
        <p>
          Under the faithful shepherding of Pastor Kathy Grace, Andrews Chapel continues to live
          out its calling — rooted in the Word of God, growing in love for one another, and serving
          the broader community with open arms and generous hearts.
        </p>
        <p>
          We invite you to become part of our story. Whether you are new to faith, returning home,
          or simply looking for a church family — there is a place for you at Andrews Chapel.
        </p>
      </div>

      <div
        className="mt-10 p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
          border: "1px solid rgba(212,175,55,0.15)",
          borderLeft: "4px solid #D4AF37",
        }}
      >
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-2">
          Our Location
        </div>
        <p className="text-white font-medium">Andrews Chapel A.M.E. Zion Church</p>
        <p className="text-white/60 text-sm mt-1">
          3009 McLean Chapel Church Rd · Bunnlevel, NC 28323
          <br />
          (910) 893-5162 · contact@andrewschapelame.org
        </p>
      </div>
    </div>
  );
}
