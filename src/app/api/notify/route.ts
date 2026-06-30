import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const STAFF_EMAIL = "cmjmctech@gmail.com"; // TODO: switch to contact@andrewschapelame.org once domain is verified
const FROM_ADDRESS = "Andrews Chapel <onboarding@resend.dev>"; // TODO: switch to your domain once verified

type NotifyPayload = {
  type:
    | "visitor_card"
    | "membership"
    | "message_pastor"
    | "connect_group"
    | "prayer_request"
    | "praise_report";
  data: Record<string, any>;
};

const STAFF_SUBJECTS: Record<NotifyPayload["type"], (d: any) => string> = {
  visitor_card: (d) => `New Visitor Card: ${d.first_name} ${d.last_name}`,
  membership: (d) => `New Membership Application: ${d.first_name} ${d.last_name}`,
  message_pastor: (d) => `New Message for the Pastor: ${d.first_name ?? ""} ${d.last_name ?? ""}`.trim(),
  connect_group: (d) => `New Connect Group Signup: ${d.first_name} ${d.last_name}`,
  prayer_request: (d) => `New Prayer Request: ${d.display_name ?? "Anonymous"}`,
  praise_report: (d) => `New Praise Report: ${d.display_name ?? "Anonymous"}`,
};

function buildStaffHtml(type: NotifyPayload["type"], d: Record<string, any>) {
  const rows = Object.entries(d)
    .map(([key, value]) => {
      const label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const display =
        typeof value === "boolean" ? (value ? "Yes" : "No") : value || "—";
      return `<p><strong>${label}:</strong> ${display}</p>`;
    })
    .join("");
  const titleMap: Record<NotifyPayload["type"], string> = {
    visitor_card: "New Visitor Card Submitted",
    membership: "New Membership Application Submitted",
    message_pastor: "New Message for the Pastor",
    connect_group: "New Connect Group Signup",
    prayer_request: "New Prayer Request",
    praise_report: "New Praise Report",
  };
  return `<h2>${titleMap[type]}</h2>${rows}`;
}

async function sendStaffEmail(type: NotifyPayload["type"], d: Record<string, any>) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to: STAFF_EMAIL,
    subject: STAFF_SUBJECTS[type](d),
    html: buildStaffHtml(type, d),
  });
}

async function sendVisitorThankYou(d: Record<string, any>) {
  if (!d.email) return;
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: d.email,
    subject: "Thank You for Visiting Andrews Chapel!",
    html: `
      <h2>Thank You, ${d.first_name}!</h2>
      <p>We're so glad you joined us at Andrews Chapel. It was a blessing to have you with us.</p>
      <p>Pastor Kathy Grace will be reaching out to you soon. In the meantime, please don't hesitate to reach out with any questions.</p>
      <p>We can't wait to see you again!</p>
      <p style="margin-top:24px;">In Christ,<br/>Andrews Chapel AME Church</p>
    `,
  });
}

async function sendMembershipWelcome(d: Record<string, any>) {
  if (!d.email) return;
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: d.email,
    subject: "Welcome to the Andrews Chapel Family!",
    html: `
      <h2>Welcome, ${d.first_name}!</h2>
      <p>Thank you for taking this step toward membership at Andrews Chapel. We're thrilled to have you join our church family.</p>
      <p>Pastor Kathy Grace and our membership team will be reaching out to you soon to walk through next steps.</p>
      <p style="margin-top:24px;">In Christ,<br/>Andrews Chapel AME Church</p>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const { type, data } = (await req.json()) as NotifyPayload;

    if (!type || !data) {
      return NextResponse.json({ success: false, error: "Missing type or data" }, { status: 400 });
    }

    await sendStaffEmail(type, data);

    if (type === "visitor_card") {
      await sendVisitorThankYou(data);
    } else if (type === "membership") {
      await sendMembershipWelcome(data);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
