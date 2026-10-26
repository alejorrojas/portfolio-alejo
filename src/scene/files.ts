import type { BinaryFileData, BinaryFiles } from "@excalidraw/excalidraw/types";

export type SceneFile = { id: string; url: string };

const readAsDataURL = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export async function loadSceneFiles(files: readonly SceneFile[]): Promise<BinaryFiles> {
  const loaded = await Promise.all(
    files.map(async ({ id, url }) => {
      try {
        const blob = await (await fetch(url)).blob();
        const file: BinaryFileData = {
          id: id as BinaryFileData["id"],
          mimeType: blob.type as BinaryFileData["mimeType"],
          dataURL: (await readAsDataURL(blob)) as BinaryFileData["dataURL"],
          created: Date.now(),
        };
        return [id, file] as const;
      } catch (error) {
        console.error(`Failed to load ${url}`, error);
        return null;
      }
    }),
  );
  return Object.fromEntries(loaded.filter((entry) => entry !== null));
}
