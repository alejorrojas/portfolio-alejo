import type { Skeleton } from "./draw";
import { INK, line, rect, text } from "./draw";

const BLACK = INK.black;

type Point = [number, number];

/** Resting fill of the home button, and the darker fill while the pointer is on it. */
export const HOME_BUTTON_ID = "lost-home-button";
export const HOME_BUTTON_FILL = "#f1f3f5";
export const HOME_BUTTON_HOVER = "#ced4da";

const stroke = (
  x: number,
  y: number,
  points: Point[],
  shake = 1,
  width = 2,
  closed = false,
): Skeleton => line(x, y, points, { color: BLACK, shake, strokeWidth: width, closed });

const poly = (points: Point[], shake = 0.8, width = 2, closed = false): Skeleton =>
  stroke(
    points[0][0],
    points[0][1],
    points.map((point) => [point[0] - points[0][0], point[1] - points[0][1]]),
    shake,
    width,
    closed,
  );

const DECK = 392;
const TRUSS = 34;
const TOWER_TOP = 156;
const TOWER_W = 86;
const LEFT = -360;
const RIGHT = 360;

const droop = (from: Point, to: Point, sag: number, steps: number): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push([
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * sag,
    ]);
  }
  return points;
};

/** One Golden Gate tower, seen straight on: portal, X braces, legs into the water. */
const tower = (cx: number): Skeleton[] => {
  const leg = 14;
  const left = cx - TOWER_W / 2;
  const right = cx + TOWER_W / 2 - leg;
  const gap = right - (left + leg);
  const pier = DECK + 58;
  const drawn: Skeleton[] = [];
  const column = (x: number, y0: number, y1: number) =>
    stroke(x, y0, [[0, 0], [leg, 0], [leg, y1 - y0], [0, y1 - y0]], 0.8, 2, true);

  drawn.push(column(left, TOWER_TOP, pier), column(right, TOWER_TOP, pier));
  drawn.push(stroke(left - 4, TOWER_TOP - 12, [[0, 12], [0, 0], [TOWER_W + 8, 0], [TOWER_W + 8, 12]], 0.6, 2));

  const bays = 4;
  const body = DECK - TOWER_TOP;
  for (let i = 0; i < bays; i++) {
    const y0 = TOWER_TOP + (body * i) / bays;
    const y1 = TOWER_TOP + (body * (i + 1)) / bays;
    drawn.push(stroke(left + leg, y0, [[0, 0], [gap, 0]], 0.5, 2));
    if (i === 0) {
      const pad = 8;
      drawn.push(
        stroke(left + leg + pad, y0 + 8, [[0, 0], [gap - pad * 2, 0], [gap - pad * 2, y1 - y0 - 16], [0, y1 - y0 - 16]], 0.4, 1, true),
      );
      continue;
    }
    drawn.push(stroke(left + leg, y0, [[0, 0], [gap, y1 - y0]], 0.9, 2));
    drawn.push(stroke(right, y0, [[0, 0], [-gap, y1 - y0]], 0.9, 2));
  }
  drawn.push(stroke(left + leg, DECK, [[0, 0], [gap, 0]], 0.5, 2));
  drawn.push(stroke(left, pier, [[0, 0], [TOWER_W, 0]], 0.6, 2));

  for (const x of [left + 3, right + 3]) {
    for (let i = 0; i < 4; i++) {
      const y = TOWER_TOP + 28 + i * 46;
      drawn.push(stroke(x, y, [[0, 0], [8, 0], [8, 16], [0, 16]], 0.3, 1, true));
    }
  }
  return drawn;
};

const deck = (): Skeleton[] => {
  const x0 = -760;
  const x1 = 760;
  const drawn: Skeleton[] = [
    stroke(x0, DECK, [[0, 0], [x1 - x0, 0]], 0.5, 2),
    stroke(x0, DECK + TRUSS, [[0, 0], [x1 - x0, 0]], 0.5, 2),
  ];
  const step = 28;
  for (let x = x0; x < x1 - 4; x += step) {
    const w = Math.min(step, x1 - x);
    drawn.push(stroke(x, DECK, [[0, 0], [0, TRUSS]], 0.3, 1));
    drawn.push(stroke(x, DECK, [[0, 0], [w, TRUSS]], 0.6, 1));
    drawn.push(stroke(x, DECK + TRUSS, [[0, 0], [w, -TRUSS]], 0.6, 1));
  }
  return drawn;
};

