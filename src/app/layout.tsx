import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mellow Kitchen",
  description: "QR table ordering for Mellow Kitchen"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
