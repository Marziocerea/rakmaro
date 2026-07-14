import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { HERO_FRAME_COUNT, HERO_FRAME_MANIFEST, MOBILE_FRAME_MANIFEST, PRELOAD_FRAME_MANIFEST } from "../lib/hero-frame-manifest";

test("hero frame manifest lists the full ordered jpg sequence", async () => {
  assert.equal(HERO_FRAME_MANIFEST.length, HERO_FRAME_COUNT);
  assert.equal(PRELOAD_FRAME_MANIFEST.length, 6);
  assert.ok(MOBILE_FRAME_MANIFEST.length < HERO_FRAME_MANIFEST.length);
  assert.equal(MOBILE_FRAME_MANIFEST.at(-1), HERO_FRAME_MANIFEST.at(-1));

  for (let index = 0; index < HERO_FRAME_COUNT; index += 1) {
    const expected = `/hero-frames/frame-${String(index).padStart(3, "0")}.jpg`;
    assert.equal(HERO_FRAME_MANIFEST[index], expected);
    await access(path.join(process.cwd(), "public", expected));
  }
});

test("public hero frame manifest matches application manifest", async () => {
  const raw = await readFile(path.join(process.cwd(), "public/hero-frames/manifest.json"), "utf8");
  const manifest = JSON.parse(raw) as { frames: string[] };
  assert.deepEqual(manifest.frames, HERO_FRAME_MANIFEST);
});
