import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Clicker",
  description: "Next + Zustand + Three clicker"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
