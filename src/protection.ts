import { CaptureUpdateAction } from "@excalidraw/excalidraw";
import type { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";

/**
 * Portfolio elements are `locked`, which already blocks selecting, moving
 * and erasing them. This guard covers what slips through (e.g. "unlock all"
 * or undo/redo) by restoring deleted elements and re-locking unlocked ones.
 */
export function createProtection(originals: readonly OrderedExcalidrawElement[]) {
  const originalById = new Map(originals.map((element) => [element.id, element]));
  let enabled = false;

  const isTampered = (current: ExcalidrawElement | undefined) =>
    !current || current.isDeleted || !current.locked;

  const restore = (
    current: OrderedExcalidrawElement | undefined,
    original: OrderedExcalidrawElement,
  ): OrderedExcalidrawElement => ({
    ...(current ?? original),
    locked: true,
    isDeleted: false,
    version: (current?.version ?? original.version) + 1,
    versionNonce: Math.floor(Math.random() * 2 ** 31),
  });

  const enforce = (
    api: ExcalidrawImperativeAPI,
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
  ) => {
    if (!enabled) {
      return;
    }
    const currentById = new Map(elements.map((element) => [element.id, element]));
    const tamperedIds = [...originalById.keys()].filter((id) => isTampered(currentById.get(id)));
    if (tamperedIds.length === 0) {
      return;
    }

    const tampered = new Set(tamperedIds);
    const missing = originals
      .filter((original) => !currentById.has(original.id))
      .map((original) => restore(undefined, original));
    const nextElements = [
      ...missing,
      ...elements.map((element) => {
        const original = originalById.get(element.id);
        return original && tampered.has(element.id) ? restore(element, original) : element;
      }),
    ];

    const selectedElementIds = Object.fromEntries(
      Object.entries(appState.selectedElementIds).filter(([id]) => !originalById.has(id)),
    ) as AppState["selectedElementIds"];

    api.updateScene({
      elements: nextElements,
      appState: { selectedElementIds },
      captureUpdate: CaptureUpdateAction.NEVER,
    });
  };

  const reset = (api: ExcalidrawImperativeAPI) => {
    const currentById = new Map(api.getSceneElementsIncludingDeleted().map((el) => [el.id, el]));
    api.updateScene({
      elements: originals.map((original) => restore(currentById.get(original.id), original)),
      appState: { selectedElementIds: {} },
      captureUpdate: CaptureUpdateAction.NEVER,
    });
    api.history.clear();
  };

  return {
    enable: () => {
      enabled = true;
    },
    enforce,
    reset,
  };
}
