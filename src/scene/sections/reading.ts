import { BOOKS_2026, SOCIALS } from "../content";
import type { Book } from "../content";
import { heading, image, INK, line, rect, tape, text } from "../draw";
import type { Skeleton } from "../draw";

const GOODREADS = SOCIALS.find((social) => social.id === "goodreads")!.href;
const CHALLENGE_YEAR = 2026;
const COVER = { width: 112, height: 168, gap: 42, rowGap: 110, perRow: 7 };
/** Book images carry transparent padding for their shadow: 14px around a 200px-wide cover (scripts/books.sh). */
const BOOK_PAD = (14 / 200) * COVER.width;
const CHALLENGE = { width: 867, height: 223 };

/** Where each cover sits, in scene coordinates, for the hover card. */
export type BookSlot = { book: Book; x: number; y: number; width: number; height: number };

const PLANK = { depth: 40, inset: 34, front: 22 };

/**
 * A wooden shelf seen slightly from above: the top the books stand on,
 * and a hatched front edge. `top` is where the books' bottoms rest.
 */
const plank = (x: number, top: number, width: number): Skeleton[] => {
  const front = top + PLANK.depth / 2;
  const back = top - PLANK.depth / 2;
  return [
    line(x, front, [[0, 0], [width, 0], [width - PLANK.inset, back - front], [PLANK.inset, back - front]], {
      closed: true,
      fill: "#ffffff",
      fillStyle: "solid",
      shake: 1,
    }),
    rect(x, front, width, PLANK.front, { angle: 0, fill: INK.gray, fillStyle: "hachure", strokeWidth: 2 }),
  ];
};

/** Days from today through December 31, so the last day of the year still counts. */
const daysLeftInYear = (year: number) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = new Date(year, 11, 31).getTime();
  return Math.max(0, Math.round((end - today) / 86_400_000) + 1);
};

const shelf = (x: number, y: number) => {
  const rows = Math.ceil(BOOKS_2026.length / COVER.perRow);
  const rowWidth = COVER.perRow * COVER.width + (COVER.perRow - 1) * COVER.gap;
  const slots: BookSlot[] = BOOKS_2026.map((book, i) => ({
    book,
    x: x + (i % COVER.perRow) * (COVER.width + COVER.gap),
    y: y + Math.floor(i / COVER.perRow) * (COVER.height + COVER.rowGap),
    width: COVER.width,
    height: COVER.height,
  }));
  const elements: Skeleton[] = [
    ...Array.from({ length: rows }, (_, row) =>
      plank(x - 50, y + row * (COVER.height + COVER.rowGap) + COVER.height, rowWidth + 100),
    ).flat(),
    ...slots.map((slot) =>
      image(
        slot.x - BOOK_PAD,
        slot.y - BOOK_PAD,
        slot.width + BOOK_PAD * 2,
        slot.height + BOOK_PAD * 2,
        `book-${slot.book.slug}`,
        { angle: 0, strokeWidth: 0, link: slot.book.url },
      ),
    ),
  ];
  return { elements, slots };
};

/**
 * White patch over the screenshot's "66", with the live count in the same spot.
 * Offsets are scene pixels from `reading()`, taken from the placed elements.
 */
const daysLeft = (x: number, y: number): Skeleton[] => {
  const count = String(daysLeftInYear(CHALLENGE_YEAR));
  return [
    {
      type: "rectangle",
      id: "days-left-box",
      x: x + 224.06,
      y: y + 289.99,
      width: 23,
      height: 17.3,
      angle: 0,
      strokeColor: "#ffffff",
      backgroundColor: "#ffffff",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
    },
    {
      type: "text",
      id: "days-left-count",
      x: x + 226.13,
      y: y + 289.53,
      text: count,
      originalText: count,
      fontSize: 14.44,
      fontFamily: 6,
      textAlign: "left",
      verticalAlign: "top",
      autoResize: true,
      strokeColor: "#212121",
      backgroundColor: "#ffffff",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      angle: 0,
    },
  ];
};

export const reading = (x: number, y: number) => {
  const books = shelf(x + 60, y + 470);
  const elements: Skeleton[] = [
    ...heading(x, y, "my year in books", { underline: 448 }),
    rect(x + 24, y + 134, CHALLENGE.width + 32, CHALLENGE.height + 32, {
      id: "reading-challenge-frame",
      color: INK.black,
      fill: "#ffffff",
      fillStyle: "solid",
      angle: 0,
    }),
    image(x + 40, y + 150, CHALLENGE.width, CHALLENGE.height, "reading-challenge", { strokeWidth: 1, angle: 0 }),
    // Covers the baked-in "66 days left". The label sits above the live count.
    ...daysLeft(x, y),
    tape(x + 20, y + 136, -20),
    tape(x + CHALLENGE.width - 20, y + 140, 18),
    text(x + 1150, y + 400, "hover a book", { size: 24, color: INK.blue }),
    ...books.elements,
    text(x + 340, y + 1060, "→ the full shelf lives on goodreads", { size: 24, color: INK.blue, link: GOODREADS }),
  ];
  return { elements, books: books.slots };
};
