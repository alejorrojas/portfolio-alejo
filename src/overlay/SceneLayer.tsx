import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import type { WebsiteSlot } from "../scene";

/** Room on every side of the window, so a finished inner scroll can spill outward. */
const CHAIN_REST = 4000;

/** Websites render at this fraction of their real size, so they show the desktop layout. */
const SITE_SCALE = 0.5;

/** Hovered link bounds, in scene coordinates. */
export type LinkHighlight = { kind: "text" | "image"; x: number; y: number; width: number; height: number };

type Props = {
  websites: WebsiteSlot[];
  link: LinkHighlight | null;
  /** Scene pixels to move the canvas once a window has scrolled to its edge. */
  onPan: (dx: number, dy: number) => void;
};

/**
 * A parked scroller around the window. Inner content scrolls first. Whatever is left,
 * horizontally or vertically, lands here and is handed to the canvas.
 */
const ScrollChain = ({ onPan, children }: { onPan: Props["onPan"]; children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onPanRef = useRef(onPan);
  onPanRef.current = onPan;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    let ignore = false;
    const atRest = () => el.scrollLeft === CHAIN_REST && el.scrollTop === CHAIN_REST;
    // iOS delivers the scroll event after scrollLeft returns. Keep ignoring until
    // the park has landed, or that event is read as another pan and the tab crashes.
    const park = () => {
      ignore = true;
      el.scrollLeft = CHAIN_REST;
      el.scrollTop = CHAIN_REST;
      if (atRest()) {
        ignore = false;
      }
    };
    park();
    const onScroll = () => {
      if (ignore) {
        if (atRest()) {
          ignore = false;
        }
        return;
      }
      const dx = el.scrollLeft - CHAIN_REST;
      const dy = el.scrollTop - CHAIN_REST;
      if (dx === 0 && dy === 0) {
        return;
      }
      park();
      onPanRef.current(dx, dy);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="scene-layer__chain">
      <div className="scene-layer__chain-gutter">{children}</div>
    </div>
  );
};

const PAN_EVENT = "portfolio-pan";

/** Cross-origin pages stay unloaded until their window actually sits on screen. */
const FramedSite = ({ site }: { site: WebsiteSlot }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || site.screenshot) {
      return;
    }
    const arm = () => {
      const rect = frame.getBoundingClientRect();
      const near =
        rect.bottom > -160 &&
        rect.right > -160 &&
        rect.top < window.innerHeight + 160 &&
        rect.left < window.innerWidth + 160;
      if (!near) {
        return;
      }
      setLive(true);
      window.removeEventListener(PAN_EVENT, arm);
    };
    arm();
    window.addEventListener(PAN_EVENT, arm);
    return () => window.removeEventListener(PAN_EVENT, arm);
  }, [site.screenshot]);

  return (
    <div
      ref={frameRef}
      className={site.screenshot ? "scene-layer__frame scene-layer__frame--scroll" : "scene-layer__frame"}
    >
      {site.screenshot ? (
        // Not a link: open the site via the canvas title (`host ↗`) only.
        <img src={site.screenshot} alt={new URL(site.url).host} loading="lazy" draggable={false} />
      ) : (
        live && (
          <iframe
            src={site.url}
            title={new URL(site.url).host}
            // No allow-popups / allow-top-navigation: browsing stays inside the frame;
            // the canvas title link is what opens the real site.
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
            style={{
              width: site.width / SITE_SCALE,
              height: site.height / SITE_SCALE,
              transform: `scale(${SITE_SCALE})`,
            }}
          />
        )
      )}
    </div>
  );
};

/** A wobbly pen underline, stretched to the link's width. */
const Underline = ({ link }: { link: LinkHighlight }) => (
  <svg
    className="scene-layer__underline"
    style={{ left: link.x - 4, top: link.y + link.height - 2, width: link.width + 8 }}
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path d="M1 5 C 15 2, 25 8, 40 5 S 65 2, 80 6 S 95 4, 99 5" vectorEffect="non-scaling-stroke" />
  </svg>
);

/**
 * DOM layer that sits between Excalidraw's canvas and its UI. Its inner element
 * is moved with a single transform (see `followViewport`), so scrolling never re-renders React.
 */
export const SceneLayer = forwardRef<HTMLDivElement, Props>(function SceneLayer({ websites, link, onPan }, ref) {
  return (
    <div className="scene-layer">
      <div ref={ref} className="scene-layer__world">
        {websites.map((site) => (
          <div
            key={site.id}
            className="scene-layer__site"
            style={{ left: site.x, top: site.y, width: site.width, height: site.height }}
          >
            <ScrollChain onPan={onPan}>
              <FramedSite site={site} />
            </ScrollChain>
          </div>
        ))}
        {link?.kind === "text" && <Underline link={link} />}
        {link?.kind === "image" && (
          <div
            className="scene-layer__outline"
            style={{ left: link.x - 8, top: link.y - 8, width: link.width + 16, height: link.height + 16 }}
          />
        )}
      </div>
    </div>
  );
});

/** Scene coordinates map to the screen as (scene + scroll) * zoom. */
export const followViewport = (world: HTMLElement | null, scrollX: number, scrollY: number, zoom: number) => {
  if (world) {
    world.style.transform = `scale(${zoom}) translate(${scrollX}px, ${scrollY}px)`;
    window.dispatchEvent(new Event(PAN_EVENT));
  }
};
