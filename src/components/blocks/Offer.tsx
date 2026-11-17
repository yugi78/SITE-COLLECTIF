import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type P = { title: string; lead: string; items: { title: string; text: string; points: string }[]; args: { label: string }[] };

export const Offer: ComponentConfig<P> = {
  label: "Ce que nous produisons (3 points + arguments)",
  fields: {
    title: { type: "text" }, lead: { type: "textarea" },
    items: { type: "array", label: "Productions", arrayFields: { title: { type: "text" }, text: { type: "textarea" }, points: { type: "text", label: "Points clés (séparés par des virgules)" } }, getItemSummary: (i: any) => i.title },
    args: { type: "array", label: "Arguments clés", arrayFields: { label: { type: "text" } }, getItemSummary: (i: any) => i.label },
  } as any,
  defaultProps: { title: "Ce que nous produisons", lead: "", items: [], args: [] },
  render: ({ title, lead, items, args }) => (
    <section id="offre">
      <div className="wrap">
        <h2>{title}</h2>
        {lead && <p className="lead"><T>{lead}</T></p>}
        <div className="offer">
          {(items ?? []).map((it, i) => (
            <div key={i}>
              <span className="num">{i + 1}</span>
              <h3>{it.title}</h3>
              <p><T>{it.text}</T></p>
              <ul className="chips">{(it.points ?? "").split(",").filter((c) => c.trim()).map((c, j) => <li key={j}>{c.trim()}</li>)}</ul>
            </div>
          ))}
        </div>
        <ul className="args">{(args ?? []).map((a, i) => <li key={i}>{a.label}</li>)}</ul>
      </div>
    </section>
  ),
};
