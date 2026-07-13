import type { ActivityRecord } from "./types";
import { normalizeText, tokenize } from "./text";

export type ActivitySearchFilters = {
  activeOnly?: boolean;
  freeZoneOnly?: boolean;
  licenseType?: string;
};

export function scoreActivity(activity: ActivityRecord, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 0;
  const tokens = tokenize(query);
  const haystack = normalizeText(
    [
      activity.name,
      activity.activityCode,
      activity.licenseType,
      activity.activityGroup,
      activity.businessSector,
      activity.subsector,
      activity.segment,
      activity.description,
    ].join(" "),
  );

  let score = 0;
  if (normalizeText(activity.name).includes(normalizedQuery)) score += 80;
  if (normalizeText(activity.activityCode) === normalizedQuery) score += 90;
  for (const token of tokens) {
    if (normalizeText(activity.name).includes(token)) score += 12;
    if (activity.keywords.includes(token) || haystack.includes(token)) score += 4;
  }
  if (activity.active) score += 8;
  if (activity.freeZone) score += 8;
  if (activity.isSpecial || activity.notAllowedForCoworking) score -= 3;
  return score;
}

export function searchActivities(
  activities: ActivityRecord[],
  query: string,
  filters: ActivitySearchFilters = {},
  limit = 8,
) {
  const normalized = normalizeText(query);
  const base = activities.filter((activity) => {
    if (filters.activeOnly && !activity.active) return false;
    if (filters.freeZoneOnly && !activity.freeZone) return false;
    if (filters.licenseType && activity.licenseType !== filters.licenseType) return false;
    return normalized.length >= 2;
  });

  return base
    .map((activity) => ({ activity, score: scoreActivity(activity, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.activity.name.localeCompare(b.activity.name))
    .slice(0, limit)
    .map((result) => result.activity);
}

export function listLicenseTypes(activities: ActivityRecord[]) {
  return Array.from(
    activities.reduce((set, activity) => {
      if (activity.active && activity.freeZone && activity.licenseType) set.add(activity.licenseType);
      return set;
    }, new Set<string>()),
  ).sort();
}
