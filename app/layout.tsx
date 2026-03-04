import type { Metadata } from "next";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
export const metadata: Metadata = {
  title: "E-Commerce website",
  description: "Shop the latest products online",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <FacebookPixel />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
