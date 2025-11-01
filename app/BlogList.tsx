/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { getTimeAgo } from './utils/getTimeAgo'

export default function BlogList({ entries }: { entries: any[] }) {
  return (
    <div id="blogs" className="container mx-auto px-4 md:px-40 py-10">
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-100">
        {entries.map((entry) => (
          <Link
            key={entry._id}
            href={`/blog/${entry.slug}`}
            className="flex flex-col md:flex-row items-start justify-between py-8 gap-6 transition-colors duration-300 rounded-xl"
          >
            {/* RIGHT IMAGE (mobile first — goes on top) */}
            {entry.featuredImage && (
              <div className="w-full md:w-60 flex-shrink-0 order-1 md:order-2 p-5">
                <Image
                  src={entry.featuredImage.url}
                  alt={entry.featuredImage.title}
                  width={320}
                  height={200}
                  className="rounded-md object-cover w-full h-56 md:h-36"
                />
              </div>
            )}

            {/* LEFT SECTION */}
            <div className="flex-1 p-5 order-2 md:order-1">
              {/* TITLE */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-snug transition-colors">
                {entry.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-5 max-w-2xl">
                {entry.description ||
                  "Learn Composition, Render Props, and Hooks to scale your React components together with your team without the tech debt."}
              </p>

              {/* META INFO */}
              <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <span>{getTimeAgo(entry.publishedDate)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
