"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiArrowRight,
  FiMessageSquare,
  FiUsers,
  FiZap,
  FiStar,
  FiCheck,
  FiCpu,
  FiShield,
} from "react-icons/fi";
import { useState, useEffect } from "react";

// Stable particle component with deterministic animations
const FloatingParticle = ({ index, totalParticles }) => {
  // Use stable, deterministic values based on index
  const stableLeft = (index / totalParticles) * 100;
  const stableTop = (index * 7) % 100;
  const duration = 4 + (index % 3); // Deterministic duration
  const delay = (index % 5) * 0.5; // Deterministic delay
  const xMovement = Math.sin(index) * 20; // Deterministic movement

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white/40 rounded-full"
      initial={{
        y: 0,
        x: 0,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, xMovement, 0],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
      style={{
        left: `${stableLeft}%`,
        top: `${stableTop}%`,
      }}
    />
  );
};

export default function ChatHero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const features = [
    {
      icon: FiUsers,
      text: "Smart Groups",
      desc: "AI-powered team chats",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiZap,
      text: "Lightning Fast",
      desc: "Real-time messaging",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FiCpu,
      text: "AI Assistant",
      desc: "Context-aware responses",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FiShield,
      text: "Secure",
      desc: "End-to-end encrypted",
      color: "from-orange-500 to-red-500",
    },
  ];

  // Don't render random content during SSR
  if (!isMounted) {
    return (
      <section className="relative min-h-screen bg-gray-900 overflow-hidden">
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32 items-center">
            {/* Simple loading state */}
            <div className="text-center lg:text-left space-y-8 sm:space-y-12">
              <div className="h-20 bg-gray-800 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs - Fixed positions */}
        <motion.div
          initial={{
            scale: 1,
            opacity: 0.2,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/30 rounded-full blur-4xl"
        />
        <motion.div
          initial={{
            scale: 1.3,
            opacity: 0.3,
          }}
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-4xl"
        />

        {/* Stable Floating Particles - Only render on client */}
        {isMounted && (
  <div className="absolute inset-0">
    {[...Array(15)].map((_, index) => (
      <FloatingParticle key={index} index={index} totalParticles={15} />
    ))}
  </div>
)}


        {/* Static Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#e5e7eb_1px, transparent_1px), linear-gradient(90deg, #e5e7eb_1px, transparent_1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Responsive Container */}
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8 sm:space-y-12"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  NEXT-GEN AI CHAT
                </span>
              </div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full" />
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-6">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent block">
                  Group Chat
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light px-2 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                AI-powered group chats that understand context, enhance
                collaboration, and deliver instant insights across all your
                devices.
              </motion.p>
            </div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`p-2 sm:p-3 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0`}
                    >
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-bold text-white text-sm sm:text-base truncate">
                        {feature.text}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">
                        {feature.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center"
            >
              <Link
                href="/chat/register"
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105 w-full sm:w-auto min-w-[160px] sm:min-w-[200px]"
              >
                <span className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                  Start Free Trial
                  <FiArrowRight className="transition-transform group-hover:translate-x-1 group-hover:scale-110" />
                </span>
              </Link>

              <Link
                href="/chat/login"
                className="group bg-white/10 hover:bg-white/20 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto min-w-[160px] sm:min-w-[200px]"
              >
                <span className="text-base sm:text-lg">Existing Account</span>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 text-sm text-gray-400 pt-4 sm:pt-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {["/team/eklak.jpg", "/team/hanu.jpg", "/team/preet.jpg"].map(
                    (img, index) => (
                      <motion.img
                        key={index}
                        src={img}
                        alt={`Team member ${index + 1}`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-900 shadow-lg object-cover"
                        whileHover={{ scale: 1.1, y: -2 }}
                      />
                    )
                  )}
                </div>

                <div className="text-left">
                  <div className="font-bold text-white text-sm sm:text-base">
                    3+ Teams
                  </div>
                  <div className="text-xs">Trusted worldwide</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 bg-white/5 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/10">
                <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <div className="text-left">
                  <div className="font-bold text-white text-sm sm:text-base">
                    99.9% Uptime
                  </div>
                  <div className="text-xs">Always available</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Chat Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl mx-auto max-w-md lg:max-w-full"
            >
              {/* Chat Header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl truncate">
                    AI Team Space
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></span>
                    3 members • Live
                  </p>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    user: "You",
                    message:
                      "Can the AI help optimize our deployment pipeline?",
                    time: "2:30 PM",
                    color: "from-blue-500 to-cyan-500",
                    delay: 0.8,
                  },
                  {
                    user: "AI Assistant",
                    message:
                      "Absolutely! I can analyze your workflow and suggest optimizations for faster deployments.",
                    time: "2:31 PM",
                    color: "from-purple-500 to-pink-500",
                    delay: 1.0,
                  },
                  {
                    user: "Sarah",
                    message: "That would save us hours!",
                    time: "2:32 PM",
                    color: "from-green-500 to-emerald-500",
                    delay: 1.2,
                  },
                ].map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: msg.delay }}
                    className={`flex gap-3 sm:gap-4 ${
                      index === 1 ? "ml-4 sm:ml-6" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${msg.color} rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <span className="text-white font-bold text-sm sm:text-base truncate">
                          {msg.user}
                        </span>
                        <span className="text-gray-500 text-xs flex-shrink-0">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                        {msg.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Typing Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8 text-gray-400 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10"
              >
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  AI Assistant is analyzing...
                </span>
              </motion.div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-black text-white">
                  50ms
                </div>
                <div className="text-xs text-gray-300 font-medium">
                  Response Time
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-black text-white">
                  24/7
                </div>
                <div className="text-xs text-gray-300 font-medium">
                  AI Online
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 sm:gap-2"
        >
          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            Scroll to explore
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-1 sm:mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}