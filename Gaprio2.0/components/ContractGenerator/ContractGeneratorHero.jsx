'use client'
import { motion } from 'framer-motion'
import { FiFileText, FiCheckCircle, FiGlobe, FiUsers, FiClock } from 'react-icons/fi'
import { FaHandshake } from 'react-icons/fa'
import { useTheme } from '@/context/ThemeContext'

export default function ContractGeneratorHero() {
  const { theme } = useTheme()

  // Theme-based styles
  const sectionBackground = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const badgeBackground = theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
  const badgeBorder = theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200'
  const badgeText = theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
  const badgeIcon = theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtitleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const featureBackground = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
  const featureBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const featureHoverBorder = theme === 'dark' ? 'hover:border-blue-500' : 'hover:border-blue-400'
  const featureTitle = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const featureText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const benefitsBackground = theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50/80'
  const benefitsBorder = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
  const benefitsTitle = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const blob1Color = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'
  const blob2Color = theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
  const blobOpacity = theme === 'dark' ? 'opacity-20' : 'opacity-10'

  // Feature icons with theme support
  const features = [
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Voice-Powered Drafting",
      description: "Dictate terms, get instant contracts",
      color: theme === 'dark' ? 'blue' : 'blue',
      iconBg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
      iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      borderColor: theme === 'dark' ? 'hover:border-blue-500' : 'hover:border-blue-400'
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Legal Compliance",
      description: "Real-time regulation checks",
      color: theme === 'dark' ? 'indigo' : 'indigo',
      iconBg: theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100',
      iconColor: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600',
      borderColor: theme === 'dark' ? 'hover:border-indigo-500' : 'hover:border-indigo-400'
    },
    {
      icon: <FaHandshake className="w-5 h-5" />,
      title: "Clause Suggestions",
      description: "AI-recommended contract terms",
      color: theme === 'dark' ? 'purple' : 'purple',
      iconBg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100',
      iconColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      borderColor: theme === 'dark' ? 'hover:border-purple-500' : 'hover:border-purple-400'
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Multi-Party Sync",
      description: "Collaborative contract editing",
      color: theme === 'dark' ? 'pink' : 'pink',
      iconBg: theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-100',
      iconColor: theme === 'dark' ? 'text-pink-400' : 'text-pink-600',
      borderColor: theme === 'dark' ? 'hover:border-pink-500' : 'hover:border-pink-400'
    }
  ]

  // Benefit items with theme support
  const benefits = [
    {
      icon: <FiClock className="w-5 h-5" />,
      title: "80% Faster Drafting",
      description: "Reduce contract creation time dramatically",
      color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
    },
    {
      icon: <FiCheckCircle className="w-5 h-5" />,
      title: "Zero Legal Oversights",
      description: "Automated compliance checks",
      color: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
    },
    {
      icon: <FiGlobe className="w-5 h-5" />,
      title: "Global Standardization",
      description: "Consistent agreements worldwide",
      color: theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
    }
  ]

  return (
    <section className={`relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-24 ${sectionBackground}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 ${blob1Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity} animate-blob`}></div>
        <div className={`absolute bottom-1/3 right-1/3 w-48 h-48 md:w-64 md:h-64 ${blob2Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity} animate-blob animation-delay-2000`}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center px-4 py-2 rounded-full ${badgeBackground} border ${badgeBorder} mb-6`}
            >
              <FiCheckCircle className={`${badgeIcon} mr-2`} />
              <span className={`text-sm font-medium ${badgeText}`}>AI-Powered Legal Tech</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight"
            >
              <span className={`block ${titleColor}`}>AI Contract Generator</span>
              <span className={`bg-gradient-to-r ${theme === 'dark' ? 'from-blue-400 via-indigo-500 to-purple-600' : 'from-blue-600 via-indigo-600 to-purple-700'} bg-clip-text text-transparent animate-gradient`}>
                Automated, Legally Sound
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg sm:text-xl ${subtitleColor} mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed`}
            >
              Our Clause system listens to negotiations and drafts legally binding contracts in real-time, continuously updated with international contract law.
            </motion.p>

            {/* CTA Buttons - Uncomment if needed
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
                Generate Contract <FiFileText className="ml-2" />
              </button>
              <button className="bg-transparent hover:bg-gray-800/50 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600">
                See How It Works
              </button>
            </motion.div>
            */}
          </div>

          {/* Right features grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -4 }}
                className={`${featureBackground} backdrop-blur-sm rounded-xl p-4 sm:p-6 border ${featureBorder} ${feature.borderColor} transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.iconBg} flex items-center justify-center mb-3 sm:mb-4 ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-base sm:text-lg font-semibold ${featureTitle} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`${featureText} text-xs sm:text-sm leading-relaxed`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Business benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`mt-12 sm:mt-16 lg:mt-20 ${benefitsBackground} backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${benefitsBorder}`}
        >
          <h3 className={`text-lg sm:text-xl font-bold ${benefitsTitle} mb-6 text-center`}>Business Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className={`${benefit.color} mt-0.5 mr-3 flex-shrink-0`}>
                  {benefit.icon}
                </div>
                <div>
                  <h4 className={`font-semibold ${benefitsTitle} text-sm sm:text-base`}>
                    {benefit.title}
                  </h4>
                  <p className={`${subtitleColor} text-xs sm:text-sm mt-1`}>
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
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