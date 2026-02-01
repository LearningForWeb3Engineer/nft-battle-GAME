import type { Metadata } from "next";
import { ThirdwebProvider } from "thirdweb/react";
import { LanguageProvider } from "../contexts/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Battle Warriors - NFT Battle Game",
  description: "Battle with your NFT warriors!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}