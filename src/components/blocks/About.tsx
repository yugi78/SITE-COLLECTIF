import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type P = { title: string; text: string; principle: string; members: { name: string; role: string; text: string; placeholder: string; src: string }[]; badges: string; coverage: string };

export const About: ComponentConfig<P> = {
  label: "Qui sommes-nous (binôme)",
  fields: {
    title: { type: "text" }, text: { type: "textarea" }, principle: { type: "textarea", label: "Phrase d’engagement" },
    members: {
      type: "array", label: "Membres du binôme",
      arrayFields: { name: { type: "text", label: "Nom" }, role: { type: "text", label: "Rôle" }, text: { type: "textarea" }, ...mediaFields },
      getItemSummary: (i: any) => i.name,
    },
    badges: { type: "text", label: "Certifications et garanties (séparées par des virgules)" },
    coverage: { type: "textarea", label: "Zone d’intervention" },
  } as any,
  defaultProps: { title: "Qui sommes-nous ?", text: "", principle: "", members: [], badges: "", coverage: "" },
  render: (p) => (
    <section id="equipe" className="dark">
      <div className="wrap">
        <h2>{p.title}</h2>
        <p className="lead"><T>{p.text}</T></p>
        <div className="members">
          {(p.members ?? []).map((m, i) => (
            <div className="member" key={i}>
              <Slot className="avatar" placeholder={m.placeholder} src={m.src} />
              <div><h3><T>{m.name}</T></h3><em>{m.role}</em><p><T>{m.text}</T></p></div>
            </div>
          ))}
        </div>
        {p.principle && <blockquote><T>{p.principle}</T></blockquote>}
        <ul className="chips" style={{ marginTop: 24 }}>{(p.badges ?? "").split(",").filter((b) => b.trim()).map((b, i) => <li key={i}><T>{b.trim()}</T></li>)}</ul>
        {p.coverage && <p className="note"><T>{p.coverage}</T></p>}
      </div>
    </section>
  ),
};
