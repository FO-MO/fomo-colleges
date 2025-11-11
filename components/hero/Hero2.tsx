"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Particles from "../Particles";

export default function Hero2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowsRef = useRef<(HTMLDivElement | null)[]>([]);

  //ALL OF THE SCROLL TRIG ANIMATION INSIDE THIS...
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.to(sectionRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 65%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(
            step,
            { opacity: 0, y: 100, scale: 0.7 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: step,
                start: "top 70%",
                toggleActions: "play none none none",
                once: true,
              },
              delay: index * 0.1,
            }
          );
        }
      });

      arrowsRef.current.forEach((arrow, index) => {
        if (arrow) {
          gsap.fromTo(
            arrow,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              ease: "power2.out",
              scrollTrigger: {
                trigger: arrow,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
              delay: index * 0.1 + 0.3,
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      title: "Ask AI",
      description: "Tell our AI copilot what you want to achieve",
      icon: (
        <svg
          className="w-10 h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-[#000]",
    },
    {
      title: "Learn",
      description: "Access expert-led clubs and curated resources",
      icon: (
        <svg
          className="w-10 h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-#000",
    },
    {
      title: "Network",
      description: "Connect with peers and industry professionals",
      icon: (
        <svg
          className="w-10 h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          <path d="M15 11h2v2h-2zm-4 0h2v2h-2zm-4 0h2v2H7z" />
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="12" cy="14" r="2" />
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      title: "Create",
      description: "Build projects and showcase your portfolio",
      icon: (
        <svg
          className="w-10 h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      title: "Get Hired",
      description: "Land jobs through college placements and network",
      icon: (
        <svg
          className="w-10 h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-[#000]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full relative min-h-[110vh] py-16 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden opacity-0"
    >
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
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[antiquewhite] mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-[antiquewhite] max-w-3xl mx-auto px-4">
            Your AI-powered journey from student to hired professional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 items-start">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                ref={(el) => {
                  stepsRef.current[index] = el;
                }}
                className="flex flex-col cursor-pointer items-center text-center group"
              >
                <div
                  className={`${step.bgColor} ${step.textColor} w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                >
                  {step.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[whitesmoke] mb-2">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-[white] max-w-xs px-2">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  ref={(el) => {
                    arrowsRef.current[index] = el;
                  }}
                  className="hidden lg:flex items-center justify-center -mx-3 mt-10"
                >
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
