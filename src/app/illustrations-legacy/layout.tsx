import type { Metadata } from "next";
import "@/styles/primitives.css";
import "@/styles/illustrations-legacy.css";

export const metadata: Metadata = {
  title: "Launch UI Ember Archive",
  description: "Offline snapshot of the pre-emerald Launch UI illustrations gallery.",
};

export default function LegacyIllustrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
