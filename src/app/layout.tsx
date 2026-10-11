import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { SyncProvider } from "@/lib/sync/sync-manager";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbon Report",
  description: "Supplier emissions data and CBAM review preparation workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`carbon-report-theme ${inter.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          <SyncProvider>
            <Toaster />
            {children}
          </SyncProvider>
        </Providers>
      </body>
    </html>
  );
}
