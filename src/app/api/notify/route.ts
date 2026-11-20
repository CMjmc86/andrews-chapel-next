import { Resend } from "resend";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/notify
 *
 * Sends notification emails. Two kinds of caller:
 *  - PUBLIC form types (visitor_card, membership, ...): anonymous visitors.
 *    These can ONLY trigger an email to the church staff address. The request
 *    body never decides who receives mail.
 *  - STAFF task types (task_assigned, task_completed): require a signed-in
 *    staff member. Recipients must be real staff (admin_roles rows).
 *
 * All values from the request are HTML-escaped and length-limited.
 */

const resend = new Resend(process.env.RESEND_API_KEY);

// Where staff notifications go. Set STAFF_NOTIFY_EMAIL in Vercel + .env.local.
const STAFF_EMAIL = process.env.STAFF_NOTIFY_EMAIL;
const FROM_ADDRESS =
  process.env.NOTIFY_FROM_ADDRESS ?? "Andrews Chapel <onboarding@resend.dev>";
// Thank-you emails to the person who filled in a form. OFF until the Resend
// domain is verified AND rate limiting exists (otherwise anyone could use the
// form to send our email to any address).
const SEND_SUBMITTER_EMAILS = process.env.ENABLE_SUBMITTER_EMAILS === "true";

type NotifyType =
  | "visitor_card" | "membership" | "message_pastor" | "connect_group"
  | "prayer_request" | "praise_report" | "task_assigned" | "task_completed";

const PUBLIC_TYPES: NotifyType[] = [
  "visitor_card", "membership", "message_pastor", "connect_group",
  "prayer_request", "praise_report",
];
const TASK_TYPES: NotifyType[] = ["task_assigned", "task_completed"];

type FormData = Record<string, unknown>;

const TITLES: Record<NotifyType, string> = {
  visitor_card: "New Visitor Card Submitted",
  membership: "New Membership Application Submitted",
  message_pastor: "New Message for the Pastor",
  connect_group: "New Connect Group Signup",
  prayer_request: "New Prayer Request",
  praise_report: "New Praise Report",
  task_assigned: "New Task Assigned",
  task_completed: "Task Completed",
};

function esc(value: unknown, max = 2000): string {
  return String(value ?? "")
    .slice(0, max)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Strip CR/LF so a value can never break out of an email subject header.
function subjectSafe(value: unknown, max = 80): string {
  return String(value ?? "").replace(/[\r\n]+/g, " ").slice(0, max).trim();
}

function name(d: FormData): string {
  return subjectSafe(`${d.first_name ?? ""} ${d.last_name ?? ""}`) || "Anonymous";
}

function subjectFor(type: NotifyType, d: FormData): string {
  switch (type) {
    case "visitor_card": return `New Visitor Card: ${name(d)}`;
    case "membership": return `New Membership Application: ${name(d)}`;
    case "message_pastor": return `New Message for the Pastor: ${name(d)}`;
    case "connect_group": return `New Connect Group Signup: ${name(d)}`;
    case "prayer_request": return `New Prayer Request: ${subjectSafe(d.display_name) || "Anonymous"}`;
    case "praise_report": return `New Praise Report: ${subjectSafe(d.display_name) || "Anonymous"}`;
    case "task_assigned": return `New Task Assigned: ${subjectSafe(d.title)}`;
    case "task_completed": return `Task Completed: ${subjectSafe(d.title)}`;
  }
}

function staffHtml(type: NotifyType, d: FormData): string {
  const rows = Object.entries(d)
    .slice(0, 30)
    .map(([key, value]) => {
      const label = esc(key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), 60);
      const shown = typeof value === "boolean" ? (value ? "Yes" : "No") : value == null || value === "" ? "—" : esc(value);
      return `<p><strong>${label}:</strong> ${shown}</p>`;
    })
    .join("");
  return `<h2>${TITLES[type]}</h2>${rows}`;
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) throw new Error(error.message);
}

const SIGNATURE = `<p style="margin-top:24px;">In Christ,<br/>Andrews Chapel AME Zion Church</p>`;

