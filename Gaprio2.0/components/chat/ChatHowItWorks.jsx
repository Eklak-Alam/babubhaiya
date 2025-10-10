'use client'
import { motion } from 'framer-motion'
import { FiUser, FiSearch, FiMessageSquare, FiUsers, FiCheck, FiArrowRight } from 'react-icons/fi'
import { FaRobot, FaHandshake } from 'react-icons/fa'
import { RiShieldKeyholeLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'

// Stable floating element component with deterministic values
const StableFloatingElement = ({ index, total }) => {
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

  return (
    <motion.div
      className="absolute bg-purple-500/10 rounded-full"
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      <section className="relative py-20 overflow-hidden bg-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading state */}
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-800 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-800 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 md:space-y-0">
              {steps.map((_, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16`}>
                  <div className="absolute -top-8 left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-900 z-10"></div>
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} order-2 md:order-none`}>
                    <div className="w-14 h-14 bg-gray-700 rounded-xl mb-4 animate-pulse"></div>
                    <div className="h-7 bg-gray-700 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-700 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>

                  <div className={`flex-1 order-1 ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'} rounded-xl border border-gray-700 bg-gray-800 h-64 animate-pulse`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gray-900">
      {/* Background elements */}
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
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              How Our AI Chat Works
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
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed tracking-wide"
          >
            From registration to successful negotiations - see how our platform revolutionizes communication
          </motion.p>
        </motion.div>

        {/* Process timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-indigo-500/20 via-purple-500/50 to-pink-500/20 transform -translate-x-1/2"></div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16`}
              >
                {/* Step number */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2, type: "spring" }}
                  viewport={{ once: true }}
                  className="absolute -top-8 left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg border-4 border-gray-900 z-10"
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
                  className={`flex-1 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} order-2 md:order-none`}
                >
                  <motion.div 
                    initial={{ y: 0 }}
                    whileHover={{ y: -5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-4 text-purple-400 border border-purple-500/20 shadow-lg ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}
                  >
                    <motion.div
                      initial={{ rotate: 0, scale: 1 }}
                      whileHover={{ rotate: 10, scale: 1.2 }}
                      transition={{ type: "spring" }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 mb-4">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (index * 0.15) + (i * 0.1) }}
                        viewport={{ once: true }}
                        className="flex items-start"
                      >
                        <FiCheck className="flex-shrink-0 mt-1 mr-2 text-purple-400" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                    className="mt-4 inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
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
                  className={`relative flex-1 order-1 ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'} rounded-xl overflow-hidden border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm h-64 group`}
                >
                  {/* Placeholder for step-specific demo */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center p-6">
                      <div className="text-4xl mb-3 text-purple-400">{step.icon}</div>
                      <h4 className="font-medium text-white">{step.title} Demo</h4>
                    </div>
                  </div>
                  
                  {/* Stable floating elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <StableFloatingElement key={i} index={i} total={3} />
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
          className="mt-20 flex flex-col items-center"
        >
          <div className="inline-flex items-center px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 shadow-lg max-w-2xl">
            <RiShieldKeyholeLine className="w-8 h-8 text-purple-400 mr-4" />
            <div>
              <h4 className="text-lg font-bold text-white">Enterprise-grade Security</h4>
              <p className="text-gray-400">All communications are end-to-end encrypted with 256-bit AES</p>
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