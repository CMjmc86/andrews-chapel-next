const beliefs = [
  {
    title: "The Holy Scriptures",
    body: "We believe the Bible is the inspired Word of God — the supreme authority in all matters of faith and practice. It is the foundation upon which we build our lives and our church.",
  },
  {
    title: "The Holy Trinity",
    body: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. Each person of the Trinity is fully God, equal in power and glory.",
  },
  {
    title: "Jesus Christ",
    body: "We believe Jesus Christ is the Son of God who became man, lived a sinless life, died on the cross for our sins, rose bodily from the dead, and ascended to heaven where He intercedes for us.",
  },
  {
    title: "Salvation by Grace",
    body: "We believe salvation is by grace through faith in Jesus Christ alone — not by works. All who repent and trust in Christ are forgiven, justified, and born again by the Holy Spirit.",
  },
  {
    title: "The Holy Spirit",
    body: "We believe the Holy Spirit indwells every believer, empowering us for holy living and effective service. He is our comforter, guide, and the source of spiritual gifts.",
  },
  {
    title: "The Church",
    body: "We believe the Church is the body of Christ, called to worship God, make disciples, and serve the world. Andrews Chapel is part of the African Methodist Episcopal Zion Church, one of the historic Black Methodist denominations.",
  },
  {
    title: "Resurrection & Eternal Life",
    body: "We believe in the bodily resurrection of both the saved and the lost. Those who are saved will enjoy eternal life with God; those who reject Christ face eternal separation from God.",
  },
  {
    title: "Social Justice & Service",
    body: "Following the A.M.E. Zion tradition — known as the Freedom Church — we believe the Gospel compels us to pursue justice, serve the poor, and stand with the marginalized in our community and world.",
  },
];

export default function WhatWeBelieve() {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
        Our Faith
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
        What We Believe
      </h2>
      <div
        className="w-16 h-0.5 mb-8"
        style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }}
      />
      <p className="text-white/60 leading-relaxed mb-10">
        Andrews Chapel A.M.E. Zion Church is grounded in the historic Christian faith as expressed
        through the Wesleyan-Methodist tradition. These are the core beliefs that shape who we are
        and how we live.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {beliefs.map((b) => (
          <div
            key={b.title}
            className="p-6 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #0d1535, #111a3e)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderLeft: "4px solid #D4AF37",
            }}
          >
            <h3 className="font-serif text-lg font-semibold text-white mb-2">{b.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
