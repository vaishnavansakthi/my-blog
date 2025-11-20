/* eslint-disable react-hooks/set-state-in-effect */
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
  const [loading, setLoading] = useState(entries.length > 0);

  // Simulate loading for smooth placeholder experience
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const filtered = entries.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(lower) ||
          entry.description?.toLowerCase().includes(lower)
      );
      setFilteredEntries(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, entries]);

  // Skeleton Placeholder Component
  const BlogSkeleton = () => (
    <div className="animate-pulse py-8 flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="flex-1 space-y-3">
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      </div>

      <div className="w-full md:w-60 h-48 md:h-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );

  return (
    <div
      id="blogs"
      className="container mx-auto px-4 max-md:px-1 md:px-40 py-10 dark:bg-[#141413]"
    >
      {/* SEARCH BAR - STICKY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-10 dark:bg-[#141413] pt-4 pb-8 mb-8 flex justify-center"
      >
        <div className="relative w-full md:w-2/3 lg:w-1/2">
          {/* Search Icon */}
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors"
            size={20}
          />

          {/* Search Input */}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blogs..."
            className="w-full pl-12 pr-12 py-3.5 
            bg-white dark:bg-gray-900/50
            border-2 border-gray-200 dark:border-gray-700
            rounded-2xl 
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none 
            focus:border-purple-500 dark:focus:border-purple-400
            focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/10
            transition-all duration-300
            shadow-sm hover:shadow-md
            backdrop-blur-sm"
          />

          {/* Clear Button */}
          {searchTerm && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={() => {
                setSearchTerm("");
                setFilteredEntries(entries);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 
              flex items-center justify-center
              w-7 h-7 
              rounded-full
              mt-[-13px]
              bg-gray-100 hover:bg-gray-200 
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-500 hover:text-gray-700 
              dark:text-gray-400 dark:hover:text-gray-200
              transition-all duration-200
              hover:scale-110 active:scale-95"
              aria-label="Clear search"
            >
              <X size={16} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* BLOG LIST */}
      <div className="space-y-8">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <BlogSkeleton key={i} />)
          : filteredEntries.length > 0
            ? filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.sys?.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/${entry.slug}`}
                  className="block py-8 flex flex-col md:flex-row gap-4 md:gap-8 
                  transition-colors duration-200 rounded-lg px-4 -mx-4"
                >
                  {/* TEXT CONTENT */}
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                      {entry.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {entry.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {getTimeAgo(entry.publishedDate)}
                    </p>
                  </div>

                  {/* IMAGE */}
                  {entry.featuredImage?.url && (
                    <div className="w-full md:w-60 h-48 md:h-36 relative overflow-hidden rounded-lg">
                      <Image
                        src={entry.featuredImage.url}
                        alt={entry.featuredImage.title || entry.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))
            : !loading && (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No blogs found matching &quot;{searchTerm}&quot;
                </p>
              </div>
            )}
      </div>
    </div>
  );
}
