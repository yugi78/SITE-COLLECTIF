import { useState, type CSSProperties } from "react";
import type { ComponentConfig } from "@measured/puck";
import { Slot, T } from "./shared";

type P = { title: string; text: string; quote: string; author: string; labelBefore: string; labelAfter: string; phBefore: string; phAfter: string; srcBefore: string; srcAfter: string };

function View(p: P) {
  const [pos, setPos] = useState(50);
  return (
    <section className="dark">
      <div className="wrap duo">
        <div className="compare" style={{ "--p": `${pos}%` } as CSSProperties}>
          <Slot className="a" placeholder={p.phBefore} src={p.srcBefore} />
          <Slot className="b" placeholder={p.phAfter} src={p.srcAfter} />
          <i />
          <label style={{ left: 10 }}>{p.labelBefore}</label>
          <label style={{ right: 10 }}>{p.labelAfter}</label>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Comparer avant et après" />
        </div>
        <div>
          <h2>{p.title}</h2>
          <p>{p.text}</p>
          <blockquote><T>{p.quote}</T><footer><T>{p.author}</T></footer></blockquote>
        </div>
      </div>
    </section>
  );
}

export const BeforeAfter: ComponentConfig<P> = {
  label: "3 · Avant / après + témoignage",
  fields: {
    title: { type: "text" }, text: { type: "textarea", label: "Texte" },
    quote: { type: "textarea", label: "Témoignage" }, author: { type: "text", label: "Auteur du témoignage" },
    labelBefore: { type: "text", label: "Étiquette « avant »" }, labelAfter: { type: "text", label: "Étiquette « après »" },
    phBefore: { type: "text", label: "Placeholder avant" }, srcBefore: { type: "text", label: "Image/iframe avant (URL)" },
    phAfter: { type: "text", label: "Placeholder après" }, srcAfter: { type: "text", label: "Image/iframe après (URL)" },
  } as any,
  defaultProps: {
    title: "Voyez la différence",
    text: "Faites glisser pour passer d’une photo classique à la scène 3D que le visiteur parcourt.",
    quote: "", author: "", labelBefore: "Photo", labelAfter: "3D",
    phBefore: "Photo classique du lieu", phAfter: "Même vue en 3D Gaussian Splatting", srcBefore: "", srcAfter: "",
  },
  render: (p) => <View {...p} />,
};
