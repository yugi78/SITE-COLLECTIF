import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = (() => { try { return window.sessionStorage; } catch { return null; } })();
const loader = document.getElementById("loader");
const cover = document.getElementById("pt");

/* Rythme général : vif. Entrées 0.6–0.9 s, décalage 0.06 s, sorties 0.3 s. */
const EASE = "power3.out";

/* ---------- 1. attendre que React ait hydraté le contenu Puck ---------- */
function hydrated(): Promise<void> {
  return new Promise((res) => {
    const t0 = performance.now();
    const tick = () => {
      if (performance.now() - t0 > 4000) return res();
      // Astro retire « ssr » au lancement de l'hydratation ; React termine un peu après : marge avant de toucher au DOM.
      if (!document.querySelector("astro-island[ssr]")) setTimeout(() => requestAnimationFrame(() => res()), 350);
      else requestAnimationFrame(tick);
    };
    tick();
  });
}
const loaded = () => new Promise<void>((res) => (document.readyState === "complete" ? res() : addEventListener("load", () => res(), { once: true })));

/* ---------- 2. défilement fluide ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 3), anchors: { offset: -16 } } as any);
  (window as any).__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- 3. écran de chargement : le nom se remplit de gauche à droite ---------- */
function runLoader(): Promise<void> {
  if (!loader || !root.classList.contains("has-loader")) return Promise.resolve();
  lenis?.stop();
  const fill = loader.querySelector<HTMLElement>(".ld-fill")!;
  const pct = loader.querySelector<HTMLElement>(".ld-pct")!;
  const state = { p: 0 };
  const render = () => {
    fill.style.clipPath = `inset(0 ${100 - state.p}% 0 0)`;
    pct.textContent = Math.round(state.p) + "%";
  };
  return new Promise((res) => {
    // Avance jusqu'à 90 % en 1.1 s, puis termine dès que la page est réellement prête.
    const tl = gsap.timeline({ onUpdate: render });
    tl.to(state, { p: 90, duration: 1.1, ease: "power2.out" });
    // durée minimale : on laisse l'animation du nom se jouer au moins 1.3 s
    const minTime = new Promise<void>((r) => setTimeout(r, 1300));
    Promise.all([loaded(), hydrated(), minTime]).then(() => {
      tl.kill();
      gsap.to(state, {
        p: 100, duration: 0.4, ease: "power1.inOut", onUpdate: render,
        onComplete: () => {
          gsap.to(".ld-name,.ld-pct", { y: -24, opacity: 0, duration: 0.4, ease: "power2.in" });
          gsap.to(loader, {
            opacity: 0, duration: 0.55, delay: 0.25, ease: "power1.inOut",
            onComplete: () => { loader.style.display = "none"; root.classList.remove("has-loader"); lenis?.start(); store?.setItem("intro-done", "1"); res(); },
          });
        },
      });
    });
  });
}

/* ---------- 4. transitions entre pages : voile qui monte / redescend ---------- */
function leave(href: string) {
  if (!cover || reduce) { location.href = href; return; }
  store?.setItem("pt", "1");
  lenis?.stop();
  gsap.set(cover, { display: "block", yPercent: 100, opacity: 1 });
  gsap.to(cover, { yPercent: 0, duration: 0.45, ease: "power3.inOut", onComplete: () => { location.href = href; } });
}
document.addEventListener("click", (e) => {
  const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (a.target && a.target !== "_self") return;
  if (a.hasAttribute("download")) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin) return;
  if (u.pathname === location.pathname && u.search === location.search) return; // ancre : défilement fluide (Lenis)
  e.preventDefault();
  leave(u.href);
});
addEventListener("pageshow", (e) => {
  if ((e as PageTransitionEvent).persisted && cover) { gsap.set(cover, { display: "none" }); root.classList.remove("pt-in"); lenis?.start(); }
});
function runReveal(): Promise<void> {
  if (!cover || !root.classList.contains("pt-in")) return Promise.resolve();
  return new Promise((res) => {
    store?.removeItem("pt");
    Promise.all([loaded(), hydrated()]).then(() => {
      gsap.to(cover, { yPercent: -100, duration: 0.55, ease: "power3.inOut", onComplete: () => { gsap.set(cover, { display: "none" }); root.classList.remove("pt-in"); res(); } });
      setTimeout(res, 250); // les animations d'entrée démarrent pendant que le voile finit de monter
    });
  });
}

