import { TALKS } from "../content";
import type { Talk } from "../content";
import { heading, image, INK, tape, text } from "../draw";
import type { Skeleton } from "../draw";

/** Portrait flyer, the lead piece of each meetup. */
const POSTER = { width: 180, height: 255 };
const PHOTO = { width: 290, height: 193 };
const SINGLE = { width: 260, height: 260 };
const POSTER_GAP = 22;
/** Where the photos start, right of the two posters. */
const PHOTOS_DX = POSTER.width * 2 + POSTER_GAP + 44;
/** The collages sit left of the heading. The heading stays put. */
const CONTENT_DX = -320;

/** Loose collages on the board, two per row. No frames. */
const SPOTS = [
  { dx: 0, dy: 0 },
  { dx: 1120, dy: 30 },
  { dx: 0, dy: 520 },
  { dx: 1120, dy: 550 },
];

const file = (name: string) => ({ url: `/images/posters/${name}.png`, name: `${name}.png` });

const taped = (x: number, y: number, width: number, height: number, fileId: string, angle: number, link?: string) => [
  image(x, y, width, height, fileId, { angle, link }),
  tape(x + width / 2 - 45, y - 14, angle * 2),
];

/** Side by side and nearly straight, like slides in a deck. */
const posters = (x: number, y: number, [front, back]: readonly [string, string]): Skeleton[] => {
  const second = x + POSTER.width + POSTER_GAP;
  return [
    image(x, y, POSTER.width, POSTER.height, `poster-${front}`, { angle: -1, download: file(front) }),
    tape(x + POSTER.width / 2 - 45, y - 14, -3),
    image(second, y + 6, POSTER.width, POSTER.height, `poster-${back}`, { angle: 1, download: file(back) }),
    tape(second + POSTER.width / 2 - 45, y - 8, 3),
  ];
};

const notes = (x: number, y: number, talk: Talk): Skeleton[] => [
  text(x, y, talk.caption, { size: 26, link: talk.link }),
  ...(talk.logo ? [image(x + talk.caption.length * 15 + 30, y + 2, 28, 28, `logo-${talk.logo}`, { angle: 0 })] : []),
  ...(talk.sub ? [text(x + 2, y + 40, talk.sub, { size: 16, color: INK.gray })] : []),
];

const meetup = (x: number, y: number, talk: Talk): Skeleton[] => {
  if (!talk.posters) {
    return [
      image(x + POSTER.width + POSTER_GAP / 2 - 100, y + 96, 200, 71, "logo-campus-party", { angle: -5 }),
      ...taped(x + PHOTOS_DX, y, SINGLE.width, SINGLE.height, `photo-${talk.photos[0]}`, -3, talk.link),
      ...notes(x + PHOTOS_DX, y + SINGLE.height + 26, talk),
    ];
  }
  const [first, second] = talk.photos;
  return [
    ...posters(x, y, talk.posters),
    ...taped(x + PHOTOS_DX, y + 8, PHOTO.width, PHOTO.height, `photo-${first}`, 2, talk.link),
    ...(second ? taped(x + PHOTOS_DX + PHOTO.width - 20, y + 36, PHOTO.width, PHOTO.height, `photo-${second}`, -3, talk.link) : []),
    ...notes(x + PHOTOS_DX, y + PHOTO.height + 66, talk),
  ];
};

export const talks = (x: number, y: number): Skeleton[] => [
  ...heading(x, y, "talks and cool meetups", { underline: 640 }),
  ...TALKS.flatMap((talk, i) => meetup(x + CONTENT_DX + SPOTS[i].dx, y + 190 + SPOTS[i].dy, talk)),
];
