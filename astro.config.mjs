import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://immersive.nlab.fr";
const readJson = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const site = readJson("./src/data/site.json").root.props;

// Chemin public (sans slash final) de chaque fichier de src/data, pour exclure du sitemap les pages « ne pas indexer ».
const routeOf = (dir, slug) => (dir === "pages" ? (slug === "accueil" ? "/" : `/${slug}`) : `/projets/${slug}`);
const noindexRoutes = new Set(
  ["pages", "projets"].flatMap((dir) =>
    readdirSync(new URL(`./src/data/${dir}/`, import.meta.url))
      .filter((f) => f.endsWith(".json"))
      .filter((f) => readJson(`./src/data/${dir}/${f}`).root?.props?.seo?.noindex === true)
      .map((f) => routeOf(dir, f.replace(/\.json$/, ""))),
  ),
);

// Redirections réglées dans /edit/site (site.json). GitHub Pages ne fait pas de vraie 301 :
// Astro génère une page HTML avec meta refresh + lien canonical vers la destination.
const redirects = Object.fromEntries(
  (site.redirects ?? [])
    .map((r) => [String(r.from ?? "").trim(), String(r.to ?? "").trim()])
    .filter(([from, to]) => from.startsWith("/") && to && from !== to),
);

const trim = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
const excluded = (url) => {
  const p = trim(new URL(url).pathname);
  return p === "/edit" || p.startsWith("/edit/") || p === "/404" || noindexRoutes.has(p) || p in redirects;
};

// Dev uniquement : l'éditeur Puck envoie le JSON ici, il est écrit dans src/data/page.json.
const savePuckData = () => ({
  name: "save-puck-data",
  configureServer(server) {
    server.middlewares.use("/__save", (req, res) => {
      const file = new URL(req.url, "http://x").searchParams.get("file") || "";
      if (req.method !== "POST" || !/^((pages|projets)\/[a-z0-9-]+|site)$/.test(file)) { res.statusCode = 400; return res.end(); }
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
  site: SITE,
  base: '/',
  redirects,
  integrations: [react(), sitemap({ filter: (page) => !excluded(page) })],
  vite: { plugins: [tailwindcss(), savePuckData()] },
});
