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
  shake = 1.6,
  width = 2,
  closed = false,
): Skeleton => line(x, y, points, { color: BLACK, shake, strokeWidth: width, closed });

const mix = (from: Point, to: Point, t: number): Point => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
];

const poly = (points: Point[], shake = 1.4, width = 2, closed = false): Skeleton =>
  stroke(
    points[0][0],
    points[0][1],
    points.map((point) => [point[0] - points[0][0], point[1] - points[0][1]]),
    shake,
    width,
    closed,
  );

/** The bridge runs toward this point, so the far tower and the deck shrink. */
const VP: Point = [760, 210];
/** Near edge of the deck (closer to the viewer, lower on the page). */
const NEAR: Point = [-700, 560];
/** Far edge of the deck (farther from the viewer). */
const FAR: Point = [-610, 468];
const DECK_THICK = NEAR[1] - FAR[1];
const TOWER_H = 320;
const NEAR_TOWER = 0.14;
const FAR_TOWER = 0.62;

const deckNear = (t: number) => mix(NEAR, VP, t);
const deckFar = (t: number) => mix(FAR, VP, t);
const deckCenter = (t: number): Point => {
  const near = deckNear(t);
  const far = deckFar(t);
  return [(near[0] + far[0]) / 2, (near[1] + far[1]) / 2];
};
const deckScale = (t: number) => Math.max(0.22, (deckNear(t)[1] - deckFar(t)[1]) / DECK_THICK);

/** How high the cable sits above the deck, 0 at the shores and 1 on a tower. */
const cableLift = (t: number) => {
  const keys: Point[] = [
    [0, 0],
    [NEAR_TOWER, 1],
    [0.36, 0.36],
    [FAR_TOWER, 1],
    [0.8, 0],
  ];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, lift0] = keys[i];
    const [t1, lift1] = keys[i + 1];
    if (t < t0 || t > t1) {
      continue;
    }
    const u = (t - t0) / (t1 - t0);
    const eased = (1 - Math.cos(u * Math.PI)) / 2;
    return lift0 + (lift1 - lift0) * eased;
  }
  return 0;
};

const cableAt = (t: number): Point => {
  const center = deckCenter(t);
  return [center[0], center[1] - cableLift(t) * TOWER_H * deckScale(t)];
};

const cable = (): Skeleton => {
  const points: Point[] = [];
  for (let i = 0; i <= 32; i++) {
    points.push(cableAt(0.84 * (i / 32)));
  }
  return poly(points, 0.8, 2);
};

const suspenders = (): Skeleton[] => {
  const drawn: Skeleton[] = [];
  for (let i = 1; i < 16; i++) {
    const t = 0.84 * (i / 16);
    if (Math.abs(t - NEAR_TOWER) < 0.05 || Math.abs(t - FAR_TOWER) < 0.045) {
      continue;
    }
    const from = cableAt(t);
    const to = deckCenter(t);
    if (to[1] - from[1] < 22) {
      continue;
    }
    drawn.push(poly([from, to], 0.4, 1));
  }
  return drawn;
};

const truss = (): Skeleton[] => {
  const steps = 14;
  const near: Point[] = [];
  const far: Point[] = [];
  const ts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = 0.86 * (i / steps);
    ts.push(t);
    near.push(deckNear(t));
    far.push(deckFar(t));
  }
  const drawn: Skeleton[] = [poly(near, 0.9, 2), poly(far, 0.9, 2)];
  for (let i = 0; i <= steps; i++) {
    const onTower = Math.abs(ts[i] - NEAR_TOWER) < 0.035 || Math.abs(ts[i] - FAR_TOWER) < 0.03;
    if (onTower) {
      continue;
    }
    drawn.push(poly([far[i], near[i]], 0.8, 1));
  }
  return drawn;
};

