// Champs SEO de l'éditeur Puck : réglages par page (racine « seo ») et réglages globaux (page « site »).
import { createContext, useContext } from "react";
import { SEO_LIMITS, clean, globals, type PageSeo } from "../lib/seo";

/** Chemin du fichier édité (ex. « pages/accueil »), fourni par Editor.tsx pour l'aperçu Google. */
export const EditorPath = createContext("");

const SITE_HOST = "immersive.nlab.fr";
const urlOf = (path: string) => {
  const [dir, slug] = path.split("/");
  if (dir === "pages") return slug === "accueil" ? "/" : `/${slug}/`;
  if (dir === "projets") return `/projets/${slug}/`;
  return "/";
};

const box: React.CSSProperties = { width: "100%", padding: "7px 9px", border: "1px solid #c8c8c8", borderRadius: 6, font: "inherit", boxSizing: "border-box" };
const lab: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 4px", color: "#333" };
const hint: React.CSSProperties = { fontSize: 12, color: "#777", marginTop: 3 };

function Counter({ n, min, ideal, max }: { n: number; min?: number; ideal: number; max: number }) {
  const bad = n > max || (min !== undefined && n > 0 && n < min);
  const color = n === 0 ? "#999" : bad ? "#c0392b" : n > ideal ? "#d4880f" : "#1e8e3e";
  return <span style={{ float: "right", fontWeight: 500, color }}>{n} / {ideal}</span>;
}

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

function SeoEditor({ value, onChange }: { value?: PageSeo; onChange: (v: PageSeo) => void }) {
  const path = useContext(EditorPath);
  const v: PageSeo = value ?? {};
  const g = globals();
  const set = (k: keyof PageSeo, x: any) => onChange({ ...v, [k]: x });
  const title = clean(v.title) || g.name;
  const desc = clean(v.description) || g.description;
  const url = urlOf(path);
  return (
    <div>
      <label style={lab}>Titre SEO <Counter n={clean(v.title).length} ideal={SEO_LIMITS.title} max={SEO_LIMITS.title} /></label>
      <input style={box} type="text" value={v.title ?? ""} placeholder={g.name} onChange={(e) => set("title", e.target.value)} />

      <label style={lab}>Meta description <Counter n={clean(v.description).length} min={SEO_LIMITS.descMin} ideal={SEO_LIMITS.descIdeal} max={SEO_LIMITS.descMax} /></label>
      <textarea style={{ ...box, minHeight: 84, resize: "vertical" }} value={v.description ?? ""} placeholder={g.description || "Vide : description par défaut du site"} onChange={(e) => set("description", e.target.value)} />

      <label style={lab}>Image de partage (URL)</label>
      <input style={box} type="text" value={v.image ?? ""} placeholder={g.image || "Vide : image par défaut du site"} onChange={(e) => set("image", e.target.value)} />
      <div style={hint}>1200 × 630 px conseillé. Chemin du site (/og/page.jpg) ou URL complète.</div>

      <label style={lab}>Texte alternatif de l’image</label>
      <input style={box} type="text" value={v.imageAlt ?? ""} onChange={(e) => set("imageAlt", e.target.value)} />

      <label style={{ ...lab, display: "flex", gap: 8, alignItems: "center", fontWeight: 500 }}>
        <input type="checkbox" checked={v.noindex === true} onChange={(e) => set("noindex", e.target.checked)} />
        Ne pas indexer cette page (absente de Google et du sitemap)
      </label>

      {/* Aperçu approximatif du résultat Google */}
      <div style={{ marginTop: 14, padding: 14, border: "1px solid #e3e3e3", borderRadius: 8, background: "#fff", fontFamily: "Arial, sans-serif", opacity: v.noindex ? 0.45 : 1 }}>
        <div style={{ fontSize: 11, color: "#777", marginBottom: 6 }}>{v.noindex ? "Aperçu Google (page non indexée)" : "Aperçu Google"}</div>
        <div style={{ fontSize: 12, color: "#202124" }}>{g.name}</div>
        <div style={{ fontSize: 12, color: "#4d5156", marginBottom: 4 }}>https://{SITE_HOST}{url === "/" ? "" : " › " + url.replace(/^\/|\/$/g, "").split("/").join(" › ")}</div>
        <div style={{ fontSize: 18, lineHeight: 1.3, color: "#1a0dab" }}>{cut(title, SEO_LIMITS.title)}</div>
        <div style={{ fontSize: 13, lineHeight: 1.45, color: "#4d5156", marginTop: 3 }}>{desc ? cut(desc, SEO_LIMITS.descMax) : <em>Aucune description : Google en choisira une dans la page.</em>}</div>
      </div>
    </div>
  );
}

/** Champ racine des pages : { title, description, image, imageAlt, noindex }. */
export const seoField: any = { type: "custom", label: "SEO de la page", render: (p: any) => <SeoEditor value={p.value} onChange={p.onChange} /> };

/** Champs SEO globaux de la page « site » (enregistrés dans site.json par la sauvegarde habituelle). */
export const siteSeoFields: any = {
  seoDescription: { type: "textarea", label: "SEO : description par défaut (pages sans description)" },
  seoImage: { type: "text", label: "SEO : image de partage par défaut (URL, 1200 × 630 px)" },
  seoImageAlt: { type: "text", label: "SEO : texte alternatif de l’image par défaut" },
  lang: { type: "select", label: "Langue du site", options: [{ label: "Français", value: "fr" }, { label: "Français (France)", value: "fr-FR" }, { label: "Anglais", value: "en" }] },
  org: {
    type: "object", label: "Entreprise (données structurées JSON-LD pour Google)",
    objectFields: {
      name: { type: "text", label: "Nom (vide = nom du studio)" },
      type: { type: "select", label: "Type", options: [{ label: "Prestataire de services (ProfessionalService)", value: "ProfessionalService" }, { label: "Commerce local (LocalBusiness)", value: "LocalBusiness" }, { label: "Organisation", value: "Organization" }] },
      url: { type: "text", label: "URL du site (vide = immersive.nlab.fr)" },
      logo: { type: "text", label: "Logo (URL, vide = logo du menu)" },
      email: { type: "text", label: "E-mail" },
      phone: { type: "text", label: "Téléphone (format international : +33 …)" },
      areaServed: { type: "text", label: "Zone d’intervention" },
      sameAs: { type: "array", label: "Réseaux sociaux et profils (URL)", arrayFields: { url: { type: "text" } }, getItemSummary: (i: any) => i.url || "Nouveau lien" },
    },
  },
  robotsExtra: { type: "textarea", label: "robots.txt : règles supplémentaires (une par ligne, ex. Disallow: /brouillon)" },
  redirects: {
    type: "array", label: "Redirections (de → vers). Prises en compte au prochain build ou redémarrage de npm run dev",
    arrayFields: { from: { type: "text", label: "De (ex. /ancienne-page)" }, to: { type: "text", label: "Vers (ex. /nouvelle-page ou URL)" } },
    getItemSummary: (i: any) => `${i.from || "?"} → ${i.to || "?"}`,
  },
};
