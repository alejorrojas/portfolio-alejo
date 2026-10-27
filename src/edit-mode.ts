import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

/** Local only: `localhost/?edit` unlocks the board and streams it to `edits.json`. */
export const EDIT_MODE = import.meta.env.DEV && new URLSearchParams(location.search).has("edit");

export const createEditRecorder = (original: readonly OrderedExcalidrawElement[]) => {
  let timer = 0;
  return (elements: readonly OrderedExcalidrawElement[]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const current = elements.filter((element) => !element.isDeleted);
      void fetch("/__edits", { method: "POST", body: JSON.stringify({ original, current }) });
    }, 600);
  };
};
