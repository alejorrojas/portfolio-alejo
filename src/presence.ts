import { CaptureUpdateAction } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { Collaborator, ExcalidrawImperativeAPI, SocketId } from "@excalidraw/excalidraw/types";

// Excalidraw derives the cursor/avatar color from a hash of this id (ignoring `color`); this one hashes to blue.
const SOCKET_ID = "alejo-11" as SocketId;
const FRAME_MS = 33;
const START_DELAY_MS = 1200;
/** How much of the gap to the followed cursor the camera closes each frame. */
const CAMERA_EASE = 0.12;
const TOUR_MIN_HOP = 700;

/** Shared identity for the fake collaborator (cursor + follow avatar). */
export const PRESENCE = {
  socketId: SOCKET_ID,
  username: "alejo",
  avatarUrl: "/images/photos/avatar.webp",
  color: { background: "#1971c2", stroke: "#1971c2" },
} as const;

const ALEJO: Collaborator = {
  id: SOCKET_ID,
  socketId: SOCKET_ID,
  username: PRESENCE.username,
  avatarUrl: PRESENCE.avatarUrl,
  color: { ...PRESENCE.color },
};

type Point = { x: number; y: number };
type Move = { from: Point; control: Point; to: Point; start: number; duration: number };

const between = (min: number, max: number) => min + Math.random() * (max - min);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Viewport rectangle in scene coordinates. */
const viewport = (api: ExcalidrawImperativeAPI) => {
  const { scrollX, scrollY, zoom, width, height } = api.getAppState();
  return { x: -scrollX, y: -scrollY, width: width / zoom.value, height: height / zoom.value };
};

const isVisible = (element: ExcalidrawElement, view: ReturnType<typeof viewport>) =>
  element.x > view.x &&
  element.y > view.y &&
  element.x + element.width < view.x + view.width &&
  element.y + element.height < view.y + view.height;

const myStuff = (api: ExcalidrawImperativeAPI) =>
  api.getSceneElements().filter((element) => element.locked && (element.type === "text" || element.type === "image"));

const spotOn = (element: ExcalidrawElement): Point => ({
  x: element.x + element.width * between(0.05, element.type === "text" ? 0.6 : 0.9),
  y: element.y + element.height * between(0.2, 0.9),
});

/** Somewhere a person would look: mostly my own text and pictures on screen, sometimes nowhere in particular. */
const pickTarget = (api: ExcalidrawImperativeAPI): Point => {
  const view = viewport(api);
  const candidates = myStuff(api).filter((element) => isVisible(element, view));
  if (candidates.length > 0 && Math.random() < 0.8) {
    return spotOn(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return {
    x: view.x + view.width * between(0.15, 0.85),
    y: view.y + view.height * between(0.2, 0.85),
  };
};

/** While someone follows me, wander off to another part of the board to show it around. */
const pickTourStop = (api: ExcalidrawImperativeAPI, from: Point): Point => {
  const elements = myStuff(api);
  const far = elements.filter((element) => Math.hypot(element.x - from.x, element.y - from.y) > TOUR_MIN_HOP);
  const pool = far.length > 0 ? far : elements;
  return spotOn(pool[Math.floor(Math.random() * pool.length)]);
};

const planMove = (from: Point, to: Point, now: number, touring: boolean): Move => {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const bend = between(-0.25, 0.25) * distance;
  const angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
  return {
    from,
    to,
    control: {
      x: (from.x + to.x) / 2 + Math.cos(angle) * bend,
      y: (from.y + to.y) / 2 + Math.sin(angle) * bend,
    },
    start: now,
    duration: touring ? Math.min(3200, 900 + distance * 0.5) : Math.min(1600, 350 + distance * 0.9),
  };
};

const pointOnMove = ({ from, control, to }: Move, t: number): Point => {
  const e = easeInOut(t);
  const a = (1 - e) ** 2;
  const b = 2 * (1 - e) * e;
  const c = e ** 2;
  return { x: a * from.x + b * control.x + c * to.x, y: a * from.y + b * control.y + c * to.y };
};

/**
 * A fake "alejo is here" collaborator. Uses Excalidraw's own collaborator rendering
 * (cursor + avatar), and only pushes updates while the cursor is actually moving.
 * Clicking the avatar follows it: the camera keeps the cursor centered while it tours the board.
 */
export const startPresence = (api: ExcalidrawImperativeAPI) => {
  let position: Point = (() => {
    const view = viewport(api);
    return { x: view.x + view.width * 0.95, y: view.y + view.height * 0.7 };
  })();
  let move: Move | null = null;
  let restUntil = performance.now() + START_DELAY_MS;
  let timer = 0;

  const isFollowed = () => api.getAppState().userToFollow?.socketId === SOCKET_ID;

  /** Ease the camera toward the cursor; scrolling this way doesn't count as the visitor breaking off. */
  const followCamera = () => {
    const { scrollX, scrollY, zoom, width, height } = api.getAppState();
    const targetX = width / 2 / zoom.value - position.x;
    const targetY = height / 2 / zoom.value - position.y;
    return {
      scrollX: scrollX + (targetX - scrollX) * CAMERA_EASE,
      scrollY: scrollY + (targetY - scrollY) * CAMERA_EASE,
    };
  };

  const publish = (followed = false) => {
    api.updateScene({
      collaborators: new Map([[SOCKET_ID, { ...ALEJO, pointer: { ...position, tool: "pointer" }, button: "up" }]]),
      ...(followed ? { appState: followCamera() } : {}),
      captureUpdate: CaptureUpdateAction.NEVER,
    });
  };

  const tick = () => {
    timer = window.setTimeout(tick, FRAME_MS);
    if (document.hidden) {
      return;
    }
    const now = performance.now();
    const followed = isFollowed();
    if (!move && now >= restUntil) {
      move = planMove(position, followed ? pickTourStop(api, position) : pickTarget(api), now, followed);
    }
    if (!move) {
      if (followed) {
        publish(true);
      }
      return;
    }
    const t = Math.min(1, (now - move.start) / move.duration);
    position = pointOnMove(move, t);
    publish(followed);
    if (t === 1) {
      move = null;
      restUntil = followed
        ? now + between(1800, 3000)
        : now + (Math.random() < 0.25 ? between(2500, 5000) : between(500, 1800));
    }
  };

  const stopListening = api.onUserFollow(({ userToFollow, action }) => {
    if (action === "FOLLOW" && userToFollow.socketId === SOCKET_ID) {
      restUntil = Math.min(restUntil, performance.now() + 600);
    }
  });

  publish();
  timer = window.setTimeout(tick, FRAME_MS);

  return () => {
    window.clearTimeout(timer);
    stopListening();
    api.updateScene({ collaborators: new Map(), captureUpdate: CaptureUpdateAction.NEVER });
  };
};
