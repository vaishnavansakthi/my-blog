/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import renderRichText from "../renderRichText";

export default function BlogContent({ blog }: { blog: any }) {
  const [showControls, setShowControls] = useState(false);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Show/hide controls on scroll
  useEffect(() => {
    const handleScroll = () => setShowControls(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate estimated reading time
  useEffect(() => {
    if (!blog?.content) return;

    const plainText = JSON.stringify(blog.content)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");

    const wordsPerMinute = 200;
    const wordCount = plainText.split(" ").length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(minutes);
  }, [blog]);

  // 🗣️ Text-to-Speech controls
  const startReading = () => {
  if (!window.speechSynthesis) {
    alert("Sorry, your browser does not support speech synthesis.");
    return;
  }

  // Cancel any ongoing speech
  if (utteranceRef.current) {
    window.speechSynthesis.cancel();
  }

  // ✅ Wait until voices are loaded before creating utterance
  const loadVoicesAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();

    if (!voices.length) {
      // Chrome sometimes needs time to load voices
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoicesAndSpeak();
      };
      return;
    }

    const plainText = document.querySelector(".blog-content")?.textContent || "";
    const utterance = new SpeechSynthesisUtterance(plainText);

    // Pick a default English female voice if available
    const selectedVoice =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setIsPaused(false);
  };

  loadVoicesAndSpeak();
};


  const pauseReading = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

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
        console.log("Share cancelled:", err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-10 leading-relaxed pb-32 md:pb-24">
        {/* Animated Header */}
        <motion.header
          className="mb-6 md:mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-2xl md:text-5xl font-extrabold mb-3 md:mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {blog.title}
          </motion.h1>

          <motion.div
            className="text-gray-500 dark:text-gray-400 text-sm md:text-base flex justify-center items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span>
              {new Date(blog.publishedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {readingTime > 0 && (
              <span className="text-gray-400 dark:text-gray-500">
                • {readingTime} min read
              </span>
            )}
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <button
              onClick={handleShare}
              className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 
                dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 
                text-sm font-medium shadow active:scale-95 transition-transform"
            >
              📤 Share
            </button>

            {/* 🎧 TTS Controls */}
            {!isReading ? (
              <button
                onClick={startReading}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-blue-100 hover:bg-blue-200 
                  dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200 
                  text-sm font-medium shadow active:scale-95 transition-transform"
              >
                🎧 Listen
              </button>
            ) : isPaused ? (
              <button
                onClick={resumeReading}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-green-100 hover:bg-green-200 
                  dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-200 
                  text-sm font-medium shadow active:scale-95 transition-transform"
              >
                ▶️ Resume
              </button>
            ) : (
              <button
                onClick={pauseReading}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 
                  dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-700 dark:text-yellow-200 
                  text-sm font-medium shadow active:scale-95 transition-transform"
              >
                ⏸ Pause
              </button>
            )}
            {isReading && (
              <button
                onClick={stopReading}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-red-100 hover:bg-red-200 
                  dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-200 
                  text-sm font-medium shadow active:scale-95 transition-transform"
              >
                ⏹ Stop
              </button>
            )}
          </motion.div>
        </motion.header>

        {/* Animated Blog Content */}
        <motion.div
          className="blog-content prose prose-base md:prose-lg lg:prose-xl max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-xl prose-img:mx-auto dark:prose-invert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {renderRichText(blog.content)}
        </motion.div>
      </article>

      {/* Animated Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg py-3 px-4 md:py-4 md:px-6 z-50"
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  📝 {blog.title}
                </span>
                {readingTime > 0 && (
                  <span className="text-xs text-gray-500">
                    • {readingTime} min read
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-2 md:space-x-3">
                <button
                  onClick={handleShare}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 
                    dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow 
                    active:scale-95 transition-transform"
                >
                  📤 Share
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
