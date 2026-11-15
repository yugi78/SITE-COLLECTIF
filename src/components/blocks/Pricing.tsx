import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type P = { title: string; lead: string; plans: { name: string; price: string; text: string; highlight: "oui" | "non" }[]; criteria: { title: string; text: string }[] };

export const Pricing: ComponentConfig<P> = {
  label: "6 · Tarifs + critères",
  fields: {
    title: { type: "text" }, lead: { type: "textarea", label: "Texte d’intro" },
    plans: {
      type: "array", label: "Formats types",
      arrayFields: {
        name: { type: "text", label: "Nom" }, price: { type: "text", label: "Prix ([[inventé]] pour surligner)" }, text: { type: "textarea" },
        highlight: { type: "radio", label: "Mettre en avant", options: [{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }] },
      },
      getItemSummary: (i: any) => i.name,
    },
    criteria: { type: "array", label: "Critères de chiffrage", arrayFields: { title: { type: "text" }, text: { type: "text" } }, getItemSummary: (i: any) => i.title },
  } as any,
  defaultProps: { title: "Combien coûte un projet ?", lead: "", plans: [], criteria: [] },
  render: ({ title, lead, plans, criteria }) => (
    <section>
      <div className="wrap">
        <h2>{title}</h2>
        <p className="lead"><T>{lead}</T></p>
        <div className="plans">
          {(plans ?? []).map((p, i) => (
            <div className={`plan ${p.highlight === "oui" ? "hl" : ""}`} key={i}>
              <h3>{p.name}</h3><div className="price"><T>{p.price}</T></div><p>{p.text}</p>
            </div>
          ))}
        </div>
        <div className="crit">{(criteria ?? []).map((c, i) => <p key={i}><b>{c.title}</b><br />{c.text}</p>)}</div>
      </div>
    </section>
  ),
};
