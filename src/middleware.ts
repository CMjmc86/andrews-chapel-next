import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: this call also refreshes the session token if needed.
  // Do not remove it or place other logic before it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // --- Staff area: everything under /admin requires a valid
  // admin_roles entry. This mirrors the checkAuth() logic already
  // in admin/page.tsx, but now enforced server-side, before the
  // page ever renders.
  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    const { data: roleRow } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!roleRow) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // --- Member area: /portal/account and /portal/directory require
  // a signed-in user with an approved members row. /portal itself
  // (the sign in/up page) stays open to everyone, signed in or not.
  if (
    path.startsWith("/portal/account") ||
    path.startsWith("/portal/directory")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }

    const { data: memberRow } = await supabase
      .from("members")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!memberRow || memberRow.status !== "approved") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/account/:path*", "/portal/directory/:path*"],
};
