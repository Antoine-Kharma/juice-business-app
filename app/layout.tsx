"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/" || pathname === "/login";

  return (
    <html lang="en">
      <body>
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}