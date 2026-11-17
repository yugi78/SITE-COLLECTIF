import type { ComponentConfig } from "@measured/puck";
import {T} from "./shared";

type P = { title: string; text: string; label: string; href: string; label2: string; href2: string };

export const CtaBand: ComponentConfig<P> = {
  label: "Bandeau d’appel à l’action",
  fields: {
    title: { type: "text" }, text: { type: "textarea" },
    label: { type: "text", label: "Bouton principal : texte" }, href: { type: "text", label: "Bouton principal : lien" },
    label2: { type: "text", label: "Bouton secondaire : texte (optionnel)" }, href2: { type: "text", label: "Bouton secondaire : lien" },
  } as any,
  defaultProps: { title: "Un lieu ou une pièce à valoriser ?", text: "Décrivez-nous votre projet : nous revenons vers vous avec une première estimation.", label: "Estimer un projet", href: "/contact", label2: "", href2: "" },
  render: (p) => (
    <section className="band dark">
      <div className="wrap band-in">
        <div><h2>{p.title}</h2>{p.text && <p><T>{p.text}</T></p>}</div>
        <div className="cta">
          <a className="btn btn-primary" href={p.href}>{p.label}</a>
          {p.label2 && <a className="btn btn-ghost" href={p.href2}>{p.label2}</a>}
        </div>
      </div>
    </section>
  ),
};
