import { SOCIALS } from "../content";
import { arrow, INK, line, note, text } from "../draw";
import type { Skeleton } from "../draw";

// Rough outline of Argentina as [longitude, latitude].
const ARGENTINA: [number, number][] = [
  [-68.6, -22], [-65, -22.1], [-62.8, -22.2], [-61, -23.8], [-58, -25], [-54.6, -25.6], [-53.7, -26.9],
  [-55.7, -28], [-57.6, -30.2], [-58.4, -33.1], [-58.4, -34.6], [-57.2, -35.6], [-57.6, -38],
  [-62.3, -38.8], [-62.1, -40.6], [-65.1, -41], [-63.8, -42.1], [-65.3, -45], [-67.6, -46.4],
  [-65.8, -47.8], [-69, -50.7], [-68.4, -52.3], [-71.9, -52], [-73.4, -50.6], [-72.3, -48],
  [-71.7, -44], [-71.9, -40], [-71.1, -36.6], [-70.1, -33], [-69.8, -30], [-68.4, -27], [-68.6, -24.5],
];

const map = (x: number, y: number, scale: number): Skeleton => {
  const project = ([lon, lat]: [number, number]): [number, number] => [(lon + 74) * scale, (-lat - 21) * scale];
  return line(x, y, ARGENTINA.map(project), { id: "intro-map", closed: true, color: INK.blue, shake: 2 });
};

/** The first view fits these, so they should span the whole intro, corner notes included. */
export const INTRO_IDS = ["intro-explore", "intro-hint", "intro-title", "intro-map", "intro-contact"];

export const intro = (): Skeleton[] => {
  const x = 330;
  return [
    text(-478, -426, "feel free to explore", { id: "intro-explore", size: 18, color: INK.gray, angle: -0.7 }),
    text(-50, 93, "mate >", { id: "intro-mate", size: 18, color: INK.gray }),
    map(150, 338, 10),

    text(x, -144, "Hi, I'm alejo", { id: "intro-title", size: 84, color: INK.blue, angle: -1.5 }),
    text(x, 18, "I'm a software engineer and a\nSystems Engineering student at UTN.\nFrom Chaco, Argentina.", { size: 32 }),
    text(x + 20, 177, "90s startup nostalgist", { size: 24, color: INK.gray }),

    ...note(1065, -448, 572, 100, { id: "intro-hint", color: INK.black, angle: -1.4 }),
    text(1095, -426, "psst... the toolbar up there is all yours.\ndraw, write, scribble anywhere.", { size: 21, angle: 0.6 }),
    arrow(1038, -404, [[0, 0], [-14, 2], [-19, -15], [-44, -32], [-74, -48]], {
      id: "intro-hint-arrow",
      color: INK.blue,
      shake: 0,
    }),

    ...note(640, 318, 340, 110 + SOCIALS.length * 42, { id: "intro-contact", color: INK.black }),
    text(665, 343, "reach me out!", { size: 30, color: INK.blue }),
    ...SOCIALS.map((social, i) =>
      text(670, 403 + i * 42, `-> ${social.handle}`, { size: 22, link: social.href }),
    ),
  ];
};
