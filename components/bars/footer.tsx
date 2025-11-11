import React from "react";

export default function Footer() {
  return (
    <footer className="w-full relative bg-[#000] text-white z-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">FOOMO</div>
          <div className="text-sm text-white/70 mt-2">
            © 2025 FOOMO. All rights reserved.
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <a className="text-white/90 hover:underline" href="#">
            Terms
          </a>
          <a className="text-white/90 hover:underline" href="#">
            Privacy
          </a>
          <a className="text-white/90 hover:underline" href="#">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
