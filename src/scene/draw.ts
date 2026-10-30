import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import type {
  ExcalidrawElement,
  ExcalidrawLinearElement,
  FileId,
  FontFamilyValues,
} from "@excalidraw/excalidraw/element/types";

export type Skeleton = ExcalidrawElementSkeleton;
type Angle = ExcalidrawElement["angle"];
type Points = ExcalidrawLinearElement["points"];
type Point = [number, number];

/** The whole palette. Anything else is off-brand. */
export const INK = {
  black: "#1e1e1e",
  blue: "#1971c2",
  gray: "#868e96",
} as const;

export const WASH = {
  gray: "#dee2e6",
  blue: "#a5d8ff",
} as const;

export const FONT = { hand: 1, comic: 8 } as const satisfies Record<string, FontFamilyValues>;

// Deterministic randomness so every visit gets the same wonky drawing.
let seed = 1;
let nextId = 0;
const random = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
/** Random number in [-amount, amount]. */
export const wobble = (amount: number) => (random() * 2 - 1) * amount;

export const uid = (prefix: string) => `${prefix}-${++nextId}`;
export const resetDrawing = () => {
  seed = 1;
  nextId = 0;
};

export const deg = (degrees: number) => ((degrees * Math.PI) / 180) as Angle;
const pts = (points: Point[]) => points as unknown as Points;

type Common = {
  id?: string;
  color?: string;
  fill?: string;
  fillStyle?: "hachure" | "cross-hatch" | "solid" | "zigzag";
  strokeWidth?: number;
  strokeStyle?: "solid" | "dashed" | "dotted";
  roughness?: number;
  opacity?: number;
  /** Degrees. Defaults to a slight random tilt; pass 0 to keep it straight. */
  angle?: number;
  link?: string;
  /** Same-origin file. A click offers a download instead of navigating. */
  download?: { url: string; name: string };
  /** Filled control: hover darkens it instead of underlining the words. */
  button?: boolean;
};

const common = (o: Common, tilt: number) => ({
  id: o.id ?? uid("el"),
  strokeColor: o.color ?? INK.black,
  backgroundColor: o.fill ?? "transparent",
  fillStyle: o.fillStyle ?? "hachure",
  strokeWidth: o.strokeWidth ?? 2,
  strokeStyle: o.strokeStyle ?? "solid",
  roughness: o.roughness ?? 2,
  opacity: o.opacity ?? 100,
  angle: deg(o.angle ?? wobble(tilt)),
  // Excalidraw's native `link` paints an icon on the canvas; ours is handled in src/links.ts.
  link: null,
  ...(o.link || o.button || o.download
    ? {
        customData: {
          ...(o.link ? { href: o.link } : {}),
          ...(o.button ? { button: true } : {}),
          ...(o.download ? { download: o.download.url, filename: o.download.name } : {}),
        },
      }
    : {}),
  locked: true,
});

type TextOpts = Common & {
  size?: number;
  font?: FontFamilyValues;
  align?: "left" | "center" | "right";
  steady?: boolean;
};

export const text = (x: number, y: number, value: string, o: TextOpts = {}): Skeleton => ({
  type: "text",
  x: o.steady ? x : x + wobble(4),
  y: o.steady ? y : y + wobble(3),
  text: value,
  fontSize: o.size ?? 22,
  fontFamily: o.font ?? FONT.hand,
  textAlign: o.align ?? "left",
  ...common({ ...o, angle: o.steady ? (o.angle ?? 0) : o.angle }, 1.2),
});

type ShapeOpts = Common & { label?: string; labelSize?: number; rounded?: boolean; steady?: boolean };

const shape =
  (type: "rectangle" | "ellipse" | "diamond") =>
  (x: number, y: number, width: number, height: number, o: ShapeOpts = {}): Skeleton => ({
    type,
    x,
    y,
    width: o.steady ? width : width + wobble(6),
    height: o.steady ? height : height + wobble(4),
    roundness: type === "rectangle" && !o.rounded ? null : { type: 3 },
    ...common(o, 1),
    ...(o.label
      ? {
          label: {
            text: o.label,
            fontSize: o.labelSize ?? 20,
            fontFamily: FONT.hand,
            strokeColor: o.color ?? INK.black,
          },
        }
      : {}),
  });

export const rect = shape("rectangle");
export const ellipse = shape("ellipse");

/** Breaks each segment into a few shaky sub-points, like a hand that can't draw straight. */
const shaky = (points: Point[], amount: number, steps = 3): Point[] => {
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const jitter = s === steps ? amount * 0.4 : amount;
      out.push([ax + (bx - ax) * t + wobble(jitter), ay + (by - ay) * t + wobble(jitter)]);
    }
  }
  return out;
};

type LineOpts = Common & { shake?: number; closed?: boolean; straight?: boolean };

