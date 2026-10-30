import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, ExcalidrawImperativeAPI, PointerDownState } from "@excalidraw/excalidraw/types";

const HIT_PADDING = 6;
const MAX_CLICK_DRIFT = 5;
const CLICKABLE_TOOLS = new Set<AppState["activeTool"]["type"]>(["selection", "hand"]);
/** Excalidraw rewrites the canvas cursor on every move, so the pointer comes from a class (see styles.css). */
const HOVER_CLASS = "portfolio--over-link";

type Point = { x: number; y: number };

const hrefOf = (element: ExcalidrawElement): string | undefined => {
  const href = element.customData?.href;
  return typeof href === "string" ? href : undefined;
};

const downloadOf = (element: ExcalidrawElement): { url: string; name: string } | undefined => {
  const url = element.customData?.download;
  const name = element.customData?.filename;
  if (typeof url !== "string" || typeof name !== "string") {
    return undefined;
  }
  return { url, name };
};

export type CanvasClick =
  | { kind: "ignored" }
  | { kind: "empty" }
  | { kind: "opened" }
  | { kind: "download"; id: string; url: string; name: string };

const contains = (element: ExcalidrawElement, { x, y }: Point) =>
  x >= element.x - HIT_PADDING &&
  x <= element.x + element.width + HIT_PADDING &&
  y >= element.y - HIT_PADDING &&
  y <= element.y + element.height + HIT_PADDING;

const linkAt = (api: ExcalidrawImperativeAPI, point: Point) => {
  const elements = api.getSceneElements();
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    if ((hrefOf(element) || downloadOf(element)) && contains(element, point)) {
      return element;
    }
  }
  return undefined;
};

const open = (href: string) => {
  if (href.startsWith("mailto:")) {
    window.location.href = href;
  } else if (href.startsWith("/") && !href.startsWith("//")) {
    window.location.assign(href);
  } else {
    window.open(href, "_blank", "noopener,noreferrer");
  }
};

/** Links without Excalidraw's link icon: pointer cursor on hover, open on click. */
export const createLinks = () => ({
  /** Returns the link element under the pointer, if any. */
  hover(api: ExcalidrawImperativeAPI, point: Point, container: HTMLElement | null) {
    const tool = api.getAppState().activeTool.type;
    const element = CLICKABLE_TOOLS.has(tool) ? linkAt(api, point) : undefined;
    // Posters download on click. They are not links, so they get no outline.
    const linked = element && hrefOf(element) ? element : undefined;
    const clickable = linked !== undefined || (element !== undefined && downloadOf(element) !== undefined);
    container?.classList.toggle(HOVER_CLASS, clickable);
    return linked;
  },

  click(api: ExcalidrawImperativeAPI, tool: AppState["activeTool"], state: PointerDownState): CanvasClick {
    const drift = Math.hypot(state.lastCoords.x - state.origin.x, state.lastCoords.y - state.origin.y);
    if (!CLICKABLE_TOOLS.has(tool.type) || drift > MAX_CLICK_DRIFT) {
      return { kind: "ignored" };
    }
    const element = linkAt(api, state.origin);
    if (!element) {
      return { kind: "empty" };
    }
    const href = hrefOf(element);
    if (href) {
      open(href);
      return { kind: "opened" };
    }
    const download = downloadOf(element);
    if (download) {
      return { kind: "download", id: element.id, url: download.url, name: download.name };
    }
    return { kind: "empty" };
  },
});
