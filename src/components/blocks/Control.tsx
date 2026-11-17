import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type P = { eyebrow: string; title: string; lead: string; items: { title: string; text: string }[]; placeholder: string; src: string; note: string };

export const Control: ComponentConfig<P> = {
  label: "Vous gardez la main (back-office modulaire)",
  fields: {
    eyebrow: { type: "text" }, title: { type: "text" }, lead: { type: "textarea" },
    items: { type: "array", label: "Capacités", arrayFields: { title: { type: "text" }, text: { type: "textarea", label: "Texte ([[pas encore développé]] pour surligner)" } }, getItemSummary: (i: any) => i.title },
    ...mediaFields, note: { type: "text", label: "Note sous la liste" },
  } as any,
  defaultProps: { eyebrow: "Back-office", title: "Une visite 3D que vous pilotez vous-même", lead: "", items: [], placeholder: "Démo vidéo : l’éditeur en action", src: "", note: "" },
  render: (p) => (
    <section id="pilotage" className="dark">
      <div className="wrap control">
        <div>
          <span className="eyebrow">{p.eyebrow}</span>
          <h2>{p.title}</h2>
          <p className="lead"><T>{p.lead}</T></p>
          <ul className="ctl-list">
            {(p.items ?? []).map((it, i) => (<li key={i}><h3>{it.title}</h3><p><T>{it.text}</T></p></li>))}
          </ul>
          {p.note && <p className="note"><T>{p.note}</T></p>}
        </div>
        <Slot className="r43" placeholder={p.placeholder} src={p.src} />
      </div>
    </section>
  ),
};
