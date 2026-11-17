import type { ComponentConfig } from "@measured/puck";
import { Slot, mediaFields } from "./shared";

type P = { title: string; steps: { title: string; text: string; chips: string; placeholder: string; src: string }[] };

export const Method: ComponentConfig<P> = {
  label: "5 · Méthode (frise 3 étapes)",
  fields: {
    title: { type: "text" },
    steps: {
      type: "array", label: "Étapes",
      arrayFields: { title: { type: "text" }, text: { type: "textarea" }, chips: { type: "text", label: "Technologies (séparées par des virgules)" }, ...mediaFields },
      getItemSummary: (i: any) => i.title,
    },
  } as any,
  defaultProps: { title: "Notre méthode en trois étapes", steps: [] },
  render: ({ title, steps }) => (
    <section className="dark">
      <div className="wrap">
        <h2>{title}</h2>
        <div className="steps">
          {(steps ?? []).map((s, i) => (
            <div className="step" key={i}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <Slot className="r169" placeholder={s.placeholder} src={s.src} />
              <ul className="chips">{(s.chips ?? "").split(",").filter((c) => c.trim()).map((c, j) => <li key={j}>{c.trim()}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
