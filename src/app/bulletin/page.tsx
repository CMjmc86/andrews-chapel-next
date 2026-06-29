import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";

// Placeholder bulletins — will be replaced with Supabase data later
const placeholderBulletins = [
  {
    id: "1",
    title: "Weekly Bulletin — June 29, 2026",
    body: `Good morning, Andrews Chapel family!\n\nWe are so glad you are here today. Whether you are joining us in person or online, know that you are loved and welcomed.\n\nThis week we continue our series on Ephesians. Pastor Kathy will be preaching from Ephesians 3:14-21 — "Rooted and Established in Love." Come expecting a fresh word from the Lord.\n\nANNOUNCEMENTS\n• VBS Registration is now open — sign up at the welcome table\n• Community Food Drive runs through July 15\n• New member orientation is July 6 after morning worship\n• Women's Circle meets July 10 at 6 PM\n\nPRAYER REQUESTS\nPlease keep the following in your prayers this week:\n• All those dealing with health challenges\n• Families facing financial hardship\n• Our community and nation\n\nGIVING\nThank you for your faithful giving. You may give online at andrewschapelame.org/give or in the offering plate.\n\nGrace and peace to you,\nPastor Kathy Grace`,
    published_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Weekly Bulletin — June 22, 2026",
    body: `Andrews Chapel family — what a blessed week it has been!\n\nThank you to everyone who participated in last week's Community Outreach Day. We served over 200 families and gave glory to God through our service.\n\nThis Sunday we celebrate the faithfulness of God in our midst. Pastor Kathy will preach from Psalm 23.\n\nANNOUNCEMENTS\n• Choir rehearsal every Wednesday at 6 PM\n• Men's Brotherhood meets Saturday July 5 at 9 AM\n• Church picnic is scheduled for August 10\n\nGrace and peace,\nPastor Kathy Grace`,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

export default function BulletinPage() {
  const latest = placeholderBulletins[0];
  const older = placeholderBulletins.slice(1);

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
            From Pastor Kathy
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Church Bulletin
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Weekly announcements, devotionals, and updates from Pastor Kathy Grace
            and the Andrews Chapel family.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Latest bulletin */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="font-serif text-xl font-bold text-white">Latest Bulletin</h2>
            </div>
            <div className="p-8 rounded-xl" style={{
              background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
              border: "1px solid rgba(212,175,55,0.25)",
            }}>
              <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                {new Date(latest.published_at).toLocaleDateString("en-US", {
                  weekday: "long", month: "long", day: "numeric", year: "numeric",
                })}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-6">
                {latest.title}
              </h3>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {latest.body}
              </div>
            </div>
          </div>

          {/* Older bulletins */}
          {older.length > 0 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-5">Past Bulletins</h2>
              <div className="space-y-4">
                {older.map((b) => (
                  <div key={b.id} className="p-6 rounded-lg" style={cardStyle}>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                      <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                      {new Date(b.published_at).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-white mb-3">
                      {b.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm mb-4">
              Want to receive the bulletin by email each week?
            </p>
            <Link
              href="/get-connected/visitor-card"
              className="inline-block px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              Fill Out a Visitor Card
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
