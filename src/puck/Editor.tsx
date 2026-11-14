import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import config from "./config";
import initial from "../data/page.json";

export default function Editor() {
  const save = async (data: Data) => {
    const res = await fetch("/__save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert(res.ok ? "Publié dans src/data/page.json" : "Sauvegarde impossible (disponible uniquement avec npm run dev).");
  };
  // iframe désactivée : le CSS du site s'applique directement dans l'aperçu.
  return <Puck config={config} data={initial as Data} onPublish={save} iframe={{ enabled: false }} />;
}
