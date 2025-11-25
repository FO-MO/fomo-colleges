"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/bars/topBar";
import Hero1 from "@/components/hero/Hero1";
import Hero2 from "@/components/hero/Hero2";
import Hero3 from "@/components/hero/Hero3";
import Hero4 from "@/components/hero/Hero4";
import Hero5 from "@/components/hero/Hero5";
import Footer from "@/components/bars/footer";

type User = {
  username: string;
  abbreviation: string;
  userType: "student" | "college" | "employer";
  loggedIn: boolean;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const rawUser = localStorage.getItem("fomo_user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        const parsedUser: User = {
          username: parsed.username || "User",
          abbreviation:
            parsed.abbreviation ||
            parsed.username?.substring(0, 2).toUpperCase() ||
            "U",
          loggedIn: true,
          userType: "college",
        };
        console.log("User from localStorage:", parsedUser);
        setUser(parsedUser);
      }
    }
  }, []);

  return (
    <>
      {/* HII */}
      <TopBar theme="home" user={user} />
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Footer />
    </>
  );
}
