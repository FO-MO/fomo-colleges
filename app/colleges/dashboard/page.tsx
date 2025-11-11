"use client";

import React, { useState } from "react";
import CollegesSideBar from "@/components/bars/collegesSideBar";
import Navbar from "@/components/bars/Navbar";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", applications: 0, hires: 0 },
  { month: "Feb", applications: 0, hires: 0 },
  { month: "Mar", applications: 0, hires: 0 },
  { month: "Apr", applications: 0, hires: 0 },
  { month: "May", applications: 0, hires: 0 },
  { month: "Jun", applications: 0, hires: 0 },
];

const chartConfig = {
  applications: {
    label: "Applications",
    color: "#0ea5e9",
  },
  hires: {
    label: "Hires",
    color: "#0d9488",
  },
} satisfies ChartConfig;

const dashboardCards = [
  {
    id: 1,
    title: "Total Students",
    value: "0",
    change: "+0% from last month",
    changeType: "positive",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z",
  },
  {
    id: 2,
    title: "Active Jobs",
    value: "0",
    change: "+0 new this week",
    changeType: "positive",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: "M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z",
  },
  {
    id: 3,
    title: "Students Hired",
    value: "0",
    change: "+0% from last month",
    changeType: "positive",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: "M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  },
  {
    id: 4,
    title: "Upcoming Events",
    value: "0",
    change: "",
    changeType: "neutral",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z",
  },
];

const actionCards = [
  {
    id: 1,
    title: "Post New Job",
    description: "Create job opportunities for students",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    icon: "M20 6L9 17l-5-5",
  },
  {
    id: 2,
    title: "Schedule Event",
    description: "Organize career fairs and workshops",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: 3,
    title: "Invite Company",
    description: "Connect with new employers",
    bgColor: "bg-green-50",
    iconBg: "bg-green-500",
    iconColor: "text-white",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
];

export default function CollegeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = "/colleges/dashboard";

  const tabs = [
    { label: "Overview", href: "/colleges/dashboard" },
    { label: "Students", href: "/colleges/students" },
    { label: "Jobs", href: "/colleges/jobs" },
    { label: "Events", href: "/colleges/events" },
    { label: "Analytics", href: "/colleges/analytics" },
  ];

  // Prevent background scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen mt-6 sm:mt-16 bg-gray-50 overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed left-0 top-0 z-50 w-56 h-full transform transition-transform duration-300 ease-in-out sm:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
      >
        <CollegesSideBar active="dashboard" />
      </div>

      {/* HAMBURGER */}
      <button
        className="fixed top-20 left-0 px-3 scale-110 z-[60] py-[3px] border-2 border-black/100 cursor-pointer rounded-br-2xl  bg-gray-200 shadow-[0px_0px_4px_#0006] sm:hidden active:bg-teal-600 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-5 h-5 text-black object-cover"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <main className="sm:ml-56 pt-20 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                FOOMO College Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">College Name</p>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-blue-50 text-emerald-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Powered
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div> */}
        </div>

        {/* TABS */}
        {/* <div className="flex bg-white border-1 border-black/5 rounded-full overflow-x-auto gap-2 mb-8 py-1 -mx-4 px-4 sm:mx-0 sm:px-2 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-1 sm:px-2 py-1 flex-1 sm:py-2 cursor-pointer rounded-lg whitespace-nowrap text-sm sm:text-base font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md flex-shrink-0 scale-95 text-center ${
                  isActive
                    ? "bg-teal-800 text-white shadow-lg -translate-y-0.5"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div> */}

        {/* CARDS + ITS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="bg-white p-6 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm">{card.title}</p>
                <div
                  className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className={`w-4 h-4 ${card.iconColor}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d={card.icon} clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p
                className={`text-sm mt-1 flex items-center gap-1 ${
                  card.changeType === "positive"
                    ? "text-green-600"
                    : card.changeType === "negative"
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
              >
                {card.changeType === "positive" && (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* CHART SETUP + TOP EMPLOYERS */}
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">
                Applications vs Hires
              </h3>
            </div>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-base font-medium"
                  tick={{ fontSize: 14 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-base font-medium"
                  tick={{ fontSize: 14 }}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  content={
                    <ChartTooltipContent className="text-base font-medium bg-white border border-gray-200 shadow-lg rounded-lg p-3" />
                  }
                />
                <Bar
                  dataKey="applications"
                  fill="var(--color-applications)"
                  radius={[4, 4, 0, 0]}
                  name="Applications"
                />
                <Bar
                  dataKey="hires"
                  fill="var(--color-hires)"
                  radius={[4, 4, 0, 0]}
                  name="Hires"
                />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Top Employers
            </h3>
            <div className="space-y-8">
              <div className="flex items-center bg-[whitesmoke] p-2 justify-between">
                <div className="flex items-center opacity-0 gap-3">
                  <div className="w-8 h-8 bg-yellow-500 opacity-0 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span
                    className="font-medium text-gray-900"
                    style={{ display: "none" }}
                  >
                    Google
                  </span>
                </div>
                <span className="text-gray-600 opacity-0">15</span>
              </div>
              <div className="flex items-center bg-[whitesmoke] p-2  justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full opacity-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="font-medium text-gray-900 opacity-0">
                    Microsoft
                  </span>
                </div>
                <span className="text-gray-600 opacity-0">6</span>
              </div>
              <div className="flex items-center bg-[whitesmoke] p-2 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 opacity-0 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span className="font-medium opacity-0 text-gray-900">
                    Amazon
                  </span>
                </div>
                <span className="text-gray-600 opacity-0">5</span>
              </div>
              <div className="flex items-center bg-[whitesmoke] p-2 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-700 opacity-0 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="font-medium opacity-0 text-gray-900">
                    Meta
                  </span>
                </div>
                <span className="text-gray-600" style={{ display: "none" }}>
                  4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY CARDS */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {actionCards.map((card) => (
            <button
              key={card.id}
              className={`${card.bgColor} p-6 rounded-xl cursor-pointer border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:scale-105`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <svg
                    className={`w-6 h-6 ${card.iconColor}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={card.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div> */}
      </main>
    </div>
  );
}
