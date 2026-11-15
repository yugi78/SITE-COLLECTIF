import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type P = { title: string; items: { q: string; a: string }[] };

export const Faq: ComponentConfig<P> = {
  label: "FAQ",
  fields: {
    title: { type: "text" },
    items: { type: "array", label: "Questions", arrayFields: { q: { type: "text", label: "Question" }, a: { type: "textarea", label: "Réponse" } }, getItemSummary: (i: any) => i.q },
  } as any,
  defaultProps: { title: "Questions fréquentes", items: [] },
  render: ({ title, items }) => (
    <section id="faq">
      <div className="wrap">
        <h2>{title}</h2>
        <div className="faq-list">
          {(items ?? []).map((it, i) => (
            <details key={i}><summary>{it.q}</summary><p><T>{it.a}</T></p></details>
          ))}
        </div>
      </div>
    </section>
  ),
};
