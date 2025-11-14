/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { getTimeAgo } from "./utils/getTimeAgo";
import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogList({ entries }: { entries: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(entries);

  // ✅ Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(lowerSearch) ||
          entry.description?.toLowerCase().includes(lowerSearch)
      );
      setFilteredEntries(filtered);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm, entries]);

  return (
    <div
      id="blogs"
      className="container mx-auto px-4 max-md:px-1 md:px-40 py-10 dark:bg-[#141413]"
    >
      {/* 🔍 Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 flex justify-center"
      >
        <div className="relative w-full md:w-1/2">
          {/* Search Icon */}
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blogs..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm 
                 focus:outline-none
                 transition-all duration-300 dark:text-white"
          />

          {/* Clear Icon */}
          {searchTerm && (
            <button
              onClick={() => {
                // 1. Reset the search term to clear the input
                setSearchTerm("");
                // 2. Explicitly reset the displayed list to the original full entries
                setFilteredEntries(entries);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Blog List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 p-5 rounded-lg"
      >
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <motion.div
              key={entry._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link
                key={entry._id}
                href={`/${entry.slug}`}
                className="flex flex-col md:flex-row items-start justify-between py-8 gap-4 md:gap-8 transition-all duration-300 rounded-xl"
              >
                {/* IMAGE SECTION */}
                {entry.featuredImage && (
                  <div className="w-full md:w-60 shrink-0 order-1 md:order-2">
                    <Image
                      src={entry.featuredImage.url}
                      alt={entry.featuredImage.title}
                      width={320}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 md:h-36"
                    />
                  </div>
                )}

                {/* CONTENT SECTION */}
                <div className="flex-1 order-2 md:order-1 mt-4 md:mt-0">
                  {/* TITLE */}
                  <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-snug dark:text-white">
                    {entry.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4 max-w-2xl line-clamp-2">
                    {entry.description ||
                      "Learn Composition, Render Props, and Hooks to scale your React components together with your team without tech debt."}
                  </p>

                  {/* META INFO */}
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    <span>{getTimeAgo(entry.publishedDate)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center py-10"
          >
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              😕 No blogs found
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try searching with a different keyword or explore other topics.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
