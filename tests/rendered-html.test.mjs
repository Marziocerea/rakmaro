import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Rakmaro landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Rakmaro/);
  assert.match(html, /AED 6,010/);
  assert.match(html, /Créez votre société aux Émirats|Set up your UAE company/);
  assert.match(html, /visa de résidence|residence visa/);
  assert.match(html, /Emirates ID/);
  assert.match(html, /compte professionnel|business account/);
  assert.match(html, /hero-canvas/);
  assert.match(html, /Votre dossier traité par un agent RAKEZ autorisé|Your file handled by an authorized RAKEZ agent/);
  assert.match(html, /Votre projet peut avancer en quelques jours|Your project can move forward in a few days/);
  assert.match(html, /Structure temporaire avec témoignages fictifs|Temporary structure with placeholder testimonials/);
  assert.match(html, /Décrivez ce que votre société va vendre ou facturer|Describe what your company will sell or invoice/);
  assert.match(html, /Que va vendre ou facturer votre société|What will your company sell or invoice/);
  assert.match(html, /sous 7 jours|within 7 days/);
  assert.match(html, /Agent RAKEZ autorisé|Authorized RAKEZ Agent/);
  assert.doesNotMatch(html, /Étude humaine nécessaire/);
  assert.doesNotMatch(html, /activité RAKEZ|RAKEZ activity|Repères visuels|Repère visuel|Visual cues|visual cue|Depuis les Émirats|From the UAE|catalogue RAKEZ 2026/);
  assert.doesNotMatch(html, /Marzio Cerea/);
  assert.doesNotMatch(html, /1 597|1,597|Packages normalized|ESR \/ non-coworking flags|Special activity checks/);
});

test("removes disposable starter preview files", async () => {
  const [page, component, manifest, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/RakmaroLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/hero-frame-manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(`${page}\n${component}`, /SkeletonPreview|_sites-preview|codex-preview/);
  assert.doesNotMatch(component, /RAKEZ launch paths|Before you commit|Application readiness|RAK signal|Activity checker|Budget simulator|Project summary|Smart form/);
  assert.match(manifest, /hero-frames\/frame-/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/hero-frames/frame-000.jpg", import.meta.url));
  await access(new URL("../public/hero-frames/frame-063.jpg", import.meta.url));
  await access(new URL("../public/assets/dubai-aerial-fog.jpg", import.meta.url));
  await access(new URL("../public/assets/rak-corniche-morning.jpg", import.meta.url));
});
