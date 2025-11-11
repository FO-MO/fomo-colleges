"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { fetchFromBackend } from "@/lib/tools";

//SEO NEEDS TO BE DONE...

const res = await fetchFromBackend("employer-dash-tiles?populate=*");
const x = res[0]; //data.data is an array

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "FOOMO - AI-Powered Career Platform for Students & Job Seekers",
//   description:
//     "Never Fear Missing Out on your dream job. FOOMO automates your career journey with AI-powered job recommendations, personalized upskilling, networking automation, and direct college placement connections.",
//   keywords: [
//     "AI career platform",
//     "student job placement",
//     "AI-powered job search",
//     "career automation",
//     "college placement",
//     "student networking",
//     "personalized learning paths",
//     "upskilling platform",
//     "job recommendations",
//     "campus placements",
//     "career development for students",
//     "AI networking",
//     "automated job matching",
//     "student career platform",
//     "entry-level jobs",
//     "internship opportunities",
//     "college to career",
//     "job portal for students",
//     "AI career advisor",
//     "career guidance platform",
//   ],
//   authors: [{ name: "FOOMO Team" }],
//   creator: "FOOMO",
//   publisher: "FOOMO",
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://FOOMO.app",
//     title: "FOOMO - AI-Powered Career Platform for Students",
//     description:
//       "Automate your entire career journey with AI-powered upskilling, networking, and college placement automation. Never miss out on your dream job.",
//     siteName: "FOOMO",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "FOOMO - AI-Powered Career Platform",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "FOOMO - AI-Powered Career Platform for Students",
//     description:
//       "Automate your career journey with AI-powered job recommendations, upskilling, and networking automation.",
//     images: ["/og-image.png"],
//     creator: "@FOOMO_app",
//   },
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 5,
//   },
//   verification: {
//     google: "your-google-verification-code",
//     // yandex: "your-yandex-verification-code",
//     // yahoo: "your-yahoo-verification-code",
//   },
//   alternates: {
//     canonical: "https://FOOMO.app",
//   },
//   category: "Career Development",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stats = [
    {
      title: "Total Applications",
      value: x.applicationNumber,
      subtitle: "This month",
      change: `+${x.applicationPercentage}% from last month`,
      icon: (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M5 3v18M5 7h7a4 4 0 110 8H5" />
        </svg>
      ),
    },
    {
      title: "Active Jobs",
      value: x.activeJobs,
      subtitle: `Across ${x.activeJobsCollege} colleges`,
      change: `+ ${x.activeJobsWeek}new this week`,
      icon: (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M4 7h16M10 11v6m4-6v6M6 7V4h12v3" />
        </svg>
      ),
    },
    {
      title: "Avg. Time to Hire",
      value: x.hireTime,
      subtitle: `Industry avg: ${x.hireTimeIndustrial} days`,
      change: `-${x.hireTimeImprovement} days improved`,
      icon: (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M12 6v6l4 2M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
    },
    {
      title: "Hires This Month",
      value: x.hireMonth,
      subtitle: `${x.hireConversion}% conversion rate`,
      change: `+${x.hirePercent}% from last month`,
      icon: (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M20 13V7a1 1 0 00-1-1h-5l-2-2H5a1 1 0 00-1 1v14l4-4h11a1 1 0 001-1z" />
        </svg>
      ),
    },
    {
      title: "Cost Saved vs Traditional",
      value: `₹${x.costSave}L`,
      subtitle: "Using FOOMO platform",
      change: `${x.costRednpercentage}% cost reduction`,
      icon: (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M12 8c-2 0-3.5 1.5-3.5 3s1.5 3 3.5 3 3.5 1.5 3.5 3-1.5 3-3.5 3m0-12c2 0 3.5-1.5 3.5-3S14 2 12 2 8.5 3.5 8.5 5" />
        </svg>
      ),
    },
  ];

  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="min-h-screen bg-[#f9fafb]">
          <header className="border-b border-gray-200/70 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 py-6">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f4f4a] text-white shadow-sm">
                  <svg
                    aria-hidden="true"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9l9-6 9 6v9a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                </span>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">cars</h1>
                  <p className="text-sm text-gray-500">
                    Talent Acquisition Platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm font-medium">
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 21V7l9-4 9 4v14" />
                    <path d="M13 13h6v8" />
                    <path d="M13 21h8" />
                  </svg>
                  Campus Hub
                </button>

                <button className="inline-flex items-center gap-2 rounded-xl bg-[#0f4f4a] px-4 py-2.5 text-white shadow-[0_8px_20px_rgba(15,79,74,0.18)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,79,74,0.22)]">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Post Job
                </button>

                <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 15.5A3.5 3.5 0 118.5 12 3.5 3.5 0 0112 15.5z" />
                    <path d="M19.4 15a8 8 0 10-3.4 3.4l2.7 2.7a1.5 1.5 0 002.1-2.1z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl\ pb-14">
            <section className="mt-8 p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className="flex h-full flex-col justify-between rounded-3xl border border-white/60 bg-white p-6 shadow-[0_10px_30px_rgba(10,34,31,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(10,34,31,0.12)]"
                >
                  <div className="flex items-start justify-between text-sm text-gray-700">
                    <span className="font-medium">{stat.title}</span>
                    {stat.icon}
                  </div>
                  <div className="mt-6 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{stat.subtitle}</p>
                  <p className="mt-3 text-xs font-medium text-emerald-600">
                    {stat.change}
                  </p>
                </article>
              ))}
            </section>

            <section className="m-4 mt-8 p-6 rounded-3xl border border-white/60 bg-gradient-to-r from-[#f2f7f5] via-white to-[#f2f7f5] shadow-[0_10px_30px_rgba(10,34,31,0.06)]">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f4f4a] text-white shadow-sm">
                    <svg
                      aria-hidden="true"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9l9-6 9 6v9a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      cars
                    </h2>
                    <p className="text-sm text-gray-500">
                      Talent Acquisition Platform
                    </p>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9" />
                    <path d="M5.25 9h13.5M19.5 9v9a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 18V9m7.5 4.5v3" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </section>

            <div className="mt-10 ">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
