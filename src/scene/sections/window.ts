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
  /** Degrees. The page overlay tilts with the frame. */
  angle?: number;
};

const BAR = 52;
const PAD = 14;

/** Top-left after spinning an element around `(cx, cy)`, so the group tilts as one piece. */
const spun = (angle: number, cx: number, cy: number, px: number, py: number, w: number, h: number) => {
  const dx = px + w / 2 - cx;
  const dy = py + h / 2 - cy;
  const r = (angle * Math.PI) / 180;
  return [cx + dx * Math.cos(r) - dy * Math.sin(r) - w / 2, cy + dx * Math.sin(r) + dy * Math.cos(r) - h / 2] as const;
};

/**
 * A hand-drawn browser window. The frame lives on the canvas; the website is mounted
 * over the returned slot, as an iframe or as a scrollable `screenshot`.
 * `angle` tilts the whole window, frame and page together.
 */
export const browserWindow = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string,
  opts: { screenshot?: string; preview?: string; angle?: number } = {},
): { elements: Skeleton[]; slot: WebsiteSlot } => {
  const host = new URL(url).host.replace(/^www\./, "");
  const angle = opts.angle ?? 0;
  const frameW = width + PAD * 2;
  const frameH = height + BAR + PAD;
  const at = (px: number, py: number, w: number, h: number) => spun(angle, x + frameW / 2, y + frameH / 2, px, py, w, h);
  const label = `${host} ↗`;
  const [sx, sy] = at(x + PAD, y + BAR, width, height);
  const [lx, ly] = at(x + 4, y + BAR - 6, frameW - 8, 2);
  const [tx, ty] = at(x + 120, y + 10, label.length * 12.5, 24);

  const elements: Skeleton[] = [
    rect(...at(x, y, frameW, frameH), frameW, frameH, { angle, color: INK.black, fill: "#ffffff", fillStyle: "solid" }),
    line(lx, ly, [[0, 0], [frameW - 8, 0]], { color: INK.black, angle }),
    ellipse(...at(x + 18, y + 14, 18, 18), 18, 18, { angle, color: INK.black, fill: INK.black, fillStyle: "solid", strokeWidth: 1 }),
    ellipse(...at(x + 46, y + 14, 18, 18), 18, 18, { angle, color: INK.gray, fill: INK.gray, fillStyle: "hachure", strokeWidth: 1 }),
    ellipse(...at(x + 74, y + 14, 18, 18), 18, 18, { angle, color: INK.blue, fill: INK.blue, fillStyle: "cross-hatch", strokeWidth: 1 }),
    text(tx, ty, label, { size: 20, color: INK.gray, angle, link: url }),
  ];

  return {
    elements,
    slot: {
      id,
      url,
      x: sx,
      y: sy,
      width,
      height,
      angle,
      screenshot: opts.screenshot,
      preview: opts.preview,
    },
  };
};
