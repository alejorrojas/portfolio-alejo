import { arrow, heading, image, INK, rect, text } from "../draw";
import type { Skeleton } from "../draw";
import { browserWindow } from "./window";

const ACCENT = "#df734f";
const ACCENT_WASH = "#ffd8a8";
const PAPER_URL = "https://nlasmith.com/paper";
const NLA_URL = "https://transformer-circuits.pub/2026/nla";

const PIPELINE = ["Dataset", "Token\npolicy", "NLA\n(Neuronpedia)", "LLM judge", "Metrics"];

export const research = (x: number, y: number) => {
  const boxWidth = 150;
  const gap = 46;
  const boxY = y + 806;
  const boxes = PIPELINE.map((label, i) => ({ id: `nla-step-${i}`, label, x: x + 3 + i * (boxWidth + gap) }));
  const window = browserWindow("site-nlasmith", x + 1060, y + 120, 760, 470, "https://nlasmith.com", {
    preview: "/images/sites/nlasmith.webp",
  });

  const elements: Skeleton[] = [
    ...heading(x, y, "research", { underline: 240 }),

    image(x - 4, y + 159, 90, 90, "logo-nlasmith"),
    text(x + 120, y + 150, "NLASmith", { size: 48, color: INK.black, link: PAPER_URL }),
    text(x + 120, y + 216, "a framework for experimenting with\nNatural Language Autoencoders.", { size: 16 }),
    text(
      x,
      y + 320,
      "I find the interpretability area of study one of the most\nimportant fields of research in the modern era. In Anthropic's words,\n\"It's hard to reason about the safety of neural networks\nwithout understanding what happens inside them,\" so contributing\nto this area of knowledge feels like a noble pursuit to me.",
      { size: 18, color: INK.gray },
    ),
    text(x, y + 461, "This work is a small contribution on an interpretability mechanism", {
      size: 18,
      color: INK.gray,
      steady: true,
    }),
    text(x, y + 484, "proposed by ", { size: 18, color: INK.gray, steady: true }),
    text(x + 111, y + 484, "Anthropic", { size: 18, color: ACCENT, link: NLA_URL, steady: true }),
    text(x + 190, y + 484, " called NLAs.", { size: 18, color: INK.gray, steady: true }),
    text(
      x,
      y + 521,
      "Natural Language Autoencoders (NLAs) convert an activation\ninto natural language text we can read directly.\nOur proposal takes that mechanism and proposes a platform\nto directly run experiments with NLAs. You choose the tokens\nto read from activations. Neuronpedia writes them out.\nAn LLM judge scores them with your rubric and you get\nyour results based on metrics.\n\npaper @ a university congress, w/ Juan Ignacio Rodriguez Leiva (UTN FRRe)",
      { size: 18, color: INK.gray },
    ),

    ...boxes.map((box, i) =>
      rect(box.x, boxY, boxWidth, 86, {
        id: box.id,
        label: box.label,
        labelSize: 20,
        fill: i === 2 ? ACCENT_WASH : "transparent",
        color: i === 2 ? ACCENT : INK.black,
        angle: 0,
        steady: true,
      }),
    ),
    ...boxes.slice(0, -1).map((box, i) =>
      arrow(box.x + boxWidth + 4, boxY + 50, [[0, 0], [gap - 8, 0]], { start: box.id, end: boxes[i + 1].id }),
    ),
    text(x, boxY + 140, "one off NLA explorations → reproducible, comparable experiments", { size: 20, color: INK.gray }),
    text(x + 703, boxY + 200, "read the paper →", { size: 26, color: ACCENT, link: PAPER_URL }),
    ...window.elements,
  ];
  return { elements, websites: [window.slot] };
};
