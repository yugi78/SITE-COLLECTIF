import type { ComponentConfig } from "@measured/puck";
import { Slot, mediaFields } from "./shared";

type P = { title: string; lead: string; items: { title: string; text: string; href: string; placeholder: string; src: string }[] };

export const SectorCards: ComponentConfig<P> = {
  label: "Entrées par secteur",
  fields: {
    title: { type: "text" }, lead: { type: "textarea" },
    items: { type: "array", label: "Secteurs", arrayFields: { title: { type: "text" }, text: { type: "textarea" }, href: { type: "text", label: "Lien" }, ...mediaFields }, getItemSummary: (i: any) => i.title },
  } as any,
  defaultProps: { title: "Votre domaine d’activité", lead: "", items: [] },
  render: ({ title, lead, items }) => (
    <section id="secteurs">
      <div className="wrap">
        <h2>{title}</h2>
        <p className="lead">{lead}</p>
        <div className="grid3">
          {(items ?? []).map((s, i) => (
            <a className="card" href={s.href} key={i}>
              <Slot className="r169" placeholder={s.placeholder} src={s.src} />
              <span className="notch">{String(i + 1).padStart(2, "0")}<i className="na" aria-hidden="true">→</i></span>
              <div className="card-body"><h3>{s.title}</h3><p>{s.text}</p></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  ),
};
