import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Roll, T, asset } from "./blocks/shared";

export type Site = {
  brand: string; logo?: string; sectorsLabel: string;
  sectors: { title: string; text: string; href: string }[];
  links: { label: string; href: string }[];
  ctaLabel: string; ctaHref: string;
  footerTagline: string; footerLinks: { label: string; href: string }[];
  legal: string; legalHref?: string;
};

export function SiteNav({ site }: { site: Site }) {
  const [open, setOpen] = useState(false);       // burger (mobile / tablette portrait)
  const [dd, setDd] = useState(false);           // menu déroulant Secteurs (bureau)
  const [compact, setCompact] = useState(false); // on a défilé : le menu se rétracte derrière le nom du studio
  const [peek, setPeek] = useState(false);       // la flèche est survolée : le menu réapparaît
  const ref = useRef<HTMLElement>(null);
  const openRef = useRef(false);
  const peekRef = useRef(false);
  const leaveTimer = useRef<number | undefined>(undefined);
  openRef.current = open;
  peekRef.current = peek;

  // Fermeture animée du menu plein écran (les textes remontent en cascade, puis le panneau s'efface).
  const shut = () => {
    if (!openRef.current) return;
    const items = "#menu .nl-row > a, #menu .dd-btn, #menu .dd-panel li";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(max-width: 1000px)").matches) { setOpen(false); return; }
    gsap.to(items, { y: -34, opacity: 0, duration: 0.22, ease: "power2.in", stagger: { each: 0.025, from: "end" }, overwrite: true });
    gsap.to("#menu", { opacity: 0, duration: 0.26, delay: 0.1, ease: "power1.in", onComplete: () => {
      setOpen(false);
      gsap.set([items, "#menu"], { clearProps: "all" });
    } });
  };
  const shutRef = useRef(shut);
  shutRef.current = shut;

  useEffect(() => {
    const close = () => { shutRef.current(); setDd(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    // Header qui se rétracte : seuil d'entrée plus haut que le seuil de sortie (pas de scintillement).
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact((c) => (c ? y > 60 : y > 160));
      // un nouveau défilement relance la rétractation
      if (peekRef.current && Math.abs(y - lastY) > 6) { setPeek(false); setDd(false); }
      lastY = y;
    };
    onScroll();
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Menu mobile plein écran : on bloque le défilement et les textes apparaissent en cascade.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("menu-open", open);
    const lenis = (window as any).__lenis;
    if (open) {
      lenis?.stop();
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo("#menu .nl-row > a, #menu .dd-btn", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.045, delay: 0.08, clearProps: "transform" });
    } else { lenis?.start(); setDd(false); } // le volet Secteurs se replie à la fermeture du menu
    return () => { html.classList.remove("menu-open"); };
  }, [open]);

  const collapsed = compact && !peek;
  const showMenu = () => { window.clearTimeout(leaveTimer.current); if (compact) setPeek(true); };
  const hideMenu = () => { window.clearTimeout(leaveTimer.current); leaveTimer.current = window.setTimeout(() => { setPeek(false); setDd(false); }, 650); };

  return (
    <header className={`nav ${compact ? "is-compact" : ""} ${collapsed ? "is-collapsed" : ""}`} ref={ref} onPointerLeave={hideMenu} onPointerEnter={() => window.clearTimeout(leaveTimer.current)}>
      <a className="brand" href="/">
        {site.logo ? <img src={asset(site.logo)} alt={site.brand.replace(/[\[\]]/g, "")} height={32} /> : <T>{site.brand}</T>}
      </a>
      <button className="nav-peek" aria-label="Afficher le menu" aria-expanded={!collapsed} tabIndex={compact ? 0 : -1}
        onPointerEnter={showMenu} onFocus={showMenu} onClick={() => (peek ? setPeek(false) : showMenu())}>
        <span aria-hidden="true">›</span>
      </button>
      <button className="burger" aria-label="Menu" aria-expanded={open} aria-controls="menu" onClick={() => (open ? shut() : setOpen(true))}>
        <span /><span /><span />
      </button>
      <nav id="menu" className={open ? "open" : ""} aria-label="Navigation principale" data-lenis-prevent>
        <div className="nav-links">
          <div className="nl-clip">
            <div className="nl-row">
              {(site.sectors ?? []).length > 0 && (
                <div className={`dd ${dd ? "dd-open" : ""}`}>
                  <button className="dd-btn" aria-expanded={dd} onClick={() => setDd(!dd)}><Roll>{site.sectorsLabel}</Roll><span className="chev" aria-hidden="true" /></button>
                  <ul className="dd-panel">
                    {site.sectors.map((s) => (<li key={s.href}><a href={s.href}><strong>{s.title}</strong><small>{s.text}</small></a></li>))}
                  </ul>
                </div>
              )}
              {(site.links ?? []).map((l) => <a key={l.href} href={l.href}><Roll>{l.label}</Roll></a>)}
            </div>
          </div>
        </div>
        {site.ctaLabel && <a className="btn btn-primary" href={site.ctaHref}>{site.ctaLabel}</a>}
      </nav>
    </header>
  );
}

export function SiteFooter({ site }: { site: Site }) {
  return (
    <footer className="site-foot">
      <div><strong><T>{site.brand}</T></strong><p><T>{site.footerTagline}</T></p></div>
      <div><h4>{site.sectorsLabel}</h4><ul>{(site.sectors ?? []).map((s) => <li key={s.href}><a href={s.href}>{s.title}</a></li>)}</ul></div>
      <div>
        <h4>Le studio</h4>
        <ul>
          {(site.footerLinks ?? []).map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          {site.legal && <li>{site.legalHref ? <a href={site.legalHref}><T>{site.legal}</T></a> : <T>{site.legal}</T>}</li>}
        </ul>
      </div>
    </footer>
  );
}
