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

const contains = (element: ExcalidrawElement, { x, y }: Point) =>
  x >= element.x - HIT_PADDING &&
  x <= element.x + element.width + HIT_PADDING &&
  y >= element.y - HIT_PADDING &&
  y <= element.y + element.height + HIT_PADDING;

const linkAt = (api: ExcalidrawImperativeAPI, point: Point) => {
  const elements = api.getSceneElements();
  for (let i = elements.length - 1; i >= 0; i--) {
    if (hrefOf(elements[i]) && contains(elements[i], point)) {
      return elements[i];
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
    const link = CLICKABLE_TOOLS.has(tool) ? linkAt(api, point) : undefined;
    container?.classList.toggle(HOVER_CLASS, link !== undefined);
    return link;
  },

  click(api: ExcalidrawImperativeAPI, tool: AppState["activeTool"], state: PointerDownState) {
    const drift = Math.hypot(state.lastCoords.x - state.origin.x, state.lastCoords.y - state.origin.y);
    if (!CLICKABLE_TOOLS.has(tool.type) || drift > MAX_CLICK_DRIFT) {
      return;
    }
    const href = linkAt(api, state.origin)?.customData?.href;
    if (typeof href === "string") {
      open(href);
    }
  },
});