async function sendSubmitterEmail(type: NotifyType, d: FormData): Promise<void> {
  if (!SEND_SUBMITTER_EMAILS) return;
  const email = typeof d.email === "string" ? d.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return;
  if (type === "visitor_card") {
    await send(email, "Thank You for Visiting Andrews Chapel!",
      `<h2>Thank You, ${esc(d.first_name, 60)}!</h2>
       <p>We're so glad you joined us at Andrews Chapel. It was a blessing to have you with us.</p>
       <p>Pastor Kathy Grace will be reaching out to you soon. In the meantime, please don't hesitate to reach out with any questions.</p>
       <p>We can't wait to see you again!</p>${SIGNATURE}`);
  } else if (type === "membership") {
    await send(email, "Welcome to the Andrews Chapel Family!",
      `<h2>Welcome, ${esc(d.first_name, 60)}!</h2>
       <p>Thank you for taking this step toward membership at Andrews Chapel. We're thrilled to have you join our church family.</p>
       <p>Pastor Kathy Grace and our membership team will be reaching out to you soon to walk through next steps.</p>${SIGNATURE}`);
  }
}

/** Returns the signed-in staff member's role, or null. */
async function getCallerRole(): Promise<string | null> {
  const cookieStore = cookies();
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_roles").select("role").eq("user_id", user.id).maybeSingle();
  return data?.role ?? null;
}

/** True only if this email belongs to a real staff member. */
async function isStaffEmail(email: string): Promise<boolean> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await admin
    .from("admin_roles").select("id").ilike("email", email).limit(1);
  return !!data && data.length > 0;
}

function taskHtml(heading: string, d: FormData, who: string): string {
  return `<h2>${heading}</h2>
    <p><strong>Task:</strong> ${esc(d.title, 200)}</p>
    ${d.description ? `<p><strong>Details:</strong> ${esc(d.description)}</p>` : ""}
    ${d.due_date ? `<p><strong>Due Date:</strong> ${esc(d.due_date, 20)}</p>` : ""}
    ${who}
    <p style="margin-top:16px;">Please log in to the admin dashboard to view and manage your tasks.</p>${SIGNATURE}`;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!STAFF_EMAIL) {
      console.error("STAFF_NOTIFY_EMAIL is not set");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const body = await req.json().catch(() => null) as { type?: NotifyType; data?: FormData } | null;
    const type = body?.type;
    const data = body?.data;
    if (!type || !data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ success: false, error: "Missing type or data" }, { status: 400 });
    }

    // ── Public form notifications: staff inbox only ──
    if (PUBLIC_TYPES.includes(type)) {
      await send(STAFF_EMAIL, subjectFor(type, data), staffHtml(type, data));
      await sendSubmitterEmail(type, data).catch((e) => console.error("Submitter email failed:", e));
      return NextResponse.json({ success: true });
    }

    // ── Staff task notifications: signed-in staff only ──
    if (TASK_TYPES.includes(type)) {
      const role = await getCallerRole();
      if (!role) return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });

      if (type === "task_assigned") {
        if (!["super_admin", "tech_admin", "pastor"].includes(role)) {
          return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }
        const to = String(data.assigned_to_email ?? "").trim();
        if (!to || !(await isStaffEmail(to))) {
          return NextResponse.json({ success: false, error: "Recipient is not staff" }, { status: 400 });
        }
        await send(to, subjectFor(type, data),
          taskHtml("You have been assigned a new task", data,
            `<p><strong>Assigned by:</strong> ${esc(data.assigned_by_email, 200)}</p>`));
      } else {
        const to = String(data.assigned_by_email ?? "").trim();
        if (to && (await isStaffEmail(to))) {
          await send(to, subjectFor(type, data),
            taskHtml("A task has been marked complete", data,
              `<p><strong>Completed by:</strong> ${esc(data.assigned_to_email, 200)}</p>`));
        }
        await send(STAFF_EMAIL, subjectFor(type, data), staffHtml(type, data));
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown type" }, { status: 400 });
  } catch (err) {
    console.error("Notify error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
