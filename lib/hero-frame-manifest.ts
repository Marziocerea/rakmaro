export const HERO_FRAME_COUNT = 429;

export const HERO_FRAME_MANIFEST = Array.from(
  { length: HERO_FRAME_COUNT },
  (_, index) => `/hero-frames/frame-${String(index).padStart(3, "0")}.jpg`,
);

export const PRELOAD_FRAME_MANIFEST = HERO_FRAME_MANIFEST.slice(0, 6);

const MOBILE_SAMPLED_FRAMES = HERO_FRAME_MANIFEST.filter((_, index) => index % 2 === 0);
const LAST_HERO_FRAME = HERO_FRAME_MANIFEST[HERO_FRAME_MANIFEST.length - 1];

export const MOBILE_FRAME_MANIFEST = MOBILE_SAMPLED_FRAMES.at(-1) === LAST_HERO_FRAME
  ? MOBILE_SAMPLED_FRAMES
  : [...MOBILE_SAMPLED_FRAMES, LAST_HERO_FRAME];
