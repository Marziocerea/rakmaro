"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "fr" | "en";

const FRAME_COUNT = 64;
const FRAME_WIDTH = 1100;
const FRAME_HEIGHT = 620;
const HERO_FRAME_URLS = Array.from(
  { length: FRAME_COUNT },
  (_, index) => `/hero-frames/frame-${String(index).padStart(3, "0")}.jpg`,
);

const copy = {
  fr: {
    nav: ["Offres", "Preuves", "Parcours", "Contact"],
    cta: "Qualifier mon projet",
    heroEyebrow: "Authorized RAKEZ reseller",
    heroTitle: "Votre société UAE, sans tunnel administratif.",
    heroText:
      "Rakmaro transforme votre projet en dossier RAKEZ clair: licence, visa, facility, budget et prochaines étapes. Vous avancez avec un interlocuteur direct, en français ou en anglais.",
    heroPrimary: "Comparer les offres",
    heroSecondary: "Demander une orientation",
    metricOne: "licence dès",
    metricTwo: "activités actives",
    metricThree: "accès pro",
    pricesTitle: "Choisissez l'élan qui correspond à votre ambition.",
    pricesText:
      "Les meilleurs acteurs du marché vendent la clarté, la vitesse et la sérénité. Rakmaro garde cette exigence, avec des prix d'appel RAKEZ et une qualification avant engagement.",
    proofTitle: "On ne vend pas une licence. On sécurise votre entrée aux UAE.",
    proofText:
      "Avant de lancer le dossier, Rakmaro clarifie l'activité, la capacité visa, le type de facility, les options bancaires et les points qui peuvent bloquer plus tard.",
    packagesTitle: "RAKEZ, rendu lisible.",
    packagesText:
      "Lite, Pro, Max ou Designated Zone: on traduit les packages en décisions business simples, avec les inclusions utiles et les limites à connaître.",
    processTitle: "Un parcours pensé pour signer, déposer, avancer.",
    rakezTitle: "Ras Al Khaimah: une base UAE compétitive, lisible, crédible.",
    rakezText:
      "RAKEZ combine packages d'entrée attractifs, options visa, facilities flexibles et large catalogue d'activités. Rakmaro vous aide à choisir la bonne configuration, sans vous perdre dans la table brute.",
    formTitle: "Faites vérifier votre setup avant de payer.",
    formText:
      "Décrivez votre activité, votre besoin visa et votre timeline. Vous recevez une orientation claire sur l'offre probable, les documents à préparer et les points à valider.",
    submit: "Recevoir mon orientation",
    success: "Demande prête. Rakmaro revient vers vous avec une première lecture du setup.",
    faqTitle: "Ce qu'il faut savoir avant de lancer",
  },
  en: {
    nav: ["Offers", "Proof", "Process", "Contact"],
    cta: "Qualify my setup",
    heroEyebrow: "Authorized RAKEZ reseller",
    heroTitle: "Your UAE company, without the admin maze.",
    heroText:
      "Rakmaro turns your project into a clear RAKEZ application path: license, visa, facility, budget and next steps. One direct contact, in French or English.",
    heroPrimary: "Compare offers",
    heroSecondary: "Request guidance",
    metricOne: "license from",
    metricTwo: "active activities",
    metricThree: "pro access",
    pricesTitle: "Choose the momentum that fits your ambition.",
    pricesText:
      "The strongest market players sell clarity, speed and peace of mind. Rakmaro keeps that standard with RAKEZ entry pricing and qualification before commitment.",
    proofTitle: "We do not just sell a license. We secure your UAE entry.",
    proofText:
      "Before submission, Rakmaro clarifies the activity, visa capacity, facility type, banking readiness and the details that can slow you down later.",
    packagesTitle: "RAKEZ, made readable.",
    packagesText:
      "Lite, Pro, Max or Designated Zone: we translate packages into simple business decisions, with useful inclusions and limits to know.",
    processTitle: "A path built to choose, submit and move.",
    rakezTitle: "Ras Al Khaimah: a competitive, credible UAE base.",
    rakezText:
      "RAKEZ combines attractive entry packages, visa options, flexible facilities and a wide activity catalogue. Rakmaro helps you choose the right configuration without drowning in raw tables.",
    formTitle: "Check your setup before you pay.",
    formText:
      "Share your activity, visa need and timeline. You get a clear first view on the likely offer, documents to prepare and points to validate.",
    submit: "Get my guidance",
    success: "Request ready. Rakmaro will come back with a first setup reading.",
    faqTitle: "What to know before launching",
  },
};

