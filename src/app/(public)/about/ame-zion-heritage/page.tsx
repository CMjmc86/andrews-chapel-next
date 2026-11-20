// VERIFY items: facts from an AI summary — confirm before launch.
const ncHighlights = [
  {
    title: "Growth after the Civil War",
    text: "Before emancipation, the A.M.E. Zion Church had little room to organize across most of the South. When the war ended, it grew rapidly from a mostly Northern denomination into a Southern one, with North Carolina becoming one of its strongest anchors.",
  },
  {
    title: "Bishop James Walker Hood",
    text: "Born in Pennsylvania, Hood came to North Carolina during the Civil War as a missionary. He helped bring independent Black congregations — beginning along the coast — into the A.M.E. Zion connection, and he and other missionaries carried the work westward across the state.", // VERIFY: arrival year omitted on purpose
  },
  {
    title: "From Brush Arbors to Church Buildings",
    text: "Newly freed people had almost no money or property, so many congregations — Andrews Chapel included — first met under brush arbors: open-air shelters of wooden posts and tree branches. As funds were raised, these were replaced by timber-frame churches that also served as schools, meeting houses, and burial grounds.",
  },
  {
    title: "A Commitment to Education",
    text: "Church basements and fellowship halls often housed the first schools for children and adults. In 1879, Dr. Joseph Charles Price and Bishop Hood helped establish Zion Wesley Institute, known today as Livingstone College and Hood Theological Seminary in Salisbury.", // VERIFY: 1879 and names
  },
];

export default function AMEZionHeritage() {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
        Our Heritage
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
        The A.M.E. Zion Church
      </h2>
      <div
        className="w-16 h-0.5 mb-8"
        style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }}
      />

      <div className="space-y-5 text-white/70 leading-relaxed mb-10">
        <p>
          The African Methodist Episcopal Zion Church — known as &ldquo;The Freedom Church&rdquo;
          — is one of the oldest and most historically significant African American Christian
          denominations in the United States. Founded in 1796 in New York City, the A.M.E. Zion
          Church was established by Black Methodists who sought to worship freely and govern their
          own spiritual community.
        </p>
        <p>
          From its earliest days, the A.M.E. Zion Church has stood at the intersection of faith
          and justice. The denomination counts among its members and supporters some of the most
          prominent freedom fighters in American history — earning its enduring title as
          &ldquo;The Freedom Church.&rdquo;
        </p>
      </div>

      {/* Key figures */}
      <div className="mb-10">
        <h3 className="font-serif text-xl font-semibold text-white mb-5">
          Notable Members of the A.M.E. Zion Church
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "Frederick Douglass", desc: "Abolitionist, writer, and statesman" },
            { name: "Harriet Tubman", desc: "Conductor of the Underground Railroad" },
            { name: "Sojourner Truth", desc: "Abolitionist and women's rights activist" },
            { name: "Paul Robeson", desc: "Singer, actor, and civil rights activist" },
          ].map((p) => (
            <div
              key={p.name}
              className="p-4 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderLeft: "4px solid #D4AF37",
              }}
            >
              <div className="font-semibold text-white text-sm">{p.name}</div>
              <div className="text-white/50 text-xs mt-0.5">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* A.M.E. Zion in North Carolina */}
      <div className="mb-10">
        <h3 className="font-serif text-xl font-semibold text-white mb-2">
          The Freedom Church in North Carolina
        </h3>
        <p className="text-white/60 text-sm leading-relaxed mb-5">
          Andrews Chapel was born in the era when the A.M.E. Zion Church flourished across North
          Carolina. Our own beginnings, under a brush shelter in 1870, are part of this larger story.
        </p>
        <div className="space-y-4">
          {ncHighlights.map((h) => (
            <div
              key={h.title}
              className="p-5 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderLeft: "4px solid #D4AF37",
              }}
            >
              <div className="font-semibold text-white text-sm mb-1.5">{h.title}</div>
              <p className="text-white/60 text-sm leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connection to Andrews Chapel */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <h3 className="font-serif text-xl font-semibold text-white mb-3">
          Andrews Chapel &amp; the A.M.E. Zion Tradition
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">
          As a member congregation of the A.M.E. Zion Church, Andrews Chapel carries this rich
          heritage of faith and freedom into the Bunnlevel community. We are part of a global
          family of believers committed to the Gospel of Jesus Christ and the dignity and liberation
          of all people. We are proud to stand in this tradition as we worship, serve, and grow
          together under Pastor Kathy Grace.
        </p>
      </div>
    </div>
  );
}
