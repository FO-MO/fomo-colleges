"use client";

import React from "react";
import Particles from "../Particles";

export default function Hero4() {
  const features = [
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "AI Networking",
      description:
        "Automated connections with the right people at the right time",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "Smart Upskilling",
      description: "Personalized learning paths based on your career goals",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Campus Placements",
      description: "Direct pipeline from your college to top employers",
    },
  ];

  return (
    <section className="w-full relative py-16 sm:py-20 lg:py-60 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Particles Background */}
      <div className="fixed inset-0 z-0">
        <Particles
          particleCount={5000}
          particleColors={["#D6FF3A"]}
          particleSpread={3}
          speed={0.3}
          alphaParticles={false}
          particleBaseSize={1.2}
          sizeRandomness={0}
          cameraDistance={0}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          disableRotation={true}
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Your Biggest Edge Over{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d6ff3a] to-[#c4e82e]">
              The Competition
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto px-4">
            While others just list jobs, we automate your entire career journey
            with AI-powered upskilling, networking, and college placement
            automation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-[#d6ff3a]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="text-white/80 group-hover:text-[#d6ff3a] transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
