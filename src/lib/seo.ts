// SEO : valeurs effectives d'une page (avec repli sur les réglages globaux de site.json) et données structurées JSON-LD.
// La même logique de repli est reprise dans scripts/check-seo.mjs : garder les deux en accord.
import site from "../data/site.json";

export type PageSeo = { title?: string; description?: string; image?: string; imageAlt?: string; noindex?: boolean };
export type Org = {
  name?: string; type?: string; url?: string; logo?: string; email?: string; phone?: string; areaServed?: string;
  sameAs?: { url: string }[];
};

export const SEO_LIMITS = { title: 60, descMin: 70, descMax: 160, descIdeal: 155 };

/** Retire les marqueurs [[ ]] (contenu inventé) et normalise les espaces. */
export const clean = (s?: string) => (s ?? "").replace(/\[\[|\]\]/g, "").replace(/\s+/g, " ").trim();

const G = site.root.props as any;

/** Réglages globaux (page « site » de l'éditeur). */
export function globals(props: any = G) {
  return {
    name: clean(props.brand) || "Studio",
    description: clean(props.seoDescription),
    image: clean(props.seoImage),
    imageAlt: clean(props.seoImageAlt),
    lang: clean(props.lang) || "fr",
    org: (props.org ?? {}) as Org,
    themeColor: clean(props.palette?.cadre) || "#0a1d28",
  };
}

/** Valeurs SEO effectives d'une page : champ `seo` de la page, puis ancien titre/description de la racine, puis site.json. */
export function resolveSeo(data: any, props: any = G) {
  const s: PageSeo = data?.root?.props?.seo ?? {};
  const r = data?.root?.props ?? {};
  const g = globals(props);
  const ownImage = clean(s.image);
  return {
    title: clean(s.title) || clean(r.title) || g.name,
    description: clean(s.description) || clean(r.description) || g.description,
    image: ownImage || g.image,
    imageAlt: ownImage ? clean(s.imageAlt) : g.imageAlt,
    noindex: s.noindex === true,
  };
}

/** URL absolue (les chemins relatifs sont résolus sur le domaine du site). */
export const absolute = (u: string, base: string | URL) => (u ? new URL(u, base).href : "");

/** Organisation (ProfessionalService par défaut), présente sur toutes les pages publiques. */
export function orgLd(base: string | URL, props: any = G) {
  const g = globals(props);
  const o = g.org;
  const sameAs = (o.sameAs ?? []).map((x) => clean(x?.url)).filter(Boolean);
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": clean(o.type) || "ProfessionalService",
    name: clean(o.name) || g.name,
    url: absolute(clean(o.url) || "/", base),
    description: g.description || undefined,
    logo: clean(o.logo || props.logo) ? absolute(clean(o.logo || props.logo), base) : undefined,
    image: g.image ? absolute(g.image, base) : undefined,
    email: clean(o.email) || undefined,
    telephone: clean(o.phone) || undefined,
    areaServed: clean(o.areaServed) || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
  return ld;
}

/** Fil d'Ariane : [{ name, path }]. */
export function breadcrumbLd(items: { name: string; path: string }[], base: string | URL) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: clean(it.name), item: absolute(it.path, base) })),
  };
}

/** FAQPage à partir des blocs FAQ de la page (données déjà débarrassées des éléments masqués). */
export function faqLd(data: any) {
  const qa = (data?.content ?? [])
    .filter((b: any) => b.type === "Faq")
    .flatMap((b: any) => b.props?.items ?? [])
    .map((it: any) => ({ q: clean(it?.q), a: clean(it?.a) }))
    .filter((x: any) => x.q && x.a);
  if (!qa.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x: any) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
}

/** Titre visible d'une page projet (en-tête), pour le fil d'Ariane. */
export const headingOf = (data: any) => clean(data?.content?.find((b: any) => b.type === "PageHeader")?.props?.title);
