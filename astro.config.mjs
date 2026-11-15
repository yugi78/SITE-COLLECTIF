import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { writeFileSync } from "node:fs";

// Dev uniquement : l'éditeur Puck envoie le JSON ici, il est écrit dans src/data/page.json.
const savePuckData = () => ({
  name: "save-puck-data",
  configureServer(server) {
    server.middlewares.use("/__save", (req, res) => {
      const file = new URL(req.url, "http://x").searchParams.get("file") || "";
      if (req.method !== "POST" || !/^(pages|projets)\/[a-z0-9-]+$/.test(file)) { res.statusCode = 400; return res.end(); }
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        try {
          writeFileSync(`src/data/${file}.json`, JSON.stringify(JSON.parse(body), null, 2));
          res.statusCode = 200;
        } catch {
          res.statusCode = 400;
        }
        res.end();
      });
    });
  },
});

export default defineConfig({
  site: 'https://yugi78.github.io',
  base: '/SITE-COLLECTIF',
  integrations: [react()],
  vite: { plugins: [tailwindcss(), savePuckData()] },
});
