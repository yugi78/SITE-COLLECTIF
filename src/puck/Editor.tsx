import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import config, { siteConfig } from "./config";
import { EditorPath } from "./seoFields";

const files = import.meta.glob("../data/**/*.json", { eager: true }) as Record<string, { default: Data }>;

export default function Editor({ path }: { path: string }) {
  const initial = files[`../data/${path}.json`].default;
  const save = async (data: Data) => {
    const res = await fetch(`/__save?file=${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    alert(res.ok ? `Publié dans src/data/${path}.json` : "Sauvegarde impossible (disponible uniquement avec npm run dev).");
  };
  return (
    <EditorPath.Provider value={path}>
      <Puck config={path === "site" ? siteConfig : config} data={initial} onPublish={save} iframe={{ enabled: false }} />
    </EditorPath.Provider>
  );
}
