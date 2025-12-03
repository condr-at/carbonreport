export const siteConfig = {
  name: "Carbon Report",
  url: "https://carbonreport.com", // Placeholder
  getStartedUrl: "/auth/register",
  ogImage: "https://carbonreport.com/og.jpg", // Placeholder
  description:
    "Product Carbon Footprint & Compliance Workspace. Prepare ISO 14067 & EU CBAM reports in days, not months.",
  links: {
    twitter: "https://twitter.com/carbonreport",
    github: "https://github.com/carbonreport",
    email: "mailto:hello@carbonreport.com",
  },
  pricing: {
    pro: "/pricing",
    team: "/pricing",
  },
  stats: {
    figma: 0,
    github: 0,
    cli: 0,
    total: "0",
    updated: "Nov 2025",
    sections: 0,
    illustrations: 0,
    animations: 0,
    templates: 0,
  },
};

export type SiteConfig = typeof siteConfig;
