import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type P = { title: string; items: { text: string; author: string }[] };

export const Quotes: ComponentConfig<P> = {
  label: "Témoignages clients",
  fields: {
    title: { type: "text" },
    items: { type: "array", label: "Témoignages", arrayFields: { text: { type: "textarea", label: "Citation ([[inventé]] pour surligner)" }, author: { type: "text", label: "Auteur, fonction, lieu" } }, getItemSummary: (i: any) => i.author },
  } as any,
  defaultProps: { title: "Ce qu’en disent nos clients", items: [] },
  render: ({ title, items }) => (
    <section>
      <div className="wrap">
        <h2>{title}</h2>
        <div className="quotes">
          {(items ?? []).map((q, i) => (<blockquote key={i}><T>{q.text}</T><footer><T>{q.author}</T></footer></blockquote>))}
        </div>
      </div>
    </section>
  ),
};
