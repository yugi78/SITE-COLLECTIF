import type { ComponentConfig } from "@measured/puck";
import { Slot, T, mediaFields } from "./shared";

type P = {
  title: string; text: string; principle: string;
  members: { name: string; role: string; text: string; placeholder: string; src: string }[];
  networkTitle: string; networkText: string; network: { title: string; text: string }[];
  badges: string; coverage: string;
};

export const About: ComponentConfig<P> = {
  label: "Qui sommes-nous (fondateurs + réseau d’experts)",
  fields: {
    title: { type: "text" }, text: { type: "textarea" }, principle: { type: "textarea", label: "Phrase d’engagement" },
    members: {
      type: "array", label: "Fondateurs (fiches avec photo)",
      arrayFields: { name: { type: "text", label: "Nom" }, role: { type: "text", label: "Rôle" }, text: { type: "textarea" }, ...mediaFields },
      getItemSummary: (i: any) => i.name,
    },
    networkTitle: { type: "text", label: "Réseau d’experts : titre" },
    networkText: { type: "textarea", label: "Réseau d’experts : introduction" },
    network: {
      type: "array", label: "Réseau d’experts : métiers",
      arrayFields: { title: { type: "text", label: "Métier" }, text: { type: "textarea" } },
      getItemSummary: (i: any) => i.title,
    },
    badges: { type: "text", label: "Certifications et garanties (séparées par des virgules)" },
    coverage: { type: "textarea", label: "Zone d’intervention" },
  } as any,
  defaultProps: { title: "Qui sommes-nous ?", text: "", principle: "", members: [], networkTitle: "", networkText: "", network: [], badges: "", coverage: "" },
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
        {(p.networkTitle || (p.network ?? []).length > 0) && (
          <div className="network">
            {p.networkTitle && <h3 className="network-title">{p.networkTitle}</h3>}
            {p.networkText && <p className="lead"><T>{p.networkText}</T></p>}
            <div className="feats">
              {(p.network ?? []).map((n, i) => (<div className="feat" key={i}><h3>{n.title}</h3><p><T>{n.text}</T></p></div>))}
            </div>
          </div>
        )}
        {p.principle && <blockquote><T>{p.principle}</T></blockquote>}
        <ul className="chips" style={{ marginTop: 24 }}>{(p.badges ?? "").split(",").filter((b) => b.trim()).map((b, i) => <li key={i}><T>{b.trim()}</T></li>)}</ul>
        {p.coverage && <p className="note"><T>{p.coverage}</T></p>}
      </div>
    </section>
  ),
};
