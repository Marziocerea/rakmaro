const STOP_WORDS = new Set([
  "and",
  "for",
  "the",
  "with",
  "services",
  "service",
  "trading",
  "business",
  "company",
  "consultancy",
  "consulting",
  "de",
  "des",
  "du",
  "la",
  "le",
  "les",
  "pour",
  "avec",
  "societe",
  "conseil",
  "commerce",
]);

const SYNONYMS: Record<string, string[]> = {
  conseil: ["consultancy", "consulting", "advisory", "management"],
  consultant: ["consultancy", "consulting", "advisory"],
  marketing: ["marketing", "advertising", "media"],
  ecommerce: ["e-commerce", "etrading", "e-trading", "internet"],
  "e-commerce": ["e-commerce", "etrading", "e-trading", "internet"],
  import: ["import", "trading", "commercial"],
  export: ["export", "trading", "commercial"],
  formation: ["training", "education", "educational"],
  logiciel: ["software", "it", "information", "technology"],
  immobilier: ["real estate", "property"],
  finance: ["finance", "financial", "investment"],
  crypto: ["crypto", "virtual", "asset"],
  recrutement: ["recruitment", "employment", "hr"],
  projet: ["project", "management"],
};

export function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokenize(value: unknown) {
  const base = normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  return Array.from(new Set(base.flatMap((token) => [token, ...(SYNONYMS[token] ?? [])])));
}

export function slugify(value: unknown) {
  return normalizeText(value).replace(/\s+/g, "-").replace(/^-|-$/g, "");
}

export function includesRiskKeyword(value: string) {
  const text = normalizeText(value);
  return [
    "bank",
    "financial",
    "finance",
    "investment",
    "insurance",
    "crypto",
    "virtual asset",
    "legal",
    "law",
    "medical",
    "clinic",
    "health",
    "pharmaceutical",
    "education",
    "school",
    "training",
    "aviation",
    "transport",
    "real estate",
    "accounting",
    "audit",
    "factory",
    "manufacturing",
  ].some((keyword) => text.includes(keyword));
}
