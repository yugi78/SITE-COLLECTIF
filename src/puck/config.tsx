import { PALETTE, themeVars } from "../lib/theme";
import type { Config } from "@measured/puck";
import { SiteNav, SiteFooter, type Site } from "../components/SiteNav";
import site from "../data/site.json";
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
      title: { type: "text", label: "Titre de la page (SEO)" }, description: { type: "textarea", label: "Description (SEO)" },
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
Object.values(config.components as Record<string, any>).forEach((c) => {
  const render = c.render;
  c.fields = { ...c.fields, ...sizeFields };
  c.defaultProps = { ...c.defaultProps, titleSize: "m", textSize: "m" };
  c.render = (props: any) => <div className="blk" data-tt={attr(props.titleSize)} data-ts={attr(props.textSize)}>{render(props)}</div>;
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
