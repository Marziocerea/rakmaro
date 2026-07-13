import { NextResponse } from "next/server";
import activitiesJson from "@/data/rakez/activities.json";
import { searchActivities } from "@/lib/rakez/search";
import type { ActivityRecord } from "@/lib/rakez/types";

const activities = activitiesJson as ActivityRecord[];

function publicActivity(activity: ActivityRecord) {
  return {
    ...activity,
    description: activity.description.slice(0, 420),
    qualificationRequirement: "",
    documentsRequired: "",
    keywords: [],
  };
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 7), 12);

  if (query.trim().length < 2) {
    return NextResponse.json({ ok: true, activities: [] });
  }

  const results = searchActivities(activities, query, { activeOnly: true, freeZoneOnly: true }, limit).map(publicActivity);
  return NextResponse.json({ ok: true, activities: results });
}
