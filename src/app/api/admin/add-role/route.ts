import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email, role } = (await req.json()) as { email: string; role: string };

    if (!email || !role) {
      return NextResponse.json({ success: false, error: "Missing email or role" }, { status: 400 });
    }

    // Look up user by email using admin client
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
    }

    const user = usersData.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "No account found with that email. The user must sign up at /auth first.",
      }, { status: 404 });
    }

    // Check if user already has a role
    const { data: existing } = await supabaseAdmin
      .from("admin_roles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({
        success: false,
        error: "This user already has a role assigned. Change it from the roles page instead.",
      }, { status: 409 });
    }

    // Insert new role
    const { error: insertError } = await supabaseAdmin
      .from("admin_roles")
      .insert([{ user_id: user.id, role }]);

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add role error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
