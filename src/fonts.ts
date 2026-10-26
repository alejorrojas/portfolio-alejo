const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/**
 * Excalidraw only adds its font faces to `document.fonts` after the first
 * scene is loaded, and text is measured when elements are created. Wait for
 * the faces to be registered and loaded so the scene can be rebuilt with
 * correct text dimensions.
 */
export async function waitForFonts(families: readonly string[], sample: string) {
  const registered = () => {
    const loaded = new Set([...document.fonts].map((face) => face.family.replace(/"/g, "")));
    return families.every((family) => loaded.has(family));
  };
  for (let frame = 0; !registered() && frame < 300; frame++) {
    await nextFrame();
  }
  await Promise.all(families.map((family) => document.fonts.load(`20px "${family}"`, sample)));
}
