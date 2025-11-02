/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { getTimeAgo } from "./utils/getTimeAgo";
import React, { useEffect, useState } from "react";

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
    <div id="blogs" className="container mx-auto px-4 max-md:px-1 md:px-40 py-10">
      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none outline-none transition-colors duration-300 "
        />
      </div>

      {/* Blog List */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-100 p-5 rounded-lg">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Link
              key={entry._id}
              href={`/blog/${entry.slug}`}
              className="flex flex-col md:flex-row items-start justify-between py-8 gap-4 md:gap-8 transition-all duration-300 rounded-xl hover:bg-gray-50"
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
                <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-snug">
                  {entry.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4 max-w-2xl">
                  {entry.description ||
                    "Learn Composition, Render Props, and Hooks to scale your React components together with your team without tech debt."}
                </p>

                {/* META INFO */}
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                  <span>{getTimeAgo(entry.publishedDate)}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10 dark:text-gray-400">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
}
