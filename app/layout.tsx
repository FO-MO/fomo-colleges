import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//SEO NEEDS TO BE DONE...

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOOMO - AI-Powered Career Platform for Students & Job Seekers",
  description:
    "Never Fear Missing Out on your dream job. FOOMO automates your career journey with AI-powered job recommendations, personalized upskilling, networking automation, and direct college placement connections.",
  keywords: [
    "AI career platform",
    "student job placement",
    "AI-powered job search",
    "career automation",
    "college placement",
    "student networking",
    "personalized learning paths",
    "upskilling platform",
    "job recommendations",
    "campus placements",
    "career development for students",
    "AI networking",
    "automated job matching",
    "student career platform",
    "entry-level jobs",
    "internship opportunities",
    "college to career",
    "job portal for students",
    "AI career advisor",
    "career guidance platform",
  ],
  authors: [{ name: "FOOMO Team" }],
  creator: "FOOMO",
  publisher: "FOOMO",
  icons: {
    icon: "/foomo_logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://FOOMO.app",
    title: "FOOMO - AI-Powered Career Platform for Students",
    description:
      "Automate your entire career journey with AI-powered upskilling, networking, and college placement automation. Never miss out on your dream job.",
    siteName: "FOOMO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FOOMO - AI-Powered Career Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOOMO - AI-Powered Career Platform for Students",
    description:
      "Automate your career journey with AI-powered job recommendations, upskilling, and networking automation.",
    images: ["/og-image.png"],
    creator: "@FOOMO_app",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://FOOMO.app",
  },
  category: "Career Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