const LEFT_TOP: Point = [LEFT, TOWER_TOP + 4];
const RIGHT_TOP: Point = [RIGHT, TOWER_TOP + 4];
const LEFT_SHORE: Point = [-740, DECK];
const RIGHT_SHORE: Point = [740, DECK];
const MAIN_SAG = 186;

const cable = (): Skeleton =>
  poly(
    [
      ...droop(LEFT_SHORE, LEFT_TOP, 26, 8),
      ...droop(LEFT_TOP, RIGHT_TOP, MAIN_SAG, 20).slice(1),
      ...droop(RIGHT_TOP, RIGHT_SHORE, 26, 8).slice(1),
    ],
    0.5,
    2,
  );

const hangers = (): Skeleton[] => {
  const spans: [Point, Point, number, number][] = [
    [LEFT_SHORE, LEFT_TOP, 26, 28],
    [LEFT_TOP, RIGHT_TOP, MAIN_SAG, 24],
    [RIGHT_TOP, RIGHT_SHORE, 26, 28],
  ];
  const drawn: Skeleton[] = [];
  for (const [from, to, sag, spacing] of spans) {
    const count = Math.max(4, Math.round(Math.abs(to[0] - from[0]) / spacing));
    for (let i = 1; i < count; i++) {
      const t = i / count;
      const x = from[0] + (to[0] - from[0]) * t;
      if (Math.abs(x - LEFT) < 50 || Math.abs(x - RIGHT) < 50) {
        continue;
      }
      const y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * sag;
      if (DECK - y < 14) {
        continue;
      }
      drawn.push(stroke(x, y, [[0, 0], [0, DECK - y]], 0.2, 1));
    }
  }
  return drawn;
};

const wave = (y: number, x0: number, x1: number, amp: number): Skeleton => {
  const points: Point[] = [];
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push([x0 + (x1 - x0) * t, Math.sin(t * Math.PI * 5) * amp]);
  }
  return poly(points.map((point) => [point[0], y + point[1]]), 0.5, 1);
};

const bush = (x: number, y: number, w: number, h: number): Skeleton[] => [
  stroke(
    x,
    y,
    [
      [0, h * 0.72],
      [w * 0.12, h * 0.28],
      [w * 0.3, h * 0.08],
      [w * 0.48, 0],
      [w * 0.66, h * 0.1],
      [w * 0.84, h * 0.32],
      [w, h * 0.58],
      [w * 0.7, h],
      [w * 0.28, h * 0.9],
    ],
    1.6,
    2,
  ),
  stroke(x + w * 0.25, y + h * 0.55, [[0, 0], [w * 0.14, -h * 0.25], [w * 0.28, -h * 0.02]], 1.4, 1),
];

const hill = (x: number, y: number, w: number, h: number): Skeleton =>
  stroke(x, y, [[0, h], [w * 0.2, h * 0.35], [w * 0.45, 0], [w * 0.7, h * 0.4], [w, h]], 1.2, 1);

const boat = (x: number, y: number): Skeleton[] => [
  stroke(x, y, [[0, 0], [34, 0], [26, 8], [8, 8]], 0.7, 1, true),
  stroke(x + 18, y, [[0, 0], [0, -28]], 0.3, 1),
  stroke(x + 18, y - 26, [[0, 0], [-12, 14], [0, 16]], 0.7, 1),
  stroke(x + 18, y - 24, [[0, 0], [10, 12], [0, 14]], 0.7, 1),
];

/** The reference elevation: two matching towers, a hanging cable, and the bay around it. */
export const notFound = (): Skeleton[] => [
  hill(-120, 470, 260, 28),
  wave(500, -720, 720, 2),
  wave(528, -700, 700, 2),
  wave(556, -680, 680, 2),
  ...bush(-820, 430, 120, 100),
  ...bush(-730, 455, 90, 78),
  ...bush(620, 400, 130, 130),
  ...bush(730, 445, 90, 80),
  ...deck(),
  ...hangers(),
  cable(),
  ...tower(LEFT),
  ...tower(RIGHT),
  ...boat(-8, 478),
  text(-184, -36, "oops that page\ndoes not exist", {
    id: "lost-title",
    size: 48,
    color: BLACK,
    steady: true,
  }),
  rect(-128, 104, 256, 62, {
    id: HOME_BUTTON_ID,
    color: BLACK,
    fill: HOME_BUTTON_FILL,
    fillStyle: "solid",
    angle: 0,
    steady: true,
    link: "/",
    button: true,
  }),
  text(-91, 118, "back to home", {
    id: "lost-home",
    size: 28,
    color: BLACK,
    steady: true,
    link: "/",
    button: true,
  }),
];
