const IMG = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i;

/** Texte avec [[passages inventés]] surlignés en pointillé doré, à remplacer par vos vraies infos. */
export const T = ({ children }: { children?: string }) => (
  <>
    {(children ?? "").split(/\[\[(.*?)\]\]/g).map((s, i) =>
      i % 2 ? <span className="todo" key={i}>{s}</span> : s
    )}
  </>
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
