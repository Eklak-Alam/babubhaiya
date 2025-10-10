'use client'
import { motion } from 'framer-motion'
import { RiShieldCheckLine, RiTranslate } from 'react-icons/ri'
import { FaRegLightbulb, FaHandshake } from 'react-icons/fa'
import { BsHourglassSplit, BsFileEarmarkText } from 'react-icons/bs'
import { useState, useEffect } from "react";

const features = [
  {
    icon: <RiShieldCheckLine className="w-6 h-6" />,
    title: "End-to-End Encryption",
    description: "Military-grade security for all conversations",
    stat: "256-bit AES"
  },
  {
    icon: <FaRegLightbulb className="w-6 h-6" />,
    title: "Smart Compromises",
    description: "AI suggests fair middle-ground solutions",
    stat: "87% success rate"
  },
  {
    icon: <BsHourglassSplit className="w-6 h-6" />,
    title: "Timeline Analysis",
    description: "Evaluates proposed deadlines for realism",
    stat: "3x faster deals"
  },
  {
    icon: <RiTranslate className="w-6 h-6" />,
    title: "Multi-Language",
    description: "Real-time translation for global negotiations",
    stat: "50+ languages"
  },
  {
    icon: <BsFileEarmarkText className="w-6 h-6" />,
    title: "Contract Drafting",
    description: "Automatically generates legal documents",
    stat: "95% accuracy"
  },
  {
    icon: <FaHandshake className="w-6 h-6" />,
    title: "Group Mediation",
    description: "Supports multi-party negotiations",
    stat: "10+ participants"
  }
];

// Stable particle component with deterministic values
const StableParticle = ({ index }) => {
  // Use deterministic values based on index
  const positions = [
    { x: -20, y: -10, w: 6, h: 8 },
    { x: 30, y: 20, w: 5, h: 7 },
    { x: -10, y: 40, w: 7, h: 5 },
    { x: 40, y: -20, w: 4, h: 6 },
    { x: 10, y: 30, w: 8, h: 4 }
  ];
  
  const pos = positions[index] || positions[0];

  return (
    <motion.div
      className="absolute bg-purple-500/20 rounded-full"
      initial={{ 
        opacity: 0, 
        x: pos.x, 
        y: pos.y, 
        width: pos.w, 
        height: pos.h 
      }}
      whileHover={{
        opacity: [0, 0.3, 0],
        transition: { duration: 2, repeat: Infinity }
      }}
    />
  );
};

export default function ChatFeature() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render animated content during SSR
  if (!isMounted) {
    return (
      <section className="relative py-20 overflow-hidden bg-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="h-12 bg-gray-800 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 h-64 animate-pulse">
                <div className="w-14 h-14 bg-gray-700 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded-full w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          initial={{ scale: 1, opacity: 0.2 }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          initial={{ scale: 1.3, opacity: 0.3 }}
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              Next-Gen Chat Features
            </span>
            <motion.span 
              className="block h-1 w-20 mx-auto mt-3 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed tracking-wide"
          >
            Revolutionizing communication with AI-powered features that go beyond basic chat
          </motion.p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
              }}
              className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-500 overflow-hidden group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Stable floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <StableParticle key={i} index={i} />
                ))}
              </div>

              {/* Icon with floating animation */}
              <motion.div 
                initial={{ y: 0 }}
                whileHover={{ y: -5 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-6 text-purple-400 border border-purple-500/20 shadow-lg"
              >
                <motion.div
                  initial={{ rotate: 0, scale: 1 }}
                  whileHover={{ rotate: 10, scale: 1.2 }}
                  transition={{ type: "spring" }}
                >
                  {feature.icon}
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                
                {/* Stat badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="inline-block px-3 py-1 text-xs font-semibold text-purple-400 bg-purple-900/30 rounded-full border border-purple-500/20"
                >
                  {feature.stat}
                </motion.div>
              </div>

              {/* Animated underline */}
              <motion.div 
                className="mt-6 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 shadow-lg max-w-2xl">
            <p className="text-lg text-white">
              <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">92% of users</span> report faster deal closures using our AI-powered chat system
            </p>
          </div>
        </motion.div>
      </div>

      {/* Add CSS for gradient animation */}
      <style jsx>{`
        .bg-gradient-to-r {
          background-size: 200% 200%;
          animation: gradientMove 6s ease infinite;
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}