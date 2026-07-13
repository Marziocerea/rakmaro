import packagesJson from "../../data/rakez/packages.json";
import reportJson from "../../data/rakez/import-report.json";
import type { ActivityRecord, RakezPackage } from "./types";

export const packages = packagesJson as RakezPackage[];
export const importReport = reportJson as {
  activeFreeZoneActivityCount: number;
  activeActivityCount: number;
  packageCount: number;
  specialActivityCount: number;
  esrActivityCount: number;
  highRiskActivityCount: number;
};

export function getActivityById(catalog: ActivityRecord[], id?: string) {
  if (!id) return undefined;
  return catalog.find((activity) => activity.id === id);
}

export function getPackageById(id?: string) {
  if (!id) return undefined;
  return packages.find((item) => item.id === id);
}

export function findPackage(predicate: (item: RakezPackage) => boolean) {
  return packages.find(predicate);
}