const offerCards = [
  {
    tag: "Fast start",
    fr: "Société seule",
    en: "Company only",
    price: "AED 6,010",
    image: "/assets/dubai-aerial-fog.jpg",
    detailFr: "Pour obtenir une licence RAKEZ sans visa immédiat et garder le budget d'entrée sous contrôle.",
    detailEn: "For a RAKEZ license without immediate visa needs, keeping the entry budget controlled.",
    includesFr: ["Licence Pro 0 visa", "Qualification activité", "Dossier guidé"],
    includesEn: ["Pro 0 visa license", "Activity qualification", "Guided application"],
  },
  {
    tag: "Founder move",
    fr: "Société + 1 visa",
    en: "Company + 1 visa",
    price: "AED 12,010",
    image: "/assets/uae-flag-skyline.jpg",
    detailFr: "Le chemin le plus lisible pour un fondateur qui veut ancrer son projet et sa résidence UAE.",
    detailEn: "The clearest route for a founder who wants to anchor both the company and UAE residency.",
    includesFr: ["Licence + visa", "Facility adaptée", "Étapes Emirates ID"],
    includesEn: ["License + visa", "Suitable facility", "Emirates ID steps"],
  },
  {
    tag: "Most balanced",
    fr: "Pro flexible",
    en: "Flexible Pro",
    price: "AED 14,010",
    image: "/assets/dubai-downtown-dawn.jpg",
    detailFr: "Une base plus confortable pour consultants, agences, e-commerce ou activités à faire évoluer.",
    detailEn: "A stronger base for consultants, agencies, e-commerce and activities that may evolve.",
    includesFr: ["Co-working", "1 visa", "Marge d'évolution"],
    includesEn: ["Co-working", "1 visa", "Room to scale"],
  },
  {
    tag: "Premium route",
    fr: "Max / DZ",
    en: "Max / DZ",
    price: "AED 16,560",
    image: "/assets/dubai-night-reflection.jpg",
    detailFr: "Pour les setups qui demandent plus d'options, une lecture bancaire plus sérieuse ou une zone dédiée.",
    detailEn: "For setups needing more options, stronger banking readiness or a designated zone route.",
    includesFr: ["Options avancées", "Lecture bancaire", "Zone/facility"],
    includesEn: ["Advanced options", "Banking readiness", "Zone/facility"],
  },
];

const proofCards = [
  {
    value: "3,395",
    frTitle: "activités actives à filtrer",
    enTitle: "active activities to filter",
    frText: "On part de votre activité réelle, pas d'un intitulé vague qui peut bloquer le dossier.",
    enText: "We start from your real activity, not a vague label that can block the application.",
  },
  {
    value: "2026",
    frTitle: "packages RAKEZ sourcés",
    enTitle: "sourced RAKEZ packages",
    frText: "Les offres sont présentées en prix d'appel, puis confirmées selon éligibilité.",
    enText: "Offers are shown as entry prices, then confirmed based on eligibility.",
  },
  {
    value: "FR/EN",
    frTitle: "interlocuteur direct",
    enTitle: "direct point of contact",
    frText: "Vous comprenez les décisions avant dépôt: licence, visas, facility, banque.",
    enText: "You understand every decision before submission: license, visas, facility, banking.",
  },
];

