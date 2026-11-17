import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type P = { title: string; items: { value: string; title: string; text: string }[]; note: string };

export const Stats: ComponentConfig<P> = {
  label: "4 · Chiffres clés",
  fields: {
    title: { type: "text" },
    items: {
      type: "array", label: "Chiffres",
      arrayFields: { value: { type: "text", label: "Chiffre" }, title: { type: "text", label: "Intitulé" }, text: { type: "textarea", label: "Ce que ça change ([[inventé]] pour surligner)" } },
      getItemSummary: (i: any) => i.value,
    },
    note: { type: "text", label: "Note sous le bandeau" },
  } as any,
  defaultProps: { title: "Rapide à capter, léger à diffuser, précis à mesurer", items: [], note: "" },
  render: ({ title, items, note }) => (
    <section className="grad">
      <div className="wrap">
        <h2>{title}</h2>
        <div className="stats">
          {(items ?? []).map((s, i) => (
            <div className="stat" key={i}><b>{s.value}</b><strong>{s.title}</strong><span><T>{s.text}</T></span></div>
          ))}
        </div>
        {note && <p className="note">{note}</p>}
      </div>
    </section>
  ),
};
