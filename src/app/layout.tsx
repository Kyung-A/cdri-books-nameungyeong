import type { Metadata } from "next";

import { Header } from "@/shared/ui";
import "./globals.css";
import { PopoverProvider, QueryProvider } from "@/shared/context";

export const metadata: Metadata = {
  title: "Certicos Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <PopoverProvider>
            <div className="w-full">
              <Header />
              <main className="max-w-[960px] w-full mx-auto pt-20">
                {children}
              </main>
            </div>
          </PopoverProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
