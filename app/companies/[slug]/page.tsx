"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/strapi/auth";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Award,
  TrendingUp,
  Briefcase,
  Heart,
  Target,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

// Toggle this to use mock data instead of backend
const USE_MOCK_DATA = true;

// Mock company data for development
const MOCK_COMPANY_DATA: CompanyProfile = {
  id: 1,
  documentId: "mock-company-123",
  companyName: "TechVista Solutions",
  tagline: "Innovating Tomorrow's Technology Today",
  logo: { url: "https://via.placeholder.com/150/0891b2/ffffff?text=TV" },
  coverImage: {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
  },
  about:
    "<p>TechVista Solutions is a leading technology company specializing in cutting-edge software development, cloud solutions, and AI-powered applications. Founded in 2015, we've grown from a small startup to a global presence with over 500 employees across multiple continents.</p><p>Our mission is to empower businesses through innovative technology solutions that drive growth and efficiency. We work with Fortune 500 companies and startups alike, delivering world-class products and services.</p>",
  industry: "Technology",
  companySize: "employees_501to1000",
  companyType: "Mid-size Company",
  foundedYear: 2015,
  headquarters: "San Francisco, CA",
  locations: [
    { city: "San Francisco", country: "USA", address: "123 Tech Street" },
    { city: "Bangalore", country: "India", address: "456 Innovation Park" },
    { city: "London", country: "UK", address: "789 Digital Avenue" },
  ],
  website: "https://techvista.example.com",
  email: "contact@techvista.example.com",
  phone: "+1 (555) 123-4567",
  socialLinks: {
    linkedin: "https://linkedin.com/company/techvista",
    twitter: "https://twitter.com/techvista",
    facebook: "https://facebook.com/techvista",
    instagram: "https://instagram.com/techvista",
    youtube: "https://youtube.com/techvista",
  },
  mission:
    "To revolutionize the way businesses operate by providing innovative, scalable, and user-friendly technology solutions that drive measurable results and create lasting value for our clients and their customers.",
  vision:
    "To be the world's most trusted technology partner, known for excellence in innovation, customer satisfaction, and creating positive impact through technology that transforms industries and improves lives.",
  values: [
    "Innovation First - We constantly push boundaries and embrace new ideas",
    "Customer Success - Our clients' success is our success",
    "Integrity & Transparency - We build trust through honest communication",
    "Collaboration - We believe great things happen when we work together",
    "Continuous Learning - We invest in our team's growth and development",
    "Excellence - We deliver nothing but the best in everything we do",
  ],
  culture:
    "<p>At TechVista, we've built a culture that celebrates creativity, encourages risk-taking, and rewards innovation. Our open-office environment fosters collaboration, while our flexible work policies ensure work-life balance.</p><p>We believe in the power of diversity and inclusion, bringing together talented individuals from different backgrounds to create breakthrough solutions. Regular team events, hackathons, and learning sessions keep our team engaged and growing.</p>",
  benefits: [
    "Comprehensive health, dental, and vision insurance",
    "401(k) matching up to 6%",
    "Unlimited PTO policy",
    "Remote work flexibility",
    "Professional development budget ($3,000/year)",
    "Home office setup allowance",
    "Gym membership reimbursement",
    "Mental health support and counseling",
    "Paid parental leave (16 weeks)",
    "Stock options for all employees",
    "Free lunch and snacks",
    "Annual company retreats",
  ],
  specialties: [
    "Cloud Computing",
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Mobile Applications",
    "DevOps",
    "Cybersecurity",
    "Data Analytics",
    "UI/UX Design",
    "Blockchain",
  ],
  products: [
    {
      name: "CloudSync Pro",
      description: "Enterprise cloud management platform",
    },
    {
      name: "AI Assistant",
      description: "Intelligent business automation tool",
    },
    {
      name: "DataViz Studio",
      description: "Advanced data visualization software",
    },
  ],
  achievements: [
    { title: "Best Place to Work 2024 - Tech Category", year: 2024 },
    { title: "Innovation Award - Cloud Computing Excellence", year: 2023 },
    { title: "Top 50 Fastest Growing Tech Companies", year: 2023 },
    { title: "Customer Choice Award - Enterprise Software", year: 2022 },
    { title: "ISO 27001 Certified for Information Security", year: 2022 },
  ],
  funding: "Series C - $50M",
  investors: [
    { name: "Sequoia Capital", type: "Lead Investor" },
    { name: "Accel Partners", type: "Series B" },
    { name: "Y Combinator", type: "Seed" },
  ],
  revenue: "$50M - $100M ARR",
  ceo: "Sarah Chen",
  leadership: [
    {
      name: "Sarah Chen",
      position: "CEO & Co-Founder",
      bio: "15+ years in enterprise software",
    },
    {
      name: "Michael Rodriguez",
      position: "CTO",
      bio: "Former Google senior engineer",
    },
    {
      name: "Emily Watson",
      position: "VP of Engineering",
      bio: "Built products at Amazon and Microsoft",
    },
    {
      name: "David Kim",
      position: "Head of Product",
      bio: "Product leader with 3 successful exits",
    },
    {
      name: "Lisa Johnson",
      position: "VP of Sales",
      bio: "20+ years in B2B SaaS sales",
    },
    {
      name: "James Anderson",
      position: "CFO",
      bio: "Former CFO at two unicorn startups",
    },
  ],
  employeeTestimonials: [
    {
      name: "Alex Thompson",
      position: "Senior Software Engineer",
      quote:
        "Best company I've ever worked for. The culture of innovation and the support for professional growth is unmatched. Every day brings new challenges and opportunities to learn.",
    },
    {
      name: "Priya Sharma",
      position: "Product Designer",
      quote:
        "TechVista truly values creativity and gives designers the freedom to explore bold ideas. The collaborative environment and cutting-edge projects make this an amazing place to grow.",
    },
    {
      name: "Marcus Williams",
      position: "Data Scientist",
      quote:
        "The work-life balance here is incredible. I can work remotely while tackling some of the most interesting problems in AI. The team is brilliant and supportive.",
    },
    {
      name: "Sophie Laurent",
      position: "Engineering Manager",
      quote:
        "What sets TechVista apart is how much they invest in their people. The leadership genuinely cares about your career progression and provides all the resources you need to succeed.",
    },
  ],
  companyPhotos: [
    {
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
    },
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    },
  ],
  companyVideos: [],
  diversityStatement:
    "At TechVista, diversity isn't just a buzzword—it's fundamental to who we are. We're committed to building a team that represents the rich diversity of our global community. With 45% women in leadership roles and employees from over 30 countries, we believe diverse perspectives drive better innovation and create products that serve everyone.",
  sustainabilityInitiatives:
    "We're committed to carbon neutrality by 2025. Our offices run on 100% renewable energy, we've eliminated single-use plastics, and we offset all business travel emissions. We also donate 1% of revenue to environmental causes and encourage employees to volunteer for sustainability projects.",
  techStack: [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "TensorFlow",
    "PyTorch",
  ],
  workModel: "Hybrid",
  glassdoorRating: 4.6,
  employeeCount: 587,
  growthRate: 45.5,
  clientLogos: [],
  pressReleases: [
    { title: "TechVista Raises $50M Series C", date: "2024-03-15" },
    { title: "Launches AI Assistant 2.0", date: "2024-01-10" },
  ],
  isVerified: true,
  isFeatured: true,
};

