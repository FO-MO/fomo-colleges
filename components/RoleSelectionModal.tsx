"use client";

import { X, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  mode,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "employer" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSelectedRole(null);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleRoleSelect = (role: "student" | "employer") => {
    setSelectedRole(role);
    setTimeout(() => {
      if (mode === "login") {
        router.push(role === "student" ? "/auth/login" : "/auth/employerlogin");
      } else {
        router.push("/auth/signup");
      }
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 p-8 pb-12">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-3 animate-fade-in">
              {mode === "login" ? "Welcome Back!" : "Join FOOMO"}
            </h2>
            <p className="text-teal-100 text-lg animate-fade-in-delay">
              Choose your role to continue
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-float-delay"></div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="p-8 -mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Card */}
            <div
              onClick={() => handleRoleSelect("student")}
              className={`group relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 cursor-pointer border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                selectedRole === "student"
                  ? "border-teal-600 shadow-2xl scale-105"
                  : "border-teal-200 hover:border-teal-400"
              }`}
            >
              {/* Icon Container */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 w-20 h-20 border-4 border-teal-400 rounded-2xl animate-ping-slow opacity-0 group-hover:opacity-50"></div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                I&apos;m a Student
              </h3>
              <p className="text-gray-600 mb-6">
                Explore opportunities, connect with companies, and kickstart
                your career journey.
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                  Find internships & jobs
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                  Join clubs & communities
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                  Build your portfolio
                </li>
              </ul>

              {/* Arrow */}
              <div className="flex items-center text-teal-600 font-semibold group-hover:gap-3 transition-all">
                <span>Continue as Student</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/0 to-cyan-400/0 group-hover:from-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500 pointer-events-none"></div>
            </div>

            {/* Employer Card */}
            <div
              onClick={() => handleRoleSelect("employer")}
              className={`group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 cursor-pointer border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                selectedRole === "employer"
                  ? "border-indigo-600 shadow-2xl scale-105"
                  : "border-indigo-200 hover:border-indigo-400"
              }`}
            >
              {/* Icon Container */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-400 rounded-2xl animate-ping-slow opacity-0 group-hover:opacity-50"></div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                I&apos;m an Employer
              </h3>
              <p className="text-gray-600 mb-6">
                Discover top talent, post opportunities, and build partnerships
                with institutions.
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Post job openings
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Find qualified candidates
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Partner with colleges
                </li>
              </ul>

              {/* Arrow */}
              <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                <span>Continue as Employer</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-500 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <p className="text-gray-500 text-sm">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={onClose}
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 6s ease-in-out 2s infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
