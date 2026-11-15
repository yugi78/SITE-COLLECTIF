import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type P = {
  eyebrow: string; title: string; intro: string; placeholder: string; src: string;
  context: string; approach: string; delay: string;
  features: { title: string; forPlace: string; forVisitor: string }[];
  moments: { title: string; text: string }[];
};

export const CaseStudy: ComponentConfig<P> = {
  label: "Étude de cas détaillée",
  fields: {
    eyebrow: { type: "text", label: "Surtitre" }, title: { type: "textarea" }, intro: { type: "textarea", label: "Introduction" },
    ...mediaFields,
    context: { type: "textarea", label: "Le contexte" }, approach: { type: "textarea", label: "L’approche" }, delay: { type: "textarea", label: "Le délai" },
    features: {
      type: "array", label: "Ce que la démo permet",
      arrayFields: { title: { type: "text" }, forPlace: { type: "textarea", label: "Pour le lieu" }, forVisitor: { type: "textarea", label: "Pour le visiteur / l’organisateur" } },
      getItemSummary: (i: any) => i.title,
    },
    moments: { type: "array", label: "Trois moments d’usage", arrayFields: { title: { type: "text" }, text: { type: "textarea" } }, getItemSummary: (i: any) => i.title },
  } as any,
  defaultProps: {
    eyebrow: "Étude de cas", title: "Château de Guermantes : 80 hectares, à parcourir depuis un lien",
    intro: "Le parc et ses abords numérisés pour se visiter, se préparer et se présenter à distance.",
    placeholder: "Démo interactive : Château de Guermantes", src: "",
    context: "", approach: "", delay: "", features: [], moments: [],
  },
  render: (p) => (
    <section className="bg2" id="etude-de-cas">
      <div className="wrap">
        <span className="eyebrow">{p.eyebrow}</span>
        <h2><T>{p.title}</T></h2>
        <p className="lead"><T>{p.intro}</T></p>
        <Slot className="r169" placeholder={p.placeholder} src={p.src} />
        <div className="case-grid">
          <div><h3>Le contexte</h3><p><T>{p.context}</T></p></div>
          <div><h3>L’approche</h3><p><T>{p.approach}</T></p></div>
          <div><h3>Le délai</h3><p><T>{p.delay}</T></p></div>
        </div>
        <div className="feats">
          {(p.features ?? []).map((f, i) => (
            <div className="feat" key={i}>
              <h3>{f.title}</h3>
              <p><i>Pour le lieu</i><T>{f.forPlace}</T></p>
              <p><i>Pour le visiteur</i><T>{f.forVisitor}</T></p>
            </div>
          ))}
        </div>
        <div className="moments">
          {(p.moments ?? []).map((m, i) => (<div key={i}><h3>{m.title}</h3><p><T>{m.text}</T></p></div>))}
        </div>
      </div>
    </section>
  ),
};
