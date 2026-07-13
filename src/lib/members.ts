import { supabase } from "@/lib/supabase";

export type MemberStatus = "pending" | "approved" | "rejected";

export type Member = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: MemberStatus;
  directory_opt_in: boolean;
  created_at: string;
};

export async function getCurrentMember(): Promise<Member | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data as Member | null;
}
