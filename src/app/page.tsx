import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, ChevronDown, FileText, FolderArchive, Table2 } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import "./landing.css";

export const metadata: Metadata = {
  title: "Carbon Report — From supplier data to review",
  description: "Prepare a CBAM supplier review package. Collect product and installation data, see what is missing, and share a versioned summary with your reviewer.",
};
const steps = [
  ["Set the context", "Start with your product, installation, reporting period and the person who needs the data."],
  ["Bring the numbers", "Work through the guided sections. Add your supplier’s emissions values and the references behind them."],
  ["Review the gaps", "See missing fields, inconsistent values and review notes before you prepare the package."],
  ["Share a clear result", "Download one versioned ZIP with a readable summary, structured data and an evidence reference register."],
];
const questions = [
  ["What can I prepare today?", "The complete export workflow is a CBAM Supplier Review Package for one product and one installation. The wider template library helps you explore other reporting needs; those templates do not yet have the same finished export workflow."],
  ["Is this an official CBAM declaration?", "No. This is a preparation package for a customer, importer or adviser to review. It is not a registry submission, verified emissions report or certificate. Confirm the required methodology and final format with the recipient."],
  ["Do I need to know my emissions already?", "You need specific emissions values from your supplier or operator, together with their basis and sources. Carbon Report calculates lot totals from mass and those values, keeping direct and indirect emissions separate. It does not calculate an installation’s emissions from energy and fuel records."],
  ["What goes into the download?", "A readable HTML summary, the saved dataset in JSON, values in CSV, an evidence reference register in CSV and a README. Source documents themselves are not included. You can open the sample above to see the exact format."],
  ["Can I come back to an unfinished report?", "Yes. Save a draft in your workspace and continue later. The review checklist keeps missing information visible, and the exported package identifies the saved dataset version used to create it."],
  ["Who is this for?", "Suppliers responding to a customer’s data request and advisers helping them prepare the response. Start with a sample case, agree the recipient’s expectations, and check the package before using it for a real reporting obligation."],
];
function ProductImage({ name, alt, priority = false }: { name: string; alt: string; priority?: boolean }) {
  return <>
    <Image className="landing-screen-light" src={`/landing/${name}-light.webp`} alt={alt} width={1200} height={900} priority={priority} sizes="(max-width: 780px) 94vw, 680px" />
    <Image className="landing-screen-dark" src={`/landing/${name}-dark.webp`} alt={alt} width={1200} height={900} priority={priority} sizes="(max-width: 780px) 94vw, 680px" />
  </>;
}
export default function Home() {
  return <div className="landing">
    <a className="landing-skip" href="#main-content">Skip to content</a>
    <LandingNav />
    <main id="main-content">
      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><span /> CBAM data preparation</p>
            <h1>Supplier data.<br /><em>Ready for review.</em></h1>
            <p className="landing-lead">A customer needs your emissions data. Bring the numbers, understand what’s missing, and turn them into a clear package for review.</p>
            <div className="landing-actions"><Link className="landing-button" href="/register">Start your package <ArrowRight size={18} /></Link><a className="landing-text-link" href="#package">See the output <ArrowDown size={16} /></a></div>
            <p className="landing-note">Your data. A guided process. One organised handover.</p>
          </div>
          <figure className="landing-hero-visual"><div className="landing-browser-frame"><div className="landing-frame-bar"><span className="landing-window-dots" aria-hidden="true"><i /><i /><i /></span><span>Carbon Report / Supplier package</span><span className="landing-frame-label">Workspace</span></div><ProductImage name="review" priority alt="Carbon Report review screen with a completeness checklist and download action, using sample supplier data." /></div><figcaption><span className="landing-status-dot" /> A real workspace, shown with sample data</figcaption></figure>
        </div>
        <div className="landing-container landing-capabilities" aria-label="Included in the workflow">{["Guided data collection", "Missing-data checks", "Separate emissions totals", "Versioned review package"].map(text => <span key={text}><Check size={16} />{text}</span>)}</div>
      </section>
      <section className="landing-section landing-container" id="how-it-works">
        <div className="landing-section-heading"><div><p className="landing-eyebrow">From request to response</p><h2>A clear next step.<br />At every step.</h2></div><p>You shouldn’t have to build a reporting process from a blank spreadsheet. Keep the context, numbers and open questions together.</p></div>
        <ol className="landing-steps">{steps.map(([title, copy], i) => <li key={title}><span className="landing-step-number">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </section>
      <section className="landing-soft-section" id="workspace"><div className="landing-container landing-feature-grid">
        <div className="landing-feature-copy"><p className="landing-eyebrow">Less chasing. More clarity.</p><h2>Know what you have.<br /><em>And what you need.</em></h2><p className="landing-section-intro">One workspace for the details your reviewer needs to understand the product and its emissions data.</p>
          <ul className="landing-check-list"><li><Check /><span><strong>Questions with context.</strong> Work through the recipient, installation, goods, emissions and evidence sections.</span></li><li><Check /><span><strong>Gaps you can act on.</strong> See required fields and review notes before you download.</span></li><li><Check /><span><strong>Sources alongside the numbers.</strong> Record where each value came from and what still needs checking.</span></li></ul>
          <Link className="landing-text-link" href="/register">Create your workspace <ArrowRight size={17} /></Link>
        </div>
        <figure className="landing-workspace-visual"><div className="landing-browser-frame"><div className="landing-frame-bar"><span>Inside the workspace</span><span className="landing-frame-label">Sample data</span></div><ProductImage name="form" alt="Guided emissions form showing separate direct and indirect specific emissions and their source references." /></div><figcaption>Work through the data in sections, then review it together.</figcaption></figure>
      </div></section>
      <section className="landing-calculation"><div className="landing-container">
        <div className="landing-section-heading"><div><p className="landing-eyebrow">Transparent calculations</p><h2>Numbers you can<br />trace back.</h2></div><p>Enter the supplier’s specific emissions and the quantity of goods. See how they produce the lot total.</p></div>
        <div className="landing-equation" aria-label="Example: 12 tonnes of goods multiplied by 2.5 tonnes CO2 equivalent per tonne equals 30 tonnes CO2 equivalent direct emissions"><div><span>Quantity of goods</span><p>12 <small>t</small></p><span>Mass of the reported lot</span></div><b aria-hidden="true">×</b><div><span>Specific direct emissions</span><p>2.5 <small>tCO₂e/t</small></p><span>Value provided by the supplier</span></div><b aria-hidden="true">=</b><div className="landing-equation-result"><span>Direct emissions for this lot</span><p>30 <small>tCO₂e</small></p><span>Calculated from the two inputs</span></div></div>
        <div className="landing-calculation-foot"><span><Check size={16} /> Direct and indirect totals stay separate</span><p>Illustrative values. The calculation does not verify the supplier’s inputs or replace an installation emissions assessment.</p></div>
      </div></section>
      <section className="landing-section landing-container landing-package-grid" id="package">
        <div className="landing-feature-copy"><p className="landing-eyebrow">The handover, made tangible</p><h2>A package your<br />reviewer can open.</h2><p className="landing-section-intro">Share a readable summary and the structured data behind it. The saved version connects the output to the numbers you reviewed.</p>
          <ul className="landing-file-list"><li><FileText /><strong>Readable summary</strong><span>HTML</span></li><li><Table2 /><strong>Values &amp; source references</strong><span>CSV</span></li><li><FolderArchive /><strong>Dataset &amp; package notes</strong><span>JSON + TXT</span></li></ul>
          <a className="landing-button landing-button-outline" href="/landing/sample/summary.html" target="_blank" rel="noreferrer">Open a sample summary <ArrowRight size={18} /><span className="sr-only"> (opens in a new tab)</span></a>
          <p className="landing-note">Synthetic example · For recipient review, not official submission</p>
        </div>
        <figure className="landing-paper-stage"><div className="landing-paper"><Image src="/landing/summary.webp" alt="Actual exported CBAM Supplier Review Package summary, showing the reporting period, dataset version and review limitations." width={960} height={1280} sizes="(max-width: 780px) 88vw, 510px" /></div><figcaption>The actual HTML export. No special software required.</figcaption></figure>
      </section>
      <section className="landing-audience landing-container" id="who-its-for"><div className="landing-section-heading"><div><p className="landing-eyebrow">Built around the request</p><h2>For the people<br />behind the data.</h2></div><p>Whether you supply the goods or help prepare the response, give the next person a clearer starting point.</p></div>
        <div className="landing-audience-row"><span>01</span><h3>Suppliers &amp; manufacturers</h3><p>Respond to a customer’s request with product details, emissions values and the references that explain them.</p><ArrowRight aria-hidden="true" /></div>
        <div className="landing-audience-row"><span>02</span><h3>Consultants &amp; advisers</h3><p>Help suppliers organise their inputs and identify open questions before handing data to the recipient.</p><ArrowRight aria-hidden="true" /></div>
        <div className="landing-audience-row"><span>03</span><h3>Teams collecting supplier data</h3><p>Start the review with a structured package instead of piecing together context from separate files.</p><ArrowRight aria-hidden="true" /></div>
      </section>
      <section className="landing-section landing-container landing-faq" id="faq"><div><p className="landing-eyebrow">Before you start</p><h2>A few things<br />to know.</h2><p>Clear expectations make<br className="landing-desktop-break" /> for a better handover.</p></div><div className="landing-faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></section>
      <section className="landing-final"><div className="landing-container"><p className="landing-eyebrow">Start with one product</p><h2>Make your next<br />data request <em>clearer.</em></h2><p>Open a workspace. Follow the questions.<br />Prepare something your reviewer can work with.</p><Link className="landing-button" href="/register">Start your package <ArrowRight size={18} /></Link></div></section>
    </main>
    <footer className="landing-footer landing-container"><div><Link className="landing-wordmark" href="/">Carbon<span>report</span><span className="landing-brand-dot">.</span></Link><p>Supplier data. A clearer handover.</p></div><nav aria-label="Footer navigation"><a href="#how-it-works">How it works</a><a href="#package">Sample output</a><a href="#faq">FAQ</a><Link href="/login">Sign in</Link></nav><p className="landing-copyright">© {new Date().getFullYear()} Carbon Report</p></footer>
  </div>;
}
