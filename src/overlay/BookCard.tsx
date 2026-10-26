import type { BookSlot } from "../scene";

const CARD_WIDTH = 240;
const GAP = 12;

export type HoveredBook = {
  slot: BookSlot;
  /** Cover bounds on screen, in px. */
  left: number;
  right: number;
  top: number;
};

const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

export function BookCard({ hovered }: { hovered: HoveredBook }) {
  const { book } = hovered.slot;
  const fitsRight = hovered.right + GAP + CARD_WIDTH < window.innerWidth;
  const left = fitsRight ? hovered.right + GAP : hovered.left - GAP - CARD_WIDTH;
  const top = Math.max(GAP, Math.min(hovered.top, window.innerHeight - 240));

  return (
    <div className="book-card" style={{ left, top, width: CARD_WIDTH }} role="tooltip">
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
