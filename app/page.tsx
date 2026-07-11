"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "fr" | "en";

const copy = {
  fr: {
    nav: ["Offres", "Parcours", "RAKEZ", "FAQ"],
    cta: "Demander un devis",
    heroEyebrow: "Authorized RAKEZ reseller",
    heroTitle: "Créer votre société aux UAE depuis Ras Al Khaimah.",
    heroText:
      "Rakmaro accompagne les entrepreneurs francophones et anglophones dans leur setup RAKEZ, de la sélection de licence au dossier visa.",
    heroPrimary: "Voir les offres",
    heroSecondary: "Parler à un conseiller",
    metricOne: "à partir de",
    metricTwo: "business activities actives",
    metricThree: "setup guidé",
    pricesTitle: "Des offres lisibles, calibrées pour commencer vite.",
    pricesText:
      "Les prix RAKEZ varient selon l'activité, la licence, les visas, le type de facility et l'éligibilité finale. Rakmaro clarifie le bon chemin avant dépôt.",
    packagesTitle: "Choisir le bon setup RAKEZ",
    packagesText:
      "On part de votre activité réelle, puis on verrouille la structure la plus simple, la plus conforme et la plus durable.",
    processTitle: "Un parcours direct, sans friction inutile.",
    rakezTitle: "Pourquoi Ras Al Khaimah Economic Zone",
    rakezText:
      "RAKEZ permet de lancer une structure UAE avec une gamme flexible de licences, facilities et options visa. Rakmaro agit comme interlocuteur reseller autorisé pour rendre le parcours plus lisible.",
    formTitle: "Parlez-nous de votre projet.",
    formText:
      "Recevez une première orientation sur l'offre RAKEZ adaptée, les documents à préparer et le budget probable.",
    submit: "Envoyer la demande",
    success: "Demande prête. Nous revenons vers vous rapidement.",
    faqTitle: "Questions fréquentes",
  },
  en: {
    nav: ["Packages", "Process", "RAKEZ", "FAQ"],
    cta: "Request a quote",
    heroEyebrow: "Authorized RAKEZ reseller",
    heroTitle: "Set up your UAE company from Ras Al Khaimah.",
    heroText:
      "Rakmaro helps French-speaking and English-speaking founders choose the right RAKEZ license, package and visa path.",
    heroPrimary: "View packages",
    heroSecondary: "Talk to an advisor",
    metricOne: "from",
    metricTwo: "active business activities",
    metricThree: "guided setup",
    pricesTitle: "Clear offers designed to get started fast.",
    pricesText:
      "RAKEZ pricing depends on the activity, license, visas, facility type and final eligibility. Rakmaro clarifies the right route before submission.",
    packagesTitle: "Choose the right RAKEZ setup",
    packagesText:
      "We start from your real activity, then shape the simplest, most compliant and most durable structure.",
    processTitle: "A direct path, without unnecessary friction.",
    rakezTitle: "Why Ras Al Khaimah Economic Zone",
    rakezText:
      "RAKEZ offers a flexible path to launch a UAE entity with license, facility and visa options. Rakmaro operates as an authorized reseller contact to make the process easier to understand.",
    formTitle: "Tell us about your project.",
    formText:
      "Get an initial view on the suitable RAKEZ package, documents to prepare and likely budget.",
    submit: "Send request",
    success: "Request ready. We will get back to you shortly.",
    faqTitle: "Frequently asked questions",
  },
};

const priceCards = [
  {
    label: "Company only",
    fr: "Création de société seule",
    en: "Company setup only",
    price: "AED 6,010",
    detailFr: "Pro 0 visa, licence RAKEZ sans visa inclus.",
    detailEn: "Pro 0 visa, RAKEZ license without included visa.",
  },
  {
    label: "Company + visa",
    fr: "Société + 1 visa",
    en: "Company + 1 visa",
    price: "AED 12,010",
    detailFr: "Point d'entrée attractif pour fondateur solo.",
    detailEn: "Accessible entry point for solo founders.",
  },
  {
    label: "Flexible Pro",
    fr: "Setup Pro flexible",
    en: "Flexible Pro setup",
    price: "AED 14,010",
    detailFr: "Co-working, 1 visa, marge d'évolution.",
    detailEn: "Co-working, 1 visa and room to grow.",
  },
  {
    label: "Premium Max",
    fr: "Setup Max premium",
    en: "Premium Max setup",
    price: "AED 16,560",
    detailFr: "Configuration renforcée pour besoins plus avancés.",
    detailEn: "Stronger setup for more advanced needs.",
  },
];

const packageCards = [
  {
    name: "Lite",
    price: "from AED 12,010",
    fr: "Pour créer vite avec une structure simple et 1 visa.",
    en: "For a fast start with a simple structure and 1 visa.",
  },
  {
    name: "Pro",
    price: "from AED 6,010",
    fr: "La famille la plus flexible, de 0 visa au co-working.",
    en: "The most flexible family, from 0 visa to co-working.",
  },
  {
    name: "Max",
    price: "from AED 16,560",
    fr: "Pour les setups qui demandent plus de capacité et d'options.",
    en: "For setups that need more capacity and options.",
  },
  {
    name: "Designated Zone",
    price: "from AED 9,999",
    fr: "Pour les besoins spécifiques de zone et d'activité.",
    en: "For specific zone and activity requirements.",
  },
];

