import { heading, image, INK, note, text } from "../draw";
import type { Skeleton } from "../draw";

export const education = (x: number, y: number): Skeleton[] => [
  ...heading(x - 1, y - 10, "university", { underline: 307, size: 64 }),

  image(x, y + 150, 300, 141, "logo-utn"),
  text(x + 340, y + 160, "Systems Engineering\n@ UTN FRRe", { size: 34 }),
  text(x + 340, y + 258, "2022 -> 2027", { size: 22, color: INK.gray }),

  ...note(x + 158, y + 384, 380, 220, { color: INK.black }),
  text(x + 182, y + 409, "certifications", { size: 26, color: INK.blue }),
  text(x + 182, y + 454, "- C1 Advanced\n- AWS Cloud Foundations\n- Agent Observability\n  & Evaluations", { size: 22 }),
];
