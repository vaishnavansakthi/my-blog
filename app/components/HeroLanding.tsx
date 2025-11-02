"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function HeroLanding() {
  return (
    <section className="bg-gray-50 text-center py-20 max-md:py-10 border-b border-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Intro */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-semibold text-gray-900"
        >
          Hi I&apos;m 👋 <span className="font-bold text-red-500">Vaishnavan</span>
        </motion.h2>

        {/* Typewriter Text */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-semibold text-red-500 mb-6 h-12"
        >
          <Typewriter
            words={["Node.js", "Express.js", "JavaScript", "React Developer"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={70}
            delaySpeed={1500}
          />
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
        >
          👋Welcome to my dynamic corner of the web! Through this blog, you’ll
          experience the exciting blend of tech, lifestyle, and positivity. 📱🌟
          We’ll explore cutting-edge tech, enhance your lifestyle, and sprinkle
          some daily positivity into your life. Join me for an adventure you
          won’t want to miss! 🚀✨
        </motion.p>
      </div>
    </section>
  );
}