const packageCards = [
  {
    name: "Lite",
    price: "from AED 12,010",
    image: "/assets/rak-corniche-morning.jpg",
    fr: "Simple, cadré, utile quand vous voulez créer vite avec 1 visa et une structure légère.",
    en: "Simple and focused when you want to launch fast with 1 visa and a lightweight structure.",
  },
  {
    name: "Pro",
    price: "from AED 6,010",
    image: "/assets/dubai-downtown-dawn.jpg",
    fr: "La famille la plus flexible, du 0 visa au co-working, selon votre activité et votre trajectoire.",
    en: "The most flexible family, from 0 visa to co-working, depending on your activity and plan.",
  },
  {
    name: "Max",
    price: "from AED 16,560",
    image: "/assets/abu-dhabi-dawn.jpg",
    fr: "Pour présenter un setup plus complet, avec options et services additionnels selon le package.",
    en: "For a fuller setup with additional options and services depending on the package.",
  },
  {
    name: "Designated Zone",
    price: "from AED 9,999",
    image: "/assets/palm-jumeirah-aerial.jpg",
    fr: "Pour certains besoins commerciaux ou General Trading, avec une lecture plus spécifique de la zone.",
    en: "For selected commercial or General Trading needs, with a more specific zone reading.",
  },
];

const process = [
  {
    step: "01",
    frTitle: "Diagnostic",
    enTitle: "Diagnosis",
    frText: "Activité, associés, visas, budget, timeline, banque et contraintes à anticiper.",
    enText: "Activity, shareholders, visas, budget, timeline, banking and constraints to anticipate.",
  },
  {
    step: "02",
    frTitle: "Route RAKEZ",
    enTitle: "RAKEZ route",
    frText: "On choisit la licence, le package, la facility et les options qui tiennent vraiment.",
    enText: "We choose the license, package, facility and options that actually fit.",
  },
  {
    step: "03",
    frTitle: "Dépôt guidé",
    enTitle: "Guided submission",
    frText: "Préparation des pièces, vérification, soumission via accès pro et suivi des retours.",
    enText: "Document preparation, checks, pro-access submission and follow-up.",
  },
  {
    step: "04",
    frTitle: "Mise en route",
    enTitle: "Go live",
    frText: "Licence, visa, Emirates ID, banque et prochaines actions pour rendre la société opérable.",
    enText: "License, visa, Emirates ID, banking and next actions to make the company operational.",
  },
];

