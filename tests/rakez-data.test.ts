import assert from "node:assert/strict";
import test from "node:test";
import activitiesJson from "../data/rakez/activities.json";
import { importReport, packages } from "../lib/rakez/data";
import { searchActivities } from "../lib/rakez/search";
import type { ActivityRecord } from "../lib/rakez/types";

const activities = activitiesJson as ActivityRecord[];

test("imports RAKEZ packages and active free zone activities", () => {
  assert.equal(importReport.activeFreeZoneActivityCount, 1597);
  assert.equal(importReport.activeActivityCount, 3395);
  assert.equal(importReport.packageCount, 40);
  assert.ok(activities.length > 4000);
  assert.ok(packages.length >= 40);
});

test("normalizes key package entry prices", () => {
  const proZero = packages.find((item) => /pro 0 visa/i.test(item.name));
  const lite = packages.find((item) => /lite package/i.test(item.name));
  const proCoworking = packages.find((item) => /pro co working 1 visa/i.test(item.name));

  assert.equal(proZero?.oneYearPrice, 6010);
  assert.equal(lite?.oneYearPrice, 12010);
  assert.equal(proCoworking?.oneYearPrice, 14010);
});

test("searches RAKEZ activities with practical French synonyms", () => {
  const results = searchActivities(activities, "conseil projet", { activeOnly: true, freeZoneOnly: true }, 5);
  assert.ok(results.length > 0);
  assert.ok(results.some((activity) => /project|consultancy|management/i.test(activity.name)));
  assert.ok(results.every((activity) => activity.active && activity.freeZone));
});
