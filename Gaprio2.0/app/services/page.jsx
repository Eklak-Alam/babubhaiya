'use client'
import { motion } from 'framer-motion'
import { FiFileText, FiHeart, FiUsers, FiCheck, FiZap, FiGlobe, FiLock, FiClock, FiTrendingUp } from 'react-icons/fi'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

export default function ServicesPage() {
  const { theme } = useTheme()

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textMuted = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const accentColor = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
  const sectionBg = theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-white via-blue-50/30 to-white'

  const services = [
    {
      icon: <FiFileText className="w-6 h-6" />,
      name: "AI Contract Generator",
      tagline: "Automated, legally sound contract creation",
      description: "Our Clause system listens to negotiations and drafts legally binding contracts in real-time, continuously updated with international contract law.",
      features: [
        "Voice-powered contract drafting",
        "Real-time legal compliance checks",
        "Automated clause suggestions",
        "Multi-party contract synchronization"
      ],
      benefits: [
        "Reduce contract drafting time by 80%",
        "Eliminate costly legal oversights",
        "Standardize agreements across teams"
      ],
      gradient: "from-indigo-500 to-purple-600",
      lightGradient: "from-indigo-400 to-purple-500"
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      name: "AI Mediator",
      tagline: "Conflict resolution powered by psychology",
      description: "Our Harmony engine facilitates understanding between parties by mediating conversations and bridging communication gaps with emotional intelligence.",
      features: [
        "Evidence-based parenting science models",
        "Emotional tone analysis",
        "Conflict resolution protocols",
        "Cultural sensitivity adaptation"
      ],
      benefits: [
        "Resolve disputes 3x faster",
        "Increase mutual understanding by 65%",
        "Preserve relationships post-conflict"
      ],
      gradient: "from-amber-500 to-pink-500",
      lightGradient: "from-amber-400 to-pink-400"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      name: "Multi-User AI Chat",
      tagline: "Collaborative negotiation workspace",
      description: "Our Accord platform enables teams to work together with AI assistance, maintaining context across all participants for seamless collaboration.",
      features: [
        "Real-time consensus building",
        "Automated meeting summaries",
        "Role-based perspective analysis",
        "Integrated decision tracking"
      ],
      benefits: [
        "Cut meeting times in half",
        "Improve team alignment by 75%",
        "Capture all stakeholder inputs"
      ],
      gradient: "from-emerald-500 to-cyan-500",
      lightGradient: "from-emerald-400 to-cyan-400"
    }
  ]

  const stats = [
    { value: "90%", label: "Faster contract drafting", icon: <FiClock /> },
    { value: "3.5x", label: "Conflict resolution speed", icon: <FiZap /> },
    { value: "70%", label: "Reduced miscommunication", icon: <FiGlobe /> },
    { value: "100%", label: "Data security compliance", icon: <FiLock /> }
  ]

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${bgColor} ${textColor}`}>
      
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Animated Grid */}
        <div className={`absolute inset-0 opacity-20 ${
          theme === 'dark' 
            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
        } bg-[size:64px_64px]`} />
        
        {/* Floating Blobs */}
        <div className="absolute inset-0 opacity-15">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-1/4 left-1/4 w-96 h-96 ${
              theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
            } rounded-full mix-blend-multiply filter blur-3xl`}
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
            } rounded-full mix-blend-multiply filter blur-3xl`}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 ${sectionBg}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white/80'
          } backdrop-blur-sm mb-6 shadow-lg border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'
            } mr-2 animate-pulse`}></span>
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-Powered Solutions</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className={textColor}>Gaprio </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Services
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Transforming complex human interactions through specialized AI solutions designed for clarity, efficiency, and mutual understanding.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
<section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {services.map((service, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative group"
      >
        {/* Gradient border effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
          theme === 'dark' ? service.gradient : service.lightGradient
        } opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`}></div>
        
        <div className={`relative h-full ${cardBg} backdrop-blur-sm rounded-2xl p-8 border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        } group-hover:${
          theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
        } transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl`}>

          {/* Service header */}
          <div className="flex items-start mb-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${
              theme === 'dark' ? service.gradient : service.lightGradient
            } text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {service.icon}
            </div>
            <div className="ml-4">
              <h3 className={`text-xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {service.name}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {service.tagline}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {service.description}
          </p>

          {/* Features */}
          <div className="mb-8">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Key Features
            </h4>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <FiCheck className={`flex-shrink-0 mt-1 mr-2 ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                  }`} />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Business Benefits
            </h4>
            <ul className="space-y-3">
              {service.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <FiTrendingUp className={`flex-shrink-0 mt-1 mr-2 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Animated hover element */}
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${
            theme === 'dark' ? service.gradient : service.lightGradient
          }/20 z-0 group-hover:scale-150 transition-transform duration-700`}></div>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* Stats Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${cardBg} backdrop-blur-sm p-6 rounded-xl border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex justify-center mb-3">
                <div className={`w-12 h-12 rounded-full ${
                  theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'
                } flex items-center justify-center ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                }`}>
                  {stat.icon}
                </div>
              </div>
                <h3
                  className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {stat.value}
                </h3>
                              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className={`rounded-2xl p-8 md:p-12 text-center shadow-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-indigo-900 to-purple-900' 
              : 'bg-gradient-to-br from-indigo-600 to-purple-600'
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Communications?
          </h2>
          <p className={`max-w-2xl mx-auto mb-8 ${
            theme === 'dark' ? 'text-indigo-100' : 'text-indigo-50'
          }`}>
            Discover how Gaprio can revolutionize your contracts, negotiations, and team collaborations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/get-started" 
              className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-white text-indigo-600 hover:bg-gray-100'
                  : 'bg-white text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Get Started
            </Link>
            <Link 
              href="/chat/register" 
              className={`px-6 py-3 border font-medium rounded-lg transition-colors flex items-center justify-center ${
                theme === 'dark'
                  ? 'border-white text-white hover:bg-indigo-700'
                  : 'border-white text-white hover:bg-indigo-500'
              }`}
            >
              Start Chat
            </Link>
          </div>
        </motion.div>
      </section>

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
      `}</style>
    </div>
  )
}