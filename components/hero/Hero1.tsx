"use client";

import { Typewriter } from "react-simple-typewriter";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Particles from "@/components/Particles";

function Writer() {
  return (
    <h1 className="mt-12 text-center text-[#d6ff3a] font-extrabold leading-none tracking-tight text-7xl sm:text-8xl md:text-9xl">
      <Typewriter
        words={["NEVER FEAR\nMISSING OUT"]}
        loop={1}
        cursor={false}
        cursorStyle="|"
        typeSpeed={80}
        delaySpeed={1000}
      />
    </h1>
  );
}

export default function Hero1() {
  //ANIMATIONS
  const entrydiv = useRef(null);
  const textdiv = useRef(null);
  const availableTextRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(
      entrydiv.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      "+=2.0"
    ).to(entrydiv.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
    });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(
      textdiv.current,
      {
        y: 0,
        opacity: 0,
        scale: 0.8,
      },
      "+=1.8"
    ).to(textdiv.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
    });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(
      availableTextRef.current,
      {
        y: 0,
        opacity: 0,
        scale: 0.8,
      },
      "+=1.8"
    ).to(availableTextRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
    });
  }, []);
  //

  return (
    <section className="w-full min-h-[100vh] relative text-white overflow-hidden bg-black">
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

      {/* Content Overlay */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="flex justify-center">
          <div
            className="inline-flex opacity-0 items-center gap-3 bg-white/6 border border-white/10 rounded-full px-4 py-2 text-sm"
            ref={availableTextRef}
          >
            <span className="w-2 h-2 rounded-full bg-[#d6ff3a] block" />
            <span className="font-semibold ">
              FOOMO is now available for all students
            </span>
          </div>
        </div>

        <Writer />

        <p
          className="mt-8 opacity-0 text-center text-white/90 text-lg max-w-2xl mx-auto"
          ref={textdiv}
        >
          Join the network built for automating your upskilling and networking
          with AI
        </p>

        <div className="mt-10 max-w-3xl mx-auto px-4">
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center bg-white rounded-xl p-3 sm:p-2 shadow-md"
            ref={entrydiv}
            style={{ opacity: 0 }}
          >
            <input
              aria-label="Email"
              className="flex-1 bg-white rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 outline-none text-sm sm:text-base"
              placeholder="Type school or personal email here"
            />
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#d6ff3a] cursor-pointer text-[#082926] font-extrabold px-6 py-3 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.3)] transform transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] whitespace-nowrap">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
