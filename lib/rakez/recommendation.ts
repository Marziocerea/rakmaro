import { findPackage, packages } from "./data";
import { includesRiskKeyword, normalizeText } from "./text";
import type { ActivityRecord, RakezPackage, Recommendation, SimulatorAnswers } from "./types";

const BASE_INCLUDED = [
  "Qualification de l'activite et du type de licence",
  "Selection du package probable et budget indicatif",
  "Preparation du dossier et controle des pieces",
  "Soumission guidee via acces professionnel",
  "Orientation obligations initiales, visa et compte professionnel",
];

const BASE_NOT_INCLUDED = [
  "Frais de tiers non confirmes",
  "Approbations externes, inspections ou locaux specifiques",
  "Garantie de decision bancaire",
  "Conseil fiscal ou juridique reglemente",
];

const BASE_DOCUMENTS = [
  "Passeport de chaque actionnaire",
  "Photo d'identite recente",
  "Adresse et coordonnees de contact",
  "Description precise de l'activite",
  "Choix du nom commercial",
];

function priceLabel(price: number | null) {
  return price ? `des ${price.toLocaleString("fr-FR")} AED` : "sur etude";
}

function selectPackage(answers: SimulatorAnswers, activity?: ActivityRecord) {
  const category = answers.activityCategory;
  const visas = answers.visas;
  const needsOffice = answers.facility === "office";
  const needsWarehouse = answers.facility === "warehouse";
  const isTrade = category === "trading" || /trading|commercial|import|export|general/i.test(activity?.licenseType ?? answers.activityQuery);

  if (needsWarehouse || category === "industry") {
    return { manual: true, reason: "Locaux physiques, industrie ou entrepot a verifier avant chiffrage." };
  }
  if (isTrade && /general trading|commercial/i.test(`${activity?.licenseType} ${activity?.name} ${answers.activityQuery}`)) {
    return {
      manual: true,
      reason: "Commerce, General Trading ou flux marchandises: Designated Zone / approvals a etudier.",
    };
  }
  if (visas === "0") {
    return {
      package: findPackage((item) => item.family === "pro" && /0 visa/i.test(item.name)),
      reason: "Structure UAE sans residence immediate.",
    };
  }
  if (visas === "1" && category !== "digital" && !needsOffice) {
    return {
      package: findPackage((item) => item.family === "lite" && item.includedVisas === 1),
      reason: "Fondateur solo avec besoin residence simple.",
    };
  }
  if ((visas === "1" || visas === "2-4") && !needsOffice) {
    const targetVisas = visas === "1" ? 1 : 2;
    return {
      package:
        findPackage(
          (item) =>
            item.family === "pro" &&
            item.includedVisas >= targetVisas &&
            /co working|coworking/i.test(`${item.name} ${item.facilityType}`),
        ) ?? findPackage((item) => item.family === "max" && item.includedVisas >= targetVisas),
      reason: "Route flexible pour activite evolutive et visas fondateur/equipe.",
    };
  }
  if (needsOffice) {
    return {
      package:
        findPackage((item) => item.family === "pro" && /standard office|serviced office/i.test(item.name)) ??
        findPackage((item) => item.family === "max" && /standard office|serviced office/i.test(item.name)),
      reason: "Presence bureau ou lecture ESR: office a confirmer.",
    };
  }
  return { manual: true, reason: "Besoin visa ou structure actionnariale a chiffrer manuellement." };
}

function manualStudy(reason: string, answers: SimulatorAnswers, activity?: ActivityRecord): Recommendation {
  return {
    status: "manual-study",
    matchStatus: "manual",
    packageName: "Etude Rakmaro necessaire",
    packageFamily: "Manual",
    headline: "Projet a qualifier avant recommandation",
    indicativeBudget: null,
    budgetLabel: "sur etude apres verification",
    complexity: "manual",
    included: BASE_INCLUDED,
    notIncluded: BASE_NOT_INCLUDED,
    reasons: [reason],
    warnings: [
      "Aucune route ne doit etre engagee avant validation de l'activite exacte.",
      "Le budget final depend des approbations, de la facility, des visas et du dossier.",
    ],
    validationPoints: [
      activity ? `Activite: ${activity.name}` : `Activite a clarifier: ${answers.activityQuery || "non renseignee"}`,
      "Eligibilite free zone et besoin mainland eventuel",
      "Facility, approbations externes et capital minimum",
      "Lecture bancaire a preparer, surtout si une residence est prevue",
    ],
    documents: [...BASE_DOCUMENTS, "Description des clients et pays d'operation", "Preuve d'adresse si demandee"],
  };
}

