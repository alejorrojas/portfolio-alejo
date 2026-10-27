import { CaptureUpdateAction } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import { PRESENCE } from "../presence";

type Props = {
  api: ExcalidrawImperativeAPI | null;
  following: boolean;
};

/** Mobile follow control — Excalidraw's UserList is desktop-only in 0.18. */
export function PresenceFollow({ api, following }: Props) {
  return (
    <button
      type="button"
      className={following ? "presence-follow presence-follow--active" : "presence-follow"}
      title={following ? "Stop following alejo" : "Follow alejo"}
      aria-label={following ? "Stop following alejo" : "Follow alejo"}
      aria-pressed={following}
      onClick={() => {
        if (!api) {
          return;
        }
        api.updateScene({
          appState: {
            userToFollow: following
              ? null
              : { socketId: PRESENCE.socketId, username: PRESENCE.username },
          },
          captureUpdate: CaptureUpdateAction.EVENTUALLY,
        });
      }}
    >
      <img className="presence-follow__img" src={PRESENCE.avatarUrl} alt="" draggable={false} />
    </button>
  );
}
