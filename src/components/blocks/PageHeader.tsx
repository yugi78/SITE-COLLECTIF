import type { ComponentConfig } from "@measured/puck";
import {Arrow, Slot, T, mediaFields} from "./shared";

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
    <header className="hero hero-page">
      <div className="hero-media"><Slot placeholder={p.placeholder} src={p.src} /></div>
      <div className="hero-side">
        <div className="tile dark hero-card">
          {p.eyebrow && <span className="chip">{p.eyebrow}</span>}
          <div>
            <h1><T>{p.title}</T></h1>
            {p.intro && <p><T>{p.intro}</T></p>}
          </div>
        </div>
        {(p.cta1Label || p.cta2Label) && (
          <div className="hero-links">
            {p.cta2Label && <a className="row" href={p.cta2Href}><span>{p.cta2Label}</span><Arrow dir="down" /></a>}
            {p.cta1Label && <a className="row primary" href={p.cta1Href}><span>{p.cta1Label}</span><Arrow /></a>}
          </div>
        )}
      </div>
    </header>
  ),
};
