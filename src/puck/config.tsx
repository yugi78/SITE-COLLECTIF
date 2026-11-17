import { PALETTE, themeVars } from "../lib/theme";
import type { Config } from "@measured/puck";
import { SiteNav, SiteFooter, type Site } from "../components/SiteNav";
import site from "../data/site.json";
import { seoField, siteSeoFields } from "./seoFields";
import { Hero } from "../components/blocks/Hero";
import { Control } from "../components/blocks/Control";
import { CtaBand } from "../components/blocks/CtaBand";
import { Offer } from "../components/blocks/Offer";
import { PageHeader } from "../components/blocks/PageHeader";
import { SectorCards } from "../components/blocks/SectorCards";
import { ProblemSolution } from "../components/blocks/ProblemSolution";
import { ProjectsRail } from "../components/blocks/ProjectsRail";
import { CaseStudy } from "../components/blocks/CaseStudy";
import { BeforeAfter } from "../components/blocks/BeforeAfter";
import { Stats } from "../components/blocks/Stats";
import { Method } from "../components/blocks/Method";
import { Commitments } from "../components/blocks/Commitments";
import { Quotes } from "../components/blocks/Quotes";
import { About } from "../components/blocks/About";
import { Faq } from "../components/blocks/Faq";
import { Pricing } from "../components/blocks/Pricing";
import { Placeholder } from "../components/blocks/Placeholder";
import { Contact } from "../components/blocks/Contact";
import { StickyBar } from "../components/blocks/StickyBar";

const config: Config = {
  root: {
    fields: {
      seo: seoField,
      pageTextSize: { type: "radio", label: "Taille du texte de toute la page", options: [{ label: "Petit", value: "s" }, { label: "Normal", value: "m" }, { label: "Grand", value: "l" }, { label: "Très grand", value: "xl" }] },
      pageTitleSize: { type: "radio", label: "Taille des titres de toute la page", options: [{ label: "Petit", value: "s" }, { label: "Normal", value: "m" }, { label: "Grand", value: "l" }, { label: "Très grand", value: "xl" }] },
    } as any,
    // Le wrapper .site scope tout le CSS du site (il n'affecte pas l'interface de Puck).
    render: ({ children, pageTextSize, pageTitleSize }: any) => (
      <div className="site" data-ts={pageTextSize && pageTextSize !== "m" ? pageTextSize : undefined} data-tt={pageTitleSize && pageTitleSize !== "m" ? pageTitleSize : undefined}><SiteNav site={site.root.props as Site} />{children}<SiteFooter site={site.root.props as Site} /></div>
    ),
  },
  components: { Hero, Offer, Control, CtaBand, PageHeader, SectorCards, ProblemSolution, ProjectsRail, CaseStudy, BeforeAfter, Stats, Method, Commitments, Quotes, About, Faq, Pricing, Placeholder, Contact, StickyBar } as Config["components"],
};

// Réglages de taille de texte ajoutés automatiquement à TOUS les blocs (titres et paragraphes).
const SIZE_OPTIONS = [
  { label: "Petit", value: "s" }, { label: "Normal", value: "m" }, { label: "Grand", value: "l" }, { label: "Très grand", value: "xl" },
];
const sizeFields: any = {
  titleSize: { type: "radio", label: "Taille des titres", options: SIZE_OPTIONS },
  textSize: { type: "radio", label: "Taille du texte", options: SIZE_OPTIONS },
};
const attr = (v?: string) => (v && v !== "m" ? v : undefined);
// Interrupteur « Afficher sur le site » ajouté à TOUS les blocs : un bloc masqué garde son contenu
// dans le JSON (on peut le réactiver plus tard) mais n'est pas du tout rendu sur le site public.
const visibilityField: any = {
  hidden: { type: "radio", label: "Afficher sur le site", options: [{ label: "Oui", value: false }, { label: "Non (masqué)", value: true }] },
};
// Même interrupteur sur chaque élément des listes (cartes, chiffres, étapes…) : l'élément masqué reste
// dans le JSON, est signalé « Masqué · » dans la liste de l'éditeur et n'est rendu ni dans l'aperçu ni sur le site.
const itemVisibilityField: any = {
  hidden: { type: "radio", label: "Afficher cet élément", options: [{ label: "Oui", value: false }, { label: "Non (masqué)", value: true }] },
};
Object.values(config.components as Record<string, any>).forEach((c) => {
  const render = c.render;
  const listKeys: string[] = [];
  for (const [key, f] of Object.entries<any>(c.fields ?? {})) {
    if (f?.type !== "array") continue;
    listKeys.push(key);
    const summary = f.getItemSummary;
    c.fields[key] = {
      ...f,
      arrayFields: { ...itemVisibilityField, ...f.arrayFields },
      getItemSummary: (item: any, i: number) => {
        const s = summary ? summary(item, i) : `Élément ${i + 1}`;
        return item?.hidden ? `Masqué · ${s}` : s;
      },
    };
  }
  c.fields = { ...visibilityField, ...c.fields, ...sizeFields };
  c.defaultProps = { ...c.defaultProps, hidden: false, titleSize: "m", textSize: "m" };
  c.render = (raw: any) => {
    if (raw.hidden && !raw.puck?.isEditing) return <></>;
    const props = { ...raw };
    for (const k of listKeys) if (Array.isArray(props[k])) props[k] = props[k].filter((it: any) => !it?.hidden);
    const blk = <div className="blk" data-tt={attr(props.titleSize)} data-ts={attr(props.textSize)}>{render(props)}</div>;
    // Dans l'éditeur, le bloc masqué reste visible mais estompé, avec une étiquette.
    return props.hidden ? <div className="blk-hidden" data-label="Bloc masqué : invisible sur le site">{blk}</div> : blk;
  };
});

