import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import { Providers } from "./providers";
import { APP_NAME, APP_DESCRIPTION, DEFAULT_OG } from "@/lib/brand";
import "./globals.css";

const fontSans = Poppins({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: DEFAULT_OG,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}