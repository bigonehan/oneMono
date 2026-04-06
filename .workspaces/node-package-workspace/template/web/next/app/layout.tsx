import type { Metadata } from "next";
import { Navbar } from "./_components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monorepo Next Template",
  description: "Next app template using @ui/shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main className="app-main-shell">{children}</main>
      </body>
    </html>
  );
}
