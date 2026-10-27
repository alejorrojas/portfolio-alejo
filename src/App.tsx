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

/** Screen pixels covered by the toolbar; the first view is centered in the free area. */
const TOOLBAR_CLEARANCE = 40;
const FIRST_VIEW_FILL = 0.85;

/** Matches Excalidraw's `isMobileBreakpoint` (portrait width, or short landscape). */
const isMobileViewport = () => {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  return width < 730 || (height < 500 && width < 1000);
};

/** Fits `elements` into the part of the screen the toolbar doesn't cover. */
const viewBelowToolbar = (
  elements: readonly ExcalidrawElement[],
  { width, height }: AppState,
  mobile: boolean,
) => {
  const [minX, minY, maxX, maxY] = getCommonBounds(elements);
  const free = height - TOOLBAR_CLEARANCE;
  const zoom = Math.min(width / (maxX - minX), free / (maxY - minY)) * FIRST_VIEW_FILL;
  // Desktop toolbar sits on top; mobile tools sit at the bottom (Excalidraw layout).
  const centerY = mobile ? free / 2 : TOOLBAR_CLEARANCE + free / 2;
  return {
    zoom: { value: zoom as NormalizedZoomValue },
    scrollX: width / 2 / zoom - (minX + maxX) / 2,
    scrollY: centerY / zoom - (minY + maxY) / 2,
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

  /** Screen-space cover bounds for the open book card (follow zoom/pan). */
  const bookScreenBounds = useCallback((slot: BookSlot) => {
    const api = apiRef.current;
    if (!api) {
      return null;
    }
    const { scrollX, scrollY, zoom } = api.getAppState();
    return {
      slot,
      left: (slot.x + scrollX) * zoom.value,
      right: (slot.x + slot.width + scrollX) * zoom.value,
      top: (slot.y + scrollY) * zoom.value,
      bottom: (slot.y + slot.height + scrollY) * zoom.value,
    };
  }, []);

  const syncHoveredBook = useCallback(() => {
    const slug = hoveredSlugRef.current;
    if (!slug) {
      return;
    }
    const slot = booksRef.current.find((entry) => entry.book.slug === slug);
    if (!slot) {
      hideBook();
      return;
    }
    const next = bookScreenBounds(slot);
    if (next) {
      setHoveredBook(next);
    }
  }, [bookScreenBounds, hideBook]);

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
        const mobile = isMobileViewport();
        api.updateScene({ appState: viewBelowToolbar(focus, api.getAppState(), mobile) });
        // Mobile: default to the hand tool so the canvas can be panned immediately.
        if (mobile) {
          api.setActiveTool({ type: "hand" });
        }
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
      // Keep the review open while pinching/panning; just follow the cover.
      syncHoveredBook();
    },
    [syncHoveredBook],
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

      // During press/pinch, keep the open review so a zoom gesture doesn't dismiss it.
      if (button === "down") {
        return;
      }

      const slot = bookAt(booksRef.current, pointer);
      if (!slot) {
        hideBook();
        return;
      }
      if (hoveredSlugRef.current !== slot.book.slug) {
        const next = bookScreenBounds(slot);
        if (next) {
          hoveredSlugRef.current = slot.book.slug;
          setHoveredBook(next);
        }
      }
    },
    [bookScreenBounds, hideBook, links],
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
