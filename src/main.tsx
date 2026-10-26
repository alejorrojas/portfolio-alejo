import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@excalidraw/excalidraw/index.css";
import "./styles.css";

import { App } from "./App";
import { startTitleSwap } from "./title";

startTitleSwap();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