export const line = (x: number, y: number, points: Point[], o: LineOpts = {}): Skeleton => {
  const path = o.closed ? [...points, points[0]] : points;
  const drawn = o.straight ? path : shaky(path, o.shake ?? 3);
  // Excalidraw only fills a line whose end lands back on its start.
  if (o.closed) {
    drawn[drawn.length - 1] = drawn[0];
  }
  return {
    type: "line",
    x,
    y,
    points: pts(drawn),
    roundness: o.straight ? null : { type: 2 },
    ...common({ angle: 0, ...o }, 0),
  };
};

type ArrowOpts = Common & { shake?: number; head?: "arrow" | "triangle" | "bar" | null; start?: string; end?: string };

export const arrow = (x: number, y: number, points: Point[], o: ArrowOpts = {}): Skeleton => ({
  type: "arrow",
  x,
  y,
  points: pts(o.start || o.end ? points : shaky(points, o.shake ?? 4, 2)),
  roundness: { type: 2 },
  startArrowhead: null,
  endArrowhead: o.head === undefined ? "arrow" : o.head,
  ...common({ angle: 0, ...o }, 0),
  ...(o.start ? { start: { id: o.start } } : {}),
  ...(o.end ? { end: { id: o.end } } : {}),
});

export const image = (x: number, y: number, width: number, height: number, fileId: string, o: Common = {}): Skeleton => ({
  type: "image",
  x,
  y,
  width,
  height,
  fileId: fileId as FileId,
  status: "saved",
  scale: [1, 1],
  ...common({ strokeWidth: 1, ...o }, 1.5),
});

/** Tape strip to "stick" photos and notes to the board. */
export const tape = (x: number, y: number, angle?: number): Skeleton =>
  rect(x, y, 90, 26, { fill: WASH.gray, color: INK.gray, strokeWidth: 1, opacity: 80, angle, fillStyle: "cross-hatch" });

/** Crooked note with tape on top. */
export const note = (x: number, y: number, width: number, height: number, o: Common = {}): Skeleton[] => {
  const angle = o.angle ?? wobble(2.5);
  return [rect(x, y, width, height, { ...o, angle }), tape(x + width / 2 - 45 + wobble(30), y - 14, angle + wobble(8))];
};

/** Polaroid-ish frame: a crooked white rect with a photo and a scrawled caption. */
export const polaroid = (
  x: number,
  y: number,
  photo: { width: number; height: number },
  fileIds: string[],
  caption: string,
  o: { sub?: string; link?: string; angle?: number; logo?: string } = {},
): Skeleton[] => {
  const angle = o.angle ?? wobble(4);
  const gap = 14;
  const width = fileIds.length * (photo.width + gap) - gap + 40;
  const height = photo.height + 110 + ((o.sub?.split("\n").length ?? 1) - 1) * 20;
  // Children rotate around their own centers, so place them where the tilted card puts them.
  const cx = x + width / 2;
  const cy = y + height / 2;
  const at = (px: number, py: number, w: number, h: number): [number, number] => {
    const dx = px + w / 2 - cx;
    const dy = py + h / 2 - cy;
    const r = deg(angle);
    return [cx + dx * Math.cos(r) - dy * Math.sin(r) - w / 2, cy + dx * Math.sin(r) + dy * Math.cos(r) - h / 2];
  };
  const written = (px: number, py: number, value: string, size: number) => {
    const lines = value.split("\n");
    return at(px, py, Math.max(...lines.map((l) => l.length)) * size * 0.5, lines.length * size * 1.25);
  };
  return [
    rect(x, y, width, height, { fill: "#ffffff", fillStyle: "solid", color: INK.black, angle }),
    ...fileIds.map((fileId, i) => {
      const [px, py] = at(x + 20 + i * (photo.width + gap), y + 20, photo.width, photo.height);
      return image(px, py, photo.width, photo.height, fileId, { angle, link: o.link });
    }),
    text(...written(x + 24, y + photo.height + 32, caption, 22), caption, { size: 22, angle, link: o.link }),
    ...(o.sub
      ? [text(...written(x + 24, y + photo.height + 66, o.sub, 16), o.sub, { size: 16, color: INK.gray, angle })]
      : []),
    ...(o.logo ? [image(...at(x + width - 56, y + photo.height + 30, 30, 30), 30, 30, o.logo, { angle })] : []),
    tape(...at(x + width / 2 - 45, y - 14, 90, 26), angle + wobble(10)),
  ];
};

/** A section heading that looks like it was written on a whiteboard in a hurry. */
export const heading = (
  x: number,
  y: number,
  value: string,
  o: { underline: number; size?: number; aside?: string; asideAt?: number },
): Skeleton[] => {
  const size = o.size ?? 56;
  return [
    text(x, y, value, { size, color: INK.blue, angle: wobble(2) }),
    line(x + 2, y + size * 1.34, [[0, 0], [o.underline, 0]], { color: INK.blue, strokeWidth: 4, roughness: 1, straight: true }),
    ...(o.aside ? [text(x + (o.asideAt ?? o.underline + 40), y + 28, o.aside, { size: 20, color: INK.gray })] : []),
  ];
};
