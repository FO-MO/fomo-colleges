"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { strapiRegister, setAuthToken } from "@/lib/strapi/auth";

export default function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await strapiRegister(name || email, email, password);
      if (result?.error) {
        setError(result.error.message || "Registration failed");
        console.error("Sign up error:", result);
      } else if (result?.jwt) {
        // Immediately set token and redirect to profile setup
        setAuthToken(result.jwt);
        try {
          localStorage.setItem("fomo_user", JSON.stringify(result.user));
        } catch {}
        setSuccess(true);
        window.location.href = "/auth/college-profile";
      } else {
        // Strapi may require email confirmation depending on settings
        setSuccess(true);
        setError("Please check your email to confirm your account");
        console.log("Signup response", result);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Link href="/">
        <div className="w-full border-b border-gray-300 py-4 px-12">
          <h1 className="text-black text-3xl font-bold">FOOMO</h1>
        </div>
      </Link>

      {/* Centered login form */}
      <div className="flex scale-90 sm:scale-100 flex-1 justify-center items-center ">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Sign Up
          </h2>
          <p className="text-sm text-gray-400 mt-2 mb-1">
            Enter your information to create an account
          </p>

          {error && (
            <div
              className={`${
                error.includes("check your email")
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-red-50 border-red-200 text-red-700"
              } border px-4 py-3 rounded-md text-sm`}
            >
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              Account created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-teal-900 font-semibold hover:text-teal-800"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex justify-center rounded-md bg-teal-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating account..."
                : success
                ? "Account created!"
                : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">
              Already have an account?
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="mt-4 w-full border-1 border-teal-900 text-teal-700 bg-white py-2 rounded-md hover:bg-teal-900 hover:text-white transition-colors duration-200">
            <Link href="/auth/login" className="w-full block text-center">
              Login
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
