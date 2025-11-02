import type { Metadata } from "next";
import Script from "next/script";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AnalyticsProvider } from "./AnalyticsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Vaishnavan's Blog",
  description: "Tech, lifestyle, and positivity — all in one place!",
  icons: {
    icon: [
      { url: "/file.svg", type: "image/svg" }
    ]
  },
  openGraph: {
    title: "VaishnavanM Blog's",
    description: "Tech, lifestyle, and positivity — all in one place!",
    url: "https://vaishnavanmblogging.vercel.app/", // update to your deployed URL
    siteName: "Vaishnavan's Blog",
    images: [
      {
        url: "/blog.png", // image in /public
        width: 1200,
        height: 630,
        alt: "Vaishnavan's Blog — Tech & Lifestyle",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaishnavan's Blog",
    description: "Tech, lifestyle, and positivity — all in one place!",
    images: ["/blog.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <head>
        {/* Google Analytics Script */}
        {(
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=G-H952GR6KXJ`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-H952GR6KXJ');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${dmSerif.variable} font-sans antialiased bg-gray-50 text-gray-900`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <AnalyticsProvider />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
