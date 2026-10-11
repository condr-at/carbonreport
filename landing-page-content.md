# Landing: content and visual brief

The current page copy is maintained in [src/app/page.tsx](src/app/page.tsx). Release status belongs to [BACKLOG](docs/planning/BACKLOG.md), under LAND-01; visual and interaction evidence is in [design-qa.md](design-qa.md).

## Positioning

Carbon Report helps a supplier or reporting team collect product data, review missing inputs and prepare a package for its recipient. The current complete path is the **CBAM supplier review package for one product and one installation**. Use the existing application's English language. Speak in concrete inputs, actions and outputs rather than broad sustainability claims.

- Inputs: product and installation details, reporting period, quantity, supplier-provided specific direct and indirect emissions, methodology and source references.
- Workflow: create a workspace and project → collect information → review required fields and values → download the package from the saved dataset version.
- Outputs: readable HTML summary, structured JSON and CSV, with direct and indirect totals kept separate. Totals multiply product mass by the entered specific emissions; the service does not derive those specific emissions from installation activity data.
- Audience: suppliers preparing a handover, importers collecting information and advisers reviewing it.
- Primary action: start a workspace. Secondary actions: inspect the workflow and a real synthetic example.

The package is for review. It is not an official filing, verification opinion or certificate. The other catalogue templates support data collection; do not present them as completed exports. Source references are not uploaded evidence attachments. Avoid claims of automated supplier emails, automatic ISO 14067/EPD calculation, guaranteed compliance, measured time savings, customer testimonials or pricing that the current product and evidence do not support.

## Visual direction

The user supplied `temp/landing_concept` and `/Users/user/Downloads/landing_redesigned.html`. Preserve those originals. Follow the concept's blue palette, clear typography, generous spacing and carefully framed product images; exact reproduction is not required.

Use Inter, white and pale-blue surfaces in light mode, navy surfaces in dark mode and the same colour tokens inside the application. Follow the operating system by default, with the existing theme selector available. Mobile must support the complete page and navigation without horizontal overflow.

Use genuine application screenshots with synthetic data, not imagined interfaces. Theme-specific WebP assets and the unmodified example export live in [public/landing](public/landing); [provenance](public/landing/sample/provenance.json) records their origin. Keep output limitations alongside the relevant workflow and FAQ, in ordinary product language.

## Acceptance

Review typography, spacing, colour, images and copy against the supplied concept. Check light/dark at 360, 390, 768 and 1440 px, live system-theme changes, keyboard navigation, mobile menu, FAQ, public links and example loading. The reproducible check is [scripts/e2e/landing.test.mjs](scripts/e2e/landing.test.mjs). Product demand and recipient acceptance remain separate work in [VALIDATION_PLAN](docs/business-planning/VALIDATION_PLAN.md).
