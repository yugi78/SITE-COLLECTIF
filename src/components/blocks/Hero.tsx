import { useState } from "react";
import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type P = { eyebrow: string; title: string; subtitle: string; cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string; placeholder: string; src: string; poster: string; launchLabel: string };

function Media({ placeholder, src, poster, launchLabel }: Pick<P, "placeholder" | "src" | "poster" | "launchLabel">) {
  const [on, setOn] = useState(false);
  // Image d'aperçu + bouton : la démo 3D ne se charge qu'au clic (démarrage rapide sur tablette).
  if (src && poster && !on)
    return (
      <div className="portfolio-media-slot viewer-slot filled">
        <img src={poster} alt={placeholder} />
        <div className="launch">
          <button className="btn btn-primary" onClick={() => setOn(true)}>{launchLabel}</button>
          <small>Navigation libre. Aucune installation.</small>
        </div>
      </div>
    );
  return <Slot className="viewer-slot" placeholder={placeholder} src={src} />;
}

export const Hero: ComponentConfig<P> = {
  label: "1 · Hero + démo 3D",
  fields: {
    eyebrow: { type: "text", label: "Surtitre" },
    title: { type: "textarea", label: "Titre H1" },
    subtitle: { type: "textarea", label: "Sous-titre" },
    cta1Label: { type: "text", label: "Bouton 1 : texte" },
    cta1Href: { type: "text", label: "Bouton 1 : lien" },
    cta2Label: { type: "text", label: "Bouton 2 : texte" },
    cta2Href: { type: "text", label: "Bouton 2 : lien" },
    ...mediaFields,
    poster: { type: "text", label: "Image d’aperçu (la démo se lance au clic ; vide = chargement direct)" },
    launchLabel: { type: "text", label: "Texte du bouton de lancement" },
  } as any,
  defaultProps: {
    eyebrow: "Studio de numérisation spatiale & valorisation 3D",
    title: "Donnez à vos lieux d’exception une empreinte numérique vivante.",
    subtitle: "Photo, drone et 3D temps réel, réunis dans une seule visite à parcourir librement.",
    cta1Label: "Explorer une démo en direct", cta1Href: "#projets",
    cta2Label: "Estimer un projet", cta2Href: "#contact",
    placeholder: "Insérer la meilleure démo 3D / WebGL ici (plein écran, chargement rapide)",
    src: "", poster: "", launchLabel: "Lancer l’expérience",
  },
  render: (p) => (
    <header className="hero">
      <Media placeholder={p.placeholder} src={p.src} poster={p.poster} launchLabel={p.launchLabel} />
      <div className="hero-in">
        <small>{p.eyebrow}</small>
        <h1><T>{p.title}</T></h1>
        <p><T>{p.subtitle}</T></p>
        <div className="cta">
          <a className="btn btn-primary" href={p.cta1Href}>{p.cta1Label}</a>
          <a className="btn btn-ghost" href={p.cta2Href}>{p.cta2Label}</a>
        </div>
      </div>
    </header>
  ),
};
