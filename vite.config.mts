import { writeFileSync } from "node:fs";

import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Receives the board while `?edit` is on (see src/edit-mode.ts). */
const editRecorder = (): Plugin => ({
  name: "edit-recorder",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/__edits", (req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        writeFileSync("edits.json", body);
        res.end("ok");
      });
    });
  },
});

export default defineConfig({
  plugins: [react(), editRecorder()],
  server: { port: 3001 },
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
});
