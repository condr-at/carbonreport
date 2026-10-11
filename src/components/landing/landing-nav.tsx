"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
export function LandingNav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <header className="landing-header"><div className="landing-container landing-nav">
    <Link className="landing-wordmark" href="/" aria-label="Carbon Report home">Carbon<span>report</span><span className="landing-brand-dot">.</span></Link>
    <nav className={`landing-nav-links ${open ? "is-open" : ""}`} id="landing-navigation" aria-label="Main navigation" onClick={() => setOpen(false)}><a href="#how-it-works">How it works</a><a href="#package">What you get</a><a href="#faq">FAQ</a><Link className="landing-mobile-signin" href="/login">Sign in</Link></nav>
    <div className="landing-nav-actions"><ModeToggle /><Link className="landing-signin" href="/login">Sign in</Link><Link className="landing-button landing-nav-cta" href="/register">Get started <ArrowRight size={16} /></Link><button ref={menuButton} className="landing-menu-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="landing-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </div></header>;
}
