import { arrow, heading, image, INK, rect, text } from "../draw";
import type { Skeleton } from "../draw";
import { browserWindow } from "./window";

const ACCENT = "#df734f";
const ACCENT_WASH = "#ffd8a8";
const PAPER_URL = "https://nlasmith.com/paper";

const PIPELINE = ["Dataset", "Token\npolicy", "NLA\n(Neuronpedia)", "LLM judge", "Metrics"];

export const research = (x: number, y: number) => {
  const boxWidth = 150;
  const gap = 46;
  const boxY = y + 420;
  const boxes = PIPELINE.map((label, i) => ({ id: `nla-step-${i}`, label, x: x + i * (boxWidth + gap) }));
  const window = browserWindow("site-nlasmith", x + 1060, y + 120, 760, 470, "https://nlasmith.com");

  const elements: Skeleton[] = [
    ...heading(x, y, "research", { underline: 240 }),

    image(x, y + 150, 90, 90, "logo-nlasmith"),
    text(x + 120, y + 150, "NLASmith", { size: 48, color: INK.black, link: PAPER_URL }),
    text(x + 120, y + 216, "a framework for experimenting with\nNatural Language Autoencoders.", { size: 24 }),
    text(x, y + 332, "paper @ a university congress, w/ Juan Ignacio Rodriguez Leiva (UTN FRRe)", {
      size: 18,
      color: INK.gray,
    }),

    ...boxes.map((box, i) =>
      rect(box.x, boxY + (i % 2) * 18, boxWidth, 86, {
        id: box.id,
        label: box.label,
        labelSize: 20,
        fill: i === 2 ? ACCENT_WASH : "transparent",
        color: i === 2 ? ACCENT : INK.black,
      }),
    ),
    ...boxes.slice(0, -1).map((box, i) =>
      arrow(box.x + boxWidth + 4, boxY + 50, [[0, 0], [gap - 8, 0]], { start: box.id, end: boxes[i + 1].id }),
    ),
    text(x, boxY + 140, "one off NLA explorations → reproducible, comparable experiments", { size: 20, color: INK.gray }),
    text(x + 700, boxY + 200, "read the paper →", { size: 26, color: ACCENT, link: PAPER_URL }),
    ...window.elements,
  ];
  return { elements, websites: [window.slot] };
};
