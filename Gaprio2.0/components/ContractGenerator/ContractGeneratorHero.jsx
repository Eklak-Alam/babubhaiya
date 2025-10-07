'use client'
import { motion } from 'framer-motion'
import { FiFileText, FiCheckCircle, FiGlobe, FiUsers, FiClock } from 'react-icons/fi'
import { FaHandshake } from 'react-icons/fa'

export default function ContractGeneratorHero() {
  return (
    <section className="relative overflow-hidden pb-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 mb-6"
            >
              <FiCheckCircle className="text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-200">AI-Powered Legal Tech</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="block text-white">AI Contract Generator</span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Automated, Legally Sound
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              Our Clause system listens to negotiations and drafts legally binding contracts in real-time, continuously updated with international contract law.
            </motion.p>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center">
                Generate Contract <FiFileText className="ml-2" />
              </button>
              <button className="bg-transparent hover:bg-gray-800/50 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600">
                See How It Works
              </button>
            </motion.div> */}
          </div>

          {/* Right features grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center mb-4 text-blue-400">
                <FiFileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Voice-Powered Drafting</h3>
              <p className="text-gray-400 text-sm">Dictate terms, get instant contracts</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 rounded-lg bg-indigo-900/30 flex items-center justify-center mb-4 text-indigo-400">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Legal Compliance</h3>
              <p className="text-gray-400 text-sm">Real-time regulation checks</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
              <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 text-purple-400">
                <FaHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Clause Suggestions</h3>
              <p className="text-gray-400 text-sm">AI-recommended contract terms</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500 transition-all">
              <div className="w-12 h-12 rounded-lg bg-pink-900/30 flex items-center justify-center mb-4 text-pink-400">
                <FiUsers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Party Sync</h3>
              <p className="text-gray-400 text-sm">Collaborative contract editing</p>
            </div>
          </motion.div>
        </div>

        {/* Business benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Business Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <FiClock className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">80% Faster Drafting</h4>
                <p className="text-gray-400 text-sm">Reduce contract creation time dramatically</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiCheckCircle className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Zero Legal Oversights</h4>
                <p className="text-gray-400 text-sm">Automated compliance checks</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiGlobe className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Global Standardization</h4>
                <p className="text-gray-400 text-sm">Consistent agreements worldwide</p>
              </div>
            </div>
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
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
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