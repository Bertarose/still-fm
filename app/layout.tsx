import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from './context/PlayerContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Still FM",
  description: "Montreal Underground Radio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 🔥 Ajout des permissions pour encrypted-media */}
        <meta 
          httpEquiv="Permissions-Policy" 
          content="encrypted-media=*, autoplay=*, fullscreen=*"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
