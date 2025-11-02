/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { List, AutoSizer } from "react-virtualized";
import Image from "next/image";
import Link from "next/link";
import { getTimeAgo } from "./utils/getTimeAgo";

export default function BlogList({ entries }: { entries: any[] }) {
  const rowRenderer = ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
    const entry = entries[index];

    return (
      <div key={key} style={style}>
        <Link
          href={`/blog/${entry.slug}`}
          className="flex flex-col md:flex-row items-start justify-between py-8 px-5 gap-4 md:gap-8 transition-all duration-300 rounded-xl hover:bg-gray-50"
        >
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

          <div className="flex-1 order-2 md:order-1 mt-4 md:mt-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-snug">
              {entry.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4 max-w-2xl">
              {entry.description}
            </p>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs md:text-sm">
              <span>{getTimeAgo(entry.publishedDate)}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 max-md:px-0 md:px-40 py-10 h-screen">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            rowCount={entries.length}
            rowHeight={250} // height of each row
            rowRenderer={rowRenderer}
            width={width}
            overscanRowCount={3} // renders 3 extra rows above and below for smoother scrolling
          />
        )}
      </AutoSizer>
    </div>
  );
}