"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/get-connected", label: "Overview" },
  { href: "/get-connected/visitor-card", label: "New Visitor Card" },
  { href: "/get-connected/join", label: "Join the Church" },
  { href: "/get-connected/message-pastor", label: "Message the Pastor" },
  { href: "/get-connected/connect-groups", label: "Connect Groups" },
];

export default function GetConnectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
            Get Connected
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            We&apos;d Love to Meet You
          </h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            However you&apos;d like to take the next step, we&apos;re here to walk with you.
          </p>
        </div>
      </section>

      {/* Tab Nav */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(212,175,55,0.15)", background: "#000D26" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex justify-center gap-1 overflow-x-auto -mb-px">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                  style={{
                    color: isActive ? "#D4AF37" : "rgba(255,255,255,0.6)",
                    borderBottomColor: isActive ? "#D4AF37" : "transparent",
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {children}
        </div>
      </section>
    </>
  );
}
