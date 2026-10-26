import { JOBS } from "../content";
import type { Job } from "../content";
import { ellipse, heading, image, INK, line, rect, text } from "../draw";
import type { Skeleton } from "../draw";
import { browserWindow } from "./window";
import type { WebsiteSlot } from "./window";

const ROW = 640;
const YC_ORANGE = "#fb651e";
const SITE = { width: 760, height: 470 };

const doodles: Record<string, (x: number, y: number) => Skeleton[]> = {
  SimpleBLE: (x, y) => [
    line(x, y + 18, [[0, 0], [34, 34], [17, 52], [17, -12], [34, 6], [0, 40]], { color: INK.blue, strokeWidth: 3, shake: 1.5 }),
  ],
  "Rebill (YC W22)": (x, y) => [
    rect(x, y, 120, 76, { color: INK.black, fill: "#ffffff", fillStyle: "solid", rounded: true }),
    text(x + 17, y + 15, "**********", { size: 16, color: INK.gray, angle: 0 }),
    text(x + 14, y + 44, "**** 4242", { size: 16, color: INK.gray, angle: 0 }),
    image(x + 150, y + 10, 56, 56, "logo-yc"),
    text(x + 221, y + 24, "<- YC W22!!", { size: 20, color: YC_ORANGE }),
  ],
};

const job = (item: Job, x: number, y: number, index: number) => {
  const doodle = doodles[item.company];
  const window = item.site
    ? browserWindow(`site-${index}`, x + 760, y - 30, SITE.width, SITE.height, item.site, item.screenshot)
    : null;
  const elements: Skeleton[] = [
    image(x, y, item.logo.width, item.logo.height, item.logo.fileId),
    text(x, y + item.logo.height + 24, item.role, { size: 34 }),
    text(x, y + item.logo.height + 72, `${item.company} · ${item.period}`, { size: 20, color: INK.gray }),
    text(x, y + item.logo.height + 120, item.bullets.map((b) => (b.startsWith("(") ? `   ${b}` : `- ${b}`)).join("\n"), {
      size: 22,
    }),
    ...(doodle ? doodle(x + 20, y + item.logo.height + 140 + item.bullets.length * 34) : []),
    ...(window?.elements ?? []),
  ];
  return { elements, website: window?.slot ?? null };
};

const yearsOf = (period: string) => {
  const found = period.match(/\d{4}/g) ?? [];
  const first = found[0];
  const last = found[found.length - 1];
  return first === last ? first : `${first}–${last.slice(2)}`;
};

const rowY = (y: number, i: number) => y + 200 + i * ROW;

/** A plain line with a hollow dot and the years of each job. */
const timeline = (sx: number, marks: number[], top: number, bottom: number): Skeleton[] => [
  line(sx, top, [[0, 0], [4, bottom - top]], { color: INK.gray, shake: 2 }),
  ...JOBS.flatMap((item, i) => {
    const years = yearsOf(item.period);
    return [
      ellipse(sx - 14, marks[i] + 2, 28, 28, { color: INK.blue, fill: "#ffffff", fillStyle: "solid", strokeWidth: 3 }),
      // Right-aligned by hand: Virgil at 32px is roughly 22px per character.
      text(sx - 40 - years.length * 22, marks[i] - 4, years, { size: 32, color: INK.blue }),
    ];
  }),
];

export const experience = (x: number, y: number) => {
  const rows = JOBS.map((item, i) => job(item, x, rowY(y, i), i));
  const elements: Skeleton[] = [
    ...heading(x, y, "Work", { underline: 173, aside: "(click around, the sites are live)", asideAt: 560 }),
    ...timeline(x - 60, JOBS.map((_, i) => rowY(y, i) + 10), y + 190, rowY(y, JOBS.length - 1) + 340),
    ...rows.flatMap((row) => row.elements),
  ];
  const websites = rows.flatMap((row): WebsiteSlot[] => (row.website ? [row.website] : []));
  return { elements, websites };
};
