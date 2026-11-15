import type { Config } from "@measured/puck";
import { SiteNav, SiteFooter } from "../components/SiteNav";
import { Hero } from "../components/blocks/Hero";
import { PageHeader } from "../components/blocks/PageHeader";
import { SectorCards } from "../components/blocks/SectorCards";
import { ProblemSolution } from "../components/blocks/ProblemSolution";
import { ProjectsRail } from "../components/blocks/ProjectsRail";
import { CaseStudy } from "../components/blocks/CaseStudy";
import { BeforeAfter } from "../components/blocks/BeforeAfter";
import { Stats } from "../components/blocks/Stats";
import { Method } from "../components/blocks/Method";
import { Commitments } from "../components/blocks/Commitments";
import { Quotes } from "../components/blocks/Quotes";
import { About } from "../components/blocks/About";
import { Faq } from "../components/blocks/Faq";
import { Pricing } from "../components/blocks/Pricing";
import { Placeholder } from "../components/blocks/Placeholder";
import { Contact } from "../components/blocks/Contact";
import { StickyBar } from "../components/blocks/StickyBar";

const config: Config = {
  root: {
    fields: { title: { type: "text", label: "Titre de la page (SEO)" }, description: { type: "textarea", label: "Description (SEO)" } } as any,
    // Le wrapper .site scope tout le CSS du site (il n'affecte pas l'interface de Puck).
    render: ({ children }: { children: React.ReactNode }) => (
      <div className="site"><SiteNav />{children}<SiteFooter /></div>
    ),
  },
  components: { Hero, PageHeader, SectorCards, ProblemSolution, ProjectsRail, CaseStudy, BeforeAfter, Stats, Method, Commitments, Quotes, About, Faq, Pricing, Placeholder, Contact, StickyBar } as Config["components"],
};

export default config;
