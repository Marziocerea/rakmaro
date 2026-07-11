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
  assert.match(html, /Authorized RAKEZ reseller/);
  assert.match(html, /AED 6,010/);
  assert.match(html, /Votre société UAE, sans tunnel administratif|Your UAE company, without the admin maze/);
  assert.match(html, /RAKEZ launch paths/);
  assert.match(html, /hero-canvas/);
});

test("removes disposable starter preview files", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);
  assert.match(page, /hero-frames\/frame-/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/hero-frames/frame-000.jpg", import.meta.url));
  await access(new URL("../public/hero-frames/frame-063.jpg", import.meta.url));
  await access(new URL("../public/assets/dubai-aerial-fog.jpg", import.meta.url));
  await access(new URL("../public/assets/rak-corniche-morning.jpg", import.meta.url));
});