/** A tower standing on the deck at depth `t` (0 is close, 1 is the vanishing point). */
const tower = (t: number): Skeleton[] => {
  const scale = deckScale(t);
  const height = TOWER_H * scale;
  const drop = 24 * scale;
  const leg = (u: number) => {
    const foot = mix(deckFar(t), deckNear(t), u);
    return {
      pier: [foot[0], foot[1] + drop] as Point,
      foot,
      top: [foot[0], foot[1] - height * 0.94] as Point,
    };
  };
  const left = leg(0.12);
  const leftIn = leg(0.3);
  const rightIn = leg(0.7);
  const right = leg(0.88);
  const cap = (foot: Point): Point => [foot[0], foot[1] - height];
  const drawn: Skeleton[] = [
    poly([left.pier, left.top, leftIn.top, leftIn.pier], 1.3, 2, true),
    poly([rightIn.pier, rightIn.top, right.top, right.pier], 1.3, 2, true),
    poly([cap(left.foot), cap(leftIn.foot), cap(rightIn.foot), cap(right.foot)], 1.2, 2, true),
  ];

  const along = (from: Point, to: Point, u: number): Point => mix(from, to, u);
  const bays = 3;
  for (let i = 0; i < bays; i++) {
    const u0 = i / bays;
    const u1 = (i + 1) / bays;
    const a0 = along(leftIn.foot, leftIn.top, u0);
    const a1 = along(leftIn.foot, leftIn.top, u1);
    const b0 = along(rightIn.foot, rightIn.top, u0);
    const b1 = along(rightIn.foot, rightIn.top, u1);
    drawn.push(poly([a0, b0], 1.2, 2));
    if (i === bays - 1) {
      const window: Point[] = [
        along(a0, b0, 0.22),
        along(a0, b0, 0.78),
        along(a1, b1, 0.78),
        along(a1, b1, 0.22),
      ];
      drawn.push(poly(window, 1, 1, true));
      continue;
    }
    drawn.push(poly([a0, b1], 1.5, 2));
    drawn.push(poly([b0, a1], 1.5, 2));
  }
  drawn.push(poly([leftIn.foot, rightIn.foot], 1.1, 2));
  return drawn;
};

const ripple = (below: number): Skeleton => {
  const points: Point[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = 0.9 * (i / 14);
    const near = deckNear(t);
    const scale = deckScale(t);
    points.push([near[0] + 30 * scale, near[1] + below * scale + Math.sin(i * 1.3) * 3 * scale]);
  }
  return poly(points, 1.2, 1);
};

const bush = (origin: Point, scale: number): Skeleton[] => {
  const w = 120 * scale;
  const h = 90 * scale;
  return [
    stroke(
      origin[0],
      origin[1],
      [
        [0, h * 0.65],
        [w * 0.15, h * 0.2],
        [w * 0.4, 0],
        [w * 0.7, h * 0.16],
        [w, h * 0.5],
        [w * 0.62, h],
        [w * 0.2, h * 0.9],
      ],
      2.2,
      2,
    ),
  ];
};

const boat = (): Skeleton[] => {
  const t = 0.42;
  const center = deckNear(t);
  const scale = deckScale(t);
  const x = center[0] - 10;
  const y = center[1] + 36 * scale;
  const w = 40 * scale;
  return [
    stroke(x, y, [[0, 0], [w, 0], [w * 0.75, 8 * scale], [w * 0.22, 8 * scale]], 1.2, 1, true),
    stroke(x + w * 0.45, y, [[0, 0], [0, -22 * scale]], 0.6, 1),
    stroke(x + w * 0.45, y - 20 * scale, [[0, 0], [14 * scale, 10 * scale], [0, 12 * scale]], 1.2, 1),
  ];
};

/** A blank board: the missing-page note over a sketched Golden Gate, seen in perspective. */
export const notFound = (): Skeleton[] => [
  ripple(28),
  ripple(52),
  ripple(74),
  ...bush([-760, 500], 1),
  ...bush([520, 300], 0.45),
  ...truss(),
  ...suspenders(),
  cable(),
  ...tower(NEAR_TOWER),
  ...tower(FAR_TOWER),
  ...boat(),
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
