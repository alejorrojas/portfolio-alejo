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

import { createEditRecorder, EDIT_MODE } from "./edit-mode";
import { FUN_EDIT_IDS, FUN_EDIT_SELECTION } from "./scene/sections/fun";
import { waitForFonts } from "./fonts";
import { createLinks } from "./links";
import { PortfolioMenu } from "./menu";
import { BookCard, bookAt } from "./overlay/BookCard";
import type { HoveredBook } from "./overlay/BookCard";
import { PosterPop } from "./overlay/PosterPop";
import type { OpenPoster } from "./overlay/PosterPop";
import { PresenceFollow } from "./overlay/PresenceFollow";
import { followViewport, SceneLayer } from "./overlay/SceneLayer";
import type { LinkHighlight } from "./overlay/SceneLayer";
import { PRESENCE, startPresence } from "./presence";
import { createProtection } from "./protection";
import { buildNotFound, buildScene, INITIAL_VIEW_IDS, SCENE_FILES, SCENE_FONTS } from "./scene";
import { HOME_BUTTON_FILL, HOME_BUTTON_HOVER, HOME_BUTTON_ID } from "./scene/not-found";
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
  const recordEditsRef = useRef<ReturnType<typeof createEditRecorder> | null>(null);
  const links = useMemo(createLinks, []);
  const [ready, setReady] = useState(false);
  const [websites, setWebsites] = useState<WebsiteSlot[]>([]);
  const [hoveredBook, setHoveredBook] = useState<HoveredBook | null>(null);
  const hoveredLinkIdRef = useRef<string | null>(null);
  const homeButtonHoverRef = useRef(false);
  const [hoveredLink, setHoveredLink] = useState<LinkHighlight | null>(null);
  const [following, setFollowing] = useState(false);
  const posterIdRef = useRef<string | null>(null);
  const [poster, setPoster] = useState<OpenPoster | null>(null);

  // Any path other than the board itself is the missing page. Static files never reach the app.
  const missing = window.location.pathname !== "/";
  // Paint the drawing immediately. Image files are not on the first view, so they load after.
  const scene = useMemo(() => (missing ? buildNotFound() : buildScene()), [missing]);
  const filesPromise = useMemo(() => loadSceneFiles(SCENE_FILES), []);
  const initialData = useMemo<ExcalidrawInitialDataState>(
    () => ({
      elements: scene.elements,
      appState: {
        viewBackgroundColor: "#ffffff",
        currentItemFontFamily: 1,
        currentItemRoughness: 2,
      },
    }),
    [scene],
  );

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

  const closePoster = useCallback(() => {
    if (posterIdRef.current !== null) {
      posterIdRef.current = null;
      setPoster(null);
    }
  }, []);

  const posterScreen = useCallback((id: string): OpenPoster | null => {
    const api = apiRef.current;
    if (!api) {
      return null;
    }
    const element = api.getSceneElements().find((entry) => entry.id === id);
    const url = element?.customData?.download;
    const name = element?.customData?.filename;
    if (!element || typeof url !== "string" || typeof name !== "string") {
      return null;
    }
    const { scrollX, scrollY, zoom } = api.getAppState();
    const scale = zoom.value;
    return {
      id,
      url,
      name,
      left: (element.x + scrollX) * scale,
      right: (element.x + element.width + scrollX) * scale,
      top: (element.y + scrollY) * scale,
      bottom: (element.y + element.height + scrollY) * scale,
    };
  }, []);

  const syncPoster = useCallback(() => {
    const id = posterIdRef.current;
    if (!id) {
      return;
    }
    const next = posterScreen(id);
    if (!next) {
      closePoster();
      return;
    }
    setPoster(next);
  }, [closePoster, posterScreen]);

  const handleApi = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      apiRef.current = api;
      void (async () => {
        await waitForFonts(SCENE_FONTS, sceneText(scene.elements));
        // StrictMode mounts Excalidraw twice; only set up the instance that stuck.
        if (apiRef.current !== api) {
          return;
        }
        const fitted = missing ? buildNotFound() : buildScene();
        if (!missing && EDIT_MODE) {
          api.updateScene({
            elements: fitted.elements.map((element) => ({ ...element, locked: false })),
            captureUpdate: CaptureUpdateAction.NEVER,
          });
          recordEditsRef.current = createEditRecorder(fitted.elements);
        } else {
          api.updateScene({ elements: fitted.elements, captureUpdate: CaptureUpdateAction.NEVER });
          protectionRef.current = createProtection(fitted.elements);
          protectionRef.current.enable();
        }
        api.history.clear();
        booksRef.current = fitted.books;
        setWebsites(fitted.websites);

        const focus = missing
          ? fitted.elements
          : fitted.elements.filter((element) =>
              EDIT_MODE ? FUN_EDIT_IDS.includes(element.id) : INITIAL_VIEW_IDS.has(element.id),
            );
        const mobile = isMobileViewport();
        const framed = viewBelowToolbar(focus, api.getAppState(), mobile);
        const selectedElementIds: Record<string, true> = {};
        if (EDIT_MODE) {
          for (const id of FUN_EDIT_SELECTION) {
            selectedElementIds[id] = true;
          }
        }
        api.updateScene({ appState: { ...framed, selectedElementIds } });
        if (EDIT_MODE) {
          api.setActiveTool({ type: "selection" });
        }
        // Mobile: default to the hand tool so the canvas can be panned immediately.
        if (mobile && !EDIT_MODE) {
          api.setActiveTool({ type: "hand" });
        }
        setReady(true);
        if (!missing && !EDIT_MODE) {
          stopPresenceRef.current ??= startPresence(api);
        }

        if (missing) {
          return;
        }
        const files = await filesPromise;
        if (apiRef.current === api) {
          api.addFiles(Object.values(files));
        }
      })();
    },
    [filesPromise, missing, scene],
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
      recordEditsRef.current?.(elements);
      const nextFollowing = appState.userToFollow?.socketId === PRESENCE.socketId;
      setFollowing((prev) => (prev === nextFollowing ? prev : nextFollowing));
    },
    [],
  );

  const handleScrollChange = useCallback(
    (scrollX: number, scrollY: number, zoom: { value: number }) => {
      followViewport(worldRef.current, scrollX, scrollY, zoom.value);
      // Keep the review open while pinching/panning; just follow the cover.
      syncHoveredBook();
      syncPoster();
    },
    [syncHoveredBook, syncPoster],
  );

  const handlePointerUpdate = useCallback(
    ({ pointer, button }: PointerUpdate) => {
      const api = apiRef.current;
      if (!api) {
        return;
      }
      const link = links.hover(api, pointer, containerRef.current);
      const overButton = link?.customData?.button === true;
      if (overButton !== homeButtonHoverRef.current) {
        homeButtonHoverRef.current = overButton;
        const backgroundColor = overButton ? HOME_BUTTON_HOVER : HOME_BUTTON_FILL;
        const elements = api.getSceneElements();
        if (elements.some((element) => element.id === HOME_BUTTON_ID)) {
          api.updateScene({
            elements: elements.map((element) =>
              element.id === HOME_BUTTON_ID
                ? {
                    ...element,
                    backgroundColor,
                    version: element.version + 1,
                    versionNonce: Math.floor(Math.random() * 2 ** 31),
                  }
                : element,
            ),
            captureUpdate: CaptureUpdateAction.NEVER,
          });
        }
      }
      // Books already react with their hover card. The home button darkens itself instead of an underline.
      const highlighted =
        link && !overButton && !(link.type === "image" && link.fileId?.startsWith("book-")) ? link : undefined;
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
      if (!apiRef.current || EDIT_MODE) {
        return;
      }
      const result = links.click(apiRef.current, tool, state);
      switch (result.kind) {
        case "ignored":
          return;
        case "download": {
          if (posterIdRef.current === result.id) {
            closePoster();
            return;
          }
          posterIdRef.current = result.id;
          setPoster(posterScreen(result.id));
          return;
        }
        case "empty":
        case "opened":
          closePoster();
          return;
        default: {
          const neverClick: never = result;
          return neverClick;
        }
      }
    },
    [closePoster, links, posterScreen],
  );

  const handleReset = useCallback(() => {
    if (apiRef.current) {
      protectionRef.current?.reset(apiRef.current);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={["portfolio", ready ? "portfolio--ready" : "", missing ? "portfolio--lost" : ""]
        .filter(Boolean)
        .join(" ")}
    >
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
      {poster && <PosterPop poster={poster} onClose={closePoster} />}
      {ready && !missing && <PresenceFollow api={apiRef.current} following={following} />}
    </div>
  );
}