export default config;

// Sélecteur de couleur : pastille + saisie du code hexadécimal.
const colorField = (label: string, def: string): any => ({
  type: "custom",
  label: `${label} (défaut ${def})`,
  render: ({ value, onChange }: any) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value ?? "") ? value : def} onChange={(e) => onChange(e.target.value)}
        style={{ width: 46, height: 36, padding: 0, border: "1px solid #c8c8c8", borderRadius: 6, background: "none", cursor: "pointer" }} />
      <input type="text" value={value ?? ""} spellCheck={false} onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, padding: "7px 9px", border: "1px solid #c8c8c8", borderRadius: 6, font: "inherit" }} />
    </div>
  ),
});

// Édition du header et du footer (page « site » dans l'éditeur) : tout se règle dans les champs de la racine.
export const siteConfig: Config = {
  root: {
    fields: {
      brand: { type: "text", label: "Nom du studio" },
      logo: { type: "text", label: "Logo (URL de l’image, vide = nom en texte)" },
      sectorsLabel: { type: "text", label: "Libellé du menu déroulant" },
      sectors: { type: "array", label: "Secteurs (menu déroulant et pied de page)", arrayFields: { title: { type: "text" }, text: { type: "text", label: "Description courte" }, href: { type: "text", label: "Lien" } }, getItemSummary: (i: any) => i.title },
      links: { type: "array", label: "Autres liens du menu", arrayFields: { label: { type: "text" }, href: { type: "text", label: "Lien" } }, getItemSummary: (i: any) => i.label },
      ctaLabel: { type: "text", label: "Bouton du menu : texte" }, ctaHref: { type: "text", label: "Bouton du menu : lien" },
      footerTagline: { type: "text", label: "Pied de page : phrase de présentation" },
      footerLinks: { type: "array", label: "Pied de page : liens", arrayFields: { label: { type: "text" }, href: { type: "text", label: "Lien" } }, getItemSummary: (i: any) => i.label },
      legal: { type: "text", label: "Mentions légales : texte" }, legalHref: { type: "text", label: "Mentions légales : lien" },
      palette: { type: "object", label: "Couleurs du site (le dégradé en est composé)", objectFields: Object.fromEntries(PALETTE.map((c) => [c.key, colorField(c.label, c.def)])) },
      gradientAngle: { type: "number", label: "Angle du dégradé (degrés : 180 = de haut en bas, 90 = de gauche à droite)", min: 0, max: 360 },
      ...siteSeoFields,
    } as any,
    render: ({ children, ...p }: any) => (
      <div className="site" style={themeVars(p) as React.CSSProperties}>
        <SiteNav site={p as Site} />{children}
        {/* Aperçu des couleurs (visible uniquement dans cet éditeur) */}
        <section className="tp"><h2>Tuile claire</h2><p>Texte courant sur fond clair, avec un <a href="#">lien d’accent</a>.</p><div className="cta"><a className="btn btn-primary" href="#">Bouton</a><a className="btn btn-ghost" href="#">Secondaire</a></div></section>
        <section className="tp dark"><h2>Tuile sombre</h2><p>Texte courant sur fond sombre.</p><div className="cta"><a className="btn btn-primary" href="#">Bouton</a><a className="btn btn-ghost" href="#">Secondaire</a></div></section>
        <section className="tp grad"><h2>Tuile dégradée</h2><div className="portfolio-media-slot" data-placeholder="Fond des emplacements médias : le dégradé" /></section>
        <section className="tp band dark"><h2>Bandeau d’appel</h2><p>Dégradé du bandeau, entre le bleu profond et la tuile sombre.</p></section>
        <SiteFooter site={p as Site} />
      </div>
    ),
  },
  components: {},
};
