import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Role = "super_admin" | "tech_admin" | "pastor" | "leader";

export async function getUserRole(): Promise<Role | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  return (data?.role as Role) || null;
}

export function canManageRoles(role: Role | null) {
  return role === "super_admin";
}

export function canManageSermons(role: Role | null) {
  return role === "super_admin" || role === "tech_admin";
}

export function canManageBulletins(role: Role | null) {
  return role === "super_admin" || role === "tech_admin" || role === "pastor";
}

export function canManageEvents(role: Role | null) {
  return role === "super_admin" || role === "tech_admin" || role === "pastor";
}

export function canViewSubmissions(role: Role | null) {
  return role === "super_admin" || role === "tech_admin" || role === "pastor";
}

export function canAssignTasks(role: Role | null) {
  return role === "super_admin" || role === "tech_admin" || role === "pastor";
}

export function canAccessAdmin(role: Role | null) {
  return role !== null;
}