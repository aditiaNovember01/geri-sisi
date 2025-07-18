import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wedding Geri Sisi",
  description: "Generated by Adit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Undangan Pernikahan Geri & Sisi" />
        <meta property="og:description" content="Yth. Bapak/Ibu/Saudara/i, Anda diundang ke pernikahan Geri & Sisi. Klik untuk detail & RSVP." />
        <meta property="og:image" content="/images/bg2.jpeg" />
        <meta property="og:url" content="https://wedding-repository.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
