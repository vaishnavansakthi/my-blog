/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import renderRichText from "../renderRichText";

export default function BlogContent({ blog }: { blog: any }) {
  const [showControls, setShowControls] = useState(false);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
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

  // Load voices and handle voice availability
  useEffect(() => {
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        setTtsError(null);
        console.log("Voices loaded:", voices.length, "voices available");
      } else {
        console.log("No voices available yet");
        setTtsError("No speech voices available");
      }
    };

    // Check immediately
    checkVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }

    // Set timeout as fallback for voice loading
    const voiceTimeout = setTimeout(() => {
      if (!voicesLoaded) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.warn("Voice loading timeout - no voices available");
          setTtsError("Speech synthesis voices failed to load");
        }
      }
    }, 3000);

    // Cleanup
    return () => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      clearTimeout(voiceTimeout);
    };
  }, [voicesLoaded]);

  // Check if speech synthesis is supported
  const isSpeechSupported = useCallback(() => {
    if (typeof window === "undefined") return false;
    
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    const hasSpeechUtterance = 'SpeechSynthesisUtterance' in window;
    
    if (!hasSpeechSynthesis || !hasSpeechUtterance) {
      console.warn("Speech synthesis not supported");
      setTtsError("Text-to-speech not supported in this browser");
      return false;
    }

    // Check if speech synthesis is actually functional
    try {
      const testUtterance = new SpeechSynthesisUtterance();
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0 && !voicesLoaded) {
        console.warn("No voices available");
        setTtsError("No speech voices available. Please check your browser settings.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Speech synthesis test failed:", error);
      setTtsError("Speech synthesis failed to initialize");
      return false;
    }
  }, [voicesLoaded]);

  // Get detailed error message from error event
  const getErrorMessage = (event: SpeechSynthesisErrorEvent) => {
    // The event.error property might be a string in some browsers
    const error = event.error;
    
    switch (error) {
      case 'interrupted':
        return 'Speech was interrupted';
      case 'audio-busy':
        return 'Audio device is busy';
      case 'audio-hardware':
        return 'Audio hardware error';
      case 'network':
        return 'Network error occurred';
      case 'synthesis-unavailable':
        return 'Speech synthesis unavailable';
      case 'synthesis-failed':
        return 'Speech synthesis failed';
      case 'language-unavailable':
        return 'Language unavailable';
      case 'voice-unavailable':
        return 'Voice unavailable';
      case 'text-too-long':
        return 'Text too long';
      case 'invalid-argument':
        return 'Invalid argument';
      case 'not-allowed':
        return 'Speech not allowed (may require user permission)';
      default:
        return `Speech error: ${error || 'Unknown error'}`;
    }
  };

  // 🗣️ Text-to-Speech controls
  const startReading = useCallback(() => {
    setTtsError(null); // Clear previous errors
    
    if (!isSpeechSupported()) {
      // Error already set in isSpeechSupported
      return;
    }

    // Cancel any ongoing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const plainText = document.querySelector(".blog-content")?.textContent || "";
    
    if (!plainText.trim()) {
      setTtsError("No content available to read.");
      return;
    }

    // For very long content, consider chunking it
    if (plainText.length > 10000) {
      console.warn("Content very long, may cause issues on some devices");
    }

    const utterance = new SpeechSynthesisUtterance(plainText);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a suitable voice
    let selectedVoice = null;
    
    // Prefer English voices
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      // Prefer female voices, then default to first English voice
      selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('female')) 
        || englishVoices.find(v => v.name.toLowerCase().includes('samantha')) 
        || englishVoices[0];
    } else if (voices.length > 0) {
      // Fallback to any available voice
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using voice:", selectedVoice.name, selectedVoice.lang);
    } else {
      console.warn("No voices available, using default");
      setTtsError("No suitable voice available");
    }

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => {
      console.log("Speech started");
      setIsReading(true);
      setIsPaused(false);
      setTtsError(null);
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsReading(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      const errorMessage = getErrorMessage(event);
      console.error("Speech synthesis error:", errorMessage, event);
      setTtsError(errorMessage);
      setIsReading(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      console.log("Speech paused");
      setIsPaused(true);
    };

    utterance.onresume = () => {
      console.log("Speech resumed");
      setIsPaused(false);
    };

    utterance.onboundary = (event) => {
      // Optional: handle word boundaries for highlighting
    };

    utteranceRef.current = utterance;
    
    try {
      window.speechSynthesis.speak(utterance);
      console.log("Speech synthesis started");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to start speech synthesis:", error);
      setTtsError(`Failed to start: ${errorMsg}`);
      setIsReading(false);
    }
  }, [isSpeechSupported]);

  const pauseReading = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeReading = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stopReading = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    utteranceRef.current = null;
    setTtsError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
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

          {/* Error Message */}
          {ttsError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
            >
              ⚠️ {ttsError}
            </motion.div>
          )}

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
                disabled={!voicesLoaded || !!ttsError}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-blue-100 hover:bg-blue-200 
                  dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200 
                  text-sm font-medium shadow active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {voicesLoaded ? "🎧 Listen" : "⏳ Loading voices..."}
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
                
                {!isReading ? (
                  <button
                    onClick={startReading}
                    disabled={!voicesLoaded || !!ttsError}
                    className="px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 
                      dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200 
                      text-sm font-medium shadow active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {voicesLoaded ? "🎧 Listen" : "⏳ Loading..."}
                  </button>
                ) : (
                  <button
                    onClick={stopReading}
                    className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 
                      dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-200 
                      text-sm font-medium shadow active:scale-95 transition-transform"
                  >
                    ⏹ Stop
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}