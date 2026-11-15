import type { ComponentConfig } from "@measured/puck";
import { Slot, mediaFields } from "./shared";

type P = { label: string; text: string; placeholder: string; src: string };

export const Placeholder: ComponentConfig<P> = {
  label: "Bloc vide « en attente »",
  fields: { label: { type: "text", label: "Étiquette" }, text: { type: "textarea" }, ...mediaFields } as any,
  defaultProps: { label: "Projet en attente", text: "", placeholder: "Contenu à venir", src: "" },
  render: (p) => (
    <section>
      <div className="wrap">
        <span className="badge">{p.label}</span>
        <Slot className="r169" placeholder={p.placeholder} src={p.src} />
        {p.text && <p className="note">{p.text}</p>}
      </div>
    </section>
  ),
};
