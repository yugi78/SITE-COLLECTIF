import type { ComponentConfig } from "@measured/puck";

type P = { text: string; label: string; href: string };

export const StickyBar: ComponentConfig<P> = {
  label: "8 · Barre d’appel fixe",
  fields: { text: { type: "text" }, label: { type: "text", label: "Texte du bouton" }, href: { type: "text", label: "Lien" } } as any,
  defaultProps: { text: "Un lieu à valoriser ?", label: "Estimer un projet", href: "#contact" },
  render: (p) => (
    <div className="bar"><span>{p.text}</span><a className="btn btn-primary" href={p.href}>{p.label}</a></div>
  ),
};
