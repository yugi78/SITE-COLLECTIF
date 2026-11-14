import { useRef, useState } from "react";
import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type Proj = { cat: string; place: string; name: string; text: string; value: string; placeholder: string; src: string };
type P = { title: string; lead: string; tags: { label: string; key: string }[]; projects: Proj[]; gains: { title: string; text: string }[] };

function View({ title, lead, tags, projects, gains }: P) {
  const [f, setF] = useState("all");
  const rail = useRef<HTMLDivElement>(null);
  const pick = (k: string) => { setF(k); rail.current?.scrollTo({ left: 0 }); };
  return (
    <section id="projets">
      <div className="wrap">
        <h2>{title}</h2>
        <p className="lead">{lead}</p>
        <div className="tags" role="group" aria-label="Pour qui ?">
          {[{ label: "Tous", key: "all" }, ...(tags ?? [])].map((t) => (
            <button key={t.key} className="tag" aria-pressed={f === t.key} onClick={() => pick(t.key)}>{t.label}</button>
          ))}
        </div>
      </div>
      <div className="rail" tabIndex={0} aria-label="Projets" ref={rail}>
        {(projects ?? []).filter((p) => f === "all" || p.cat.split(" ").includes(f)).map((p, i) => (
          <article className="proj" key={i}>
            <Slot className="r43" placeholder={p.placeholder} src={p.src} />
            <div className="pb">
              <em>{p.place}</em>
              <h3>{p.name}</h3>
              <p><T>{p.text}</T></p>
              <b>{p.value}</b>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap">
        <div className="gains">
          {(gains ?? []).map((g, i) => (<div key={i}><h3>{g.title}</h3><p>{g.text}</p></div>))}
        </div>
      </div>
    </section>
  );
}

export const ProjectsRail: ComponentConfig<P> = {
  label: "2 · Univers + réalisations",
  fields: {
    title: { type: "text", label: "Titre" },
    lead: { type: "textarea", label: "Texte d’intro" },
    tags: {
      type: "array", label: "Filtres « Pour qui ? »",
      arrayFields: { label: { type: "text", label: "Libellé" }, key: { type: "text", label: "Clé (sans espace)" } },
      getItemSummary: (i: any) => i.label,
    },
    projects: {
      type: "array", label: "Projets",
      arrayFields: {
        cat: { type: "text", label: "Clés des filtres (séparées par un espace)" },
        place: { type: "text", label: "Lieu" },
        name: { type: "text", label: "Nom" },
        text: { type: "textarea", label: "Description ([[inventé]] pour surligner)" },
        value: { type: "text", label: "Chiffre mis en avant" },
        ...mediaFields,
      },
      getItemSummary: (i: any) => i.name,
    },
    gains: {
      type: "array", label: "Bénéfices",
      arrayFields: { title: { type: "text" }, text: { type: "textarea" } },
      getItemSummary: (i: any) => i.title,
    },
  } as any,
  defaultProps: { title: "Des lieux réels, des résultats concrets", lead: "", tags: [], projects: [], gains: [] },
  render: (p) => <View {...p} />,
};
