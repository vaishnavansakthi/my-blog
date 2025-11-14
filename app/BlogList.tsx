/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTimeAgo } from "./utils/getTimeAgo";
import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";

export default function BlogList({ entries }: { entries: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [loading, setLoading] = useState(true);

  const router: any = useRouter();

  // Simulate loading for smooth placeholder experience
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      // Only save if we're navigating away from the blog list
      if (!url.includes("/blogs")) {
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        sessionStorage.setItem("blog-list-scroll", scrollTop.toString());
      }
    };

    router?.events?.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router?.events?.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(lower) ||
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
      className="container mx-auto px-4 max-md:px-1 md:px-40 dark:bg-[#141413]"
    >
      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex justify-center"
      >
        <div className="relative w-full md:w-1/2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blogs..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none transition-all duration-300 dark:text-white"
          />

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilteredEntries(entries);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* VIRTUALIZED LIST */}
      <div
        className="virtuoso-scroll-wrapper no-scrollbar"
        style={{ height: "75vh" }}
      >
        {loading ? (
          <div className="space-y-8">
            {[...Array(filteredEntries.length)].map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <Virtuoso
            className="no-scrollbar"
            data={filteredEntries}
            itemContent={(index, entry) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  href={`/${entry.slug}`}
                  className="flex flex-col md:flex-row items-start justify-between py-8 gap-4 md:gap-8 rounded-xl"
                >
                  {/* IMAGE */}
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

                  {/* CONTENT */}
                  <div className="flex-1 order-2 md:order-1">
                    <h2 className="text-xl md:text-3xl font-extrabold dark:text-white mb-2">
                      {entry.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4 line-clamp-2">
                      {entry.description}
                    </p>

                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {getTimeAgo(entry.publishedDate)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              😕 No blogs found
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try another keyword.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
