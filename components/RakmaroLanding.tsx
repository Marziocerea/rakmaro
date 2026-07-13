"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { recommendPackage } from "@/lib/rakez/recommendation";
import type { ActivityRecord, Locale, Recommendation, SimulatorAnswers } from "@/lib/rakez/types";
import { HERO_FRAME_MANIFEST, MOBILE_FRAME_MANIFEST, PRELOAD_FRAME_MANIFEST } from "@/lib/hero-frame-manifest";

const FRAME_WIDTH = 1100;
const FRAME_HEIGHT = 620;
const MIN_CANVAS_FRAMES = 3;

type IconName =
  | "arrow"
  | "bank"
  | "badge"
  | "briefcase"
  | "building"
  | "calendar"
  | "check"
  | "compass"
  | "file"
  | "globe"
  | "home"
  | "id"
  | "language"
  | "landmark"
  | "map"
  | "menu"
  | "package"
  | "plane"
  | "route"
  | "search"
  | "shield"
  | "spark"
  | "users"
  | "x";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string[]> = {
    arrow: ["M5 12h14", "m13 6 6 6-6 6"],
    badge: ["M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.75Z", "m9 12 2 2 4-4"],
    bank: ["M3 10h18L12 4 3 10Z", "M5 10v8", "M9 10v8", "M15 10v8", "M19 10v8", "M4 20h16"],
    briefcase: ["M9 7V5h6v2", "M4 8h16v11H4Z", "M4 13h16"],
    building: ["M4 20V6h8v14", "M12 10h8v10", "M7 9h2", "M7 13h2", "M15 13h2", "M15 17h2"],
    calendar: ["M7 4v3", "M17 4v3", "M4 8h16", "M5 6h14v14H5Z"],
    check: ["m5 12 4 4L19 6"],
    compass: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "m15 9-2 6-4 2 2-6 4-2Z"],
    file: ["M7 3h7l4 4v14H7Z", "M14 3v5h5", "M9 13h6", "M9 17h5"],
    globe: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M3 12h18", "M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21", "M12 3c-2.4 2.5-3.5 5.5-3.5 9s1.1 6.5 3.5 9"],
    home: ["M4 11 12 4l8 7", "M6 10v10h12V10", "M10 20v-6h4v6"],
    id: ["M4 5h16v14H4Z", "M8 10h4", "M8 14h8", "M15 10h1"],
    language: ["M4 5h8", "M8 5v14", "M5 9c1.2 3 3.3 5.2 6 6", "M12 19l4-9 4 9", "M14 15h4"],
    landmark: ["M3 10h18L12 4 3 10Z", "M4 20h16", "M6 10v7", "M10 10v7", "M14 10v7", "M18 10v7"],
    map: ["M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z", "M9 3v15", "M15 6v15"],
    menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
    package: ["m7.5 4.27 9 5.15", "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "m3.3 7 8.7 5 8.7-5", "M12 22V12"],
    plane: ["M3 11 21 3l-8 18-3-7-7-3Z", "m10 14 4-4"],
    route: ["M4 19h6", "M14 5h6", "M10 19c4 0 4-14 8-14", "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
    search: ["M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z", "m16 16 5 5"],
    shield: ["M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z", "m8.5 12 2.2 2.2 4.8-5"],
    spark: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"],
    users: ["M16 20v-2a4 4 0 0 0-8 0v2", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M20 20v-2a3 3 0 0 0-3-3", "M17 5a3 3 0 0 1 0 6"],
    x: ["M6 6l12 12", "M18 6 6 18"],
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

const defaultAnswers: SimulatorAnswers = {
  activityQuery: "",
  activityCategory: "consulting",
  shareholders: "1",
  visas: "1",
  facility: "coworking",
  clients: "international",
  relocation: "yes-dubai",
  timeline: "30-days",
};

const activityCategories = [
  ["consulting", "Conseil / prestation", "Consulting / services"],
  ["digital", "Digital / logiciel", "Digital / software"],
  ["ecommerce", "E-commerce", "E-commerce"],
  ["trading", "Commerce / import-export", "Trade / import-export"],
  ["industry", "Industrie / production", "Industry / production"],
  ["education", "Formation / éducation", "Training / education"],
  ["regulated", "Activité réglementée", "Regulated activity"],
  ["unknown", "À clarifier ensemble", "To clarify together"],
] as const;

const popularActivities = [
  {
    query: "Project Management Consultancy Services",
    category: "consulting",
    fr: "Consulting",
    en: "Consulting",
  },
  {
    query: "Marketing Management",
    category: "consulting",
    fr: "Marketing",
    en: "Marketing",
  },
  {
    query: "Computer Systems and Software Designing",
    category: "digital",
    fr: "Software",
    en: "Software",
  },
  {
    query: "Internet Marketing",
    category: "ecommerce",
    fr: "E-commerce",
    en: "E-commerce",
  },
  {
    query: "Advertising Requisites Trading",
    category: "trading",
    fr: "Trading",
    en: "Trading",
  },
  {
    query: "Management Consultancy",
    category: "consulting",
    fr: "Management",
    en: "Management",
  },
] as const;

const handledBlocks = [
  {
    fr: ["Créer votre société", "Choix de la structure, préparation du dossier, constitution et documents corporate pour commencer à facturer proprement."],
    en: ["Set up your company", "Structure choice, file preparation, incorporation and corporate documents so you can operate properly."],
  },
  {
    fr: ["Obtenir votre résidence", "Coordination du parcours visa, medical fitness, Emirates ID et étapes administratives jusqu’à l’installation."],
    en: ["Obtain residency", "Residence visa, medical fitness, Emirates ID and administrative steps through relocation."],
  },
  {
    fr: ["Ouvrir votre compte professionnel", "Après création de la société et obtention du visa, Rakmaro prépare une ouverture bancaire sous 7 jours avec un dossier clair."],
    en: ["Open your business account", "After company setup and visa approval, Rakmaro prepares a business account opening within 7 days with a clear file."],
  },
  {
    fr: ["Vous installer aux Émirats", "Lecture pratique de votre arrivée : famille, calendrier, documents, priorités et décisions à prendre dans le bon ordre."],
    en: ["Settle in the UAE", "A practical relocation view: family, timing, documents, priorities and decisions in the right order."],
  },
];

const handledIcons: IconName[] = ["building", "id", "landmark", "home"];

const uaeReasons = [
  {
    fr: ["Un cadre international", "Une base crédible pour vendre, recruter et opérer entre Europe, Afrique, Moyen-Orient et Asie."],
    en: ["An international base", "A credible base to sell, hire and operate between Europe, Africa, the Middle East and Asia."],
  },
  {
    fr: ["Résidence possible", "La création de société peut ouvrir un parcours de résidence, sous réserve d’éligibilité et de validation."],
    en: ["Possible residency", "Company setup can open a residency path, subject to eligibility and approval."],
  },
  {
    fr: ["Fiscalité lisible", "Un environnement attractif, à structurer proprement selon votre situation personnelle et professionnelle."],
    en: ["Clearer tax environment", "An attractive environment that must be structured properly for your personal and business situation."],
  },
  {
    fr: ["Vie sur place", "Dubaï, Abu Dhabi, Ras Al Khaimah ou autre émirat : le lieu de vie se pense avec le projet."],
    en: ["Life on the ground", "Dubai, Abu Dhabi, Ras Al Khaimah or another emirate: where you live is planned with the project."],
  },
];

const uaeReasonIcons: IconName[] = ["globe", "badge", "shield", "map"];

const creationSteps = [
  ["01", "Cadrage du projet", "Project scoping", "Activité, clients, associés, visas, budget et calendrier.", "Activity, clients, shareholders, visas, budget and timing."],
  ["02", "Structure adaptée", "Suitable structure", "Choix de la route de création selon le besoin réel.", "Choice of setup route based on the real need."],
  ["03", "Dossier complet", "Complete file", "Documents, identité, cohérence de l’activité et dépôt guidé.", "Documents, identity, activity coherence and guided filing."],
  ["04", "Création et installation", "Setup and relocation", "Société, résidence, Emirates ID, compte professionnel et prochaines étapes.", "Company, residency, Emirates ID, business account and next steps."],
] as const;

const creationStepIcons: IconName[] = ["search", "briefcase", "file", "route"];

const offers = [
  {
    image: "/assets/dubai-aerial-fog.jpg",
    icon: "building",
    price: "AED 6,010",
    fr: ["Créer la société", "Pour disposer d’une structure aux Émirats sans résidence immédiate.", ["Analyse du projet", "Création de la société", "Documents corporate", "Plan d’action post-création"]],
    en: ["Company setup", "For a UAE structure without immediate residency.", ["Project review", "Company incorporation", "Corporate documents", "Post-setup action plan"]],
  },
  {
    image: "/assets/uae-flag-skyline.jpg",
    icon: "id",
    price: "AED 12,010",
    fr: ["Société + résidence", "Pour créer l’entreprise et enclencher votre résidence aux Émirats.", ["Création de société", "Visa de résidence", "Emirates ID", "Préparation bancaire"]],
    en: ["Company + residency", "For company setup and your UAE residency path.", ["Company setup", "Residence visa", "Emirates ID", "Banking preparation"]],
  },
  {
    image: "/assets/dubai-downtown-dawn.jpg",
    icon: "landmark",
    price: "AED 14,010",
    fr: ["Installation entrepreneur", "Pour une installation plus complète, avec activité évolutive et accompagnement renforcé.", ["Société", "Visa", "Compte professionnel", "Priorités d’installation"]],
    en: ["Founder relocation", "For a more complete move with a scalable activity and stronger support.", ["Company", "Visa", "Business account", "Relocation priorities"]],
  },
  {
    image: "/assets/dubai-night-reflection.jpg",
    icon: "shield",
    price: "Sur étude",
    fr: ["Projet spécifique", "Pour commerce, local, équipe, famille, activité réglementée ou situation plus complexe.", ["Étude dédiée", "Bureau ou autorisation", "Budget détaillé", "Calendrier de décision"]],
    en: ["Specific project", "For trade, premises, team, family, regulated activity or more complex situations.", ["Dedicated review", "Office or approval", "Detailed budget", "Decision timeline"]],
  },
] satisfies Array<{
  image: string;
  icon: IconName;
  price: string;
  fr: [string, string, string[]];
  en: [string, string, string[]];
}>;

const videoStories = [
  {
    media: "/media/dubai-uae.mp4",
    poster: "/assets/dubai-aerial-fog.jpg",
    icon: "globe",
    fr: ["Arrivée business", "Le mouvement d’une ville pensée pour accélérer les décisions."],
    en: ["Business arrival", "The movement of a city built to accelerate decisions."],
  },
  {
    media: "/media/burj-khalifa-day.mp4",
    poster: "/assets/dubai-downtown-dawn.jpg",
    icon: "building",
    fr: ["Structure claire", "Société, licence, résidence : chaque étape doit soutenir la suivante."],
    en: ["Clear structure", "Company, licence, residency: every step should support the next one."],
  },
  {
    media: "/media/burj-khalifa-night.mp4",
    poster: "/assets/dubai-night-reflection.jpg",
    icon: "landmark",
    fr: ["Compte professionnel", "Une fois la société créée et le visa obtenu, l’ouverture bancaire peut être préparée sous 7 jours."],
    en: ["Business account", "Once the company is created and the visa is obtained, account opening can be prepared within 7 days."],
  },
  {
    media: "/media/sheikh-zayed-mosque.mp4",
    poster: "/assets/abu-dhabi-dawn.jpg",
    icon: "shield",
    fr: ["Installation maîtrisée", "Le projet se prépare avec les validations, les délais et les zones d’attention."],
    en: ["Controlled relocation", "The project is prepared with approvals, timings and watch points."],
  },
] satisfies Array<{
  media: string;
  poster: string;
  icon: IconName;
  fr: [string, string];
  en: [string, string];
}>;

const journey = [
  ["01", "Diagnostic", "Diagnosis", "On clarifie ce que vous vendez, où vous vivez, qui facture et ce qu’il faut éviter.", "We clarify what you sell, where you live, who invoices and what to avoid."],
  ["02", "Création", "Incorporation", "Rakmaro prépare la route de création et coordonne le dépôt du dossier.", "Rakmaro prepares the setup route and coordinates the filing."],
  ["03", "Documents", "Documents", "Vous obtenez les documents corporate nécessaires pour avancer.", "You receive the corporate documents needed to move forward."],
  ["04", "Résidence", "Residency", "Visa, medical fitness, Emirates ID et étapes administratives sont organisés.", "Visa, medical fitness, Emirates ID and admin steps are organized."],
  ["05", "Banque", "Banking", "Après création de la société et obtention du visa, Rakmaro prépare l’ouverture du compte sous 7 jours.", "After company setup and visa approval, Rakmaro prepares account opening within 7 days."],
  ["06", "Famille", "Family", "Si besoin, le parcours famille est anticipé après la résidence principale.", "If needed, the family path is anticipated after the main residency."],
  ["07", "Installation", "Settlement", "Vous repartez avec les prochaines priorités pour vivre et opérer aux Émirats.", "You leave with the next priorities to live and operate in the UAE."],
] as const;

const journeyIcons: IconName[] = ["search", "building", "file", "id", "landmark", "users", "home"];

const faqs = [
  {
    frQ: "Rakmaro est-il une autorité officielle ?",
    enQ: "Is Rakmaro an official authority?",
    frA: "Non. Rakmaro est une société de conseil et d’accompagnement. Les autorités économiques et administratives restent décisionnaires.",
    enA: "No. Rakmaro is an advisory and support company. Economic and administrative authorities remain the decision-makers.",
  },
  {
    frQ: "Dois-je vivre à Ras Al Khaimah ?",
    enQ: "Do I need to live in Ras Al Khaimah?",
    frA: "Non. L’émirat d’enregistrement de la société ne vous oblige pas à y vivre. Le bon choix dépend de l’activité, du visa, des clients et de votre organisation.",
    enA: "No. The emirate where the company is registered does not force you to live there. The right route depends on activity, visa, clients and organization.",
  },
  {
    frQ: "Le compte bancaire est-il garanti ?",
    enQ: "Is the bank account guaranteed?",
    frA: "Après création de la société et obtention du visa, Rakmaro prépare l’ouverture du compte bancaire sous 7 jours. La banque reste décisionnaire, mais la résidence et un dossier cohérent rendent le parcours beaucoup plus fluide.",
    enA: "After company setup and visa approval, Rakmaro prepares business account opening within 7 days. The bank remains the decision-maker, but residency and a coherent file make the path much smoother.",
  },
  {
    frQ: "Les prix affichés sont-ils définitifs ?",
    enQ: "Are displayed prices final?",
    frA: "Non. Ce sont des budgets d’entrée indicatifs. Le montant final dépend de l’activité, des visas, des associés, du local et des validations nécessaires.",
    enA: "No. They are indicative entry budgets. The final amount depends on activity, visas, shareholders, premises and required approvals.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function label(locale: Locale, frValue: string, enValue: string) {
  return locale === "fr" ? frValue : enValue;
}

function defaultContactMessage(locale: Locale) {
  return label(
    locale,
    "Je souhaite étudier ma création de société, mon visa de résidence et l’ouverture de mon compte bancaire aux Émirats.",
    "I would like to review my company setup, residence visa and business account opening in the UAE.",
  );
}

function budgetLabel(recommendation: Recommendation, locale: Locale) {
  if (!recommendation.indicativeBudget) return label(locale, "Sur étude", "On review");
  const amount = recommendation.indicativeBudget.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  return label(locale, `À partir de ${amount} AED`, `From ${amount} AED`);
}

function configurationLabel(answers: SimulatorAnswers, recommendation: Recommendation, locale: Locale) {
  if (recommendation.status === "manual-study") {
    return label(locale, "Vérification complémentaire nécessaire", "Additional review needed");
  }
  if (answers.visas === "0") {
    return label(locale, "Société free zone sans visa immédiat", "Free zone company without immediate visa");
  }
  if (answers.visas === "1") {
    return label(locale, "Société free zone avec un visa de résidence", "Free zone company with one residence visa");
  }
  return label(locale, "Société free zone avec plusieurs visas à confirmer", "Free zone company with several visas to confirm");
}

function activityDiagnosis(activity: ActivityRecord | undefined, query: string, locale: Locale) {
  if (!query.trim()) {
    return {
      title: label(locale, "Indiquez votre activité", "Enter your business activity"),
      body: label(locale, "Recherchez votre métier ou utilisez une activité populaire. Rakmaro identifiera ensuite le bon intitulé de licence.", "Search for your business or use a popular activity. Rakmaro will then identify the right licence wording."),
      status: "neutral",
    };
  }
  if (!activity) {
    return {
      title: label(locale, "Sélectionnez l’activité la plus proche", "Select the closest activity"),
      body: label(locale, "Choisissez l’intitulé qui correspond le mieux à ce que vous vendez ou facturez pour déclencher l’estimation.", "Choose the wording that best matches what you sell or invoice to trigger the estimate."),
      status: "neutral",
    };
  }
  if (activity.isSpecial || activity.notAllowedForCoworking || /high/i.test(activity.complianceRisk)) {
    return {
      title: label(locale, "Vérification complémentaire nécessaire", "Additional review needed"),
      body: label(locale, "Votre activité semble possible, mais elle peut demander un bureau, une autorisation ou une lecture renforcée du dossier.", "Your activity may be possible, but it can require an office, an approval or stronger review."),
      status: "review",
    };
  }
  return {
    title: label(locale, "Activité probablement compatible", "Activity probably compatible"),
    body: label(locale, "Votre sélection permet une première estimation. L’équipe Rakmaro confirmera l’intitulé exact avant création.", "Your selection allows a first estimate. The Rakmaro team will confirm the exact wording before setup."),
    status: "ok",
  };
}

export default function RakmaroLanding() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const [frameProgress, setFrameProgress] = useState(0);
  const [validFrames, setValidFrames] = useState(0);
  const [frameErrors, setFrameErrors] = useState(0);
  const [activityQuery, setActivityQuery] = useState("");
  const [activityNote, setActivityNote] = useState("");
  const [searchResults, setSearchResults] = useState<ActivityRecord[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | undefined>();
  const [answers, setAnswers] = useState<SimulatorAnswers>(defaultAnswers);
  const [contactMessage, setContactMessage] = useState(() => defaultContactMessage("fr"));
  const [leadStatus, setLeadStatus] = useState<{ ok: boolean; message: string; leadId?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const previousLocaleRef = useRef<Locale>("fr");
  const framesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const copy = locale === "fr" ? fr : en;
  const recommendation = useMemo(() => {
    if (!selectedActivity) return null;
    return recommendPackage(
      {
        ...answers,
        activityQuery: selectedActivity.name,
        selectedActivityId: selectedActivity.id,
      },
      selectedActivity,
    );
  }, [answers, selectedActivity]);
  const diagnosis = activityDiagnosis(selectedActivity, activityQuery, locale);
  const hasActivityInput = activityQuery.trim().length >= 2;
  const estimateState = !recommendation ? "neutral" : recommendation.status === "manual-study" ? "manual" : recommendation.matchStatus;

  useEffect(() => {
    document.documentElement.lang = locale;

    const previousLocale = previousLocaleRef.current;
    const previousDefaultMessage = defaultContactMessage(previousLocale);
    const nextDefaultMessage = defaultContactMessage(locale);

    setContactMessage((current) => (current === previousDefaultMessage ? nextDefaultMessage : current));
    previousLocaleRef.current = locale;
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setHeaderSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("[data-decorative-video]"));
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "180px 0px", threshold: 0.2 },
    );
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (activityQuery.trim().length < 2) return () => controller.abort();
    const timeout = globalThis.setTimeout(() => {
      fetch(`/api/rakez/activities?q=${encodeURIComponent(activityQuery)}&limit=4`, { signal: controller.signal })
        .then((response) => response.json())
        .then((payload: { activities?: ActivityRecord[] }) => {
          const results = payload.activities ?? [];
          setSearchResults(results);
          setAnswers((current) => ({ ...current, activityQuery }));
        })
        .catch(() => {
          if (!controller.signal.aborted) setSearchResults([]);
        });
    }, 180);
    return () => {
      globalThis.clearTimeout(timeout);
      controller.abort();
    };
  }, [activityQuery]);

  useEffect(() => {
    PRELOAD_FRAME_MANIFEST.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let cancelled = false;
    let animationFrame = 0;
    let resizeFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const frameUrls = reducedMotion ? [HERO_FRAME_MANIFEST[0]] : isMobile ? MOBILE_FRAME_MANIFEST : HERO_FRAME_MANIFEST;

    const sizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawCover = (frame: CanvasImageSource) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const sourceWidth = "naturalWidth" in frame ? frame.naturalWidth || FRAME_WIDTH : FRAME_WIDTH;
      const sourceHeight = "naturalHeight" in frame ? frame.naturalHeight || FRAME_HEIGHT : FRAME_HEIGHT;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;
      context.clearRect(0, 0, width, height);
      context.drawImage(frame, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    const drawIndex = (index: number) => {
      const safeIndex = Math.round(clamp(index, 0, frameUrls.length - 1));
      const frame = framesRef.current[safeIndex];
      if (frame) drawCover(frame);
    };

    const updateTargetFromScroll = () => {
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      targetFrameRef.current = clamp(-rect.top / travel, 0, 1) * (frameUrls.length - 1);
    };

    const animate = () => {
      updateTargetFromScroll();
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.34;
      canvas.dataset.frame = String(Math.round(currentFrameRef.current));
      drawIndex(currentFrameRef.current);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const loadFrame = (index: number) => {
      if (framesRef.current[index]) return;
      const image = new Image();
      image.decoding = "async";
      const markLoaded = () => {
        if (cancelled) return;
        framesRef.current[index] = image;
        const loaded = framesRef.current.filter(Boolean).length;
        setValidFrames(loaded);
        setFrameProgress(Math.round((loaded / frameUrls.length) * 100));
        if (loaded === 1 || index === 0) drawIndex(0);
      };
      image.onload = markLoaded;
      image.onerror = () => {
        if (!cancelled) setFrameErrors((current) => current + 1);
      };
      image.src = frameUrls[index];
      if (image.complete && image.naturalWidth > 0) markLoaded();
    };

    const progressiveLoad = () => {
      const initial = Math.min(reducedMotion ? 1 : 10, frameUrls.length);
      for (let index = 0; index < initial; index += 1) loadFrame(index);
      let restStarted = false;
      const loadRest = () => {
        if (restStarted) return;
        restStarted = true;
        for (let index = initial; index < frameUrls.length; index += 1) loadFrame(index);
      };
      if (!reducedMotion) globalThis.setTimeout(loadRest, 300);
    };

    const onResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        sizeCanvas();
        drawIndex(currentFrameRef.current);
      });
    };

    sizeCanvas();
    progressiveLoad();
    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
      window.addEventListener("scroll", updateTargetFromScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("scroll", updateTargetFromScroll);
      window.removeEventListener("resize", onResize);
      framesRef.current = [];
    };
  }, []);

  const updateAnswer = <K extends keyof SimulatorAnswers>(key: K, value: SimulatorAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const chooseActivity = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setActivityQuery(activity.name);
    setAnswers((current) => ({
      ...current,
      activityQuery: activity.name,
      selectedActivityId: activity.id,
    }));
  };

  const runPopularSearch = (activity: (typeof popularActivities)[number]) => {
    setActivityQuery(activity.query);
    setSelectedActivity(undefined);
    setSearchResults([]);
    setAnswers((current) => ({
      ...current,
      activityQuery: activity.query,
      activityCategory: activity.category as SimulatorAnswers["activityCategory"],
      selectedActivityId: undefined,
    }));
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setLeadStatus(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      locale,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      country: formData.get("country"),
      nationality: formData.get("nationality"),
      activity: selectedActivity?.name ?? answers.activityQuery,
      selectedActivityId: selectedActivity?.id ?? answers.selectedActivityId,
      shareholders: answers.shareholders,
      visas: answers.visas,
      facility: answers.facility,
      clients: answers.clients,
      relocation: answers.relocation,
      timeline: answers.timeline,
      budget: recommendation ? budgetLabel(recommendation, locale) : label(locale, "À confirmer après sélection d’activité", "To confirm after activity selection"),
      message: [formData.get("message"), activityNote ? `Note activité: ${activityNote}` : ""].filter(Boolean).join("\n\n"),
      consent: formData.get("consent") === "on",
      website: formData.get("website"),
      recommendation,
    };
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok: boolean; message?: string; leadId?: string; errors?: string[] };
      setLeadStatus({
        ok: result.ok,
        leadId: result.leadId,
        message: result.message || result.errors?.join(" ") || "Unable to submit.",
      });
    } catch {
      setLeadStatus({
        ok: false,
        message: label(locale, "Impossible d’envoyer la demande pour le moment.", "Unable to send the request right now."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <header className={`site-header ${headerSolid ? "is-solid" : ""} ${menuOpen ? "is-open" : ""}`} aria-label="Rakmaro navigation">
        <a className="brand" href="#top" aria-label="Rakmaro">
          <span className="brand-mark">
            <img src="/assets/rakmaro-logo.png" alt="" aria-hidden="true" />
          </span>
          <span className="brand-text">
            <strong>Rakmaro</strong>
            <small>{label(locale, "UAE company setup", "UAE company setup")}</small>
          </span>
        </a>
        <nav className="primary-nav">
          <a href="#handled">{copy.nav.handled}</a>
          <a href="#why-uae">{copy.nav.whyUae}</a>
          <a href="#offers">{copy.nav.offers}</a>
          <a href="#estimate">{copy.nav.estimate}</a>
          <a href="#faq">{copy.nav.faq}</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button lang-toggle" type="button" onClick={() => setLocale(locale === "fr" ? "en" : "fr")} aria-label={label(locale, "Passer en anglais", "Switch to French")}>
            <Icon name="language" />
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a className="button button-small" href="#contact">
            <Icon name="arrow" />
            {copy.cta.qualify}
          </a>
          <button className="icon-button menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label={label(locale, "Ouvrir le menu", "Open menu")} aria-expanded={menuOpen}>
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>
        </div>
        <div className="mobile-nav" hidden={!menuOpen}>
          <a href="#handled" onClick={() => setMenuOpen(false)}>{copy.nav.handled}</a>
          <a href="#why-uae" onClick={() => setMenuOpen(false)}>{copy.nav.whyUae}</a>
          <a href="#offers" onClick={() => setMenuOpen(false)}>{copy.nav.offers}</a>
          <a href="#estimate" onClick={() => setMenuOpen(false)}>{copy.nav.estimate}</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>{copy.nav.contact}</a>
        </div>
      </header>

      <section id="top" ref={heroRef} className="hero-scroll">
        <div className="hero-sticky">
          <img className="hero-fallback-image" src="/assets/dubai-downtown-dawn.jpg" alt="" aria-hidden="true" />
          <canvas
            ref={canvasRef}
            className={validFrames >= MIN_CANVAS_FRAMES ? "hero-canvas is-ready" : "hero-canvas"}
            aria-label="Vue de Dubai animée par le défilement"
            data-valid-frames={validFrames}
            data-frame-errors={frameErrors}
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <div className="hero-panel">
              <p className="eyebrow hero-eyebrow"><Icon name="spark" /> {copy.hero.overline}</p>
              <h1>{copy.hero.title}</h1>
              <p className="hero-copy">{copy.hero.body}</p>
              <div className="hero-actions">
                <a className="button" href="#contact">
                  <Icon name="arrow" />
                  {copy.cta.qualify}
                </a>
                <a className="button button-ghost" href="#estimate">
                  <Icon name="calendar" />
                  {copy.cta.estimate}
                </a>
              </div>
              <div className="hero-proof-list" aria-label={label(locale, "Preuves Rakmaro", "Rakmaro proof points")}>
                {copy.hero.proofs.map((proof, index) => (
                  <span key={proof}><Icon name={(["shield", "globe", "users", "bank"] as IconName[])[index] ?? "check"} />{proof}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-scroll-cue" aria-hidden="true">
            <span>{label(locale, "Scroll", "Scroll")}</span>
            <strong>{label(locale, "La ville avance avec vous", "The city moves with you")}</strong>
          </div>
          <div className="frame-loader" aria-hidden="true">
            <span style={{ transform: `scaleX(${frameProgress / 100})` }} />
          </div>
        </div>
      </section>

      <section id="handled" className="section handled-section">
        <div className="section-heading">
          <p className="eyebrow">{copy.sections.handledEyebrow}</p>
          <h2>{copy.sections.handledTitle}</h2>
          <p>{copy.sections.handledBody}</p>
        </div>
        <div className="feature-grid">
          {handledBlocks.map((block, index) => (
            <article className="mini-card service-card" key={block.fr[0]}>
              <div className="service-card-media">
                <video
                  src={videoStories[index]?.media}
                  poster={videoStories[index]?.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-decorative-video
                  aria-hidden="true"
                />
              </div>
              <div className="service-card-body">
                <span className="card-icon"><Icon name={handledIcons[index] ?? "check"} /></span>
                <h3>{label(locale, block.fr[0], block.en[0])}</h3>
                <p>{label(locale, block.fr[1], block.en[1])}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="why-uae" className="section split-section">
        <div>
          <p className="eyebrow">{copy.sections.whyUaeEyebrow}</p>
          <h2>{copy.sections.whyUaeTitle}</h2>
          <p>{copy.sections.whyUaeBody}</p>
          <div className="feature-grid compact">
            {uaeReasons.map((reason, index) => (
              <article className="mini-card" key={reason.fr[0]}>
                <span className="card-icon"><Icon name={uaeReasonIcons[index] ?? "check"} /></span>
                <h3>{label(locale, reason.fr[0], reason.en[0])}</h3>
                <p>{label(locale, reason.fr[1], reason.en[1])}</p>
              </article>
            ))}
          </div>
        </div>
        <img className="section-image" src="/assets/dubai-downtown-dawn.jpg" alt={label(locale, "Vue du skyline de Dubai", "Dubai skyline view")} loading="lazy" />
      </section>

      <section id="how" className="section process-section">
        <div className="section-heading">
          <p className="eyebrow">{copy.sections.howEyebrow}</p>
          <h2>{copy.sections.howTitle}</h2>
          <p>{copy.sections.howBody}</p>
        </div>
        <div className="process-grid four">
          {creationSteps.map(([step, frTitle, enTitle, frText, enText], index) => (
            <article className="process-card" key={step}>
              <span className="step-index">{step}</span>
              <span className="card-icon"><Icon name={creationStepIcons[index] ?? "check"} /></span>
              <h3>{label(locale, frTitle, enTitle)}</h3>
              <p>{label(locale, frText, enText)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="ras-al-khaimah" className="section dark-band">
        <img className="section-image" src="/assets/rak-corniche-morning.jpg" alt={label(locale, "Corniche de Ras Al Khaimah", "Ras Al Khaimah corniche")} loading="lazy" />
        <div>
          <p className="eyebrow">{copy.sections.rakEyebrow}</p>
          <h2>{copy.sections.rakTitle}</h2>
          <p>{copy.sections.rakBody}</p>
          <p className="subtle-note">{copy.sections.rakezNote}</p>
        </div>
      </section>

      <section id="offers" className="section offer-section">
        <div className="section-heading">
          <p className="eyebrow">{copy.sections.offersEyebrow}</p>
          <h2>{copy.sections.offersTitle}</h2>
          <p>{copy.sections.offersBody}</p>
        </div>
        <div className="offer-grid">
          {offers.map((offer) => {
            const item = offer[locale];
            return (
              <article className="offer-card" key={item[0] as string}>
                <div className="offer-media">
                  <img src={offer.image} alt="" loading="lazy" />
                </div>
                <div className="offer-card-body">
                  <span className="offer-icon"><Icon name={offer.icon} /></span>
                  <h3>{item[0] as string}</h3>
                  <div className="offer-price">
                    {offer.price === "Sur étude" ? null : <span>{label(locale, "À partir de", "From")}</span>}
                    <strong>{offer.price === "Sur étude" ? label(locale, "Sur étude", "On review") : offer.price}</strong>
                  </div>
                  <p>{item[1] as string}</p>
                  <ul>
                    {(item[2] as string[]).map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="journey" className="section process-section">
        <div className="section-heading">
          <p className="eyebrow">{copy.sections.journeyEyebrow}</p>
          <h2>{copy.sections.journeyTitle}</h2>
        </div>
        <div className="process-grid">
          {journey.map(([step, frTitle, enTitle, frText, enText], index) => (
            <article className="process-card" key={step}>
              <span className="step-index">{step}</span>
              <span className="card-icon"><Icon name={journeyIcons[index] ?? "check"} /></span>
              <h3>{label(locale, frTitle, enTitle)}</h3>
              <p>{label(locale, frText, enText)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="estimate" className="section simulator-section">
        <div className="section-heading">
          <p className="eyebrow">{copy.sections.activityEyebrow}</p>
          <h2>{copy.sections.activityTitle}</h2>
          <p>{copy.sections.activityBody}</p>
        </div>
        <div className="tool-layout">
          <div className="tool-panel">
            <label className="activity-search">
              {label(locale, "Que va vendre ou facturer votre société ?", "What will your company sell or invoice?")}
              <input
                value={activityQuery}
                role="combobox"
                aria-controls="activity-results"
                aria-expanded={hasActivityInput}
                aria-autocomplete="list"
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setActivityQuery(nextQuery);
                  setSelectedActivity(undefined);
                  if (nextQuery.trim().length < 2) {
                    setSearchResults([]);
                  }
                  updateAnswer("activityQuery", nextQuery);
                  updateAnswer("selectedActivityId", undefined);
                }}
                placeholder={label(locale, "Ex. Marketing, software, consulting, e-commerce...", "E.g. Marketing, software, consulting, e-commerce...")}
              />
            </label>
            <div className="popular-activities" aria-label={label(locale, "Activités populaires", "Popular activities")}>
              {popularActivities.map((activity) => (
                <button type="button" key={activity.query} onClick={() => runPopularSearch(activity)}>
                  {label(locale, activity.fr, activity.en)}
                </button>
              ))}
            </div>
            {hasActivityInput ? (
              <div id="activity-results" className="activity-results" aria-live="polite">
                {searchResults.length ? (
                  searchResults.map((activity) => (
                    <button
                      className={`activity-result ${selectedActivity?.id === activity.id ? "is-selected" : ""}`}
                      type="button"
                      key={activity.id}
                      onClick={() => chooseActivity(activity)}
                    >
                      <span>{activity.licenseType}</span>
                      <strong>{activity.name}</strong>
                      <small>{activity.activityGroup || activity.businessSector}</small>
                      {activity.isSpecial || activity.notAllowedForCoworking || /high/i.test(activity.complianceRisk) ? (
                        <em>{label(locale, "Validation renforcée", "Enhanced review")}</em>
                      ) : null}
                    </button>
                  ))
                ) : (
                  <div className="activity-empty">
                    <strong>{label(locale, "Aucun intitulé exact détecté pour l’instant", "No exact wording detected yet")}</strong>
                    <p>{label(locale, "Essayez un mot plus court ou une activité populaire. L’estimation se déclenche après sélection d’une activité.", "Try a shorter word or a popular activity. The estimate starts after selecting an activity.")}</p>
                  </div>
                )}
              </div>
            ) : null}
            {selectedActivity ? (
              <div className="selected-activity">
                <span>{label(locale, "Activité sélectionnée", "Selected activity")}</span>
                <h3>{selectedActivity.name}</h3>
                <dl>
                  <div>
                    <dt>{label(locale, "Licence", "Licence")}</dt>
                    <dd>{selectedActivity.licenseType || "-"}</dd>
                  </div>
                  <div>
                    <dt>{label(locale, "Catégorie", "Category")}</dt>
                    <dd>{selectedActivity.activityGroup || selectedActivity.businessSector || "-"}</dd>
                  </div>
                  <div>
                    <dt>{label(locale, "Coworking", "Coworking")}</dt>
                    <dd>{selectedActivity.notAllowedForCoworking ? label(locale, "À vérifier", "To check") : label(locale, "Possible", "Possible")}</dd>
                  </div>
                  <div>
                    <dt>{label(locale, "Vigilance", "Watch level")}</dt>
                    <dd>{selectedActivity.isSpecial || /high/i.test(selectedActivity.complianceRisk) ? label(locale, "Renforcée", "Enhanced") : label(locale, "Standard", "Standard")}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
            <label className="activity-note">
              {label(locale, "Note projet optionnelle", "Optional project note")}
              <textarea
                value={activityNote}
                onChange={(event) => setActivityNote(event.target.value)}
                rows={3}
                placeholder={label(locale, "Ex. Clients en France, lancement sous 30 jours, résidence à Dubaï.", "E.g. French clients, launch within 30 days, Dubai residency.")}
              />
            </label>
            <div className={`activity-diagnosis is-${diagnosis.status}`}>
              <strong>{diagnosis.title}</strong>
              <p>{diagnosis.body}</p>
              <ul>
                <li>{label(locale, "Besoin éventuel de bureau ou d’autorisation : à confirmer", "Possible office or approval need: to confirm")}</li>
                <li>{label(locale, "Prochaine étape : échange de qualification avec Rakmaro", "Next step: qualification call with Rakmaro")}</li>
              </ul>
            </div>
          </div>
          <div className="tool-panel estimate-panel">
            <p className="eyebrow">{copy.sections.simulatorEyebrow}</p>
            <h2>{copy.sections.simulatorTitle}</h2>
            <form className="simulator-form compact-form">
              <label>
                {label(locale, "Catégorie", "Category")}
                <select value={answers.activityCategory} onChange={(event) => updateAnswer("activityCategory", event.target.value as SimulatorAnswers["activityCategory"])}>
                  {activityCategories.map(([value, frLabel, enLabel]) => (
                    <option key={value} value={value}>
                      {label(locale, frLabel, enLabel)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {label(locale, "Associés", "Shareholders")}
                <select value={answers.shareholders} onChange={(event) => updateAnswer("shareholders", event.target.value as SimulatorAnswers["shareholders"])}>
                  <option value="1">1</option>
                  <option value="2-5">2-5</option>
                  <option value="6+">6+</option>
                </select>
              </label>
              <label>
                {label(locale, "Visas", "Visas")}
                <select value={answers.visas} onChange={(event) => updateAnswer("visas", event.target.value as SimulatorAnswers["visas"])}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2-4">2-4</option>
                  <option value="5+">5+</option>
                </select>
              </label>
              <label>
                {label(locale, "Local", "Premises")}
                <select value={answers.facility} onChange={(event) => updateAnswer("facility", event.target.value as SimulatorAnswers["facility"])}>
                  <option value="coworking">{label(locale, "Pas de bureau dédié", "No dedicated office")}</option>
                  <option value="office">{label(locale, "Bureau", "Office")}</option>
                  <option value="warehouse">{label(locale, "Entrepôt / industrie", "Warehouse / industry")}</option>
                  <option value="not-sure">{label(locale, "À confirmer", "Not sure")}</option>
                </select>
              </label>
              <label>
                {label(locale, "Clients", "Clients")}
                <select value={answers.clients} onChange={(event) => updateAnswer("clients", event.target.value as SimulatorAnswers["clients"])}>
                  <option value="international">{label(locale, "Hors UAE surtout", "Mostly outside UAE")}</option>
                  <option value="mixed">{label(locale, "Mix UAE / international", "Mixed UAE / international")}</option>
                  <option value="uae">{label(locale, "UAE principalement", "Mostly UAE")}</option>
                  <option value="not-sure">{label(locale, "À confirmer", "Not sure")}</option>
                </select>
              </label>
              <label>
                {label(locale, "Installation", "Relocation")}
                <select value={answers.relocation} onChange={(event) => updateAnswer("relocation", event.target.value as SimulatorAnswers["relocation"])}>
                  <option value="yes-dubai">{label(locale, "Je veux vivre à Dubaï", "I want to live in Dubai")}</option>
                  <option value="yes-rak">{label(locale, "Je vise Ras Al Khaimah", "I am considering Ras Al Khaimah")}</option>
                  <option value="later">{label(locale, "Plus tard", "Later")}</option>
                  <option value="no">{label(locale, "Pas de résidence", "No residency")}</option>
                </select>
              </label>
              <label className="full">
                {label(locale, "Calendrier", "Timeline")}
                <select value={answers.timeline} onChange={(event) => updateAnswer("timeline", event.target.value as SimulatorAnswers["timeline"])}>
                  <option value="now">{label(locale, "Dès maintenant", "Right now")}</option>
                  <option value="30-days">{label(locale, "Sous 30 jours", "Within 30 days")}</option>
                  <option value="quarter">{label(locale, "Ce trimestre", "This quarter")}</option>
                  <option value="exploring">{label(locale, "Je compare encore", "Still exploring")}</option>
                </select>
              </label>
            </form>
            {recommendation ? (
              <div className={`recommendation ${recommendation.status === "manual-study" ? "is-manual" : ""}`}>
                <span>{estimateState === "catalog" ? copy.sections.estimateResultLabel : estimateState === "provisional" ? label(locale, "Estimation provisoire", "Provisional estimate") : label(locale, "Étude humaine nécessaire", "Human review needed")}</span>
                <h3>{configurationLabel(answers, recommendation, locale)}</h3>
                <strong>{budgetLabel(recommendation, locale)}</strong>
                <p>{copy.sections.estimateValidation}</p>
                <ul>
                  <li>{label(locale, "Activité exacte", "Exact activity")}</li>
                  <li>{label(locale, "Nombre d’associés", "Number of shareholders")}</li>
                  <li>{label(locale, "Besoin de local", "Premises requirement")}</li>
                  <li>{label(locale, "Nature de vos clients", "Nature of your clients")}</li>
                </ul>
              </div>
            ) : (
              <div className="recommendation is-neutral">
                <span>{label(locale, "Estimation prête", "Estimate ready")}</span>
                <h3>{label(locale, "Sélectionnez l’activité la plus proche", "Select the closest activity")}</h3>
                <strong>{label(locale, "Budget affiché après sélection", "Budget shown after selection")}</strong>
                <p>{label(locale, "L’outil combine l’activité choisie, le nombre de visas, les associés, le local, les clients et votre calendrier pour proposer une route probable.", "The tool combines the selected activity, visas, shareholders, premises, clients and timeline to suggest a probable route.")}</p>
                <ul>
                  <li>{label(locale, "Recherche par métier", "Business activity search")}</li>
                  <li>{label(locale, "Package probable", "Probable package")}</li>
                  <li>{label(locale, "Budget indicatif", "Indicative budget")}</li>
                  <li>{label(locale, "Points à confirmer", "Points to confirm")}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="banking" className="section dark-band">
        <div>
          <p className="eyebrow">{copy.sections.bankEyebrow}</p>
          <h2>{copy.sections.bankTitle}</h2>
          <p>{copy.sections.bankBody}</p>
          <div className="note-box">{copy.sections.bankNote}</div>
        </div>
        <img className="section-image" src="/assets/abu-dhabi-dawn.jpg" alt={label(locale, "Vue d'Abu Dhabi", "Abu Dhabi view")} loading="lazy" />
      </section>

      <section id="founder" className="section founder-section">
        <img className="section-image" src="/assets/palm-jumeirah-aerial.jpg" alt={label(locale, "Vue aérienne de Palm Jumeirah", "Palm Jumeirah aerial view")} loading="lazy" />
        <div>
          <p className="eyebrow">{copy.sections.founderEyebrow}</p>
          <h2>{copy.sections.founderTitle}</h2>
          <p>{copy.sections.founderBody}</p>
          <div className="founder-tags">
            <span>Français</span>
            <span>English</span>
            <span>{label(locale, "Authorized reseller", "Authorized reseller")}</span>
            <span>{label(locale, "Présence UAE", "UAE presence")}</span>
          </div>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>{copy.sections.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.frQ}>
              <summary>{label(locale, faq.frQ, faq.enQ)}</summary>
              <p>{label(locale, faq.frA, faq.enA)}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy">
          <p className="eyebrow">{copy.sections.contactEyebrow}</p>
          <h2>{copy.sections.contactTitle}</h2>
          <p>{copy.sections.contactBody}</p>
          <div className="contact-note">{copy.sections.contactNote}</div>
        </div>
        <form className="lead-form" onSubmit={submitLead}>
          <input name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
          <label>
            {label(locale, "Prénom", "First name")}
            <input name="firstName" required />
          </label>
          <label>
            {label(locale, "Nom", "Last name")}
            <input name="lastName" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            WhatsApp
            <input name="whatsapp" inputMode="tel" />
          </label>
          <label>
            {label(locale, "Pays actuel", "Current country")}
            <input name="country" />
          </label>
          <label>
            {label(locale, "Nationalité", "Nationality")}
            <input name="nationality" />
          </label>
          <label className="full">
            {label(locale, "Message", "Message")}
            <textarea
              name="message"
              rows={4}
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
            />
          </label>
          <label className="consent full">
            <input name="consent" type="checkbox" required />
            <span>{copy.sections.consent}</span>
          </label>
          <button className="button" disabled={submitting} type="submit">
            {submitting ? "..." : copy.cta.contact}
          </button>
          {leadStatus ? (
            <p className={`form-success ${leadStatus.ok ? "" : "is-error"}`}>
              {leadStatus.message} {leadStatus.leadId ? `(${leadStatus.leadId})` : ""}
            </p>
          ) : null}
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="footer-logo" href="#top" aria-label="Rakmaro">
              <img src="/assets/rakmaro-logo.png" alt="" aria-hidden="true" />
              <span>
                <strong>Rakmaro</strong>
                <small>{label(locale, "UAE company setup", "UAE company setup")}</small>
              </span>
            </a>
            <p>{copy.sections.footer}</p>
            <div className="footer-badges" aria-label={label(locale, "Garanties Rakmaro", "Rakmaro trust points")}>
              <span>{label(locale, "Authorized reseller", "Authorized reseller")}</span>
              <span>{label(locale, "Équipe francophone", "French-speaking team")}</span>
              <span>{label(locale, "Société · Visa · Banque", "Company · Visa · Banking")}</span>
            </div>
          </div>
          <nav className="footer-links" aria-label={label(locale, "Navigation footer", "Footer navigation")}>
            <div>
              <h3>{label(locale, "Explorer", "Explore")}</h3>
              <a href="#handled">{copy.nav.handled}</a>
              <a href="#offers">{copy.nav.offers}</a>
              <a href="#estimate">{copy.nav.estimate}</a>
              <a href="#faq">{copy.nav.faq}</a>
            </div>
            <div>
              <h3>{label(locale, "Accompagnement", "Support")}</h3>
              <a href="#ras-al-khaimah">{label(locale, "Ras Al Khaimah", "Ras Al Khaimah")}</a>
              <a href="#banking">{label(locale, "Compte bancaire", "Business account")}</a>
              <a href="#contact">{copy.nav.contact}</a>
              <a href="#top">{label(locale, "Haut de page", "Back to top")}</a>
            </div>
          </nav>
          <div className="footer-cta">
            <h3>{label(locale, "Prêt à structurer votre installation ?", "Ready to structure your UAE move?")}</h3>
            <p>{label(locale, "Recevez une première lecture de votre société, votre visa et votre compte bancaire.", "Get a first reading of your company setup, visa and business account path.")}</p>
            <a className="button" href="#contact">
              <Icon name="arrow" />
              {copy.cta.qualify}
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Rakmaro</span>
          <span>{label(locale, "Conseil indépendant. Les autorités et banques restent décisionnaires.", "Independent advisory. Authorities and banks remain the decision-makers.")}</span>
        </div>
      </footer>
    </main>
  );
}