const faqs = [
  {
    frQ: "Rakmaro est-il le site officiel RAKEZ ?",
    enQ: "Is Rakmaro the official RAKEZ website?",
    frA: "Non. Rakmaro est une marque indépendante et authorized RAKEZ reseller. Le site doit aider à qualifier et accompagner votre dossier, pas se présenter comme RAKEZ.",
    enA: "No. Rakmaro is an independent brand and authorized RAKEZ reseller. The site helps qualify and support your application; it is not RAKEZ itself.",
  },
  {
    frQ: "Pourquoi afficher des prix d'appel ?",
    enQ: "Why show entry prices?",
    frA: "Parce que c'est ce que les clients veulent comprendre en premier. Le prix final dépend ensuite de l'activité, des visas, du type de facility, des documents et de l'éligibilité RAKEZ.",
    enA: "Because clients need an immediate budget signal. The final price then depends on activity, visas, facility type, documents and RAKEZ eligibility.",
  },
  {
    frQ: "Est-ce adapté à un entrepreneur français ?",
    enQ: "Is it suited to French founders?",
    frA: "Oui. Le parcours est pensé pour expliquer les décisions en français ou en anglais, avec une lecture claire des étapes UAE.",
    enA: "Yes. The journey is designed to explain decisions in French or English, with a clear reading of UAE steps.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [sent, setSent] = useState(false);
  const [frameProgress, setFrameProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const framesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const t = copy[locale];

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US"),
    [locale],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;

    if (!canvas || !hero) {
      return;
    }

    let cancelled = false;
    let animationFrame = 0;
    let resizeFrame = 0;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const sizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawCover = (frame: CanvasImageSource, alpha = 1) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.max(width / FRAME_WIDTH, height / FRAME_HEIGHT);
      const drawWidth = FRAME_WIDTH * scale;
      const drawHeight = FRAME_HEIGHT * scale;
      context.globalAlpha = alpha;
      context.drawImage(
        frame,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      context.globalAlpha = 1;
    };

    const drawIndex = (index: number) => {
      const frames = framesRef.current;
      const frame = frames[Math.round(clamp(index, 0, FRAME_COUNT - 1))];
      if (!frame) {
        return;
      }
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawCover(frame);
    };

    const updateTargetFromScroll = () => {
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel, 0, 1);
      targetFrameRef.current = progress * (FRAME_COUNT - 1);
    };

    const animate = () => {
      updateTargetFromScroll();
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      currentFrameRef.current = current + (target - current) * 0.22;
      canvas.dataset.frame = String(Math.round(currentFrameRef.current));
      drawIndex(currentFrameRef.current);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const loadFrames = () => {
      let loaded = 0;
      framesRef.current = new Array(FRAME_COUNT);

      HERO_FRAME_URLS.forEach((src, index) => {
        const image = new Image();
        image.decoding = "async";
        image.src = src;

        const markLoaded = () => {
          if (cancelled) {
            return;
          }
          framesRef.current[index] = image;
          loaded += 1;
          canvas.dataset.loadedFrames = String(loaded);
          setFrameProgress(Math.round((loaded / FRAME_COUNT) * 100));

          if (index === 0) {
            drawIndex(0);
          }
        };

        if (image.complete) {
          markLoaded();
          return;
        }

        image.addEventListener("load", markLoaded, { once: true });
      });
    };

    const onResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        sizeCanvas();
        drawIndex(currentFrameRef.current);
      });
    };

    sizeCanvas();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", updateTargetFromScroll, { passive: true });
    loadFrames();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateTargetFromScroll);
      framesRef.current = [];
    };
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main>
      <header className="site-header" aria-label="Rakmaro navigation">
        <a className="brand" href="#top" aria-label="Rakmaro home">
          <span className="brand-mark">R</span>
          <span>Rakmaro</span>
        </a>
        <nav>
          <a href="#offers">{t.nav[0]}</a>
          <a href="#proof">{t.nav[1]}</a>
          <a href="#process">{t.nav[2]}</a>
          <a href="#contact">{t.nav[3]}</a>
        </nav>
        <div className="header-actions">
          <button
            className="lang-toggle"
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            aria-label="Switch language"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a className="button button-small" href="#contact">
            {t.cta}
          </a>
        </div>
      </header>

      <section id="top" ref={heroRef} className="hero-scroll">
        <div className="hero-sticky">
          <canvas
            ref={canvasRef}
            className={frameProgress > 0 ? "hero-canvas is-ready" : "hero-canvas"}
            aria-label="Dubai orbital hyperlapse controlled by scroll"
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero-copy">{t.heroText}</p>
            <div className="hero-actions">
              <a className="button" href="#offers">
                {t.heroPrimary}
              </a>
              <a className="button button-ghost" href="#contact">
                {t.heroSecondary}
              </a>
            </div>
          </div>
          <div className="hero-metrics" aria-label="Key Rakmaro figures">
            <div>
              <span>{t.metricOne}</span>
              <strong>AED 6,010</strong>
            </div>
            <div>
              <span>{formatter.format(3395)}</span>
              <strong>{t.metricTwo}</strong>
            </div>
            <div>
              <span>RAKEZ</span>
              <strong>{t.metricThree}</strong>
            </div>
          </div>
          <div className="frame-loader" aria-hidden="true">
            <span style={{ transform: `scaleX(${frameProgress / 100})` }} />
          </div>
        </div>
      </section>

      <section id="offers" className="section offer-section">
        <div className="section-heading">
          <p className="eyebrow">RAKEZ launch paths</p>
          <h2>{t.pricesTitle}</h2>
          <p>{t.pricesText}</p>
        </div>
        <div className="offer-grid">
          {offerCards.map((card) => (
            <article className="offer-card" key={card.tag}>
              <img src={card.image} alt="" loading="lazy" />
              <div className="offer-card-body">
                <span>{card.tag}</span>
                <h3>{locale === "fr" ? card.fr : card.en}</h3>
                <strong>{card.price}</strong>
                <p>{locale === "fr" ? card.detailFr : card.detailEn}</p>
                <ul>
                  {(locale === "fr" ? card.includesFr : card.includesEn).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="proof" className="section proof-section">
        <div className="proof-media">
          <img
            src="/assets/palm-jumeirah-aerial.jpg"
            alt="Palm Jumeirah aerial view"
            loading="lazy"
          />
        </div>
        <div className="proof-copy">
          <p className="eyebrow">Before you commit</p>
          <h2>{t.proofTitle}</h2>
          <p>{t.proofText}</p>
          <div className="proof-grid">
            {proofCards.map((card) => (
              <article className="proof-card" key={card.value}>
                <strong>{card.value}</strong>
                <h3>{locale === "fr" ? card.frTitle : card.enTitle}</h3>
                <p>{locale === "fr" ? card.frText : card.enText}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section package-section">
        <div className="section-heading">
          <p className="eyebrow">Lite, Pro, Max, Designated Zone</p>
          <h2>{t.packagesTitle}</h2>
          <p>{t.packagesText}</p>
        </div>
        <div className="package-grid">
          {packageCards.map((card) => (
            <article
              className="package-card"
              key={card.name}
              style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 12, 10, 0.2), rgba(7, 12, 10, 0.88)), url(${card.image})` }}
            >
              <div>
                <h3>{card.name}</h3>
                <p>{locale === "fr" ? card.fr : card.en}</p>
              </div>
              <span>{card.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="section-heading">
          <p className="eyebrow">From idea to license</p>
          <h2>{t.processTitle}</h2>
        </div>
        <div className="process-grid">
          {process.map((item) => (
            <article className="process-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{locale === "fr" ? item.frTitle : item.enTitle}</h3>
              <p>{locale === "fr" ? item.frText : item.enText}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="rakez" className="section rakez-section">
        <div className="rakez-copy">
          <p className="eyebrow">Why RAK / Why RAKEZ</p>
          <h2>{t.rakezTitle}</h2>
          <p>{t.rakezText}</p>
          <div className="rakez-points">
            <span>Cost-effective packages</span>
            <span>Visa and facility options</span>
            <span>Business activity matching</span>
          </div>
        </div>
        <div className="activity-panel">
          <img src="/assets/rak-corniche-morning.jpg" alt="" loading="lazy" />
          <div>
            <span>RAK signal</span>
            <strong>RAKEZ</strong>
            <p>
              {locale === "fr"
                ? "Une zone économique à positionner comme base de lancement, pas comme simple formalité administrative."
                : "An economic zone to position as a launch base, not just an administrative formality."}
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy">
          <p className="eyebrow">Application readiness</p>
          <h2>{t.formTitle}</h2>
          <p>{t.formText}</p>
          <div className="contact-note">
            {locale === "fr"
              ? "Réponse attendue: package probable, budget indicatif, points de vigilance, documents à préparer."
              : "Expected output: likely package, indicative budget, watchpoints and documents to prepare."}
          </div>
        </div>
        <form className="lead-form" onSubmit={onSubmit}>
          <label>
            {locale === "fr" ? "Nom" : "Name"}
            <input name="name" type="text" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            {locale === "fr" ? "Activité envisagée" : "Planned activity"}
            <input name="activity" type="text" required />
          </label>
          <label>
            {locale === "fr" ? "Besoin visa" : "Visa need"}
            <select name="visa" defaultValue="1 visa">
              <option>0 visa</option>
              <option>1 visa</option>
              <option>2+ visas</option>
              <option>{locale === "fr" ? "À confirmer" : "To confirm"}</option>
            </select>
          </label>
          <label className="full">
            {locale === "fr" ? "Votre objectif aux UAE" : "Your UAE objective"}
            <textarea name="message" rows={4} />
          </label>
          <button className="button" type="submit">
            {t.submit}
          </button>
          {sent ? <p className="form-success">{t.success}</p> : null}
        </form>
      </section>

      <section id="faq" className="section faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>{t.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.frQ}>
              <summary>{locale === "fr" ? faq.frQ : faq.enQ}</summary>
              <p>{locale === "fr" ? faq.frA : faq.enA}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Rakmaro</strong>
          <p>
            {locale === "fr"
              ? "Authorized RAKEZ reseller. Marque indépendante, sans affiliation visible à Talents Nexus."
              : "Authorized RAKEZ reseller. Independent brand with no visible Talents Nexus affiliation."}
          </p>
        </div>
        <a href="#top">Back to top</a>
      </footer>
    </main>
  );
}
