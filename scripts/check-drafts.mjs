// Bloque `npm run build` tant qu'il reste du contenu inventé ou des valeurs d'exemple.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith(".json") ? [p] : [];
});
let drafts = 0, examples = 0, pending = 0;
for (const f of walk("src/data")) {
  const s = readFileSync(f, "utf8");
  const d = (s.match(/\[\[/g) || []).length;
  const e = (s.match(/VOTRE_CLE|example\.com|contact@votre-domaine|votre-profil/g) || []).length;
  const p = (s.match(/"status": "attente"/g) || []).length;
  if (d || e || p) console.log(`${f} : ${d} passage(s) [[inventé]], ${e} valeur(s) d’exemple, ${p} projet(s) en attente`);
  drafts += d; examples += e; pending += p;
}
if (drafts + examples > 0) {
  console.error(`\nBuild bloqué : ${drafts} passage(s) inventé(s) et ${examples} valeur(s) d’exemple à remplacer.`);
  console.error("Pour générer un brouillon quand même : npm run build:draft");
  process.exit(1);
}
if (pending) console.warn(`\nAttention : ${pending} projet(s) « en attente » restent visibles.`);
