"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getUserRole, type Role } from "@/lib/roles";
import { ArrowLeft, Mail, Phone, Users, Home } from "lucide-react";

type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  directory_opt_in: boolean;
};

const cardStyle = {
  background: "linear-gradient(135deg, #102460 0%, #0a1840 100%)",
  border: "1px solid rgba(212,175,55,0.15)",
  borderLeft: "4px solid #D4AF37",
  borderRadius: "0.75rem",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function PortalDirectoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [isStaffView, setIsStaffView] = useState(false);
  const [search, setSearch] = useState("");

  const loadDirectory = useCallback(async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/portal");
      return;
    }

    const { data: selfMember } = await supabase
      .from("members")
      .select("status")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!selfMember || selfMember.status !== "approved") {
      await supabase.auth.signOut();
      router.push("/portal");
      return;
    }

    const role = await getUserRole();
    const staffView = role === "pastor" || role === "super_admin";
    setIsStaffView(staffView);

    const { data } = await supabase
      .from("members")
      .select("id, full_name, email, phone, directory_opt_in")
      .eq("status", "approved")
      .order("full_name", { ascending: true });

    const rows = (data as MemberRow[]) || [];
    // Non-staff viewers only see opted-in rows. Their own row can
    // slip through via the "Members can view own record" RLS policy
    // even when they haven't opted in — filter that out here so the
    // directory visually matches what they'd expect: if they didn't
    // opt in, they shouldn't see themselves listed either.
    const visibleRows = staffView ? rows : rows.filter((m) => m.directory_opt_in);

    setMembers(visibleRows);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const filtered = members.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-dvh bg-[#000D26] text-white">
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(16,36,96,0.5)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/portal/account" className="text-white/40 hover:text-white transition-colors" title="Back to Account">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" /> Member Directory
            </h1>
            <p className="text-white/40 text-xs">
              {isStaffView ? "Showing all approved members" : "Showing members who opted in"}
            </p>
          </div>
        </div>
        <Link href="/" className="text-white/40 hover:text-white transition-colors" title="Back to Home">
          <Home className="w-5 h-5" />
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "0.5rem" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-2.5 rounded-lg text-sm text-white bg-transparent placeholder-white/30 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 animate-pulse rounded-xl" style={cardStyle}>
                <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            {members.length === 0
              ? "No members to show yet."
              : "No members match your search."}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((member) => (
              <div key={member.id} className="p-5 rounded-xl flex items-start gap-4" style={cardStyle}>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-serif font-bold text-sm"
                  style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
                >
                  {initials(member.full_name) || "?"}
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="font-serif font-bold text-white truncate">
                    {member.full_name || "Unnamed"}
                  </p>
                  <p className="text-white/50 text-xs flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 shrink-0" /> {member.email}
                  </p>
                  {member.phone && (
                    <p className="text-white/50 text-xs flex items-center gap-1.5">
                      <Phone className="w-3 h-3 shrink-0" /> {member.phone}
                    </p>
                  )}
                  {isStaffView && !member.directory_opt_in && (
                    <p className="text-white/25 text-[10px] uppercase tracking-wider mt-1">
                      Not opted into public directory
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
