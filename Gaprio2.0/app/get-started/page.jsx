'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  FiUsers, 
  FiMessageSquare, 
  FiFileText, 
  FiCheck, 
  FiArrowRight, 
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiGlobe,
  FiStar
} from 'react-icons/fi'
import { 
  FaHandshake, 
  FaRobot, 
  FaRegLightbulb,
  FaBalanceScale
} from 'react-icons/fa'

export default function GetStartedPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const services = [
    {
      id: 'accord',
      icon: <FiUsers className="w-8 h-8" />,
      title: "Multi-User AI Chat",
      subtitle: "Collaborative negotiation workspace",
      description: "Our Accord platform enables teams to work together with AI assistance, maintaining context across all participants for seamless collaboration.",
      gradient: "from-blue-500 to-cyan-500",
      url: "/chat",
      features: {
        title: "Key Features",
        items: [
          { icon: <FiMessageSquare className="w-5 h-5" />, text: "Real-time consensus building" },
          { icon: <FaRobot className="w-5 h-5" />, text: "Automated meeting summaries" },
          { icon: <FiUsers className="w-5 h-5" />, text: "Role-based perspective analysis" },
          { icon: <FiTarget className="w-5 h-5" />, text: "Integrated decision tracking" }
        ]
      },
      benefits: {
        title: "Business Benefits",
        items: [
          { icon: <FiClock className="w-5 h-5" />, text: "Cut meeting times in half" },
          { icon: <FiTrendingUp className="w-5 h-5" />, text: "Improve team alignment by 75%" },
          { icon: <FiCheck className="w-5 h-5" />, text: "Capture all stakeholder inputs" }
        ]
      },
      cta: "Start Chat"
    },
    {
      id: 'clause',
      icon: <FiFileText className="w-8 h-8" />,
      title: "AI Contract Generator",
      subtitle: "Automated, legally sound contract creation",
      description: "Our Clause system listens to negotiations and drafts legally binding contracts in real-time, continuously updated with international contract law.",
      gradient: "from-purple-500 to-pink-500",
      url: "/contract-generator",
      features: {
        title: "Key Features",
        items: [
          { icon: <FaRegLightbulb className="w-5 h-5" />, text: "Voice-powered contract drafting" },
          { icon: <FaBalanceScale className="w-5 h-5" />, text: "Real-time legal compliance checks" },
          { icon: <FiZap className="w-5 h-5" />, text: "Automated clause suggestions" },
          { icon: <FiGlobe className="w-5 h-5" />, text: "Multi-party contract synchronization" }
        ]
      },
      benefits: {
        title: "Business Benefits",
        items: [
          { icon: <FiClock className="w-5 h-5" />, text: "Reduce contract drafting time by 80%" },
          { icon: <FiShield className="w-5 h-5" />, text: "Eliminate costly legal oversights" },
          { icon: <FiTrendingUp className="w-5 h-5" />, text: "Standardize agreements across teams" }
        ]
      },
      cta: "Generate Contracts"
    }
  ]

  // Don't render animated content during SSR
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Loading state */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-800 rounded-lg max-w-md mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {[1, 2].map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50 animate-pulse">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl mb-6"></div>
                <div className="h-8 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-6"></div>
                <div className="h-4 bg-gray-700 rounded mb-8"></div>
                <div className="space-y-4 mb-8">
                  <div className="h-6 bg-gray-700 rounded w-32"></div>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="space-y-4 mb-8">
                  <div className="h-6 bg-gray-700 rounded w-32"></div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-700 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 4 }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-4xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 4, delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-4xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 4, delay: 2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-4xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gray-800/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-700/50 mb-8"
          >
            <FiStar className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white">Choose Your AI Solution</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent block">
              Transform Your
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block">
              Business Communication
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Select the AI-powered solution that fits your needs. Start with collaborative chat or automated contract generation.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Service Card */}
              <div className="relative bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 overflow-hidden">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

                {/* Header */}
                <div className="relative z-10 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 text-white shadow-lg`}
                  >
                    {service.icon}
                  </motion.div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-300 mb-4 font-medium">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="relative z-10 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
                    {service.features.title}
                  </h3>
                  <div className="space-y-3">
                    {service.features.items.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: (index * 0.2) + (featureIndex * 0.1) }}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${service.gradient} bg-opacity-20 flex items-center justify-center text-white`}>
                          {feature.icon}
                        </div>
                        <span className="text-sm lg:text-base">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="relative z-10 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
                    {service.benefits.title}
                  </h3>
                  <div className="space-y-3">
                    {service.benefits.items.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefitIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: (index * 0.2) + (benefitIndex * 0.1) + 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm lg:text-base text-gray-300">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Crystal CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative z-10"
                >
                  <Link
                    href={service.url}
                    className="group relative w-full flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-600 hover:border-gray-400 overflow-hidden"
                  >
                    {/* Crystal Border Effect */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]`} />
                    
                    {/* Subtle Background Glow */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Button Content */}
                    <span className="relative z-10 text-base lg:text-lg">
                      {service.cta}
                    </span>
                    <FiArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />

                    {/* Subtle Hover Effects */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute bg-gradient-to-r ${service.gradient} rounded-full opacity-5`}
                      initial={{ 
                        opacity: 0,
                        x: i * 40 - 60,
                        y: i * 30 - 45,
                        width: 20 + i * 10,
                        height: 20 + i * 10
                      }}
                      animate={{
                        opacity: [0, 0.1, 0],
                        y: [i * 30 - 45, i * 30 - 60, i * 30 - 45]
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 1.5
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 lg:mt-24"
        >
          <div className="inline-block bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 max-w-2xl">
            <FaHandshake className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">
              Need Help Choosing?
            </h3>
            <p className="text-gray-300">
              Both services integrate seamlessly. Start with one and add the other anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}