// Palette du site : chaque couleur est une variable CSS (--c-…) modifiable depuis l'éditeur (page « site »).
// Le dégradé et toutes les teintes du site sont construits à partir de ces variables.
export const PALETTE = [
  { key: "cadre", label: "Cadre et menu : le plus sombre", def: "#0a1d28" },
  { key: "sombre", label: "Tuiles sombres (et fin du bandeau)", def: "#0f2a39" },
  { key: "profond", label: "Dégradé 4/4 : bleu profond (bas du dégradé)", def: "#1d4357" },
  { key: "moyen", label: "Dégradé 3/4 : bleu moyen", def: "#5b8ea6" },
  { key: "doux", label: "Dégradé 2/4 : bleu doux", def: "#a9c9d8" },
  { key: "clair", label: "Tuiles claires (le dégradé commence par une version éclaircie)", def: "#d5e6ee" },
  { key: "encre", label: "Texte sur fond clair", def: "#0c2230" },
  { key: "texte", label: "Texte sur fond sombre", def: "#eaf4f8" },
  { key: "accent-clair", label: "Couleur d’accent sur fond clair", def: "#2c6a85" },
  { key: "accent-sombre", label: "Couleur d’accent sur fond sombre", def: "#8cc7da" },
] as const;

export const DEFAULT_PALETTE: Record<string, string> = Object.fromEntries(PALETTE.map((p) => [p.key, p.def]));
export const DEFAULT_ANGLE = 158;

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Variables CSS à poser (uniquement celles qui diffèrent d'une valeur valide : une saisie incorrecte est ignorée). */
export function themeVars(props: any): Record<string, string> {
  const out: Record<string, string> = {};
  const pal = (props && props.palette) || {};
  for (const { key } of PALETTE) {
    const v = typeof pal[key] === "string" ? pal[key].trim() : "";
    if (HEX.test(v)) out[`--c-${key}`] = v;
  }
  const a = Number(props?.gradientAngle);
  if (Number.isFinite(a)) out["--grad-angle"] = `${Math.max(0, Math.min(360, a))}deg`;
  return out;
}

export const themeStyleString = (props: any) =>
  Object.entries(themeVars(props)).map(([k, v]) => `${k}:${v}`).join(";");
