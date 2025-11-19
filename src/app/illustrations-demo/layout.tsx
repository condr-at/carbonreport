import type { Metadata } from "next";
import "@/styles/primitives.css";
import "@/styles/illustrations-demo.css";

export const metadata: Metadata = {
  title: "Illustrations Demo | Extended Visuals",
  description: "Offline gallery of snippets, illustrations, and charts that rely on extended theme styles",
};

export default function IllustrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="illustrations-demo-theme">{children}</div>;
}
