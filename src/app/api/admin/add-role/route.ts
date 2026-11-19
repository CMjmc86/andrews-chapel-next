import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Service-role client: bypasses RLS entirely. It must never run anything until the
// caller has been verified as a super admin (see the checks in POST below).
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_ROLES = ["super_admin", "tech_admin", "pastor", "leader"];

// listUsers() returns one page at a time, so look through the pages.
async function findUserByEmail(email: string) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 1000) break;
  }
  return null;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // 1. Who is calling? middleware.ts does not cover /api/*, so this route has to check.
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );
    const {
      data: { user: caller },
    } = await supabase.auth.getUser();

    if (!caller) {
      return NextResponse.json({ success: false, error: "Not signed in" }, { status: 401 });
    }

    const { data: callerRole } = await supabaseAdmin
      .from("admin_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "super_admin")
      .maybeSingle();

    if (!callerRole) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    // 2. Validate the request
    const body = (await req.json()) as { email?: unknown; role?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const role = typeof body.role === "string" ? body.role : "";

    if (!email || !role) {
      return NextResponse.json({ success: false, error: "Missing email or role" }, { status: 400 });
    }
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }

    // 3. Look up the user by email
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with that email. The user must sign up at /auth first.",
        },
        { status: 404 }
      );
    }

    // 4. Don't create a second role for the same user
    const { data: existing } = await supabaseAdmin
      .from("admin_roles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "This user already has a role assigned. Change it from the roles page instead.",
        },
        { status: 409 }
      );
    }

    // 5. Insert the new role
    const { error: insertError } = await supabaseAdmin
      .from("admin_roles")
      .insert([{ user_id: user.id, role, email: user.email ?? email }]);

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add role error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}