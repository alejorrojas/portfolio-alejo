import { ellipse, INK, line, rect, text } from "../draw";
import type { Skeleton } from "../draw";

/** Where a live website gets mounted on top of the canvas, in scene coordinates. */
export type WebsiteSlot = {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Full-page screenshot to scroll instead of framing `url`. */
  screenshot?: string;
  /** First screen of the landing, shown until hover loads `url`. */
  preview?: string;
};

const BAR = 52;
const PAD = 14;

/**
 * A hand-drawn browser window. The frame lives on the canvas; the website is mounted
 * over the returned slot, as an iframe or as a scrollable `screenshot`.
 */
export const browserWindow = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string,
  opts: { screenshot?: string; preview?: string } = {},
): { elements: Skeleton[]; slot: WebsiteSlot } => {
  const host = new URL(url).host.replace(/^www\./, "");
  const elements: Skeleton[] = [
    rect(x, y, width + PAD * 2, height + BAR + PAD, { angle: 0, color: INK.black, fill: "#ffffff", fillStyle: "solid" }),
    line(x + 4, y + BAR - 6, [[0, 0], [width + PAD * 2 - 8, 0]], { color: INK.black }),
    ellipse(x + 18, y + 14, 18, 18, { angle: 0, color: INK.black, fill: INK.black, fillStyle: "solid", strokeWidth: 1 }),
    ellipse(x + 46, y + 14, 18, 18, { angle: 0, color: INK.gray, fill: INK.gray, fillStyle: "hachure", strokeWidth: 1 }),
    ellipse(x + 74, y + 14, 18, 18, { angle: 0, color: INK.blue, fill: INK.blue, fillStyle: "cross-hatch", strokeWidth: 1 }),
    text(x + 120, y + 10, `${host} ↗`, { size: 20, color: INK.gray, angle: 0, link: url }),
  ];

  return {
    elements,
    slot: { id, url, x: x + PAD, y: y + BAR, width, height, screenshot: opts.screenshot, preview: opts.preview },
  };
};
