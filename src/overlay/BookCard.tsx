import type { BookSlot } from "../scene";

const CARD_WIDTH = 240;
const GAP = 12;
/** Fallback height used before layout; real height is clamped with max-height in CSS. */
const CARD_HEIGHT_GUESS = 280;

export type HoveredBook = {
  slot: BookSlot;
  /** Cover bounds on screen, in px. */
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/** Keeps the review fully on screen; on narrow viewports prefers below/above the cover. */
export const positionBookCard = (hovered: HoveredBook) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(CARD_WIDTH, vw - GAP * 2);
  const height = Math.min(CARD_HEIGHT_GUESS, vh - GAP * 2);
  const spaceRight = vw - hovered.right - GAP;
  const spaceLeft = hovered.left - GAP;
  const narrow = vw < 730 || (spaceRight < width && spaceLeft < width);

  let left: number;
  let top: number;

  if (narrow) {
    left = (hovered.left + hovered.right) / 2 - width / 2;
    const below = hovered.bottom + GAP;
    const above = hovered.top - GAP - height;
    top = below + height <= vh - GAP ? below : above >= GAP ? above : GAP;
  } else {
    left = spaceRight >= width ? hovered.right + GAP : hovered.left - GAP - width;
    top = hovered.top;
  }

  return {
    left: clamp(left, GAP, vw - width - GAP),
    top: clamp(top, GAP, vh - height - GAP),
    width,
  };
};

export function BookCard({ hovered }: { hovered: HoveredBook }) {
  const { book } = hovered.slot;
  const { left, top, width } = positionBookCard(hovered);

  return (
    <div className="book-card" style={{ left, top, width }} role="tooltip">
      <div className="book-card__stars" aria-label={`${book.rating} out of 5`}>
        {stars(book.rating)}
      </div>
      <div className="book-card__title">{book.title}</div>
      <div className="book-card__author">{book.author}</div>
      <p className="book-card__review">{book.review ?? "no review yet, just vibes."}</p>
    </div>
  );
}

export const bookAt = (books: BookSlot[], { x, y }: { x: number; y: number }) =>
  books.find((slot) => x >= slot.x && x <= slot.x + slot.width && y >= slot.y && y <= slot.y + slot.height);
