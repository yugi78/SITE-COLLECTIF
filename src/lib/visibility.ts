// Retire les blocs et les éléments de liste masqués (« hidden: true ») avant de transmettre la page au navigateur.
// Sans ça, leur texte resterait lisible dans le code source : Astro sérialise toutes les données de la page pour l'hydratation React.
const isHidden = (x: any) => x && typeof x === "object" && x.hidden === true;

function stripProps(props: any) {
  if (!props || typeof props !== "object") return props;
  const out: any = {};
  for (const [k, v] of Object.entries(props)) out[k] = Array.isArray(v) ? v.filter((it) => !isHidden(it)) : v;
  return out;
}

const stripBlocks = (blocks: any[] = []) => blocks.filter((b) => !isHidden(b?.props)).map((b) => ({ ...b, props: stripProps(b.props) }));

export function stripHidden<T = any>(data: any): T {
  if (!data) return data;
  const zones = Object.fromEntries(Object.entries(data.zones ?? {}).map(([k, v]) => [k, stripBlocks(v as any[])]));
  return { ...data, content: stripBlocks(data.content), zones } as T;
}
