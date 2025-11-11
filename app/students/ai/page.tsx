"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// === FOOMO Clubs & Projects Database ===
const CLUBS = {
  cybersecurity: {
    name: "Cybersecurity Club",
    projects: [
      "Password Strength Checker – A Python tool that checks password strength.",
      "Phishing URL Detector – Classify URLs as safe or phishing.",
      "Basic Network Packet Sniffer – Analyze traffic using scapy.",
      "Secure File Encryptor – Encrypt/decrypt files using AES.",
      "Login Attempt Tracker – Track failed logins for security awareness.",
    ],
  },
  "web development": {
    name: "Web Development Club",
    projects: [
      "Personal Portfolio Website – Showcase your resume and projects.",
      "College Club Website – Build your own club site.",
      "Task Tracker App – A simple to-do web app.",
      "Feedback Form App – Store feedback in Firebase.",
      "Weather Forecast App – Fetch live weather data.",
    ],
  },
  ai: {
    name: "AI / Machine Learning Club",
    projects: [
      "Fake News Detector – Use sklearn for text classification.",
      "Spam Email Classifier – Train a spam detector.",
      "Handwritten Digit Recognition (MNIST) – Build a CNN.",
      "Movie Recommendation System – Based on cosine similarity.",
      "AI Chatbot (Mini) – Rule-based chatbot using nltk.",
    ],
  },
  blender: {
    name: "Blender (3D Design & Animation) Club",
    projects: [
      "Basic 3D Logo Design",
      "Simple 3D Chair/Table Modeling",
      "Create a Low-Poly Character",
      "Model a Room or Simple House",
      "Basic Lighting & Rendering",
    ],
  },
  cad: {
    name: "CAD & CAM Club",
    projects: [
      "2D Mechanical Part Drawing",
      "3D Modeling of a Simple Bracket",
      "Engineering Drawing to 3D Conversion",
      "CAD Assembly of Mechanical Parts",
      "Design a Small Machine Component",
    ],
  },
  mathematics: {
    name: "Mathematics Club",
    projects: [
      "Visualizing Set Theory using Venn Diagrams",
      "Prime Number Generator in Python",
      "Matrix Operations (Addition, Multiplication)",
      "Plot Linear & Quadratic Functions",
      "Probability Simulator (Dice, Coin Toss)",
    ],
  },
  python: {
    name: "Python Programming Club",
    projects: [
      "Calculator App",
      "Quiz Game",
      "File Organizer",
      "Expense Tracker",
      "Password Generator",
    ],
  },
  dsa: {
    name: "DSA Club",
    projects: [
      "Linked List Visualizer",
      "Stack and Queue Implementation",
      "Sorting Algorithm Visual Demo",
      "Searching Algorithm App",
      "Simple Calculator using Stack",
    ],
  },
  sql: {
    name: "SQL Club",
    projects: [
      "Student Database Management",
      "Library Management System",
      "Inventory Tracker",
      "College Attendance System",
      "Employee Salary Manager",
    ],
  },
  "power bi": {
    name: "Power BI Club",
    projects: [
      "Sales Dashboard (Excel Dataset)",
      "Student Performance Analysis",
      "College Placement Insights Dashboard",
      "Social Media Analytics (CSV data)",
      "Financial Budget Tracker",
    ],
  },
};

// === Gemini-style FOOMO AI Response Logic ===
const getAIResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase().trim();

  // Detect "I want to learn [skill]" pattern
  const learnMatch = msg.match(/i want to learn (.+)/i);
  if (learnMatch) {
    const skill = learnMatch[1].toLowerCase();
    const foundClubKey = Object.keys(CLUBS).find((club) =>
      skill.includes(club)
    );

    if (foundClubKey) {
      const club = CLUBS[foundClubKey as keyof typeof CLUBS];
      const beginnerProjects = club.projects.slice(0, 3);

      return `🎓 **Welcome to FOOMO!**  
That’s awesome — learning *${skill}* is a great step toward your career goals. 💪  

💬 **Club Recommendation:**  
Join the **${
        club.name
      }** on FOOMO to collaborate with peers, attend workshops, and showcase your projects.

🎥 **Suggested Learning Resources:**  
- YouTube: *"${skill} for Beginners"* playlist  
- FreeCodeCamp / Coursera courses  
- Official documentation and practice tutorials  

🧩 **Try These Beginner Projects:**  
${beginnerProjects.map((p, i) => `${i + 1}. ${p}`).join("\n")}

🚀 **Next Steps:**  
- Explore intermediate topics and advanced toolkits  
- Earn certifications (e.g., Google, Coursera)  
- Participate in hackathons or mini internships via FOOMO!  

Would you like to learn any other skill?`;
    }

    // Skill not found in our club list
    return `That’s a great choice! Unfortunately, FOOMO doesn’t have a dedicated club for *${skill}* yet.  
But don’t worry — you can still start learning from YouTube and online platforms, and share your progress with other learners on FOOMO! 💡`;
  }

  // Greetings
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello there! 👋 I'm **FOOMO-AI**, your academic and placement assistant. You can ask me things like:\n\n• *I want to learn AI*\n• *Suggest projects in Web Development*\n• *What skills should I learn for placements?*";
  }

  // Projects or skills
  if (msg.includes("project")) {
    return "FOOMO can help you with real project ideas across domains — AI, Web Dev, Cybersecurity, Python, and more! Try saying:\n\n👉 *I want to learn Web Development* or *I want to learn Python*";
  }

  if (msg.includes("skill")) {
    return "Here are some in-demand skills to learn: React, Python, SQL, Power BI, AI/ML, and Cybersecurity.\nTry saying: *I want to learn [Skill Name]* to get personalized guidance.";
  }

  // Default fallback
  return "I'm FOOMO-AI 🤖 — I can guide you with projects, clubs, and skills for placements. Try asking:\n\n• *I want to learn AI*\n• *Suggest Web Development projects*\n• *What clubs are available on FOOMO?*";
};

export default function AIAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Welcome to FOOMO! I'm FOOMO-AI — your academic and placement assistant. Ask me anything like:\n\n• I want to learn AI\n• Give me project ideas\n• What skills should I learn for placements?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "I want to learn AI",
    "I want to learn Web Development",
    "I want to learn Python",
    "What skills should I learn?",
  ];

  return (
    <main className="w-full h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <div className="max-w-5xl w-full mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">FOOMO-AI</h1>
              <p className="text-xs text-gray-600">Your Placement Mentor</p>
            </div>
          </div>
          <div className="w-20"></div>
        </header>

        {/* Chat Section */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-gradient-to-br from-teal-400 to-teal-600"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              <div className="flex flex-col flex-1 max-w-2xl">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(p)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-teal-500 hover:text-teal-700 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Box */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask FOOMO-AI anything..."
              rows={1}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-teal-500 resize-none text-sm"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:bg-gray-300 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
