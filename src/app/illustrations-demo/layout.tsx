import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Illustrations Demo | Launch UI Offline",
  description: "Offline gallery of Launch UI illustrations bundled with local CSS",
};

export default function IllustrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/launch-ui/launch-ui-a.css" />
      <link rel="stylesheet" href="/launch-ui/launch-ui-b.css" />
      {children}
    </>
  );
}
