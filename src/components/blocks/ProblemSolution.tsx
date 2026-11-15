import type { ComponentConfig } from "@measured/puck";
import { T } from "./shared";

type Row = { problem: string; solution: string; proof: string; href: string; status: "ok" | "attente" };
type P = { title: string; rows: Row[] };

export const ProblemSolution: ComponentConfig<P> = {
  label: "Problème → solution → preuve",
  fields: {
    title: { type: "text" },
    rows: {
      type: "array", label: "Lignes",
      arrayFields: {
        problem: { type: "textarea", label: "Ce que dit le client" }, solution: { type: "textarea", label: "Ce que nous faisons" },
        proof: { type: "text", label: "La preuve" }, href: { type: "text", label: "Lien de la preuve (optionnel)" },
        status: { type: "radio", label: "Preuve", options: [{ label: "Disponible", value: "ok" }, { label: "En attente", value: "attente" }] },
      },
      getItemSummary: (i: any) => i.problem?.slice(0, 40),
    },
  } as any,
  defaultProps: { title: "Ce que vous nous dites, ce que nous faisons", rows: [] },
  render: ({ title, rows }) => (
    <section className="bg2">
      <div className="wrap">
        <h2>{title}</h2>
        <div className="ps">
          {(rows ?? []).map((r, i) => (
            <div className="ps-row" key={i}>
              <div><i>Ce que nous entendons</i><p className="said">« <T>{r.problem}</T> »</p></div>
              <div><i>Ce que nous faisons</i><p><T>{r.solution}</T></p></div>
              <div className={`proof ${r.status === "attente" ? "wait" : ""}`}>
                <i>La preuve</i>
                {r.href && r.status !== "attente" ? <a href={r.href}>{r.proof} →</a> : <p><T>{r.proof}</T></p>}
                {r.status === "attente" && <span className="badge">En attente</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
