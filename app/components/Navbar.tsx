/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with gradient effect */}
        <Link
          href="/"
          className="group relative text-2xl font-bold select-none"
        >
          <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent transition-all duration-300 group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-pink-500">
            Vaishnavan
          </span>
          <span className="bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            M
          </span>
          <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent transition-all duration-300 group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-pink-500">
            {" "}Blog&apos;s
          </span>

          {/* Animated underline */}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Theme Toggle Button with enhanced design */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="
              relative p-3 rounded-xl 
              bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900
              hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30
              transition-all duration-300 
              border border-gray-300/50 dark:border-gray-600/50
              hover:border-pink-300 dark:hover:border-pink-600
              shadow-md hover:shadow-xl hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30
              transform hover:scale-110 active:scale-95
              group
            "
            aria-label="Toggle theme"
          >
            <div className="relative w-6 h-6">
              {theme === 'dark' ? (
                // Sun icon - shown in dark mode (click to go to light)
                <svg
                  className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-all duration-300 group-hover:rotate-180 transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Moon icon - shown in light mode (click to go to dark)
                <svg
                  className="w-6 h-6 text-indigo-600 group-hover:text-indigo-500 transition-all duration-300 group-hover:-rotate-12 transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </button>
        )}
      </div>
    </nav>
  );
}