const process = [
  {
    step: "01",
    frTitle: "Qualification",
    enTitle: "Qualification",
    frText: "Activité, associés, visas, budget, timeline et contraintes bancaires.",
    enText: "Activity, shareholders, visas, budget, timeline and banking constraints.",
  },
  {
    step: "02",
    frTitle: "Sélection RAKEZ",
    enTitle: "RAKEZ selection",
    frText: "Licence, package, facility, options visa et points de conformité.",
    enText: "License, package, facility, visa options and compliance checks.",
  },
  {
    step: "03",
    frTitle: "Dossier",
    enTitle: "Application",
    frText: "Préparation des pièces, soumission via accès pro et suivi.",
    enText: "Document preparation, submission through pro access and follow-up.",
  },
  {
    step: "04",
    frTitle: "Lancement",
    enTitle: "Launch",
    frText: "Licence, visas, prochaines étapes bancaires et mise en route.",
    enText: "License, visas, banking next steps and operational start.",
  },
];

const faqs = [
  {
    frQ: "Rakmaro est-il RAKEZ ?",
    enQ: "Is Rakmaro RAKEZ?",
    frA: "Non. Rakmaro est un reseller autorisé RAKEZ et accompagne le dossier côté client.",
    enA: "No. Rakmaro is an authorized RAKEZ reseller and supports the client-side setup process.",
  },
  {
    frQ: "Les prix affichés sont-ils définitifs ?",
    enQ: "Are displayed prices final?",
    frA: "Ce sont des prix d'appel issus des packages RAKEZ 2026. Le devis final dépend de votre activité, des visas et de l'éligibilité.",
    enA: "They are entry prices from the RAKEZ 2026 packages. The final quote depends on your activity, visas and eligibility.",
  },
  {
    frQ: "Peut-on gérer un dossier en français ?",
    enQ: "Can the process be handled in French?",
    frA: "Oui. Rakmaro s'adresse aux clients francophones et anglophones.",
    enA: "Yes. Rakmaro serves both French-speaking and English-speaking clients.",
  },
];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [sent, setSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const t = copy[locale];

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US"),
    [locale],
  );

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;

    if (!video || !hero) {
      return;
    }

    const updateVideoTime = () => {
      if (!video.duration || Number.isNaN(video.duration)) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      video.currentTime = progress * Math.max(video.duration - 0.2, 0);
    };

    const onMetadata = () => {
      video.pause();
      updateVideoTime();
    };

    video.addEventListener("loadedmetadata", onMetadata);
    window.addEventListener("scroll", updateVideoTime, { passive: true });
    window.addEventListener("resize", updateVideoTime);
    updateVideoTime();

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      window.removeEventListener("scroll", updateVideoTime);
      window.removeEventListener("resize", updateVideoTime);
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
          <a href="#process">{t.nav[1]}</a>
          <a href="#rakez">{t.nav[2]}</a>
          <a href="#faq">{t.nav[3]}</a>
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
          <video
            ref={videoRef}
            className="hero-video"
            src="/hero-dubai-hyperlapse.mp4"
            muted
            playsInline
            preload="auto"
            aria-label="Dubai hyperlapse city view"
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
        </div>
      </section>

      <section id="offers" className="section section-light">
        <div className="section-heading">
          <p className="eyebrow">Packages 2026</p>
          <h2>{t.pricesTitle}</h2>
          <p>{t.pricesText}</p>
        </div>
        <div className="price-grid">
          {priceCards.map((card) => (
            <article className="price-card" key={card.label}>
              <span>{locale === "fr" ? card.fr : card.en}</span>
              <strong>{card.price}</strong>
              <p>{locale === "fr" ? card.detailFr : card.detailEn}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section package-section">
        <div className="section-heading">
          <p className="eyebrow">Lite, Pro, Max, DZ</p>
          <h2>{t.packagesTitle}</h2>
          <p>{t.packagesText}</p>
        </div>
        <div className="package-grid">
          {packageCards.map((card) => (
            <article className="package-card" key={card.name}>
              <div>
                <h3>{card.name}</h3>
                <p>{locale === "fr" ? card.fr : card.en}</p>
              </div>
              <span>{card.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="section section-light">
        <div className="section-heading">
          <p className="eyebrow">Method</p>
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
          <p className="eyebrow">RAK Economic Zone</p>
          <h2>{t.rakezTitle}</h2>
          <p>{t.rakezText}</p>
        </div>
        <div className="activity-panel">
          <span>Business activity fit</span>
          <strong>3,395</strong>
          <p>
            {locale === "fr"
              ? "activités actives recensées dans les fichiers RAKEZ 2026, avec vérification avant soumission."
              : "active activities listed in the RAKEZ 2026 files, checked before submission."}
          </p>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy">
          <p className="eyebrow">Next step</p>
          <h2>{t.formTitle}</h2>
          <p>{t.formText}</p>
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
              <option>{locale === "fr" ? "A confirmer" : "To confirm"}</option>
            </select>
          </label>
          <label className="full">
            {locale === "fr" ? "Contexte" : "Context"}
            <textarea name="message" rows={4} />
          </label>
          <button className="button" type="submit">
            {t.submit}
          </button>
          {sent ? <p className="form-success">{t.success}</p> : null}
        </form>
      </section>

      <section id="faq" className="section section-light faq-section">
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
