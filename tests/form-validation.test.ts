import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeLeadPayload, validateLeadPayload } from "../lib/rakez/validation";

test("accepts a clean lead payload with consent", () => {
  const payload = sanitizeLeadPayload({
    locale: "fr",
    firstName: "Robin",
    lastName: "Test",
    email: "M@Example.COM",
    phone: "+971 50 000 0000",
    activity: "Project Management Consultancy Services",
    consent: true,
  });
  assert.equal(payload.email, "m@example.com");
  assert.equal(validateLeadPayload(payload).ok, true);
});

test("rejects missing consent, invalid email and honeypot", () => {
  const payload = sanitizeLeadPayload({
    firstName: "Bot",
    lastName: "Lead",
    email: "not-email",
    activity: "Trading",
    consent: false,
    website: "https://spam.example",
  });
  const validation = validateLeadPayload(payload);
  assert.equal(validation.ok, false);
  assert.ok(validation.errors.length >= 3);
});

test("sanitizes angle brackets from text fields", () => {
  const payload = sanitizeLeadPayload({
    firstName: "<A>",
    lastName: "B",
    email: "a@example.com",
    activity: "<script>consulting</script>",
    consent: true,
  });
  assert.equal(payload.firstName, "A");
  assert.doesNotMatch(payload.activity || "", /<|>/);
});