interface CompanyProfile {
  id: number;
  documentId: string;
  companyName: string;
  tagline?: string;
  logo?: any;
  coverImage?: any;
  about?: string;
  industry?: string;
  companySize?: string;
  companyType?: string;
  foundedYear?: number;
  headquarters?: string;
  locations?: any[];
  website?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  mission?: string;
  vision?: string;
  values?: string[];
  culture?: string;
  benefits?: string[];
  specialties?: string[];
  products?: any[];
  achievements?: any[];
  funding?: string;
  investors?: any[];
  revenue?: string;
  ceo?: string;
  leadership?: any[];
  employeeTestimonials?: any[];
  companyPhotos?: any[];
  companyVideos?: any[];
  diversityStatement?: string;
  sustainabilityInitiatives?: string;
  techStack?: string[];
  workModel?: string;
  glassdoorRating?: number;
  employeeCount?: number;
  growthRate?: number;
  clientLogos?: any[];
  pressReleases?: any[];
  isVerified?: boolean;
  isFeatured?: boolean;
}

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "culture" | "jobs">(
    "overview"
  );

  useEffect(() => {
    loadCompanyProfile();
  }, [slug]);

  const loadCompanyProfile = async () => {
    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCompany(MOCK_COMPANY_DATA);
        setLoading(false);
        return;
      }

      // Real backend call
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/company-profiles?filters[slug][$eq]=${slug}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch company profile");
      }

      const data = await response.json();
      console.log("Company profile data:", data);

      if (data.data && data.data.length > 0) {
        setCompany(data.data[0]);
      }
    } catch (error) {
      console.error("Error loading company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCompanySize = (size?: string) => {
    if (!size) return "Not specified";
    return (
      size
        .replace("employees_", "")
        .replace("to", "-")
        .replace("plus", "+")
        .replace(/_/g, " ") + " employees"
    );
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The company profile you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const logoUrl = company.logo?.url
    ? `${BACKEND_URL}${company.logo.url}`
    : null;
  const coverUrl = company.coverImage?.url
    ? `${BACKEND_URL}${company.coverImage.url}`
    : null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Cover Image */}
      <div className="w-full h-64 relative overflow-hidden">
        {coverUrl ? (
          <>
            <img
              src={coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800"></div>
        )}

        {/* Company Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            {/* Logo */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={company.companyName}
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {company.companyName}
                </h1>
                {company.isVerified && (
                  <div
                    className="bg-blue-500 rounded-full p-1"
                    title="Verified Company"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {company.tagline && (
                <p className="text-xl text-white/90 font-medium">
                  {company.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Info Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {company.industry && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Industry</p>
                  <p className="font-semibold text-gray-900">
                    {company.industry}
                  </p>
                </div>
              </div>
            )}

            {company.companySize && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company Size</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatCompanySize(company.companySize)}
                  </p>
                </div>
              </div>
            )}

            {company.foundedYear && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Founded</p>
                  <p className="font-semibold text-gray-900">
                    {company.foundedYear}
                  </p>
                </div>
              </div>
            )}

            {company.headquarters && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Headquarters</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {company.headquarters}
                  </p>
                </div>
              </div>
            )}

            {company.workModel && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Work Model</p>
                  <p className="font-semibold text-gray-900">
                    {company.workModel}
                  </p>
                </div>
              </div>
            )}

            {company.glassdoorRating && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="font-semibold text-gray-900">
                    {company.glassdoorRating}/5.0
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Website
                </span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>
            )}

            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {company.email}
                </span>
              </a>
            )}

            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {company.phone}
                </span>
              </a>
            )}

            {company.socialLinks &&
              Object.entries(company.socialLinks).map(
                ([platform, url]) =>
                  url && (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {getSocialIcon(platform)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {platform}
                      </span>
                    </a>
                  )
              )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex gap-1 bg-white rounded-xl p-1.5 shadow-md border border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("culture")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === "culture"
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Culture & Benefits
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === "jobs"
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Open Positions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* About */}
            {company.about && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {company.companyName}
                </h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: company.about }}
                />
              </div>
            )}

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.mission && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {company.mission}
                  </p>
                </div>
              )}

              {company.vision && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {company.vision}
                  </p>
                </div>
              )}
            </div>

            {/* Specialties */}
            {company.specialties && company.specialties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {company.techStack && company.techStack.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {company.achievements && company.achievements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Achievements & Awards
                  </h3>
                </div>
                <div className="space-y-3">
                  {company.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <ChevronRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        {typeof achievement === "string"
                          ? achievement
                          : achievement.title || achievement.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leadership */}
            {company.leadership && company.leadership.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Leadership Team
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.leadership.map((leader, index) => (
                    <div key={index} className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
                        {leader.name?.charAt(0) || "?"}
                      </div>
                      <h4 className="font-bold text-gray-900">{leader.name}</h4>
                      <p className="text-sm text-teal-600 font-medium">
                        {leader.position}
                      </p>
                      {leader.bio && (
                        <p className="text-sm text-gray-600 mt-2">
                          {leader.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "culture" && (
          <div className="space-y-6">
            {/* Culture */}
            {company.culture && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Company Culture
                  </h2>
                </div>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: company.culture }}
                />
              </div>
            )}

            {/* Values */}
            {company.values && company.values.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Our Values
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200"
                    >
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Employee Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {company.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diversity Statement */}
            {company.diversityStatement && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Diversity & Inclusion
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {company.diversityStatement}
                </p>
              </div>
            )}

            {/* Sustainability */}
            {company.sustainabilityInitiatives && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sustainability Initiatives
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {company.sustainabilityInitiatives}
                </p>
              </div>
            )}

            {/* Employee Testimonials */}
            {company.employeeTestimonials &&
              company.employeeTestimonials.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    What Our Employees Say
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {company.employeeTestimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                      >
                        <p className="text-gray-700 italic mb-4">
                          "{testimonial.quote || testimonial.text}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                            {testimonial.name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {testimonial.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Job listings will be displayed here once they're available.
            </p>
            <button className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors">
              View All Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
