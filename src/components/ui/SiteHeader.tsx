"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChildItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: ChildItem[];
}

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about/our-story" },
      { label: "What We Believe", href: "/about/what-we-believe" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "AME Zion Heritage", href: "/about/ame-zion-heritage" },
    ],
  },
  { label: "Ministries", href: "/ministries" },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "All Events", href: "/events" },
      { label: "Worship Services", href: "/events/worship" },
      { label: "Youth Events", href: "/events/youth" },
      { label: "Special Services", href: "/events/special" },
      { label: "Full Calendar", href: "/events/calendar" },
    ],
  },
  {
    label: "Get Connected",
    href: "/get-connected",
    children: [
      { label: "New Visitor Card", href: "/get-connected/visitor-card" },
      { label: "Join the Church", href: "/get-connected/join" },
      { label: "Message the Pastor", href: "/get-connected/message-pastor" },
      { label: "Connect Groups", href: "/get-connected/connect-groups" },
    ],
  },
  {
    label: "Media",
    href: "/media",
    children: [
      { label: "Sermons", href: "/media/sermons" },
      { label: "Worship Music", href: "/media/worship-music" },
      { label: "Live Stream", href: "/media/live-stream" },
      { label: "Photo Gallery", href: "/media/gallery" },
      { label: "Downloads", href: "/media/downloads" },
    ],
  },
  { label: "Bulletin", href: "/bulletin" },
  {
    label: "Give",
    href: "/give",
    children: [
      { label: "Tithe & Offering", href: "/give/tithe" },
      { label: "Community Outreach", href: "/give/community-outreach" },
      { label: "Building Fund", href: "/give/building-fund" },
      { label: "Missionary Fund", href: "/give/missionary" },
      { label: "My Giving History", href: "/give/history" },
    ],
  },
  {
    label: "Prayer Wall",
    href: "/prayer-wall",
    children: [
      { label: "All Requests", href: "/prayer-wall" },
      { label: "Submit Request", href: "/prayer-wall/submit" },
      { label: "Praise Reports", href: "/prayer-wall/praise" },
    ],
  },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#000D26]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              className="grid h-11 w-11 place-items-center rounded-full shrink-0"
              style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}
            >
              <span className="text-[#F0C040] font-bold text-lg leading-none">✛</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif text-base font-bold tracking-tight text-white sm:text-lg">
                Andrews Chapel
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]">
                A.M.E. Zion Church
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center flex-1 justify-center gap-0.5">
            {NAV.map((item) => (
              <DesktopNavItem key={item.label} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* Member Login */}
          <div className="hidden xl:flex items-center shrink-0">
            <Link
              href="/auth"
              className="px-4 py-2 text-sm font-semibold rounded-lg text-[#000D26] hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
            >
              Member Login
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="xl:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 py-4 max-h-[80vh] overflow-y-auto">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
              <li className="pt-3 border-t border-white/10 mt-3">
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-semibold rounded-lg text-[#000D26]"
                  style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
                >
                  Member Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

// ── Desktop Nav Item — pure CSS group hover ──────────────────────────
function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : item.children
      ? item.children.some((c) => pathname.startsWith(c.href))
      : pathname.startsWith(item.href);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap",
          "text-white/80 hover:text-[#D4AF37] hover:bg-white/5",
          isActive && "text-[#D4AF37]"
        )}
      >
        {item.label}
        {isActive && (
          <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#D4AF37]" />
        )}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap",
          "text-white/80 hover:text-[#D4AF37] hover:bg-white/5",
          isActive && "text-[#D4AF37]"
        )}
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-150 group-hover:rotate-180" />
        {isActive && (
          <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#D4AF37]" />
        )}
      </Link>

      {/* Dropdown — pure CSS group-hover */}
      <div className={cn(
        "absolute left-0 top-full z-50 min-w-[200px] pt-1",
        "opacity-0 invisible pointer-events-none",
        "group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto",
        "transition-all duration-150 ease-out"
      )}>
        <div
          className="rounded-lg overflow-hidden py-1"
          style={{
            background: "#1a1f3a",
            border: "1px solid rgba(212,175,55,0.25)",
            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.8)",
          }}
        >
          <div
            className="h-0.5 mb-1"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
          {item.children.map((child) => {
            const childActive = pathname === child.href || pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block px-4 py-2.5 text-sm transition-all duration-100",
                  "hover:bg-white/5 hover:text-[#D4AF37] hover:pl-5",
                  childActive ? "text-[#D4AF37] bg-white/5 pl-5" : "text-white/80"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Mobile Nav Item ──────────────────────────────────────────────────
function MobileNavItem({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  const isActive =
    item.href === "/"
      ? pathname === "/"
      : item.children
      ? item.children.some((c) => pathname.startsWith(c.href))
      : pathname.startsWith(item.href);

  if (item.children) {
    return (
      <li>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2.5",
            "text-sm font-medium transition-colors hover:bg-white/5",
            isActive ? "text-[#D4AF37]" : "text-white/90"
          )}
          onClick={() => setOpen((o) => !o)}
        >
          {item.label}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <ul className="ml-3 pl-3 my-1 border-l-2 border-[#D4AF37]/30 space-y-0.5">
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/5",
                    pathname === child.href ? "text-[#D4AF37]" : "text-white/70"
                  )}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5",
          isActive ? "text-[#D4AF37]" : "text-white/90"
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}
