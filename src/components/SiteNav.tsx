const LINKS: [string, string][] = [
  ["Patrimoine", "/patrimoine"], ["Domaines", "/domaines"], ["Immobilier", "/immobilier"],
  ["Événementiel", "/evenementiel"], ["Objets", "/objets"], ["Garanties", "/garanties"],
];

export function SiteNav() {
  return (
    <header className="nav">
      <a className="brand todo" href="/">Nom du studio</a>
      <nav aria-label="Navigation principale">
        {LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        <a className="btn btn-primary" href="/contact">Estimer un projet</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="site-foot"><span className="todo">Nom du studio</span> · Studio de numérisation spatiale &amp; valorisation 3D · Mentions légales (à venir)</footer>;
}
