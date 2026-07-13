import { NextResponse } from "next/server";
import { buildLeadEmailText } from "@/lib/rakez/summary";
import { createLeadId, sanitizeLeadPayload, validateLeadPayload } from "@/lib/rakez/validation";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 6;
const hits = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.expiresAt < now) {
    hits.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: ["Too many requests."] }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Invalid JSON."] }, { status: 400 });
  }

  const lead = sanitizeLeadPayload(body as Record<string, unknown>);
  const validation = validateLeadPayload(lead);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 422 });
  }

  const leadId = createLeadId();
  const text = buildLeadEmailText(leadId, lead);

  // Integration point: wire Resend, HubSpot, Airtable, Supabase or a webhook here.
  // Keep provider API keys server-side only through environment variables.
  console.info(text);

  return NextResponse.json({
    ok: true,
    leadId,
    message:
      lead.locale === "fr"
        ? "Votre demande est prequalifiee. Rakmaro revient vers vous avec une lecture humaine."
        : "Your request is pre-qualified. Rakmaro will follow up with a human review.",
  });
}
