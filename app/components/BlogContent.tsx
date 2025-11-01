/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import renderRichText from "../renderRichText";

export default function BlogContent({ blog }: { blog: any }) {
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [showControls, setShowControls] = useState(false);
  
  // Use refs for values that need to be fresh in callbacks
  const readingRef = useRef(reading);
  const pausedRef = useRef(paused);
  const currentParagraphRef = useRef<number>(0);
  const paragraphsRef = useRef<string[]>([]);

  // Sync refs with state
  useEffect(() => {
    readingRef.current = reading;
  }, [reading]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Show/hide controls based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowControls(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load preferred female voice
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Samantha") ||
              v.name.includes("Google US English Female") ||
              v.name.includes("Zira") ||
              v.name.includes("Natural") ||
              v.name.includes("Female"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      setFemaleVoice(preferred || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Highlight current paragraph
  useEffect(() => {
    const paragraphs = Array.from(document.querySelectorAll(".blog-content p"));
    paragraphs.forEach((p, i) => {
      if (currentIndex !== null && i === currentIndex) {
        p.classList.add("highlight");
        // Only auto-scroll if controls are not visible (user isn't manually scrolling)
        if (!showControls) {
          p.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        p.classList.remove("highlight");
      }
    });
  }, [currentIndex, showControls]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakNextParagraph = (startIndex: number) => {
    const paragraphs = paragraphsRef.current;
    
    if (startIndex >= paragraphs.length) {
      setReading(false);
      setPaused(false);
      setCurrentIndex(null);
      return;
    }

    // Cancel any existing utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(paragraphs[startIndex]);
    utterance.voice = femaleVoice || null;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = femaleVoice?.lang || "en-US";

    utterance.onstart = () => {
      setCurrentIndex(startIndex);
      currentParagraphRef.current = startIndex;
      setPaused(false);
    };

    utterance.onend = () => {
      // Use refs to get fresh state values
      if (readingRef.current && !pausedRef.current) {
        // Move to next paragraph
        speakNextParagraph(startIndex + 1);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setReading(false);
      setPaused(false);
      setCurrentIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleReadBlog = () => {
    // If already reading, stop
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      setPaused(false);
      setCurrentIndex(null);
      return;
    }

    // Extract paragraphs
    const paragraphs = Array.from(
      document.querySelectorAll<HTMLParagraphElement>(".blog-content p")
    )
      .map((p) => p.innerText.trim())
      .filter((t) => t.length > 0);

    if (paragraphs.length === 0) {
      alert("No content found to read.");
      return;
    }

    paragraphsRef.current = paragraphs;
    setReading(true);
    setPaused(false);
    speakNextParagraph(0);
  };

  const handlePauseResume = () => {
    if (!reading) return;

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      // Pause
      window.speechSynthesis.pause();
      setPaused(true);
    } else if (window.speechSynthesis.paused) {
      // Resume
      window.speechSynthesis.resume();
      setPaused(false);
    } else if (paused) {
      // If paused but not speaking, restart from current paragraph
      const currentIndex = currentParagraphRef.current;
      if (currentIndex !== null) {
        speakNextParagraph(currentIndex);
      }
    }
  };

  const handleStopReading = () => {
    window.speechSynthesis.cancel();
    setReading(false);
    setPaused(false);
    setCurrentIndex(null);
  };

  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: "Check out this blog post!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Share was cancelled, do nothing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <article className="max-w-4xl mx-auto px-6 md:px-8 py-10 leading-relaxed pb-24">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">
            {blog.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {new Date(blog.publishedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow"
            >
              📤 Share
            </button>

            <button
              onClick={handleReadBlog}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow ${
                reading
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {reading ? "⏹ Stop Reading" : "🔊 Read Blog"}
            </button>

            {reading && (
              <button
                onClick={handlePauseResume}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow ${
                  paused 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                {paused ? "▶️ Resume" : "⏸ Pause"}
              </button>
            )}
          </div>
        </header>

        <div className="blog-content prose prose-lg md:prose-xl max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-xl prose-img:mx-auto">
          {renderRichText(blog.content)}
        </div>

        <style jsx>{`
          .highlight {
            background-color: #fef3cd;
            transition: background-color 0.3s ease;
            padding: 8px 12px;
            border-radius: 4px;
          }
        `}</style>
      </article>

      {/* Fixed bottom control bar */}
      {(reading || showControls) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg py-4 px-6 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {reading ? "Now Reading" : "Blog Controls"}
              </span>
              {currentIndex !== null && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Paragraph {currentIndex + 1} of {paragraphsRef.current.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow"
              >
                📤 Share
              </button>

              {reading ? (
                <>
                  <button
                    onClick={handlePauseResume}
                    className={`px-4 py-2 rounded-lg text-sm font-medium shadow ${
                      paused 
                        ? "bg-green-500 text-white hover:bg-green-600" 
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    {paused ? "▶️ Resume" : "⏸ Pause"}
                  </button>
                  
                  <button
                    onClick={handleStopReading}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium shadow"
                  >
                    ⏹ Stop
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReadBlog}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow"
                >
                  🔊 Read Blog
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}