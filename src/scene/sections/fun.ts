import { FUN } from "../content";
import { heading, INK, text } from "../draw";
import type { Skeleton } from "../draw";
import { browserWindow } from "./window";
import type { WebsiteSlot } from "./window";

/** What edit mode frames, and which of those start selected so they can be dragged together. */
export const FUN_EDIT_IDS = ["fun-borges-title", "fun-borges", "fun-rebord-title", "fun-rebord"];
export const FUN_EDIT_SELECTION = ["fun-rebord-title", "fun-rebord"];

/**
 * Scattered on purpose. Notes sit beside the window, never in a card.
 * Tabu and Borges are the heavy pieces. Padel is smaller and off to the side.
 */
type Spot = {
  dx: number;
  dy: number;
  width: number;
  height: number;
  noteDx: number;
  noteDy: number;
  angle: number;
  title: number;
  body: number;
};

const LAYOUT: Spot[] = [
  { dx: -70, dy: 150, width: 900, height: 556, noteDx: 1040, noteDy: 20, angle: -2.8, title: 42, body: 28 },
  { dx: 1120, dy: 880, width: 480, height: 296, noteDx: -420, noteDy: 8, angle: 4.4, title: 24, body: 18 },
  { dx: -10, dy: 1400, width: 940, height: 580, noteDx: 1080, noteDy: 28, angle: -1.6, title: 42, body: 28 },
];

export const fun = (x: number, y: number): { elements: Skeleton[]; websites: WebsiteSlot[] } => {
  const placed = FUN.map((site, i) => {
    const spot = LAYOUT[i];
    const win = browserWindow(`site-${site.id}`, x + spot.dx, y + spot.dy, spot.width, spot.height, site.url, {
      preview: site.preview,
      angle: spot.angle,
    });
    const nx = x + spot.dx + spot.noteDx;
    const ny = y + spot.dy + spot.noteDy;
    const note: Skeleton[] = [
      text(nx, ny, site.title, {
        id: site.id === "borges" ? "fun-borges-title" : undefined,
        size: spot.title,
        color: INK.blue,
        angle: spot.angle * 0.5,
        link: site.url,
      }),
      text(nx + 6, ny + spot.title + 16, site.body, {
        id: site.id === "borges" ? "fun-borges" : undefined,
        size: spot.body,
        angle: spot.angle * 0.35,
      }),
    ];
    return { elements: [...win.elements, ...note], website: win.slot };
  });

  return {
    elements: [
      ...heading(x, y, "code for fun", { underline: 400 }),
      ...placed.flatMap((item) => item.elements),
    ],
    websites: placed.map((item) => item.website),
  };
};
