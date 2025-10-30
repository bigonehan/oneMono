import type { Metadata } from "next";
import { Footer_1 } from "@ui/shadcn/footer/Footer_1";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@ui/shadcn/utils";

export const metadata: Metadata = {
  title: "Ieum",
  description: "Bring back happiness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased transition-colors duration-300"
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
            <header className="sticky top-0 z-10 border-b border-border/60 bg-background/90 backdrop-blur transition-colors duration-300">
              <div className="container mx-auto flex items-center justify-end gap-3 px-4 py-4">

              </div>
            </header>

            <main className=" w-full mx-auto flex-grow  py-8 transition-colors duration-300">
              {children}
            </main>
			
                <Footer_1 />

          </div>
        </Providers>
        {/* 전체 레이아웃 Div 닫힘 */}
      </body>
    </html>
  );
}
