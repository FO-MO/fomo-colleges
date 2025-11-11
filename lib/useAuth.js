"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("FOOMO_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email) => {
    // Simple login - just save user data
    const userData = {
      id: "1",
      email,
      name: email.split("@")[0],
      initials: email.substring(0, 2).toUpperCase(),
    };

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("FOOMO_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("FOOMO_user");
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
  };
}
