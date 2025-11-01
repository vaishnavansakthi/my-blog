"use client";

import { Typewriter } from "react-simple-typewriter";

export default function HeroLanding() {
  return (
    <section className="bg-gray-50 text-center py-20 max-md:py-10 border-b border-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Intro */}
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900">
          Hi I&apos;m 👋 <span className="font-bold">Vaishnavan</span>
        </h2>

        {/* Typewriter Text */}
        <h3 className="text-2xl md:text-4xl font-semibold text-red-500 mb-6 h-12">
          <Typewriter
            words={["Node.js", "Express.js", "JavaScript", "React Developer"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={70}
            delaySpeed={1500}
          />
        </h3>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          👋Welcome to my dynamic corner of the web! Through this blog, you’ll
          experience the exciting blend of tech, lifestyle, and positivity. 📱🌟
          We’ll explore cutting-edge tech, enhance your lifestyle, and sprinkle
          some daily positivity into your life. Join me for an adventure you
          won’t want to miss! 🚀✨
        </p>
      </div>
    </section>
  );
}
