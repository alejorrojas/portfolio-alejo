import { OPEN_SOURCE } from "../content";
import type { Contribution } from "../content";
import { heading, image, INK, rect, text } from "../draw";
import type { Skeleton } from "../draw";

const CARD = { width: 580, gap: 50, perRow: 2, line: 34 };
const PREVIEW = { width: CARD.width - 48, height: (CARD.width - 48) / 2 };
const BODY = 20 + PREVIEW.height + 24;

const prNumber = (url: string) => `#${url.split("/").pop()}`;

const cardHeight = (item: Contribution) => BODY + 130 + item.prs.length * CARD.line + (item.more ? CARD.line : 0);

const card = (item: Contribution, x: number, y: number, height: number): Skeleton[] => {
  const top = y + BODY;
  return [
    rect(x, y, CARD.width, height, { angle: 0, color: INK.black, fill: "#ffffff", fillStyle: "solid" }),
    image(x + 24, y + 20, PREVIEW.width, PREVIEW.height, item.preview, { angle: 0, link: `https://github.com/${item.repo}` }),
    text(x + 24, top, item.repo, { size: 24, angle: 0, link: `https://github.com/${item.repo}` }),
    text(x + CARD.width - 100, top + 2, `★ ${item.stars}`, { size: 18, color: INK.gray, angle: 0 }),
    text(x + 24, top + 38, item.about, { size: 18, color: INK.gray, angle: 0 }),
    ...item.prs.map((pr, i) =>
      text(x + 24, top + 82 + i * CARD.line, `${prNumber(pr.url)} ${pr.title}`, { size: 20, angle: 0, link: pr.url }),
    ),
    ...(item.more
      ? [text(x + 24, top + 82 + item.prs.length * CARD.line, item.more.label, { size: 18, color: INK.blue, angle: 0, link: item.more.url })]
      : []),
  ];
};

export const openSource = (x: number, y: number): Skeleton[] => {
  const rows: Contribution[][] = [];
  for (let i = 0; i < OPEN_SOURCE.length; i += CARD.perRow) rows.push(OPEN_SOURCE.slice(i, i + CARD.perRow));

  let rowTop = y + 190;
  const cards = rows.flatMap((row) => {
    const height = Math.max(...row.map(cardHeight));
    const elements = row.flatMap((item, col) => card(item, x + col * (CARD.width + CARD.gap), rowTop, height));
    rowTop += height + CARD.gap;
    return elements;
  });

  return [
    ...heading(x, y, "Open source", { underline: 240 }),
    ...cards,
    text(x + CARD.perRow * (CARD.width + CARD.gap) - 470, rowTop + 10, "→ everything else lives on github", {
      size: 24,
      color: INK.blue,
      link: "https://github.com/alejorrojas",
    }),
  ];
};
