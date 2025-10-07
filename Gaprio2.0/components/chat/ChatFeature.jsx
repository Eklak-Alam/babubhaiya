'use client'
import { motion } from 'framer-motion'
import { RiShieldCheckLine, RiTranslate } from 'react-icons/ri'
import { FaRegLightbulb, FaHandshake } from 'react-icons/fa'
import { BsHourglassSplit, BsFileEarmarkText } from 'react-icons/bs'
import { FiArrowRight } from 'react-icons/fi'

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

export default function ChatFeature() {
  return (
    <section className="relative py-20 overflow-hidden bg-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient">
              Next-Gen Chat Features
            </span>
            <span className="block h-1 w-20 mx-auto mt-3 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full"></span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
                boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)"
              }}
              className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-500 overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-purple-500/20 rounded-full"
                    initial={{ 
                      opacity: 0,
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                      width: Math.random() * 8 + 4,
                      height: Math.random() * 8 + 4
                    }}
                    whileHover={{
                      opacity: [0, 0.3, 0],
                      transition: { duration: 2, repeat: Infinity }
                    }}
                  />
                ))}
              </div>

              {/* Icon with floating animation */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-6 text-purple-400 border border-purple-500/20 shadow-lg"
              >
                <motion.div
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
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
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

              {/* Learn more link */}
              {/* <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Learn more</span>
                <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
              </motion.div> */}
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

      {/* Animation styles */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 6s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.2); }
          66% { transform: translate(-30px, 30px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </section>
  )
}