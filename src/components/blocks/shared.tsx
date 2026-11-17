const IMG = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i;

/** Texte avec [[passages inventés]] surlignés en pointillé doré, à remplacer par vos vraies infos. */
export const T = ({ children }: { children?: string }) => (
  <>
    {(children ?? "").split(/\[\[(.*?)\]\]/g).map((s, i) =>
      i % 2 ? <span className="todo" key={i}>{s}</span> : s
    )}
  </>
);

/** Texte « roulant » : au survol du lien ou du bouton parent, le texte part vers le haut et sa copie monte prendre sa place. */
export const Roll = ({ children }: { children?: string }) => (
  <span className="roll"><span data-t={(children ?? "").replace(/\[\[|\]\]/g, "")}><T>{children}</T></span></span>
);

/** Flèche simple : au survol du lien parent, elle glisse légèrement (voir CSS). */
export const Arrow = ({ dir = "right" }: { dir?: "right" | "down" }) => (
  <i className={`ar ar-${dir}`} aria-hidden="true">{dir === "down" ? "↓" : "→"}</i>
);

/** Conteneur média : placeholder pointillé, ou image / iframe interactive si une URL est renseignée. */
export const Slot = ({ placeholder, src, className = "" }: { placeholder?: string; src?: string; className?: string }) => (
  <div className={`portfolio-media-slot ${src ? "filled" : ""} ${className}`} data-placeholder={placeholder}>
    {src &&
      (IMG.test(src) ? (
        <img src={src} alt={placeholder ?? ""} loading="lazy" />
      ) : (
        <iframe className="interactive-preview-slot" src={src} title={placeholder ?? "Démo interactive"} loading="lazy" allowFullScreen />
      ))}
  </div>
);

export const mediaFields = {
  placeholder: { type: "text", label: "Texte du placeholder" },
  src: { type: "text", label: "Image ou iframe (URL, vide = placeholder)" },
} as const;
