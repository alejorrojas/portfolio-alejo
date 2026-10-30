import { TALKS } from "../content";
import { heading, image, polaroid } from "../draw";
import type { Skeleton } from "../draw";

const SINGLE = { width: 300, height: 300 };
const PAIR = { width: 300, height: 200 };

const LAYOUT = [
  { dx: 0, dy: 0, angle: -4 },
  { dx: 420, dy: 60, angle: 2 },
  { dx: 40, dy: 520, angle: -2 },
  { dx: 760, dy: 460, angle: 3 },
];

export const talks = (x: number, y: number): Skeleton[] => [
  ...heading(x, y, "talks and cool meetups", { underline: 640 }),
  ...TALKS.flatMap((talk, i) =>
    polaroid(
      x + LAYOUT[i].dx,
      y + 170 + LAYOUT[i].dy,
      talk.photos.length > 1 ? PAIR : SINGLE,
      talk.photos.map((name) => `photo-${name}`),
      talk.caption,
      { sub: talk.sub, link: talk.link, angle: LAYOUT[i].angle, logo: talk.logo && `logo-${talk.logo}` },
    ),
  ),
  image(x - 277, y + 217, 220, 78, "logo-campus-party", { angle: -5 }),
];
