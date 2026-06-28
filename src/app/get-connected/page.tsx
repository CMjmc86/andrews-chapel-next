import Link from "next/link";
import { ClipboardList, UserPlus, MessageCircle, Users } from "lucide-react";

const items = [
  {
    href: "/get-connected/visitor-card",
    icon: ClipboardList,
    title: "New Visitor Card",
    body: "First time with us? Let us know you're here so we can welcome you personally.",
  },
  {
    href: "/get-connected/join",
    icon: UserPlus,
    title: "Join the Church",
    body: "Ready to make Andrews Chapel your home? Begin your membership journey.",
  },
  {
    href: "/get-connected/message-pastor",
    icon: MessageCircle,
    title: "Message the Pastor",
    body: "Send a private note to Pastor Kathy Grace — questions, prayer, or pastoral care.",
  },
  {
    href: "/get-connected/connect-groups",
    icon: Users,
    title: "Connect Groups",
    body: "Find your people in a small group — fellowship, Bible study, and shared life.",
  },
];

export default function GetConnectedPage() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group p-7 rounded-xl transition-all duration-200 hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg, #0d1535, #111a3e)",
            border: "1px solid rgba(212,175,55,0.15)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="mb-4 grid h-12 w-12 place-items-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
          >
            <item.icon className="h-6 w-6 text-[#000D26]" strokeWidth={2.25} />
          </div>
          <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">{item.body}</p>
        </Link>
      ))}
    </div>
  );
}
