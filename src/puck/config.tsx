import type { Config } from "@measured/puck";
import { Hero } from "../components/blocks/Hero";
import { ProjectsRail } from "../components/blocks/ProjectsRail";
import { BeforeAfter } from "../components/blocks/BeforeAfter";
import { Stats } from "../components/blocks/Stats";
import { Method } from "../components/blocks/Method";
import { Pricing } from "../components/blocks/Pricing";
import { Contact } from "../components/blocks/Contact";
import { StickyBar } from "../components/blocks/StickyBar";

const config: Config = {
  // Le wrapper .site scope tout le CSS du site (il n'affecte pas l'interface de Puck).
  root: { render: ({ children }: { children: React.ReactNode }) => <div className="site">{children}</div> },
  components: { Hero, ProjectsRail, BeforeAfter, Stats, Method, Pricing, Contact, StickyBar } as Config["components"],
};

export default config;
