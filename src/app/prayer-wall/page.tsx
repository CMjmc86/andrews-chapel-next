import Link from "next/link";
import { Heart } from "lucide-react";

// Placeholder requests — will be replaced with Supabase data later
const placeholderRequests = [
  {
    id: "1",
    display_name: "A member of our family",
    request: "Please pray for healing and strength during this difficult season.",
    category: "health",
    is_anonymous: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    display_name: "James T.",
    request: "Praying for my family to find peace and unity. God has been faithful.",
    category: "family",
    is_anonymous: false,
    created_at: new Date().toISOString(),
  },
];

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.5rem",
};

export default function PrayerWallPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-white/50 text-sm">
          {placeholderRequests.length} request{placeholderRequests.length !== 1 ? "s" : ""} on the wall
        </p>
        <Link
          href="/prayer-wall/submit"
          className="px-4 py-2 text-xs font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
        >
          Submit a Request
        </Link>
      </div>

      {/* Prayer request cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {placeholderRequests.map((r) => (
          <div key={r.id} className="p-6" style={cardStyle}>
            <div className="flex items-start justify-between mb-3">
              <Heart className="h-5 w-5 text-[#D4AF37] shrink-0" />
              {r.category && (
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: "#D4AF37",
                    border: "1px solid rgba(212,175,55,0.2)",
                  }}
                >
                  {r.category.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <p className="text-white/80 leading-relaxed mb-4 whitespace-pre-line text-sm">
              {r.request}
            </p>
            <p className="text-xs text-white/40">
              — {r.is_anonymous ? "Anonymous" : r.display_name} ·{" "}
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-white/30 text-xs mt-8">
        Prayer requests are reviewed by Pastor Kathy before appearing on the wall.
      </p>
    </div>
  );
}
