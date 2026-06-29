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
