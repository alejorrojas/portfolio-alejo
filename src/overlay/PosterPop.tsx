import { useEffect } from "react";

const POP_WIDTH = 132;
const POP_HEIGHT = 44;
const GAP = 10;

export type OpenPoster = {
  id: string;
  url: string;
  name: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/** A small sticker under the poster, with one action. */
export function PosterPop({ poster, onClose }: { poster: OpenPoster; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = poster.bottom + GAP;
  if (top + POP_HEIGHT > vh - GAP) {
    top = poster.top - GAP - POP_HEIGHT;
  }
  const left = clamp((poster.left + poster.right) / 2 - POP_WIDTH / 2, GAP, Math.max(GAP, vw - POP_WIDTH - GAP));
  top = clamp(top, GAP, Math.max(GAP, vh - POP_HEIGHT - GAP));

  return (
    <div className="poster-pop" style={{ left, top, width: POP_WIDTH }} role="dialog" aria-label="download poster">
      <a href={poster.url} download={poster.name} onClick={onClose}>
        download
      </a>
    </div>
  );
}
