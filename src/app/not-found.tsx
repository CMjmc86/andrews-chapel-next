import Link from "next/link";

/**
 * Custom 404 page (shown for any URL that doesn't exist).
 * Lives at the app root, so it renders inside the root layout but NOT the
 * (public) group's header/footer — hence the self-contained "Back to Home" link.
 */
export default function NotFound() {
  return (
    <main className="min-h-dvh bg-[#000D26] text-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-6 grid place-items-center"
          style={{ background: "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)" }}
        >
          <span className="text-[#F0C040] font-bold text-2xl">✛</span>
        </div>
        <p className="text-[#D4AF37] text-sm uppercase tracking-[0.22em] mb-3">Error 404</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-white/60 leading-relaxed mb-8">
          We couldn&apos;t find the page you were looking for. It may have moved, or the
          link may be mistyped. You&apos;re always welcome at Andrews Chapel.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 text-sm font-semibold rounded-full text-[#000D26] hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)" }}
          >
            Back to Home
          </Link>
          <Link
            href="/get-connected"
            className="px-6 py-3 text-sm font-semibold rounded-full text-[#D4AF37] hover:bg-white/5 transition-colors"
            style={{ border: "1px solid rgba(212,175,55,0.4)" }}
          >
            Get Connected
          </Link>
        </div>
      </div>
    </main>
  );
}