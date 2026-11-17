import type { ComponentConfig } from "@measured/puck";
import {Slot, T} from "./shared";

type P = {
  title: string; text: string; pilot: string;
  phone: string; phoneHref: string; rdvLabel: string; rdvHref: string; whatsapp: string; email: string; linkedin: string;
  qrPlaceholder: string; qrSrc: string; accessKey: string; subject: string; redirect: string; button: string;
};

export const Contact: ComponentConfig<P> = {
  label: "Contact (Web3Forms, multi-canal)",
  fields: {
    title: { type: "text" }, text: { type: "textarea" }, pilot: { type: "textarea", label: "Offre de projet pilote (vide = masquée)" },
    phone: { type: "text", label: "Téléphone affiché" }, phoneHref: { type: "text", label: "Lien tel:" },
    rdvLabel: { type: "text", label: "Bouton rendez-vous : texte" }, rdvHref: { type: "text", label: "Lien de prise de rendez-vous (vide = masqué)" },
    whatsapp: { type: "text", label: "Numéro WhatsApp (chiffres, avec indicatif ; vide = masqué)" },
    email: { type: "text", label: "Email (vide = masqué)" }, linkedin: { type: "text", label: "URL LinkedIn (vide = masqué)" },
    qrPlaceholder: { type: "text", label: "Placeholder QR code" }, qrSrc: { type: "text", label: "Image du QR code (URL)" },
    accessKey: { type: "text", label: "Clé d’accès Web3Forms" },
    subject: { type: "text", label: "Objet de l’email reçu" },
    redirect: { type: "text", label: "URL de redirection après envoi (optionnel)" },
    button: { type: "text", label: "Texte du bouton d’envoi" },
  } as any,
  defaultProps: {
    title: "Un lieu à valoriser ? Parlons de votre projet.",
    text: "Dites-nous où il se trouve et ce que vous voulez en faire.", pilot: "",
    phone: "[[06 00 00 00 00]]", phoneHref: "tel:+33000000000",
    rdvLabel: "Réserver 30 min en visio", rdvHref: "", whatsapp: "", email: "", linkedin: "",
    qrPlaceholder: "QR code vers cette page", qrSrc: "",
    accessKey: "VOTRE_CLE_WEB3FORMS", subject: "Nouvelle demande d’estimation", redirect: "", button: "Recevoir mon estimation",
  },
  render: (p) => (
    <section id="contact" className="dark">
      <div className="wrap contact">
        <div>
          <h2>{p.title}</h2>
          <p><T>{p.text}</T></p>
          {p.pilot && <aside className="pilot"><T>{p.pilot}</T></aside>}
          <div className="channels">
            {p.rdvHref && <a className="btn btn-primary" href={p.rdvHref}>{p.rdvLabel}</a>}
            {p.whatsapp && <a className="btn btn-ghost" href={`https://wa.me/${p.whatsapp.replace(/\D/g, "")}`}>WhatsApp</a>}
            {p.email && <a className="btn btn-ghost" href={`mailto:${p.email}`}>Email</a>}
            {p.linkedin && <a className="btn btn-ghost" href={p.linkedin}>LinkedIn</a>}
          </div>
          <div className="direct">
            <Slot placeholder={p.qrPlaceholder} src={p.qrSrc} />
            <div><a href={p.phoneHref}><T>{p.phone}</T></a><p>Ou scannez pour retrouver cette page sur votre téléphone.</p></div>
          </div>
        </div>
        <form action="https://api.web3forms.com/submit" method="POST">
          <input type="hidden" name="access_key" value={p.accessKey} />
          <input type="hidden" name="subject" value={p.subject} />
          {p.redirect && <input type="hidden" name="redirect" value={p.redirect} />}
          <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
          <div><label htmlFor="nom">Nom</label><input type="text" id="nom" name="name" autoComplete="name" required /></div>
          <div><label htmlFor="tel">Email ou téléphone</label><input type="text" id="tel" name="contact" autoComplete="email" required /></div>
          <div className="full"><label htmlFor="lieu">Votre lieu et sa surface approximative</label><input type="text" id="lieu" name="lieu" placeholder="ex. domaine, 4 hectares, Yvelines" /></div>
          <div className="full"><label htmlFor="besoin">Votre besoin</label><textarea id="besoin" name="besoin" /></div>
          <div className="full"><button className="btn btn-primary" type="submit">{p.button}</button></div>
        </form>
      </div>
    </section>
  ),
};