/* ---------- 5. apparitions au scroll ---------- */
const SPLIT = ".hero h1,.hero-card p,section h2,section .lead,.band p,.pb h3,.offer h3,.ps-row .said";
const GROUPS = [
  ".offer>div", ".card", ".proj", ".stat", ".step", ".ps-row", ".feat", ".plan", ".quotes blockquote", ".ctl-list li", ".gains>div",
  ".member", ".cmp", ".crit>div", "details", ".args li", ".tag", ".case-grid>div", ".moments>div", ".site-foot>div",
];

let heroTl: gsap.core.Timeline | null = null;
function setup() {
  if (reduce) return;
  heroTl = gsap.timeline({ paused: true });
  // titres : montée ligne par ligne
  document.querySelectorAll<HTMLElement>(SPLIT).forEach((el) => {
    if (el.closest(".nav") || el.dataset.split) return;
    el.dataset.split = "1";
    const inHero = !!el.closest(".hero");
    const run = () => {
      const s = SplitText.create(el, { type: "lines", mask: "lines", autoSplit: !inHero, linesClass: "ln",
        onSplit: (self: any) => {
          if (inHero) return heroTl!.from(self.lines, { yPercent: 108, duration: 0.85, ease: EASE, stagger: 0.07 }, 0.15);
          return gsap.from(self.lines, { yPercent: 108, duration: 0.85, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        } });
      return s;
    };
    run();
  });
  // hero : l'image se dévoile, les tuiles arrivent
  heroTl.from(".hero-media", { clipPath: "inset(8% 8% 8% 8% round 40px)", scale: 1.04, duration: 1.1, ease: "power3.out" }, 0)
        .from(".hero-card .chip,.hero-links .row", { y: 24, opacity: 0, duration: 0.7, ease: EASE, stagger: 0.09, clearProps: "transform,opacity" }, 0.25)
        .from(".nav", { y: -24, opacity: 0, duration: 0.7, ease: EASE, clearProps: "transform,opacity" }, 0.1);

  // blocs : fondu + montée, groupés pour un rythme régulier
  GROUPS.forEach((sel) => {
    const els = gsap.utils.toArray<HTMLElement>(sel).filter((el) => !el.closest(".nav"));
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 36 });
    ScrollTrigger.batch(els, {
      start: "top 90%", once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.75, ease: EASE, stagger: 0.07, overwrite: true, clearProps: "transform" }),
    });
  });
  // éléments sobres : simple fondu
  gsap.utils.toArray<HTMLElement>(".note,.eyebrow,.direct,.channels,.pilot,.badge,form,.chips,.duo .compare,.control>div:last-child,.band-in .cta").forEach((el) => {
    if (el.closest(".hero,.nav")) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  // médias : léger zoom-out parallaxe à l'entrée (rapide, sans effet permanent)
  gsap.utils.toArray<HTMLElement>(".card .portfolio-media-slot,.proj .portfolio-media-slot,.step .portfolio-media-slot").forEach((el) => {
    gsap.from(el, { clipPath: "inset(0 0 22% 0 round 24px)", duration: 0.9, ease: EASE, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });

  /* ---------- parallaxe par couches : on décale les éléments à l'intérieur des tuiles ----------
     Gros titre = grand décalage, paragraphe = petit décalage ; les éléments d'une même rangée partagent la même valeur. */
  const k = innerWidth < 1000 ? 0.55 : 1;
  const done = new WeakSet<Element>();
  const layer = (els: Element[], amp: number, trigger: Element, from = "top bottom", centered = true) => {
    const list = els.filter((e) => !done.has(e)) as HTMLElement[];
    if (!list.length) return;
    list.forEach((e) => { done.add(e); e.setAttribute("data-px", ""); });
    ScrollTrigger.create({ trigger, start: from, end: centered ? "bottom top" : "bottom top", onUpdate: (st) => {
      const v = ((centered ? st.progress - 0.5 : st.progress) * amp * k).toFixed(1) + "px";
      list.forEach((e) => e.style.setProperty("--py", v));
    } });
  };

  // hero : titre et texte glissent à des vitesses différentes (pas les boutons) ; la colonne de gauche se rétrécit
  const heroEl = document.querySelector<HTMLElement>(".hero");
  if (heroEl) {
    layer([...heroEl.querySelectorAll(".hero-card h1")], 90, heroEl, "top top", false);
    layer([...heroEl.querySelectorAll(".hero-card p")], 46, heroEl, "top top", false);
    ScrollTrigger.create({ trigger: heroEl, start: "top top", end: "bottom top", onUpdate: (st) => heroEl.style.setProperty("--hx", st.progress.toFixed(3)) });
  }

  // tuiles : leur hauteur augmente légèrement en arrivant dans l'écran (l'écart entre tuiles ne change pas)
  const secs = [...document.querySelectorAll<HTMLElement>("section")];
  ScrollTrigger.addEventListener("refreshInit", () => secs.forEach((s) => s.style.setProperty("--g", "0px")));
  secs.forEach((sec) => {
    ScrollTrigger.create({ trigger: sec, start: "top bottom", end: "top 35%", onUpdate: (st) => sec.style.setProperty("--g", (-(1 - st.progress) * 34 * k).toFixed(1) + "px") });
  });

  // sections : titres (grand décalage), petit texte et introductions (décalage moyen)
  secs.forEach((sec) => {
    layer([...sec.querySelectorAll("h2")], 100, sec);
    layer([...sec.querySelectorAll(".eyebrow")], 76, sec);
    layer([...sec.querySelectorAll(".lead, .band p, h2 + p")], 52, sec);
  });

  // images : léger mouvement à l'intérieur de leur cadre
  document.querySelectorAll<HTMLElement>(".portfolio-media-slot.filled").forEach((slot) => {
    const img = slot.querySelector<HTMLElement>("img"); if (!img) return;
    ScrollTrigger.create({ trigger: slot, start: "top bottom", end: "bottom top", onUpdate: (st) => img.style.setProperty("--pyp", ((st.progress - 0.5) * 9).toFixed(1) + "%") });
  });
  ScrollTrigger.refresh();
}

/* ---------- 6. rebond au toucher ---------- */
const TOUCH = ".btn,.row,.burger,.bar a,.more,.nav nav a:not(.dd-btn)";
const SOFT = ".card,.proj";
let pressed: HTMLElement | null = null;
function down(e: Event) {
  const el = (e.target as Element).closest?.(`${TOUCH},${SOFT}`) as HTMLElement | null;
  if (!el || !el.closest(".site")) return;
  pressed = el;
  gsap.to(el, { scale: el.matches(SOFT) ? 0.985 : 0.92, duration: 0.12, ease: "power2.out", overwrite: "auto" });
}
function up() {
  if (!pressed) return;
  const el = pressed; pressed = null;
  gsap.to(el, { scale: 1, duration: 0.7, ease: "elastic.out(1,0.38)", overwrite: "auto" });
}
if (!reduce) {
  document.addEventListener("pointerdown", down, { passive: true });
  ["pointerup", "pointercancel", "pointerleave", "dragstart"].forEach((n) => document.addEventListener(n, up, { passive: true }));
}

/* ---------- 8. FAQ : déroulement animé (au lieu d'un rebond) ---------- */
document.addEventListener("click", (e) => {
  const sum = (e.target as Element | null)?.closest?.("summary") as HTMLElement | null;
  const d = sum?.parentElement as HTMLDetailsElement | null;
  if (!sum || !d || d.tagName !== "DETAILS" || !sum.closest(".site")) return;
  e.preventDefault();
  if (reduce) { d.open = !d.open; return; }
  if (d.dataset.anim) return;
  d.dataset.anim = "1";
  const content = [...d.children].filter((c) => c !== sum) as HTMLElement[];
  const end = () => { gsap.set(content, { clearProps: "height,overflow,opacity" }); delete d.dataset.anim; ScrollTrigger.refresh(); };
  if (!d.open) {
    d.open = true;
    gsap.fromTo(content, { height: 0, opacity: 0, overflow: "hidden" }, { height: "auto", opacity: 1, duration: 0.55, ease: "power3.out", onComplete: end });
  } else {
    d.classList.add("closing");
    gsap.to(content, { height: 0, opacity: 0, overflow: "hidden", duration: 0.38, ease: "power2.inOut", onComplete: () => { d.open = false; d.classList.remove("closing"); end(); } });
  }
});

/* ---------- séquence de démarrage ---------- */
(async () => {
  await Promise.all([loaded(), hydrated()]);
  setup();
  // Les animations d'entrée de la page démarrent derrière le voile, puis on le retire.
  await runLoader();
  await runReveal();
  heroTl?.play();
  ScrollTrigger.refresh();
})();
