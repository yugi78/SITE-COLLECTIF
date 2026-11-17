// robots.txt généré depuis site.json (règles supplémentaires réglables dans /edit/site).
import type { APIRoute } from "astro";
import site from "../data/site.json";

export const GET: APIRoute = ({ site: base }) => {
  const extra = String((site.root.props as any).robotsExtra ?? "")
    .split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const sitemap = new URL("/sitemap-index.xml", base ?? "https://immersive.nlab.fr").href;
  const body = ["User-agent: *", "Allow: /", "Disallow: /edit", ...extra, "", `Sitemap: ${sitemap}`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
