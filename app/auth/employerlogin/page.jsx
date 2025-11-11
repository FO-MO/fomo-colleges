import React from "react";
import Link from "next/link";

export default function EmployerLogin() {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      {/* Full-width header */}
      <div className="w-full border-b border-gray-300 bg-teal-900 py-4 px-8">
        <h1 className="text-white text-xl font-bold">ConnectEd</h1>
      </div>

      {/* Centered login form */}
      <div className="flex flex-1 justify-center items-center mb-4  mt-4">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Sign up for free
          </h2>
          <p className="text-sm text-gray-400 mt-2 mb-2">
            Create an account to post your job—and gain access to more than 15
            million verified students and alumni.
          </p>

          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Frist name
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Last Name
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Company name
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Company Description(optional)
              </label>
              <textarea
                id="text"
                name="text"
                type="text"
                placeholder="Brief description of your company..."
                required
                autoComplete="text"
                rows={4}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Industry (optional)
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Company size (optional)
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Website (optional)
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-900"
              >
                Location (optional)
              </label>
              <input
                id="text"
                name="text"
                type="text"
                required
                autoComplete="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <p className="text-sm text-gray-400 mt-2 mb-1">
              By clicking "Create account", I agree to the ConnectEd Terms of
              Service and have read the Privacy Policy.
            </p>

            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-teal-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">
              Don't have an account?
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link
            href="/Signup"
            className="mt-4 w-full inline-block text-center border border-teal-900 text-teal-700 bg-white py-2 rounded-md hover:bg-teal-900 hover:text-white transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
