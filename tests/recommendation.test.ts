import assert from "node:assert/strict";
import test from "node:test";
import activitiesJson from "../data/rakez/activities.json";
import { recommendPackage } from "../lib/rakez/recommendation";
import type { ActivityRecord, SimulatorAnswers } from "../lib/rakez/types";

const activities = activitiesJson as ActivityRecord[];
const activity = (id?: string) => activities.find((item) => item.id === id);

const base: SimulatorAnswers = {
  activityQuery: "Project Management Consultancy Services",
  selectedActivityId: "AM-06070",
  activityCategory: "consulting",
  shareholders: "1",
  visas: "1",
  facility: "coworking",
  clients: "international",
  relocation: "yes-dubai",
  timeline: "30-days",
};

test("recommends Lite for a simple solo founder with one visa", () => {
  const result = recommendPackage(base, activity(base.selectedActivityId));
  assert.equal(result.status, "recommended");
  assert.match(result.packageName, /Lite/i);
  assert.equal(result.indicativeBudget, 12010);
});

test("recommends Pro 0 visa for company-only setups", () => {
  const answers = { ...base, visas: "0", relocation: "later" } as SimulatorAnswers;
  const result = recommendPackage(answers, activity(answers.selectedActivityId));
  assert.equal(result.status, "recommended");
  assert.match(result.packageName, /Pro 0 visa/i);
  assert.equal(result.indicativeBudget, 6010);
});

test("routes ESR or special activities to manual review", () => {
  const answers = {
    ...base,
    activityQuery: "Accounting & Bookkeeping",
    selectedActivityId: "AM-01852",
    activityCategory: "regulated",
  } as SimulatorAnswers;
  const result = recommendPackage(answers, activity(answers.selectedActivityId));
  assert.equal(result.status, "manual-study");
  assert.match(result.reasons.join(" "), /ESR|speciale|spéciale|reglementee|réglementée|special/i);
});

test("routes high visa count to manual review", () => {
  const answers = { ...base, visas: "5+" } as SimulatorAnswers;
  const result = recommendPackage(answers, activity(answers.selectedActivityId));
  assert.equal(result.status, "manual-study");
  assert.match(result.reasons.join(" "), /visas/i);
});

test("provides a provisional estimate when the activity wording is not matched yet", () => {
  const result = recommendPackage({
    ...base,
    activityQuery: "I sell consulting services to European clients",
    selectedActivityId: undefined,
  });
  assert.equal(result.status, "recommended");
  assert.equal(result.matchStatus, "provisional");
  assert.match(result.warnings.join(" "), /provisoire|exact/i);
});

test("routes empty or unclear activity to manual review", () => {
  const result = recommendPackage({
    ...base,
    activityQuery: "",
    selectedActivityId: undefined,
    activityCategory: "unknown",
  });
  assert.equal(result.status, "manual-study");
  assert.match(result.reasons.join(" "), /absente|non selectionnee/i);
});
