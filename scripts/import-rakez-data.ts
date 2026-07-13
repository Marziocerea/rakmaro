import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

type PackageFamily = "lite" | "pro" | "max" | "designated-zone";
type ActivityRecord = {
  id: string;
  masterNumber: string;
  activityCode: string;
  name: string;
  zone: string;
  status: string;
  active: boolean;
  freeZone: boolean;
  licenseType: string;
  minimumShareCapital: number | null;
  notAllowedForCoworking: boolean;
  hseRisk: string;
  complianceRisk: string;
  isSpecial: boolean;
  activityPrice: number | null;
  requiredFacilityType: string;
  activityGroup: string;
  businessSector: string;
  subsector: string;
  segment: string;
  description: string;
  qualificationRequirement: string;
  documentsRequired: string;
  keywords: string[];
};
type RakezPackage = {
  id: string;
  family: PackageFamily;
  name: string;
  activities: string;
  shareholders: string;
  visaQuota: string;
  includedVisas: number;
  maxVisas: number;
  facilityType: string;
  legalForm: string;
  prices: Record<string, number>;
  oneYearPrice: number | null;
  notes: string[];
};

const STOP_WORDS = new Set(["and", "for", "the", "with", "services", "service", "business", "company"]);
const SYNONYMS: Record<string, string[]> = {
  conseil: ["consultancy", "consulting", "advisory"],
  projet: ["project", "management"],
  ecommerce: ["e-commerce", "etrading", "e-trading", "internet"],
  logiciel: ["software", "information", "technology"],
};

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: unknown) {
  const base = normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  return Array.from(new Set(base.flatMap((token) => [token, ...(SYNONYMS[token] ?? [])])));
}

function slugify(value: unknown) {
  return normalizeText(value).replace(/\s+/g, "-").replace(/^-|-$/g, "");
}

const projectRoot = path.resolve(process.cwd(), "..");
const outputDir = path.resolve(process.cwd(), "data/rakez");
const packageCandidates = [
  path.join(projectRoot, "RAKEZ - ALL PACKAGES 2026 (1).xlsx"),
  path.join(projectRoot, "RAKEZ - ALL PACKAGES  2026 (1).xlsx"),
];
const activityFile = path.join(projectRoot, "RAKEZ ACTIVE BUSINESS ACTIVITIES LICENSE TYPES 2026.xlsx");

function readWorkbook(filePath: string) {
  return XLSX.readFile(filePath, { cellDates: false });
}

function firstExisting(paths: string[]) {
  for (const candidate of paths) {
    if (existsSync(candidate)) {
      return readWorkbook(candidate);
    }
  }
  throw new Error(`Missing RAKEZ packages workbook. Tried: ${paths.join(", ")}`);
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function numberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseIncludedVisas(value: string, name: string) {
  if (/\bzero\b|\b0\s*visa/i.test(`${name} ${value}`)) return 0;
  const match = `${name} ${value}`.match(/(\d+)\s*(?:free\s*)?(?:visa|visas)/i);
  if (!match && /^\d+$/.test(value.trim())) return Number(value.trim());
  return match ? Number(match[1]) : 0;
}

function parseMaxVisas(value: string, included: number) {
  const upTo = value.match(/up\s*to\s*(\d+)/i);
  if (upTo) return Number(upTo[1]);
  return Math.max(included, 0);
}

function familyFromSheet(sheetName: string): PackageFamily {
  if (/lite/i.test(sheetName)) return "lite";
  if (/max/i.test(sheetName)) return "max";
  if (/designated/i.test(sheetName)) return "designated-zone";
  return "pro";
}

function parsePackages() {
  const workbook = firstExisting(packageCandidates);
  const packages: RakezPackage[] = [];

  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
      header: 1,
      defval: "",
      blankrows: false,
    });
    const productRow = rows.findIndex((row) => /product name/i.test(text(row[0])));
    if (productRow === -1) continue;
    const labels = rows.map((row) => text(row[0]).toLowerCase());
    const rowFor = (needle: RegExp) => rows[labels.findIndex((label) => needle.test(label))] ?? [];
    const activityRow = rowFor(/#activities/);
    const shareholderRow = rowFor(/#shareholders/);
    const visaRow = rowFor(/visa quota/);
    const facilityRow = rowFor(/^facility type$|facility type/i);
    const legalRow = rowFor(/legal form/);
    const notesRows = rows.filter((row) =>
      /additional visa|bank letter|establishment card|mix and match|promo code/i.test(text(row[0])),
    );

    for (let column = 1; column < rows[productRow].length; column += 1) {
      const name = text(rows[productRow][column]);
      if (!name || /product name/i.test(name)) continue;
      const prices: Record<string, number> = {};
      rows.forEach((row) => {
        const label = text(row[0]);
        if (/^price\s+\d+\s+year/i.test(label)) {
          const price = numberOrNull(row[column]);
          if (price) prices[slugify(label)] = price;
        }
      });
      const oneYearPrice = prices["price-1-year"] ?? null;
      const visaQuota = text(visaRow[column]);
      const includedVisas = parseIncludedVisas(visaQuota, name);
      packages.push({
        id: slugify(`${sheetName}-${name}`),
        family: familyFromSheet(sheetName),
        name,
        activities: text(activityRow[column]),
        shareholders: text(shareholderRow[column]),
        visaQuota,
        includedVisas,
        maxVisas: parseMaxVisas(visaQuota, includedVisas),
        facilityType: text(facilityRow[column]),
        legalForm: text(legalRow[column]),
        prices,
        oneYearPrice,
        notes: notesRows.map((row) => `${text(row[0])}: ${text(row[column])}`).filter((item) => !item.endsWith(":")),
      });
    }
  }

  return packages.filter((item) => item.oneYearPrice !== null);
}

