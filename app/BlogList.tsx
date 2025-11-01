/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { getTimeAgo } from "./utils/getTimeAgo";

export default function BlogList({ entries }: { entries: any[] }) {
  return (
    <div id="blogs" className="container mx-auto px-4 max-md:px-0 md:px-40 py-10">
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-100 p-5 rounded-lg">
        {entries.map((entry) => (
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
        ))}
      </div>
    </div>
  );
}
