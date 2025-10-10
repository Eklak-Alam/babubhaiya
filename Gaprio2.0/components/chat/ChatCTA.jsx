'use client'
import { motion } from 'framer-motion'
import { FiArrowRight, FiZap } from 'react-icons/fi'
import { FaRegHandPointer } from 'react-icons/fa'

export default function ChatCTA() {
  return (
    <section className="relative py-20 overflow-hidden bg-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Sparkle icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 text-white shadow-xl"
        >
          <FiZap className="w-8 h-8" />
        </motion.div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
        >
          <span className="block text-white mb-3">Ready to Transform</span>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Your Communication?
          </span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-gray-300 max-w-3xl mx-auto mb-10"
        >
          Join thousands who already revolutionized their negotiations with our AI-powered platform.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/chat/login"
            className="relative group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center">
              Start Chat <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 pointer-events-none" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/chat/register"
            className="relative group bg-transparent hover:bg-gray-800/50 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-gray-700 hover:border-gray-600"
          >
            <span className="relative z-10 flex items-center">
              Create Account <FaRegHandPointer className="ml-2 group-hover:animate-bounce" />
            </span>
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/10 transition-all duration-300 pointer-events-none" />
          </motion.a>
        </motion.div>

        {/* Guarantee badge */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700"
        >          <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">No credit card required • 14-day free trial</span>
        </motion.div> */}
      </div>


      {/* Animation styles */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </section>
  )
}