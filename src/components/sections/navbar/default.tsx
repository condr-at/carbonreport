import { type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import CarbonReportLogo from "@/components/logos/carbon-report";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo = <CarbonReportLogo className="h-6 w-6" />,
  name = siteConfig.name,
  homeUrl = "/",
  mobileLinks = [
    { text: "Features", href: "#features" },
    { text: "Pricing", href: "#pricing" },
    { text: "FAQ", href: "#faq" },
  ],
  actions = [
    { text: "Sign in", href: "/auth/login", isButton: false },
    {
      text: "Get Started",
      href: "/auth/register",
      isButton: true,
      variant: "primary",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo}
              {name}
            </a>
            {showNavigation && !customNavigation && (
              <div className="hidden md:flex">
                <Navigation 
                    menuItems={[
                        { title: "Features", href: "#features", isLink: true },
                        { title: "Pricing", href: "#pricing", isLink: true },
                        { title: "FAQ", href: "#faq", isLink: true },
                    ]}
                />
              </div>
            )}
            {customNavigation}
          </NavbarLeft>
          <NavbarRight>
            <div className="hidden md:flex items-center gap-4">
              {actions.map((action, index) =>
                action.isButton ? (
                  <Button
                    key={index}
                    variant={action.variant || "primary"}
                    asChild
                  >
                    <a href={action.href}>
                      {action.icon}
                      {action.text}
                      {action.iconRight}
                    </a>
                  </Button>
                ) : (
                  <a
                    key={index}
                    href={action.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {action.text}
                  </a>
                )
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 p-4">
                  {mobileLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-lg font-medium"
                    >
                      {link.text}
                    </a>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                     {actions.map((action, index) => (
                        <a
                            key={index}
                            href={action.href}
                            className={cn("text-lg font-medium", action.isButton && "text-primary")}
                        >
                            {action.text}
                        </a>
                     ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
