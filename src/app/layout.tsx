import type { Metadata } from "next";

import { Header } from "@/shared/ui";
import { QueryProvider } from "@/shared/context";
import "./globals.css";

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
          <div className="w-full">
            <Header />
            <main className="max-w-[960px] w-full mx-auto pt-20">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
