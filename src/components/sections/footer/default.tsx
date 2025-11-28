import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import CarbonReportLogo from "@/components/logos/carbon-report";
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  className?: string;
}

export default function FooterSection({
  logo = <CarbonReportLogo className="h-6 w-6" />,
  name = siteConfig.name,
  columns = [
    {
      title: "Product",
      links: [
        { text: "Features", href: "#features" },
        { text: "Pricing", href: "#pricing" },
        { text: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: "#" },
        { text: "Blog", href: "#" },
        { text: "Careers", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy", href: "#" },
        { text: "Terms", href: "#" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Carbon Report. All rights reserved.`,
  policies = [
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Service", href: "#" },
  ],
  className,
}: FooterProps) {
  return (
    <Footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <FooterContent>
          <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-2">
            <div className="flex items-center gap-2">
              {logo}
              <h3 className="text-xl font-bold">{name}</h3>
            </div>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              {siteConfig.description}
            </p>
          </FooterColumn>
          {columns.map((column, index) => (
            <FooterColumn key={index}>
              <h3 className="text-md font-semibold">{column.title}</h3>
              {column.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className="text-muted-foreground text-sm hover:text-foreground"
                >
                  {link.text}
                </a>
              ))}
            </FooterColumn>
          ))}
        </FooterContent>
        <FooterBottom>
          <p className="text-muted-foreground text-sm">{copyright}</p>
          <div className="flex items-center gap-4">
            {policies.map((policy, index) => (
              <a
                key={index}
                href={policy.href}
                className="text-muted-foreground text-sm hover:text-foreground"
              >
                {policy.text}
              </a>
            ))}
          </div>
        </FooterBottom>
      </div>
    </Footer>
  );
}
