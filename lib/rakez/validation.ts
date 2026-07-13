import type { LeadPayload } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()0-9.\-\s]{6,32}$/;

function clean(value: unknown, max = 400) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function sanitizeLeadPayload(input: Partial<LeadPayload>): LeadPayload {
  return {
    locale: input.locale === "en" ? "en" : "fr",
    firstName: clean(input.firstName, 80),
    lastName: clean(input.lastName, 80),
    email: clean(input.email, 120).toLowerCase(),
    phone: clean(input.phone, 40),
    whatsapp: clean(input.whatsapp, 40),
    country: clean(input.country, 80),
    nationality: clean(input.nationality, 80),
    activity: clean(input.activity, 220),
    selectedActivityId: clean(input.selectedActivityId, 80),
    shareholders: clean(input.shareholders, 20),
    visas: clean(input.visas, 20),
    facility: clean(input.facility, 40),
    clients: clean(input.clients, 40),
    relocation: clean(input.relocation, 40),
    timeline: clean(input.timeline, 40),
    budget: clean(input.budget, 80),
    message: clean(input.message, 1200),
    consent: input.consent === true,
    website: clean(input.website, 120),
    recommendation: input.recommendation,
  };
}

export function validateLeadPayload(payload: LeadPayload) {
  const errors: string[] = [];
  if (payload.website) errors.push("Spam protection triggered.");
  if (!payload.firstName) errors.push("First name is required.");
  if (!payload.lastName) errors.push("Last name is required.");
  if (!EMAIL_RE.test(payload.email)) errors.push("Valid email is required.");
  if (payload.phone && !PHONE_RE.test(payload.phone)) errors.push("Phone number format is invalid.");
  if (payload.whatsapp && !PHONE_RE.test(payload.whatsapp)) errors.push("WhatsApp number format is invalid.");
  if (!payload.activity) errors.push("Activity is required.");
  if (!payload.consent) errors.push("Consent is required.");
  return { ok: errors.length === 0, errors };
}

export function createLeadId(now = new Date()) {
  const stamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RKM-${stamp}-${random}`;
}
