// DRAFT HISTORY — facts marked VERIFY came from an AI summary and must be confirmed by
// the church (Pastor Kathy / church historians) before launch.
const timeline = [
  {
    year: "1870",
    title: "A Congregation Gathers",
    text: "Andrews Chapel's story begins in 1870, when a local congregation of freed Black families came together to worship. Their first meeting place was a simple brush shelter — an open-air structure of posts and leafy branches that the congregation lovingly nicknamed “Bush Wack.”", // VERIFY: year, nickname
  },
  {
    year: "Early years",
    title: "Land, Trustees & a Timber Church",
    text: "The founding land was provided by Brother Sam McDougald, who served as one of the church's original trustees alongside Brother Fred McLean and Brother J.G. McLean. In time, the congregation built a more permanent timber church.", // VERIFY: names + spellings
  },
  {
    year: "After the storm",
    title: "Rebuilt, and Named Andrews Chapel",
    text: "A devastating tornado destroyed that timber church. Mrs. Andrews, a friend and supporter of the congregation, donated a new parcel of land so the people could rebuild. In gratitude for her part in saving the congregation, the new building was named Andrews Chapel — the name we carry today.", // VERIFY: tornado, who Mrs. Andrews was, naming story
  },
  {
    year: "1943",
    title: "Building for the Future",
    text: "After worshiping in the post-tornado building for decades, the church community held a major fundraising rally in November 1943 to build a newer, more modern facility.", // VERIFY: date + details
  },
  {
    year: "Today",
    title: "A Living Witness",
    text: "Andrews Chapel remains an active beacon of faith in the Central North Carolina Conference, and is recognized as a stop on the Harnett County African American Heritage Tour.", // VERIFY: conference name + tour stop
  },
];

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
      </div>

      {/* ── Church history timeline ─────────────────────────────── */}
      <div className="mt-12">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-2">
          Our History
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-8">
          From a Brush Shelter to a Church Family
        </h3>
        <ol className="relative ml-3 space-y-8" style={{ borderLeft: "2px solid rgba(212,175,55,0.35)" }}>
          {timeline.map((item) => (
            <li key={item.title} className="pl-6 relative">
              <span
                className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full"
                style={{ background: "linear-gradient(135deg, #F0C040, #B8860B)", boxShadow: "0 0 0 4px #000D26" }}
              />
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-1">
                {item.year}
              </div>
              <h4 className="font-serif text-lg font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-5 text-white/70 leading-relaxed mt-12">
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
