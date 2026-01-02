import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TEKOM Kandidaten-Profile",
  description: "Vertrauliche Kandidaten-Profile von TEKOM Industrielle Systemtechnik GmbH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
