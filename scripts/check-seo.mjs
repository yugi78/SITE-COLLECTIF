// Contrôle SEO des pages (src/data/pages et src/data/projets) : affiche des avertissements, ne bloque jamais le build.
// Même logique de repli que src/lib/seo.ts : champ « seo » de la page, puis ancien titre/description, puis site.json.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LIMITS = { title: 60, descMin: 70, descMax: 160 };
const IMG = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i;
const clean = (s) => String(s ?? "").replace(/\[\[|\]\]/g, "").replace(/\s+/g, " ").trim();
const read = (p) => JSON.parse(readFileSync(p, "utf8"));

const g = read("src/data/site.json").root.props;
const G = { name: clean(g.brand), description: clean(g.seoDescription), image: clean(g.seoImage), imageAlt: clean(g.seoImageAlt) };

const warnings = [];
const warn = (file, msg) => warnings.push(`  ${file} : ${msg}`);
const titles = new Map();

if (G.image && !G.imageAlt) warn("site.json", "image de partage par défaut sans texte alternatif");
if (!G.description) warn("site.json", "pas de description SEO par défaut");

for (const dir of ["pages", "projets"]) {
  for (const f of readdirSync(join("src/data", dir)).filter((x) => x.endsWith(".json"))) {
    const file = `${dir}/${f}`;
    const d = read(join("src/data", dir, f));
    const r = d.root?.props ?? {};
    const s = r.seo ?? {};
    const title = clean(s.title) || clean(r.title) || G.name;
    const desc = clean(s.description) || clean(r.description) || G.description;
    const ownImage = clean(s.image);

    if (s.noindex === true) warn(file, "page marquée « ne pas indexer » (absente du sitemap)");
    if (!clean(s.title) && !clean(r.title)) warn(file, `titre SEO vide (repli sur « ${G.name} »)`);
    if (title.length > LIMITS.title) warn(file, `titre de ${title.length} caractères (> ${LIMITS.title}) : « ${title} »`);
    if (!desc) warn(file, "meta description absente");
    else if (desc.length < LIMITS.descMin || desc.length > LIMITS.descMax) warn(file, `meta description de ${desc.length} caractères (conseillé : ${LIMITS.descMin}–${LIMITS.descMax})`);
    if (ownImage && !clean(s.imageAlt)) warn(file, "image de partage sans texte alternatif");

    // Images des blocs : le texte du placeholder sert de texte alternatif.
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (!o || typeof o !== "object" || o.hidden === true) return;
      if (typeof o.src === "string" && IMG.test(o.src) && !clean(o.placeholder)) warn(file, `image sans texte alternatif : ${o.src}`);
      Object.values(o).forEach(walk);
    };
    walk(d.content);

    if (s.noindex !== true) titles.set(title, [...(titles.get(title) ?? []), file]);
  }
}
for (const [t, files] of titles) if (files.length > 1) warnings.push(`  titre dupliqué « ${t} » : ${files.join(", ")}`);

if (warnings.length) {
  console.warn(`\nSEO : ${warnings.length} avertissement(s) (non bloquant)\n${warnings.join("\n")}\n`);
} else console.log("SEO : aucun avertissement.");
