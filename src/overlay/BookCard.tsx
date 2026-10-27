import { useLayoutEffect, useRef, useState } from "react";

import type { BookSlot } from "../scene";

const CARD_WIDTH = 240;
const GAP = 12;
/** Used for the first paint, before the card has been measured. */
const CARD_HEIGHT_GUESS = 140;

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
export const positionBookCard = (hovered: HoveredBook, cardHeight: number) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(CARD_WIDTH, vw - GAP * 2);
  const height = Math.min(cardHeight, vh - GAP * 2);
  const spaceRight = vw - hovered.right - GAP;
  const spaceLeft = hovered.left - GAP;
  const narrow = vw < 730 || (spaceRight < width && spaceLeft < width);

  let left: number;
  let top: number;

  if (narrow) {
    left = (hovered.left + hovered.right) / 2 - width / 2;
    const below = hovered.bottom + GAP;
    const above = hovered.top - GAP - height;
    const fitsBelow = below + height <= vh - GAP;
    const fitsAbove = above >= GAP;
    if (fitsBelow) {
      top = below;
    } else if (fitsAbove) {
      top = above;
    } else {
      const roomBelow = vh - hovered.bottom;
      const roomAbove = hovered.top;
      top = roomBelow >= roomAbove ? below : above;
    }
  } else {
    left = spaceRight >= width ? hovered.right + GAP : hovered.left - GAP - width;
    top = hovered.top;
  }

  return {
    left: clamp(left, GAP, Math.max(GAP, vw - width - GAP)),
    top: clamp(top, GAP, Math.max(GAP, vh - height - GAP)),
    width,
  };
};

export function BookCard({ hovered }: { hovered: HoveredBook }) {
  const { book } = hovered.slot;
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<{ slug: string; height: number } | null>(null);
  const height = measured?.slug === book.slug ? measured.height : CARD_HEIGHT_GUESS;

  useLayoutEffect(() => {
    const card = ref.current;
    if (!card) {
      return;
    }
    const next = card.offsetHeight;
    setMeasured((prev) => (prev?.slug === book.slug && prev.height === next ? prev : { slug: book.slug, height: next }));
  }, [book.slug, hovered.bottom, hovered.left, hovered.top]);

  const { left, top, width } = positionBookCard(hovered, height);

  return (
    <div ref={ref} className="book-card" style={{ left, top, width }} role="tooltip">
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
