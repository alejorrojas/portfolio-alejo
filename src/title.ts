const TITLES = ["My own world", "alejo rojas"];
const INTERVAL_MS = 3000;

let index = 0;

/** Flips the tab title back and forth. Skips work while the tab is hidden. */
export const startTitleSwap = () =>
  window.setInterval(() => {
    if (!document.hidden) {
      index = (index + 1) % TITLES.length;
      document.title = TITLES[index];
    }
  }, INTERVAL_MS);
