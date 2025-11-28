"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "../global/max-width-wrapper";
import AnimationContainer from "../global/animation-container";
import Image from "next/image";
import { ModeToggle } from "../ui/mode-toggle";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 8) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-14 w-full border-b border-transparent z-[99999] select-none",
        scroll && "border-border/80 bg-background/40 backdrop-blur-md"
      )}
    >
      <AnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-12">
            <Link href="/#home" className="flex items-center gap-2">
              <Image
                src="/app/emblem-black.svg"
                alt="Carbon Report"
                width={24}
                height={24}
                className="dark:hidden"
              />
              <Image
                src="/app/emblem-white.svg"
                alt="Carbon Report"
                width={24}
                height={24}
                className="hidden dark:block"
              />
              <span className="text-lg font-bold font-heading !leading-none">
                Carbon Report
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-x-4">
            <ModeToggle />
            <Link
              href="/login"
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              Sign In
            </Link>
            <Link href="/register" className={buttonVariants({ size: "sm" })}>
              Get Started
            </Link>
          </div>
        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;
