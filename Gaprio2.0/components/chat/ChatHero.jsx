'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiMessageSquare, FiUsers, FiZap, FiGlobe, FiStar, FiCheck, FiCpu, FiShield } from 'react-icons/fi'

export default function ChatHero() {
  const glassEffect = 'bg-white/10 backdrop-blur-xl border border-white/20'
  
  const features = [
    { icon: FiUsers, text: 'Smart Groups', desc: 'AI-powered team chats', color: 'from-blue-500 to-cyan-500' },
    { icon: FiZap, text: 'Lightning Fast', desc: 'Real-time messaging', color: 'from-purple-500 to-pink-500' },
    { icon: FiCpu, text: 'AI Assistant', desc: 'Context-aware responses', color: 'from-green-500 to-emerald-500' },
    { icon: FiShield, text: 'Secure', desc: 'End-to-end encrypted', color: 'from-orange-500 to-red-500' }
  ]

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-10"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <FiStar className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  NEXT-GEN AI CHAT PLATFORM
                </span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Group Chat
                </span>
                <motion.span 
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'] 
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ 
                    backgroundSize: '200% 100%' 
                  }}
                >
                  Perfected
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Revolutionize team communication with AI that understands context, 
                enhances collaboration, and delivers instant insights in real-time.
              </motion.p>
            </div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 gap-5 max-w-md"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-white text-sm lg:text-base">{feature.text}</div>
                      <div className="text-xs text-gray-400 mt-1">{feature.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center"
            >
              <Link 
                href="/chat/register" 
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105 min-w-[200px]"
              >
                <span className="flex items-center gap-3 text-lg">
                  Start Free Trial
                  <FiArrowRight className="transition-transform group-hover:translate-x-1 group-hover:scale-110" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link 
                href="/chat/login" 
                className="group bg-white/10 hover:bg-white/20 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[200px]"
              >
                <span className="text-lg">Existing Account</span>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-gray-400 pt-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-slate-900 shadow-lg"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">10K+ Teams</div>
                  <div className="text-xs">Trusted worldwide</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                <FiCheck className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <div className="font-bold text-white">99.9% Uptime</div>
                  <div className="text-xs">Always available</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Premium Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Chat Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              {/* Chat Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiMessageSquare className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl">AI Team Space</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    3 members • Live
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-6">
                {[
                  {
                    user: 'You',
                    message: 'Can the AI help optimize our deployment pipeline?',
                    time: '2:30 PM',
                    color: 'from-blue-500 to-cyan-500',
                    delay: 0.8
                  },
                  {
                    user: 'AI Assistant',
                    message: 'Absolutely! I can analyze your current workflow and suggest optimizations for faster deployments and better CI/CD practices.',
                    time: '2:31 PM',
                    color: 'from-purple-500 to-pink-500',
                    delay: 1.0
                  },
                  {
                    user: 'Sarah',
                    message: 'That would save us hours of manual configuration!',
                    time: '2:32 PM',
                    color: 'from-green-500 to-emerald-500',
                    delay: 1.2
                  }
                ].map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: msg.delay }}
                    className={`flex gap-4 ${index === 1 ? 'ml-6' : ''}`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${msg.color} rounded-xl flex-shrink-0 shadow-lg`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-bold text-sm">{msg.user}</span>
                        <span className="text-gray-500 text-xs">{msg.time}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-2xl p-4 border border-white/10">
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
                className="flex items-center gap-3 mt-8 text-gray-400 bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm font-medium">AI Assistant is analyzing...</span>
              </motion.div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-2xl font-black text-white">50ms</div>
                <div className="text-xs text-gray-300 font-medium">Response Time</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-2xl font-black text-white">24/7</div>
                <div className="text-xs text-gray-300 font-medium">AI Online</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-400 font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}