'use client'
import { motion } from 'framer-motion'
import { RiShieldCheckLine, RiTranslate } from 'react-icons/ri'
import { FaRegLightbulb, FaHandshake } from 'react-icons/fa'
import { BsHourglassSplit, BsFileEarmarkText } from 'react-icons/bs'
import { useState, useEffect } from "react";
import { useTheme } from '@/context/ThemeContext';

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
const StableParticle = ({ index, theme }) => {
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
      className={`absolute rounded-full ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-400/20'}`}
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
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Theme-based styles
  const sectionBackground = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const cardBackground = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
  const cardBorder = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
  const cardHoverBorder = theme === 'dark' ? 'hover:border-purple-500/70' : 'hover:border-purple-500/50'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const descriptionColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const subtitleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const iconBackground = theme === 'dark' ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20' : 'bg-gradient-to-br from-indigo-100 to-purple-100'
  const iconBorder = theme === 'dark' ? 'border-purple-500/20' : 'border-purple-500/30'
  const iconColor = theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
  const statBackground = theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
  const statBorder = theme === 'dark' ? 'border-purple-500/20' : 'border-purple-500/30'
  const statText = theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
  const bannerBackground = theme === 'dark' ? 'bg-gradient-to-r from-indigo-500/10 to-purple-600/10' : 'bg-gradient-to-r from-indigo-50 to-purple-50'
  const bannerBorder = theme === 'dark' ? 'border-indigo-500/20' : 'border-indigo-500/30'
  const bannerText = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const loadingBackground = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
  const loadingBorder = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300'
  const gradientFrom = theme === 'dark' ? 'from-indigo-400' : 'from-indigo-600'
  const gradientVia = theme === 'dark' ? 'via-purple-500' : 'via-purple-600'
  const gradientTo = theme === 'dark' ? 'to-pink-500' : 'to-pink-600'
  const blob1Color = theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
  const blob2Color = theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
  const blobOpacity = theme === 'dark' ? 'opacity-20' : 'opacity-10'

  // Don't render animated content during SSR
  if (!isMounted) {
    return (
      <section className={`relative py-20 overflow-hidden ${sectionBackground}`}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`h-12 ${loadingBackground} rounded-lg max-w-md mx-auto mb-4 animate-pulse`}></div>
            <div className={`h-6 ${loadingBackground} rounded max-w-2xl mx-auto animate-pulse`}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((_, index) => (
              <div key={index} className={`${cardBackground} rounded-2xl p-8 border ${loadingBorder} h-64 animate-pulse`}>
                <div className={`w-14 h-14 ${loadingBackground} rounded-xl mb-6`}></div>
                <div className={`h-6 ${loadingBackground} rounded mb-3`}></div>
                <div className={`h-4 ${loadingBackground} rounded mb-4`}></div>
                <div className={`h-6 ${loadingBackground} rounded-full w-20`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative py-20 overflow-hidden ${sectionBackground}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
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
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${blob1Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity}`}
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
          className={`absolute bottom-1/3 right-1/3 w-64 h-64 ${blob2Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity}`}
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
            <span className={`bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} bg-clip-text text-transparent drop-shadow-lg`}>
              Next-Gen Chat Features
            </span>
            <motion.span 
              className={`block h-1 w-20 mx-auto mt-3 bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} rounded-full`}
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
            className={`text-lg md:text-lg ${subtitleColor} max-w-3xl mx-auto leading-relaxed tracking-wide`}
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
              className={`relative ${cardBackground} backdrop-blur-sm rounded-2xl p-8 border ${cardBorder} ${cardHoverBorder} transition-all duration-500 overflow-hidden group shadow-sm hover:shadow-lg`}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Stable floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <StableParticle key={i} index={i} theme={theme} />
                ))}
              </div>

              {/* Icon with floating animation */}
              <motion.div 
                initial={{ y: 0 }}
                whileHover={{ y: -5 }}
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${iconBackground} mb-6 ${iconColor} border ${iconBorder} shadow-lg`}
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
                <h3 className={`text-xl font-bold ${titleColor} mb-3`}>{feature.title}</h3>
                <p className={`${descriptionColor} mb-4`}>{feature.description}</p>
                
                {/* Stat badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className={`inline-block px-3 py-1 text-xs font-semibold ${statText} ${statBackground} rounded-full border ${statBorder}`}
                >
                  {feature.stat}
                </motion.div>
              </div>

              {/* Animated underline */}
              <motion.div 
                className={`mt-6 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0`}
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
          <div className={`inline-block px-6 py-4 rounded-2xl ${bannerBackground} border ${bannerBorder} shadow-lg max-w-2xl`}>
            <p className={`text-lg ${bannerText}`}>
              <span className={`font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>92% of users</span> report faster deal closures using our AI-powered chat system
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