function parseActivities() {
  const workbook = readWorkbook(activityFile);
  const specialRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets["Special activity"] ?? workbook.Sheets[workbook.SheetNames[1]], {
    defval: "",
  });
  const specialByName = new Map(
    specialRows.map((row) => [
      text(row.Activity).toLowerCase(),
      {
        fee: numberOrNull(row["Special Activity Fee"]),
        facility: text(row["Required Facility Type"]),
      },
    ]),
  );

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets["01112023 List"], {
    defval: "",
  });

  return rows.map<ActivityRecord>((row, index) => {
    const name = text(row["Activity Name"]);
    const special = specialByName.get(name.toLowerCase());
    const masterNumber = text(row["Activity Master: Activity Master Number"]);
    const activityCode = text(row["Activity Code"]);
    const isSpecial = text(row["Is Special"]).toLowerCase() === "special" || Boolean(special);
    const keywordSource = [
      name,
      row["License Type"],
      row["Activity Group"],
      row["Business Sector"],
      row.Subsector,
      row["Segment Name English"],
      row.Description,
    ].join(" ");

    return {
      id: masterNumber || activityCode || `activity-${index + 1}`,
      masterNumber,
      activityCode,
      name,
      zone: text(row.Zone),
      status: text(row.Status),
      active: text(row.Status).toLowerCase() === "active",
      freeZone: text(row.Zone).toLowerCase() === "freezone",
      licenseType: text(row["License Type"]),
      minimumShareCapital: numberOrNull(row["Minimum Share Capital"]),
      notAllowedForCoworking: text(row["Is Not Allowed for Coworking(ESR)"]).toLowerCase() === "esr",
      hseRisk: text(row["RAKEZ HSE Risk Classification"]),
      complianceRisk: text(row["Compliance Risk Rating -RR"]),
      isSpecial,
      activityPrice: numberOrNull(row["Activity Price"]) ?? special?.fee ?? null,
      requiredFacilityType: special?.facility ?? "",
      activityGroup: text(row["Activity Group"]),
      businessSector: text(row["Business Sector"]),
      subsector: text(row.Subsector),
      segment: text(row["Segment Name English"]),
      description: text(row.Description),
      qualificationRequirement: text(row["Qualification Requirement"]),
      documentsRequired: text(row["Documents Required"]),
      keywords: tokenize(keywordSource),
    };
  });
}

const packages = parsePackages();
const activities = parseActivities();
const activeFreeZone = activities.filter((activity) => activity.active && activity.freeZone);
const publicActivities = activeFreeZone.map((activity) => [
  activity.id,
  activity.masterNumber,
  activity.activityCode,
  activity.name,
  activity.licenseType,
  activity.minimumShareCapital,
  activity.notAllowedForCoworking,
  activity.isSpecial,
  activity.activityPrice,
  activity.requiredFacilityType,
  activity.activityGroup,
  activity.businessSector,
  activity.subsector,
  activity.segment,
  activity.complianceRisk,
  activity.description.slice(0, 220),
  tokenize(
    [
      activity.name,
      activity.licenseType,
      activity.activityGroup,
      activity.businessSector,
      activity.subsector,
      activity.segment,
    ].join(" "),
  ).slice(0, 24),
]);
const report = {
  importedAt: new Date().toISOString(),
  sources: {
    packages: packageCandidates.map((candidate) => path.basename(candidate)),
    activities: path.basename(activityFile),
  },
  packageCount: packages.length,
  activityCount: activities.length,
  activeActivityCount: activities.filter((activity) => activity.active).length,
  activeFreeZoneActivityCount: activeFreeZone.length,
  specialActivityCount: activities.filter((activity) => activity.isSpecial).length,
  esrActivityCount: activities.filter((activity) => activity.notAllowedForCoworking).length,
  highRiskActivityCount: activities.filter((activity) => /high/i.test(activity.complianceRisk)).length,
  licenseTypes: Object.fromEntries(
    Array.from(
      activeFreeZone.reduce((map, activity) => {
        map.set(activity.licenseType || "Unknown", (map.get(activity.licenseType || "Unknown") ?? 0) + 1);
        return map;
      }, new Map<string, number>()),
    ).sort((a, b) => b[1] - a[1]),
  ),
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "packages.json"), `${JSON.stringify(packages, null, 2)}\n`);
writeFileSync(path.join(outputDir, "activities.json"), `${JSON.stringify(activities, null, 2)}\n`);
writeFileSync(path.join(outputDir, "activities-public.json"), `${JSON.stringify(publicActivities, null, 2)}\n`);
writeFileSync(path.join(outputDir, "import-report.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log(
  `Imported ${packages.length} packages and ${activities.length} activities (${report.activeFreeZoneActivityCount} active free zone).`,
);
