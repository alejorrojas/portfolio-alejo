import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CaptureUpdateAction, Excalidraw, getCommonBounds } from "@excalidraw/excalidraw";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  NormalizedZoomValue,
  PointerDownState,
} from "@excalidraw/excalidraw/types";
import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";

import { waitForFonts } from "./fonts";
import { createLinks } from "./links";
import { PortfolioMenu } from "./menu";
import { BookCard, bookAt } from "./overlay/BookCard";
import type { HoveredBook } from "./overlay/BookCard";
import { followViewport, SceneLayer } from "./overlay/SceneLayer";
import type { LinkHighlight } from "./overlay/SceneLayer";
import { startPresence } from "./presence";
import { createProtection } from "./protection";
import { buildScene, INITIAL_VIEW_IDS, SCENE_FILES, SCENE_FONTS } from "./scene";
import type { BookSlot, WebsiteSlot } from "./scene";
import { loadSceneFiles } from "./scene/files";

const UI_OPTIONS = {
  canvasActions: {
    changeViewBackgroundColor: false,
    clearCanvas: false,
    export: false,
    loadScene: false,
    saveToActiveFile: false,
    saveAsImage: true,
    toggleTheme: true,
  },
  tools: { image: false },
} as const;

/** Screen pixels covered by the toolbar; the first view is centered below it. */
const TOOLBAR_CLEARANCE = 40;
const FIRST_VIEW_FILL = 0.85;

/** Fits `elements` into the part of the screen the toolbar doesn't cover. */
const viewBelowToolbar = (elements: readonly ExcalidrawElement[], { width, height }: AppState) => {
  const [minX, minY, maxX, maxY] = getCommonBounds(elements);
  const free = height - TOOLBAR_CLEARANCE;
  const zoom = Math.min(width / (maxX - minX), free / (maxY - minY)) * FIRST_VIEW_FILL;
  return {
    zoom: { value: zoom as NormalizedZoomValue },
    scrollX: width / 2 / zoom - (minX + maxX) / 2,
    scrollY: (TOOLBAR_CLEARANCE + free / 2) / zoom - (minY + maxY) / 2,
  };
};

type PointerUpdate = { pointer: { x: number; y: number }; button: "down" | "up" };

const sceneText = (elements: readonly ExcalidrawElement[]) =>
  [...new Set(elements.flatMap((element) => (element.type === "text" ? [...element.text] : [])))].join("");

