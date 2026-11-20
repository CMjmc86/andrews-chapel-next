import Image from "next/image";
import { Building2, Heart, BookOpen, Users, Music, type LucideIcon } from "lucide-react";

/**
 * To add a photo for anyone (a person OR a group): put the image in
 * public/images/leadership/ and set `photo` to its path, e.g.
 *   photo: "/images/leadership/pastor-kathy-grace.jpg"
 * Square or portrait images work best. With no photo, people show their initials
 * and groups show their icon.
 */
type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  photo?: string;
  icon?: LucideIcon; // used for groups when there is no photo
};

const team: TeamMember[] = [
  {
    name: "Pastor Kathy Grace",
    role: "Senior Pastor",
    bio: "Pastor Kathy Grace has served as pastor of Andrews Chapel A.M.E. Zion Church for the past two years. Her ministry is rooted in prayer, community outreach, and the Word of God, and she leads with a shepherd's heart.",
    email: "contact@andrewschapelame.org",
    phone: "(910) 893-5162",
  },
  // TODO: confirm each minister's exact title (e.g. Associate Minister, Elder) and add a short bio.
  {
    name: "Rev. Janet Mitchell",
    role: "Minister",
  },
  {
    name: "Rev. Sarah Bass",
    role: "Minister",
  },
  {
    name: "Board of Trustees",
    icon: Building2,
    role: "Stewardship & Property",
    bio: "The Board of Trustees oversees the physical and financial stewardship of Andrews Chapel, ensuring our facilities and resources serve the congregation and community well.",
  },
  {
    name: "Steward Board",
    icon: Heart,
    role: "Spiritual Care",
    bio: "The Steward Board supports the spiritual care and welfare of the congregation, working alongside Pastor Kathy to ensure every member is ministered to.",
  },
  {
    name: "Class Leaders",
    icon: BookOpen,
    role: "Discipleship",
    bio: "Class Leaders shepherd small groups within the congregation, fostering discipleship, accountability, and spiritual growth.",
  },
  {
    name: "Lay Council Officers",
    icon: Users,
    role: "Lay Ministry",
    bio: "The Lay Council represents the voice of the congregation and serves as a bridge between the membership and church leadership.",
  },
  {
    name: "Music & Worship Leaders",
    icon: Music,
    role: "Worship Arts",
    bio: "Our worship team leads the congregation into the presence of God through music, song, and Spirit-filled praise every Sunday.",
  },
];

// "Rev. Janet Mitchell" -> "JM" (skips the title so initials aren't "RJ")
function getInitials(name: string) {
  return name
    .replace(/^(Rev\.|Pastor|Dr\.)\s+/, "")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}

/** Photo if available, otherwise the group's icon, otherwise the person's initials. */
function Avatar({ member, size }: { member: TeamMember; size: "lg" | "sm" }) {
  const box = size === "lg" ? "h-24 w-24" : "h-10 w-10";
  const gradient =
    size === "lg"
      ? "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)"
      : "linear-gradient(135deg, #1A5FE0, #0047CC)";
  const Icon = member.icon;
  return (
    <div
      className={`${box} relative rounded-full grid place-items-center shrink-0 overflow-hidden`}
      style={{ background: gradient, border: member.photo ? "2px solid rgba(212,175,55,0.5)" : undefined }}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes={size === "lg" ? "96px" : "40px"}
          className="object-cover"
        />
      ) : Icon ? (
        <Icon className={size === "lg" ? "w-10 h-10 text-[#F0C040]" : "w-5 h-5 text-[#F0C040]"} aria-hidden="true" />
      ) : (
        <span className={`font-serif font-bold text-[#F0C040] ${size === "lg" ? "text-2xl" : "text-sm"}`}>
          {getInitials(member.name)}
        </span>
      )}
    </div>
  );
}

export default function Leadership() {
  const [pastor, ...rest] = team;

  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
        Our Team
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
        Our Leadership
      </h2>
      <div
        className="w-16 h-0.5 mb-8"
        style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }}
      />
      <p className="text-white/60 leading-relaxed mb-10">
        Our leaders serve under the headship of Christ and the shepherding of Pastor Kathy Grace.
      </p>

      {/* Pastor featured card */}
      <div
        className="p-8 rounded-xl mb-8"
        style={{
          background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar member={pastor} size="lg" />
          <div className="text-center sm:text-left">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] mb-1">
              {pastor.role}
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">{pastor.name}</h3>
            {pastor.bio && (
              <p className="text-white/60 leading-relaxed mb-4 text-sm">{pastor.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {pastor.phone && (
                <a href={`tel:${pastor.phone}`} className="text-sm text-[#D4AF37] hover:text-[#F0C040] transition-colors">
                  {pastor.phone}
                </a>
              )}
              {pastor.email && (
                <a href={`mailto:${pastor.email}`} className="text-sm text-[#D4AF37] hover:text-[#F0C040] transition-colors">
                  {pastor.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of team */}
      <div className="grid sm:grid-cols-2 gap-5">
        {rest.map((m) => (
          <div
            key={m.name}
            className="p-6 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderLeft: "4px solid #D4AF37",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar member={m} size="sm" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]">{m.role}</div>
                <h3 className="font-serif text-base font-semibold text-white">{m.name}</h3>
              </div>
            </div>
            {m.bio && <p className="text-white/60 text-sm leading-relaxed">{m.bio}</p>}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-white/40">
        Individual leadership profiles coming soon. Contact us at{" "}
        <a href="tel:9108935162" className="text-[#D4AF37] hover:text-[#F0C040] transition-colors">
          (910) 893-5162
        </a>{" "}
        for more information.
      </div>
    </div>
  );
}
