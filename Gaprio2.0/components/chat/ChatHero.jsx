'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiMessageSquare, FiUsers, FiZap, FiGlobe } from 'react-icons/fi'

export default function ChatHero() {
  const primaryGradient = 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'
  const textGradient = `bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient`
  const glassEffect = 'bg-white/5 backdrop-blur-xl border border-white/10'

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 0,
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: [0, 1, 0],
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

        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`inline-flex items-center px-4 py-2 rounded-2xl ${glassEffect} mb-8 shadow-2xl`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-200">Next-Gen AI Communication Platform</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-white px-2">Intelligent Group</span>
              <span className={textGradient}>Chat Reimagined</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Experience the future of communication with AI that understands context, 
              enhances collaboration, and transforms how teams interact in real-time.
            </motion.p>

            {/* Feature Points */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-8 lg:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {[
                { icon: FiUsers, text: 'Multi-User AI' },
                { icon: FiZap, text: 'Real-time Sync' },
                { icon: FiMessageSquare, text: 'Smart Context' },
                { icon: FiGlobe, text: 'Global Scale' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-300">
                  <item.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Link 
                href="/chat/register" 
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link 
                href="/chat/login" 
                className={`${glassEffect} hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105`}
              >
                Existing Account
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              className="mt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-gray-900" />
                  ))}
                </div>
                <span>Join 10,000+ teams</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Chat Preview */}
            <div className={`relative ${glassEffect} rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500`}>
              {/* Chat Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FiMessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Team Chat</h3>
                  <p className="text-gray-400 text-sm">3 members online</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4">
                {[
                  { user: 'You', message: 'Can the AI help with code review?', time: '2:30 PM', color: 'from-blue-500 to-blue-600' },
                  { user: 'AI Assistant', message: 'Absolutely! I can analyze code and suggest improvements in real-time.', time: '2:31 PM', color: 'from-purple-500 to-purple-600' },
                  { user: 'Sarah', message: 'That would save us hours!', time: '2:31 PM', color: 'from-pink-500 to-pink-600' },
                ].map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.2 }}
                    className={`flex items-start space-x-3 ${index === 1 ? 'ml-8' : ''}`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${msg.color} rounded-full flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">{msg.user}</span>
                        <span className="text-gray-500 text-xs">{msg.time}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Typing Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="flex items-center space-x-2 mt-6 text-gray-400"
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className={`absolute -top-4 -right-4 ${glassEffect} rounded-2xl p-4 shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              className={`absolute -bottom-4 -left-4 ${glassEffect} rounded-2xl p-4 shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50ms</div>
                <div className="text-xs text-gray-400">Response Time</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 3s ease infinite;
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