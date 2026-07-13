export const HERO_FRAME_MANIFEST = Array.from(
  { length: 64 },
  (_, index) => `/hero-frames/frame-${String(index).padStart(3, "0")}.jpg`,
);

export const PRELOAD_FRAME_MANIFEST = HERO_FRAME_MANIFEST.slice(0, 6);

export const MOBILE_FRAME_MANIFEST = HERO_FRAME_MANIFEST.filter((_, index) => index % 2 === 0);
