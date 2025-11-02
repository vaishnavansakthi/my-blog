/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import renderRichText from "../renderRichText";

export default function BlogContent({ blog }: { blog: any }) {
  const [showControls, setShowControls] = useState(false);

  // Show/hide controls on scroll
  useEffect(() => {
    const handleScroll = () => setShowControls(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: "Check out this blog post!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      }
    }
  };

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-10 leading-relaxed pb-32 md:pb-24">
        <header className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-5xl font-extrabold mb-3 md:mb-4 text-gray-900">
            {blog.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {new Date(blog.publishedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-6">
            <button
              onClick={handleShare}
              className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow active:scale-95 transition-transform"
            >
              📤 Share
            </button>
          </div>
        </header>

        <div className="blog-content prose prose-base md:prose-lg lg:prose-xl max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-xl prose-img:mx-auto dark:prose-invert">
          {renderRichText(blog.content)}
        </div>
      </article>

      {/* Fixed bottom controls */}
      {showControls && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg py-3 px-4 md:py-4 md:px-6 z-50">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
            <div className="flex items-center space-x-3 md:space-x-4">
              <span className="text-sm font-medium text-gray-700">
                📝 {blog.title}
              </span>
            </div>

            <div className="flex items-center justify-between md:justify-end space-x-2 md:space-x-3">
              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow active:scale-95 transition-transform"
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}