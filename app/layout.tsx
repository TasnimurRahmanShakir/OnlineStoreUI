import type { Metadata } from "next";
import "./globals.css";
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
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
