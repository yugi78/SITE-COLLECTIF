import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type P = { title: string; lead: string; items: { title: string; text: string }[]; linkLabel: string; linkHref: string };

export const Commitments: ComponentConfig<P> = {
  label: "Garanties / engagements",
  fields: {
    title: { type: "text" }, lead: { type: "textarea" },
    items: { type: "array", label: "Engagements", arrayFields: { title: { type: "text" }, text: { type: "textarea" } }, getItemSummary: (i: any) => i.title },
    linkLabel: { type: "text", label: "Lien : texte (optionnel)" }, linkHref: { type: "text", label: "Lien : adresse" },
  } as any,
  defaultProps: { title: "Nos engagements", lead: "", items: [], linkLabel: "", linkHref: "" },
  render: ({ title, lead, items, linkLabel, linkHref }) => (
    <section className="bg2">
      <div className="wrap">
        <h2>{title}</h2>
        {lead && <p className="lead"><T>{lead}</T></p>}
        <div className="gains big">{(items ?? []).map((g, i) => (<div key={i}><h3>{g.title}</h3><p><T>{g.text}</T></p></div>))}</div>
        {linkLabel && <p style={{ marginTop: 28 }}><a className="btn btn-ghost" href={linkHref}>{linkLabel}</a></p>}
      </div>
    </section>
  ),
};
