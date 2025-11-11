"use client";

import React, { useState, useEffect } from "react";
import PartnershipCard from "@/components/employee-section/PartnershipCard";
import SubBar from "@/components/subBar";
import { fetchFromBackend } from "@/lib/tools";

interface Partnership {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  badge: string;
  tier: string;
  placementRate: number;
  avgPackage: string;
  students: string;
  placementTrend: number[];
  packageGrowth: number[];
  activeJobs: number;
  rating: number;
}

function mapPartnershipData(x: any): Partnership {
  return {
    id: x.id,
    name: x.name || "Unknown College",
    location: x.location || "Unknown Location",
    verified: x.verified || false,
    badge: x.badge || "",
    tier: x.tier || "Tier-3",
    placementRate: Number(x.placementRate) || 0,
    avgPackage: x.avgPackage || "N/A",
    students: x.students || "N/A",
    placementTrend: x.placementTrend || [],
    packageGrowth: x.packageGrowth || [],
    activeJobs: x.activeJobs || 0,
    rating: x.rating || 0,
  };
}

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const res = await fetchFromBackend("Partnershipcards?populate=*");
        console.log("Partnership data:", res);

        if (res && res.length > 0) {
          const mappedPartnerships = res.map((item: any) => {
            const x = item.data;
            return mapPartnershipData(x);
          });
          setPartnerships(mappedPartnerships);
        } else {
          setError("No partnerships data found");
        }
      } catch (err) {
        console.error("Error fetching partnerships:", err);
        setError("Failed to fetch partnerships");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerships();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading partnerships...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  //SEARCH BAR MECHANISM
  /**
   * Helper function to check if a single field includes the search query.
   * @param {string} fieldValue - The value of the field (e.g., partnership.name).
   * @param {string} normalizedQuery - The lowercase search query.
   * @returns {boolean} - True if the field contains the query.
   */
  const doesFieldMatch = (fieldValue, normalizedQuery) => {
    // Check if the field is a non-empty string before converting to lowercase.
    if (typeof fieldValue === "string" && fieldValue.length > 0) {
      return fieldValue.toLowerCase().includes(normalizedQuery);
    }
    return false;
  };

  // --- Main Filtering Logic ---
  const filteredPartnerships = partnerships.filter((partnership) => {
    // Normalize the search query once for efficiency
    const normalizedSearchQuery = searchQuery.toLowerCase();

    // 1. **Search Match (Logical OR)**
    // Define all the partnership fields you want to search against.
    const searchableFields = [
      partnership.name,
      partnership.location,
      // Add more fields here as needed (e.g., partnership.category, partnership.description)
    ];

    // .some() returns true if ANY field matches the query (Logical OR)
    const matchesSearch = searchableFields.some((field) =>
      doesFieldMatch(field, normalizedSearchQuery)
    );

    // 2. **Tier Filter (Logical AND)**
    const matchesTier =
      tierFilter === "All Tiers" || partnership.tier === tierFilter;

    // 3. **Location Filter (Logical AND)**
    // This is for a specific filter dropdown, not the general search query.
    const matchesLocationFilter =
      locationFilter === "All Locations" ||
      partnership.location.includes(locationFilter);

    // 4. **Final Result (Logical AND)**
    // A partnership must satisfy ALL three conditions (Search AND Tier AND Location Filter)
    return matchesSearch && matchesTier && matchesLocationFilter;
  });
  //

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SubBar
          items={[
            { url: "/employers/overview", name: "Overview", logo: "👤" },
            {
              url: "/employers/applications",
              name: "Applications",
              logo: "📈",
            },
            {
              url: "/employers/partnerships",
              name: "College Partnerships",
              logo: "🎓",
            },
            { url: "/employers/jobpostings", name: "Job Postings", logo: "🧳" },
            // { url: "/employers/analytics", name: "Analytics", logo: "📊" },
          ]}
          className="mb-10"
        />
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                College Partnerships
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Build relationships with top educational institutions
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-semibold">
                <span>+</span>
                Add Partnership
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search colleges by name or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option>All Tiers</option>
              <option>Tier-1</option>
              <option>Tier-2</option>
              <option>Tier-3</option>
            </select>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option>All Locations</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Pilani</option>
              <option>Tiruchirappalli</option>
            </select>
          </div>
        </div>

        {/* Partnership Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPartnerships.map((partnership) => (
            <PartnershipCard key={partnership.id} {...partnership} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPartnerships.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No partnerships found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
