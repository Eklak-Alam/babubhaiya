'use client'
import { motion } from 'framer-motion'
import { FiUser, FiSearch, FiMessageSquare, FiUsers, FiCheck, FiArrowRight } from 'react-icons/fi'
import { FaRobot, FaHandshake } from 'react-icons/fa'
import { RiShieldKeyholeLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

// Stable floating element component with deterministic values
const StableFloatingElement = ({ index, total, theme }) => {
  // Use deterministic values based on index to avoid hydration mismatches
  const positions = [
    { x: -60, y: -20, w: 80, h: 90 },
    { x: 40, y: 30, w: 60, h: 70 },
    { x: -20, y: 50, w: 70, h: 80 }
  ]
  
  const movements = [
    { y: [0, -15, 0], opacity: [0.5, 0.7, 0.5] },
    { y: [0, 10, 0], opacity: [0.5, 0.8, 0.5] },
    { y: [0, -10, 0], opacity: [0.5, 0.6, 0.5] }
  ]
  
  const pos = positions[index] || positions[0]
  const move = movements[index] || movements[0]
  const duration = 8 + (index * 2)

  const elementColor = theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'

  return (
    <motion.div
      className={`absolute ${elementColor} rounded-full`}
      initial={{ 
        opacity: 0.5,
        x: pos.x,
        y: pos.y,
        width: pos.w,
        height: pos.h
      }}
      animate={move}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  )
}

export default function ChatHowItWorks() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textMuted = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const accentColor = theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
  const sectionBg = theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-white via-blue-50/30 to-white'
  const gradientFrom = theme === 'dark' ? 'from-indigo-500' : 'from-indigo-400'
  const gradientTo = theme === 'dark' ? 'to-purple-600' : 'to-purple-500'

  const steps = [
    {
      icon: <FiUser className="w-6 h-6" />,
      title: "Register & Login",
      description: "Secure authentication with OAuth and email verification",
      features: [
        "Multi-factor authentication",
        "Profile customization",
        "Social login options"
      ]
    },
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: "Find Users",
      description: "Discover collaborators using advanced search",
      features: [
        "Username search",
        "Interest-based matching",
        "AI recommendations"
      ]
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Start Chat",
      description: "Initiate 1:1 or group conversations",
      features: [
        "Encrypted channels",
        "AI icebreaker suggestions",
        "Multi-format messaging"
      ]
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: "AI Assistance",
      description: "Smart mediation during negotiations",
      features: [
        "Real-time suggestions",
        "Context-aware responses",
        "Conflict resolution"
      ]
    },
    {
      icon: <FaHandshake className="w-6 h-6" />,
      title: "Reach Agreement",
      description: "Finalize deals with AI assistance",
      features: [
        "Contract generation",
        "Term summarization",
        "Digital signatures"
      ]
    }
  ]

  // Don't render animated content during SSR
  if (!isMounted) {
    return (
      <section className={`relative py-16 overflow-hidden transition-colors duration-500 ${bgColor}`}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading state */}
          <div className="text-center mb-12">
            <div className={`h-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg max-w-md mx-auto mb-4 animate-pulse`}></div>
            <div className={`h-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded max-w-2xl mx-auto animate-pulse`}></div>
          </div>
          
          <div className="relative">
            <div className={`hidden md:block absolute left-1/2 top-0 h-full w-0.5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} transform -translate-x-1/2`}></div>
            
            <div className="space-y-12">
              {steps.map((_, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12`}>
                  <div className={`absolute -top-6 left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} border-4 ${theme === 'dark' ? 'border-gray-900' : 'border-white'} z-10`}></div>
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-6 md:text-right' : 'md:pl-6 md:text-left'} order-2 md:order-none`}>
                    <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-xl mb-3 animate-pulse`}></div>
                    <div className={`h-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-2 animate-pulse`}></div>
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-3 animate-pulse`}></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                      ))}
                    </div>
                  </div>

                  <div className={`flex-1 order-1 ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'} rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} h-48 animate-pulse`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative py-16 overflow-hidden transition-colors duration-500 ${bgColor}`}>
      {/* Background elements */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} pointer-events-none`}>
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
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          } rounded-full mix-blend-multiply filter blur-3xl`}
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
          className={`absolute bottom-1/3 right-1/3 w-64 h-64 ${
            theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
          } rounded-full mix-blend-multiply filter blur-3xl`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
              How Our AI Chat Works
            </span>
            <motion.span 
              className={`block h-1 w-16 mx-auto mt-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full`}
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`text-base md:text-lg ${textMuted} max-w-3xl mx-auto leading-relaxed`}
          >
            From registration to successful negotiations - see how our platform revolutionizes communication
          </motion.p>
        </motion.div>

        {/* Process timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className={`hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b ${
            theme === 'dark' 
              ? 'from-indigo-500/20 via-purple-500/50 to-pink-500/20' 
              : 'from-indigo-400/20 via-purple-400/50 to-pink-400/20'
          } transform -translate-x-1/2`}></div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12`}
              >
                {/* Step number */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2, type: "spring" }}
                  viewport={{ once: true }}
                  className={`absolute -top-6 left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white font-bold text-sm border-4 ${
                    theme === 'dark' ? 'border-gray-900' : 'border-white'
                  } z-10 shadow-lg`}
                >
                  {index + 1}
                </motion.div>

                {/* Content */}
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className={`flex-1 ${index % 2 === 0 ? 'md:pr-6 md:text-right' : 'md:pl-6 md:text-left'} order-2 md:order-none`}
                >
                  <motion.div 
                    initial={{ y: 0 }}
                    whileHover={{ y: -3 }}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${
                      theme === 'dark' ? 'from-indigo-500/20 to-purple-600/20' : 'from-indigo-400/20 to-purple-500/20'
                    } mb-3 ${
                      theme === 'dark' ? 'text-purple-400 border-purple-500/20' : 'text-purple-500 border-purple-400/20'
                    } border shadow-lg ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}
                  >
                    <motion.div
                      initial={{ rotate: 0, scale: 1 }}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring" }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                  
                  <h3 className={`text-xl font-bold ${textColor} mb-2`}>{step.title}</h3>
                  <p className={`${textMuted} mb-3 text-sm`}>{step.description}</p>
                  
                  <ul className="space-y-1">
                    {step.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (index * 0.15) + (i * 0.1) }}
                        viewport={{ once: true }}
                        className="flex items-start text-sm"
                      >
                        <FiCheck className={`flex-shrink-0 mt-0.5 mr-2 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                        }`} />
                        <span className={textMuted}>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                    className={`mt-3 inline-flex items-center text-xs ${
                      theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-500 hover:text-purple-600'
                    } transition-colors cursor-pointer`}
                  >
                    <span>Learn details</span>
                    <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </motion.div>

                {/* Visual demo */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className={`relative flex-1 order-1 ${
                    index % 2 === 0 ? 'md:order-3' : 'md:order-1'
                  } rounded-xl overflow-hidden border ${
                    theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'
                  } ${cardBg} backdrop-blur-sm h-48 group shadow-lg`}
                >
                  {/* Placeholder for step-specific demo */}
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <div className="text-center p-4">
                      <div className={`text-2xl mb-2 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                      }`}>{step.icon}</div>
                      <h4 className={`font-medium ${textColor} text-sm`}>{step.title} Demo</h4>
                    </div>
                  </div>
                  
                  {/* Stable floating elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <StableFloatingElement key={i} index={i} total={3} theme={theme} />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center"
        >
          <div className={`inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-indigo-500/10 to-purple-600/10 border-indigo-500/20' 
              : 'from-indigo-400/10 to-purple-500/10 border-indigo-400/20'
          } border shadow-lg max-w-2xl`}>
            <RiShieldKeyholeLine className={`w-6 h-6 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
            } mr-3`} />
            <div>
              <h4 className={`text-base font-bold ${textColor}`}>Enterprise-grade Security</h4>
              <p className={`text-sm ${textMuted}`}>All communications are end-to-end encrypted with 256-bit AES</p>
            </div>
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
  )
}