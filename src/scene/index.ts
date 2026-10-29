import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

import { BOOKS_2026, OPEN_SOURCE, TALKS } from "./content";
import { resetDrawing } from "./draw";
import type { Skeleton } from "./draw";
import type { SceneFile } from "./files";
import { notFound } from "./not-found";
import { education } from "./sections/education";
import { experience } from "./sections/experience";
import { fun } from "./sections/fun";
import { intro, INTRO_IDS } from "./sections/intro";
import { openSource } from "./sections/open-source";
import { reading } from "./sections/reading";
import type { BookSlot } from "./sections/reading";
import { research } from "./sections/research";
import { SKETCHES } from "./sections/sketches";
import { talks } from "./sections/talks";
import type { WebsiteSlot } from "./sections/window";

export type { BookSlot, WebsiteSlot };

export const INITIAL_VIEW_IDS = new Set(INTRO_IDS);

const LOGOS = ["simpleble", "the-network", "rebill", "digital-house", "nlasmith", "utn", "campus-party"];

export const SCENE_FONTS = ["Virgil", "Nunito", "Comic Shanns"];

export const SCENE_FILES: SceneFile[] = [
  ...TALKS.flatMap(({ photos }) => photos).map((name) => ({
    id: `photo-${name}`,
    url: `/images/photos/${name}.webp`,
  })),
  ...LOGOS.map((name) => ({ id: `logo-${name}`, url: `/images/logos/${name}.webp` })),
  { id: "logo-yc", url: "/images/logos/yc.svg" },
  ...TALKS.flatMap(({ logo }) => (logo ? [{ id: `logo-${logo}`, url: `/images/logos/${logo}.svg` }] : [])),
  { id: "reading-challenge", url: "/images/reading-challenge.webp" },
  ...OPEN_SOURCE.map(({ preview }) => ({ id: preview, url: `/images/repos/${preview.replace(/^repo-/, "")}.webp` })),
  ...BOOKS_2026.map(({ slug }) => ({ id: `book-${slug}`, url: `/images/books/${slug}.webp` })),
];

/** Excalidraw picks a random roughness seed per element; pin it so the sketch looks the same on every visit. */
const stableSeed = (id: string) => {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash = Math.imul(hash ^ id.charCodeAt(i), 16777619);
  }
  return (hash >>> 0) % 2147483647 || 1;
};

export type Scene = {
  elements: ReturnType<typeof convertToExcalidrawElements>;
  websites: WebsiteSlot[];
  books: BookSlot[];
};

export function buildScene(): Scene {
  resetDrawing();
  const work = experience(2300, -300);
  const paper = research(4100, -300);
  const shelf = reading(-2369, -400);
  const play = fun(-260, -3560);
  const skeleton: Skeleton[] = [
    ...play.elements,
    ...intro(),
    ...work.elements,
    ...paper.elements,
    ...talks(-1960, 2273),
    ...education(-1528, 1130),
    ...shelf.elements,
    ...openSource(-117, 1309),
  ];

  const generated = convertToExcalidrawElements(skeleton, { regenerateIds: false }).map((element) => ({
    ...element,
    seed: stableSeed(element.id),
    locked: true,
  }));
  const elements = [...generated, ...(SKETCHES as typeof generated)];
  return { elements, websites: [...play.websites, ...work.websites, ...paper.websites], books: shelf.books };
}

/** Same board, but only the missing-page drawing. No portfolio, no embedded sites. */
export function buildNotFound(): Scene {
  resetDrawing();
  const elements = convertToExcalidrawElements(notFound(), { regenerateIds: false }).map((element) => ({
    ...element,
    seed: stableSeed(element.id),
    locked: true,
  }));
  return { elements, websites: [], books: [] };
}
