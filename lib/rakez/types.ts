export type Locale = "fr" | "en";

export type Complexity = "low" | "medium" | "high" | "manual";

export type ActivityRecord = {
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

export type RakezPackage = {
  id: string;
  family: "lite" | "pro" | "max" | "designated-zone";
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

export type SimulatorAnswers = {
  activityQuery: string;
  selectedActivityId?: string;
  activityCategory: "consulting" | "digital" | "ecommerce" | "trading" | "industry" | "education" | "regulated" | "unknown";
  shareholders: "1" | "2-5" | "6+";
  visas: "0" | "1" | "2-4" | "5+";
  facility: "coworking" | "office" | "warehouse" | "not-sure";
  clients: "international" | "uae" | "mixed" | "not-sure";
  relocation: "no" | "yes-dubai" | "yes-rak" | "later";
  timeline: "now" | "30-days" | "quarter" | "exploring";
  nationality?: string;
};

export type Recommendation = {
  status: "recommended" | "manual-study";
  matchStatus: "catalog" | "provisional" | "manual";
  packageId?: string;
  packageName: string;
  packageFamily: string;
  headline: string;
  indicativeBudget: number | null;
  budgetLabel: string;
  complexity: Complexity;
  included: string[];
  notIncluded: string[];
  validationPoints: string[];
  reasons: string[];
  warnings: string[];
  documents: string[];
};

export type LeadPayload = {
  locale: Locale;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  nationality?: string;
  activity?: string;
  selectedActivityId?: string;
  shareholders?: string;
  visas?: string;
  facility?: string;
  clients?: string;
  relocation?: string;
  timeline?: string;
  budget?: string;
  message?: string;
  consent: boolean;
  website?: string;
  recommendation?: Recommendation;
};
