"use client";

import React, { useState } from "react";

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function FOOMOAIpopup({ isOpen = true, onClose }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="scale-70">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Space for AI Robot Image */}
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  {/* Placeholder for robot image */}
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  FOOMO AI Copilot
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                I can help you with project ideas, track your progress, and
                guide your learning journey!
              </p>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {/* Suggest a project idea */}
                <button
                  onClick={() => setSelectedOption("project")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedOption === "project"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedOption === "project"
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">
                    Suggest a project idea
                  </span>
                </button>

                {/* Check my readiness */}
                <button
                  onClick={() => setSelectedOption("readiness")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedOption === "readiness"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedOption === "readiness"
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">
                    Check my readiness
                  </span>
                </button>

                {/* Ask me anything */}
                <button
                  onClick={() => setSelectedOption("anything")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedOption === "anything"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedOption === "anything"
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">
                    Ask me anything
                  </span>
                </button>
              </div>

              {/* Open Full Chat Button */}
              <button className="w-full bg-teal-700 text-white py-4 rounded-xl font-semibold hover:bg-teal-800 transition-colors">
                Open Full Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
