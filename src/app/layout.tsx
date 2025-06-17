import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "800"], // adjust as needed
});

export const metadata: Metadata = {
  title: "Effortless Tasks",
  description: "A minimal to-do list app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
    <body className={`${sourceSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