export function App() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const protectionRef = useRef<ReturnType<typeof createProtection> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const booksRef = useRef<BookSlot[]>([]);
  const hoveredSlugRef = useRef<string | null>(null);
  const stopPresenceRef = useRef<(() => void) | null>(null);
  const links = useMemo(createLinks, []);
  const [ready, setReady] = useState(false);
  const [websites, setWebsites] = useState<WebsiteSlot[]>([]);
  const [hoveredBook, setHoveredBook] = useState<HoveredBook | null>(null);
  const hoveredLinkIdRef = useRef<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<LinkHighlight | null>(null);

  const initialData = useMemo<Promise<ExcalidrawInitialDataState>>(async () => {
    const files = await loadSceneFiles(SCENE_FILES);
    return {
      elements: buildScene().elements,
      files,
      appState: {
        viewBackgroundColor: "#ffffff",
        currentItemFontFamily: 1,
        currentItemRoughness: 2,
      },
    };
  }, []);

  const panCanvas = useCallback((dx: number, dy: number) => {
    const api = apiRef.current;
    if (!api || (dx === 0 && dy === 0)) {
      return;
    }
    const { scrollX, scrollY } = api.getAppState();
    api.updateScene({
      appState: { scrollX: scrollX - dx, scrollY: scrollY - dy },
      captureUpdate: CaptureUpdateAction.NEVER,
    });
  }, []);

  const syncLayer = useCallback(() => {
    const api = apiRef.current;
    if (api) {
      const { scrollX, scrollY, zoom } = api.getAppState();
      followViewport(worldRef.current, scrollX, scrollY, zoom.value);
    }
  }, []);

  const hideBook = useCallback(() => {
    if (hoveredSlugRef.current !== null) {
      hoveredSlugRef.current = null;
      setHoveredBook(null);
    }
  }, []);

  const handleApi = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      apiRef.current = api;
      initialData.then(async ({ elements }) => {
        await waitForFonts(SCENE_FONTS, sceneText(elements ?? []));
        // StrictMode mounts Excalidraw twice; only set up the instance that stuck.
        if (apiRef.current !== api) {
          return;
        }
        const scene = buildScene();
        api.updateScene({ elements: scene.elements, captureUpdate: CaptureUpdateAction.NEVER });
        api.history.clear();
        protectionRef.current = createProtection(scene.elements);
        protectionRef.current.enable();
        booksRef.current = scene.books;
        setWebsites(scene.websites);

        const focus = scene.elements.filter((element) => INITIAL_VIEW_IDS.has(element.id));
        api.updateScene({ appState: viewBelowToolbar(focus, api.getAppState()) });
        setReady(true);
        stopPresenceRef.current ??= startPresence(api);
      });
    },
    [initialData],
  );

  useEffect(
    () => () => {
      stopPresenceRef.current?.();
      stopPresenceRef.current = null;
    },
    [],
  );

  useEffect(() => {
    syncLayer();
    window.addEventListener("resize", syncLayer);
    return () => window.removeEventListener("resize", syncLayer);
  }, [ready, syncLayer]);

  const handleChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], appState: AppState) => {
      if (apiRef.current) {
        protectionRef.current?.enforce(apiRef.current, elements, appState);
      }
    },
    [],
  );

  const handleScrollChange = useCallback(
    (scrollX: number, scrollY: number, zoom: { value: number }) => {
      followViewport(worldRef.current, scrollX, scrollY, zoom.value);
      hideBook();
    },
    [hideBook],
  );

  const handlePointerUpdate = useCallback(
    ({ pointer, button }: PointerUpdate) => {
      const api = apiRef.current;
      if (!api) {
        return;
      }
      const link = links.hover(api, pointer, containerRef.current);
      // Books already react with their hover card.
      const highlighted = link && !(link.type === "image" && link.fileId?.startsWith("book-")) ? link : undefined;
      if ((highlighted?.id ?? null) !== hoveredLinkIdRef.current) {
        hoveredLinkIdRef.current = highlighted?.id ?? null;
        setHoveredLink(
          highlighted
            ? {
                kind: highlighted.type === "image" ? "image" : "text",
                x: highlighted.x,
                y: highlighted.y,
                width: highlighted.width,
                height: highlighted.height,
              }
            : null,
        );
      }

      const slot = button === "up" ? bookAt(booksRef.current, pointer) : undefined;
      if (!slot) {
        hideBook();
        return;
      }
      if (hoveredSlugRef.current !== slot.book.slug) {
        const { scrollX, scrollY, zoom } = api.getAppState();
        hoveredSlugRef.current = slot.book.slug;
        setHoveredBook({
          slot,
          left: (slot.x + scrollX) * zoom.value,
          right: (slot.x + slot.width + scrollX) * zoom.value,
          top: (slot.y + scrollY) * zoom.value,
        });
      }
    },
    [hideBook, links],
  );

  const handlePointerUp = useCallback(
    (tool: AppState["activeTool"], state: PointerDownState) => {
      if (apiRef.current) {
        links.click(apiRef.current, tool, state);
      }
    },
    [links],
  );

  const handleReset = useCallback(() => {
    if (apiRef.current) {
      protectionRef.current?.reset(apiRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className={ready ? "portfolio portfolio--ready" : "portfolio"}>
      <Excalidraw
        excalidrawAPI={handleApi}
        initialData={initialData}
        onChange={handleChange}
        onScrollChange={handleScrollChange}
        onPointerUpdate={handlePointerUpdate}
        onPointerUp={handlePointerUp}
        UIOptions={UI_OPTIONS}
        name="My own world"
        handleKeyboardGlobally
        autoFocus
      >
        <PortfolioMenu onReset={handleReset} />
      </Excalidraw>
      <SceneLayer ref={worldRef} websites={websites} link={hoveredLink} onPan={panCanvas} />
      {hoveredBook && <BookCard hovered={hoveredBook} />}
    </div>
  );
}
