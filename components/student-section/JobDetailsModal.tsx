"use client";

import React from "react";
import {
  X,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Building2,
  Clock,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  description: string;
  tags: string[];
  type: string;
}

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
  onApply,
}: JobDetailsModalProps) {
  if (!isOpen || !job) return null;

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      alert("Application submitted successfully!");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
              <Building2 className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">
                  Location
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900">{job.location}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Salary</span>
              </div>
              <p className="text-sm font-bold text-gray-900">₹{job.salary}</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Type</span>
              </div>
              <p className="text-sm font-bold text-gray-900 capitalize">
                {job.type}
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Posted</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {job.postedDate}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Skills/Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-200 hover:bg-teal-100 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-blue-900 mb-2">
              About this opportunity
            </h3>
            <p className="text-sm text-blue-800">
              This position offers a great opportunity to work with{" "}
              {job.company} in {job.location}. The role requires expertise in
              the listed skills and offers competitive compensation.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-semibold border-2 border-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Apply for this Job
          </button>
        </div>
      </div>
    </div>
  );
}