function activityNeedsManualStudy(activity?: ActivityRecord) {
  if (!activity) return "Activite non selectionnee.";
  if (!activity.active) return "Activite inactive ou a confirmer.";
  if (!activity.freeZone) return "Activite non compatible avec la route free zone standard.";
  if (activity.isSpecial) return "Activite speciale avec frais ou verification specifique.";
  if (activity.notAllowedForCoworking) return "Activite ESR/non coworking: bureau dedie a verifier.";
  if (/high/i.test(activity.complianceRisk)) return "Activite marquee high compliance risk.";
  if (includesRiskKeyword(`${activity.name} ${activity.licenseType} ${activity.description}`)) {
    return "Activite potentiellement reglementee ou a approbation externe.";
  }
  return "";
}

export function recommendPackage(answers: SimulatorAnswers, activity?: ActivityRecord): Recommendation {
  const hasActivityDescription = answers.activityQuery.trim().length >= 8;
  const canEstimateWithoutCatalog =
    !activity &&
    hasActivityDescription &&
    answers.activityCategory !== "regulated" &&
    answers.activityCategory !== "unknown";
  const manualReason = canEstimateWithoutCatalog ? "" : activityNeedsManualStudy(activity);
  if (manualReason) return manualStudy(manualReason, answers, activity);
  if (answers.shareholders === "6+") return manualStudy("Plus de 5 associes: actionnariat a structurer avant chiffrage.", answers, activity);
  if (answers.visas === "5+") return manualStudy("Plus de 4 visas: quota, facility et package a confirmer.", answers, activity);
  if (answers.clients === "uae" && /retail|shop|restaurant|clinic|mainland/i.test(normalizeText(answers.activityQuery))) {
    return manualStudy("Clientele ou presence locale UAE pouvant demander une route mainland/dual licence.", answers, activity);
  }

  const selected = selectPackage(answers, activity);
  if (selected.manual || !selected.package) {
    return manualStudy(selected.reason, answers, activity);
  }

  const selectedPackage = selected.package as RakezPackage;
  const validationPoints = [
    activity ? `Activite de licence: ${activity.name}` : "Activite exacte a confirmer",
    activity ? `Type de licence: ${activity.licenseType}` : "Type de licence a confirmer apres analyse",
    `Package probable: ${selectedPackage.name}`,
    answers.clients === "uae" ? "Verifier si l'activite en UAE mainland demande un cadre complementaire." : "Clients hors UAE ou mixtes a documenter.",
    answers.visas === "0"
      ? "Preparer la lecture bancaire et les documents KYC avant depot."
      : "Residence prevue: preparer la lecture bancaire et les documents KYC pour faciliter l'ouverture.",
  ];
  const warnings = [
    "Budget indicatif sujet a confirmation.",
    "Le visa, l'Emirates ID et le compte professionnel restent soumis aux controles des autorites et prestataires.",
  ];
  const documents = [...BASE_DOCUMENTS];
  if (answers.visas !== "0") {
    documents.push("Ancien visa UAE si applicable", "Adresse locale ou plan d'installation aux UAE");
  }
  if (activity?.minimumShareCapital) documents.push(`Capital minimum a verifier: ${activity.minimumShareCapital.toLocaleString("fr-FR")} AED`);

  return {
    status: "recommended",
    matchStatus: activity ? "catalog" : "provisional",
    packageId: selectedPackage.id,
    packageName: selectedPackage.name,
    packageFamily: selectedPackage.family,
    headline: `${selectedPackage.name} probablement adapte`,
    indicativeBudget: selectedPackage.oneYearPrice,
    budgetLabel: `a partir ${priceLabel(selectedPackage.oneYearPrice)}`,
    complexity: answers.visas === "0" ? "low" : answers.visas === "1" ? "medium" : "high",
    included: [
      ...BASE_INCLUDED,
      selectedPackage.includedVisas > 0 ? `${selectedPackage.includedVisas} visa(s) inclus selon package` : "Licence sans visa immediat",
      selectedPackage.facilityType ? `Facility: ${selectedPackage.facilityType}` : "Facility a confirmer",
    ],
    notIncluded: BASE_NOT_INCLUDED,
    validationPoints,
    reasons: [selected.reason],
    warnings: activity
      ? warnings
      : [
          "Estimation provisoire: l'intitule de licence exact doit encore etre confirme.",
          ...warnings,
        ],
    documents,
  };
}

export function packageFloor(family: RakezPackage["family"]) {
  const matches = packages.filter((item) => item.family === family && item.oneYearPrice);
  return matches.sort((a, b) => (a.oneYearPrice ?? 0) - (b.oneYearPrice ?? 0))[0];
}

export { activityNeedsManualStudy };
