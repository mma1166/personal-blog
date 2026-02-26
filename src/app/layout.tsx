import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muntasir's Blog | Tech & Travel",
  description: "A professional blog website featuring technological insights and travel stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body>
        <div className="fixed-bg" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
