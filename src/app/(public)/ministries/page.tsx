import Link from "next/link";

const ministries = [
  {
    name: "Youth Ministry",
    ages: "Ages 13–17",
    schedule: "Weekly meetings",
    desc: "A vibrant community where young people discover their faith, build lasting friendships, and grow into the leaders God has called them to be. Activities include Bible study, community service, and special events.",
    icon: "🌟",
  },
  {
    name: "Young Adults Bible Study",
    ages: "Ages 18–35",
    schedule: "Weekly",
    desc: "A weekly gathering for young adults to dig deep into Scripture, ask hard questions, and build meaningful community. Life is better together.",
    icon: "📖",
  },
  {
    name: "Senior Saints Fellowship",
    ages: "Ages 55+",
    schedule: "Monthly",
    desc: "Honoring the wisdom and experience of our senior members through regular fellowship, outings, and ministry. A place where every season of life is celebrated.",
    icon: "🕊️",
  },
  {
    name: "Men's Brotherhood",
    ages: "Men of all ages",
    schedule: "Monthly meetings",
    desc: "Men coming together to encourage one another in faith, family, and purpose. Building godly men who lead with integrity and serve with strength.",
    icon: "🤝",
  },
  {
    name: "Women's Circle",
    ages: "Women of all ages",
    schedule: "Monthly gatherings",
    desc: "A sisterhood rooted in prayer, service, and mutual support. The Women's Circle carries on a long tradition of faithful women shaping the life of Andrews Chapel.",
    icon: "💐",
  },
  {
    name: "Couples Ministry",
    ages: "Married couples",
    schedule: "Quarterly events",
    desc: "Strengthening marriages through shared faith, fellowship, and practical wisdom. Couples learn and grow together in community with other believing families.",
    icon: "💍",
  },
  {
    name: "Music & Worship Ministry",
    ages: "All ages",
    schedule: "Weekly rehearsals",
    desc: "Our worship team and choir lead the congregation into the presence of God every Sunday. If you have a gift for music, we'd love to have you join us.",
    icon: "🎵",
  },
  {
    name: "Community Outreach",
    ages: "All ages",
    schedule: "Ongoing",
    desc: "Following the A.M.E. Zion tradition of the Freedom Church, we actively serve our local community through food drives, assistance programs, and neighborhood partnerships.",
    icon: "🌍",
  },
];

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

export default function MinistriesPage() {
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
            Get Involved
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Our Ministries
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            There is a place for everyone at Andrews Chapel. Find your community,
            discover your gifts, and serve alongside your church family.
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((m) => (
              <div key={m.name} className="p-6" style={cardStyle}>
                <div className="text-3xl mb-4">{m.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-white mb-1">{m.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] text-[#D4AF37] uppercase tracking-wider">{m.ages}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[11px] text-white/40">{m.schedule}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div
              className="inline-block p-8 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              <h2 className="font-serif text-2xl font-bold text-white mb-3">
                Ready to Get Involved?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
                Sign up for a Connect Group or reach out to Pastor Kathy — we&apos;d love to help
                you find your place in the Andrews Chapel family.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/get-connected/connect-groups"
                  className="px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
                >
                  Join a Connect Group
                </Link>
                <Link
                  href="/get-connected/message-pastor"
                  className="px-6 py-3 text-sm font-semibold rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
                  style={{ border: "1px solid rgba(212,175,55,0.4)" }}
                >
                  Message Pastor Kathy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
