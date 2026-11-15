import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type P = { eyebrow: string; title: string; intro: string; cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string; placeholder: string; src: string };

export const PageHeader: ComponentConfig<P> = {
  label: "En-tête de page (secteur / projet)",
  fields: {
    eyebrow: { type: "text", label: "Surtitre" }, title: { type: "textarea", label: "Titre H1" }, intro: { type: "textarea", label: "Introduction" },
    cta1Label: { type: "text", label: "Bouton 1 : texte" }, cta1Href: { type: "text", label: "Bouton 1 : lien" },
    cta2Label: { type: "text", label: "Bouton 2 : texte" }, cta2Href: { type: "text", label: "Bouton 2 : lien" },
    ...mediaFields,
  } as any,
  defaultProps: { eyebrow: "", title: "Titre de la page", intro: "", cta1Label: "Estimer un projet", cta1Href: "/contact", cta2Label: "", cta2Href: "", placeholder: "Insérer la démo ou l’image principale", src: "" },
  render: (p) => (
    <section className="ph">
      <div className="wrap ph-grid">
        <div>
          {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
          <h1><T>{p.title}</T></h1>
          <p className="lead"><T>{p.intro}</T></p>
          <div className="cta">
            {p.cta1Label && <a className="btn btn-primary" href={p.cta1Href}>{p.cta1Label}</a>}
            {p.cta2Label && <a className="btn btn-ghost" href={p.cta2Href}>{p.cta2Label}</a>}
          </div>
        </div>
        <Slot className="r43" placeholder={p.placeholder} src={p.src} />
      </div>
    </section>
  ),
};
