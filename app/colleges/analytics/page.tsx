'use client'

import React, { useState } from 'react'
import CollegesSideBar from '@/components/bars/collegesSideBar'
import Navbar from '@/components/bars/Navbar'
import Link from 'next/link'
import { Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

const applicationData = [
  { status: 'hired', count: 0, fill: '#10b981' },
  { status: 'interview', count: 0, fill: '#f59e0b' },
  { status: 'pending', count: 999, fill: '#9ca3af' },
  { status: 'rejected', count: 0, fill: '#ef4444' },
]

const chartConfig = {
  count: {
    label: 'Applications',
  },
  hired: {
    label: 'Hired',
    color: '#10b981',
  },
  interview: {
    label: 'Interview',
    color: '#f59e0b',
  },
  pending: {
    label: 'Pending',
    color: '#9ca3af',
  },
  rejected: {
    label: 'Rejected',
    color: '#ef4444',
  },
} satisfies ChartConfig

type ActivityItem = {
  id: number
  type: string
  title: string
  subtitle: string
  time: string
  bgColor: string
  iconColor: string
  icon: string
}

export default function CollegeAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Recent Activity Array
  const recentActivity: ActivityItem[] = [
    // {
    //   id: 1,
    //   type: "job",
    //   title: "New job posted",
    //   subtitle: "Google",
    //   time: "2 hours ago",
    //   bgColor: "bg-blue-100",
    //   iconColor: "text-blue-600",
    //   icon: "M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
    // },
    // {
    //   id: 2,
    //   type: "application",
    //   title: "Student application",
    //   subtitle: "Aarav Sharma",
    //   time: "4 hours ago",
    //   bgColor: "bg-yellow-100",
    //   iconColor: "text-yellow-600",
    //   icon: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
    // },
    // {
    //   id: 3,
    //   type: "event",
    //   title: "Event created",
    //   subtitle: "Tech Career Fair",
    //   time: "1 day ago",
    //   bgColor: "bg-purple-100",
    //   iconColor: "text-purple-600",
    //   icon: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
    // },
    // {
    //   id: 4,
    //   type: "company",
    //   title: "Company registered",
    //   subtitle: "Microsoft",
    //   time: "2 days ago",
    //   bgColor: "bg-green-100",
    //   iconColor: "text-green-600",
    //   icon: "M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
    // },
    // {
    //   id: 5,
    //   type: "hire",
    //   title: "Student hired",
    //   subtitle: "Priya Patel",
    //   time: "3 days ago",
    //   bgColor: "bg-teal-100",
    //   iconColor: "text-teal-600",
    //   icon: "M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    // }
  ]

  // Recent activities data (replace with real data when available)
  const recentActivities: Array<{
    title: string
    subtitle?: string
    time: string
    bg: string
    icon: any
  }> = []

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className='min-h-screen mt-6 sm:mt-16 bg-gray-50 overflow-x-hidden'>
      <Navbar />

      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/20 sm:hidden'
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
        fixed left-0 top-0 z-50 w-56 h-full transform transition-transform duration-300 ease-in-out sm:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
      `}
      >
        <CollegesSideBar active='analytics' />
      </div>

      <button
        className='fixed top-20 left-0 px-3 scale-110 z-[60] py-[3px] border-1 border-black/30 cursor-pointer rounded-br-2xl bg-white shadow-lg sm:hidden hover:bg-gray-50 transition-colors'
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label='Toggle sidebar'
      >
        <svg
          className='w-5 h-5 text-black object-cover'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          {sidebarOpen ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4 6h16M4 12h16M4 18h16'
            />
          )}
        </svg>
      </button>

      <main className='sm:ml-56 pt-20 p-4 sm:p-6 lg:p-8'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
                Analytics Dashboard
              </h1>
              <p className='text-sm sm:text-base text-gray-600'>
                College Analytics & Insights
              </p>
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

        {/* Main Title */}
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Advanced Analytics
        </h2>

        {/* Top Section: Pie Chart + Metrics */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Pie Chart Section */}
          <div className='lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-6'>
              Application Status Breakdown
            </h3>

            <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
              {/* Pie Chart */}
              <div className='w-full md:w-1/2'>
                <ChartContainer
                  config={chartConfig}
                  className='mx-auto aspect-square max-h-[280px]'
                >
                  <PieChart>
                    <Pie
                      data={applicationData}
                      dataKey='count'
                      nameKey='status'
                      innerRadius={60}
                      strokeWidth={5}
                    />
                  </PieChart>
                </ChartContainer>
              </div>

              {/* Legend */}
              <div className='w-full md:w-1/2 space-y-4'>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 font-medium">Hired</span>
                  </div>
                  <span className="text-gray-900 font-semibold">24</span>
                </div> */}
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-gray-700 font-medium">Interview</span>
                  </div>
                  <span className="text-gray-900 font-semibold">15</span>
                </div> */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-gray-400'></div>
                    <span className='text-gray-700 font-medium'>Pending</span>
                  </div>
                  <span className='text-gray-900 font-semibold'></span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700 font-medium">Rejected</span>
                  </div>
                  <span className="text-gray-900 font-semibold">8</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className='space-y-4'>
            {/* Placement Rate */}
            <div className='bg-blue-50 p-4 rounded-xl border border-blue-100'>
              <div className='flex items-start justify-between mb-2'>
                <p className='text-sm text-gray-600 font-medium'>
                  Placement Rate
                </p>
                <svg
                  className='w-5 h-5 text-green-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <p className='text-3xl font-bold text-gray-900 mb-1'>0%</p>
              <p className='text-xs text-green-600'>+0% from last year</p>
            </div>

            {/* Average Package */}
            <div className='bg-green-50 p-4 rounded-xl border border-green-100'>
              <div className='flex items-start justify-between mb-2'>
                <p className='text-sm text-gray-600 font-medium'>
                  Average Package
                </p>
                <svg
                  className='w-5 h-5 text-green-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <p className='text-3xl font-bold text-gray-900 mb-1'>₹0 LPA</p>
              <p className='text-xs text-green-600'>+0% from last year</p>
            </div>

            {/* Top Performers */}
            <div className='bg-purple-50 p-4 rounded-xl border border-purple-100'>
              <div className='flex items-start justify-between mb-2'>
                <p className='text-sm text-gray-600 font-medium'>
                  Top Performers
                </p>
                <svg
                  className='w-5 h-5 text-purple-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              </div>
              <p className='text-3xl font-bold text-gray-900 mb-1'>0</p>
              <p className='text-xs text-purple-600'>Above 0% AI Score</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
          <h3 className='text-lg font-semibold text-gray-900 mb-6'>
            Recent Activity
          </h3>

          {recentActivity.length === 0 ? (
            <div className='text-center py-8'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h4 className='text-lg font-medium text-gray-900 mb-2'>
                No Recent Activity
              </h4>
              <p className='text-gray-600 text-sm'>
                When activity occurs, it will appear here.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between py-3 ${
                    index !== recentActivity.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <svg
                        className={`w-5 h-5 ${activity.iconColor}`}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d={activity.icon}
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {activity.title}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className='text-sm text-gray-400'>{activity.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
