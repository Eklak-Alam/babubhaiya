'use client'
import { motion } from 'framer-motion'
import { FiFileText, FiHeart, FiUsers, FiCheck, FiZap, FiGlobe, FiLock, FiClock, FiTrendingUp } from 'react-icons/fi'
import Link from 'next/link'

export default function ServicesPage() {
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
      gradient: "from-indigo-500 to-purple-600"
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
      gradient: "from-amber-500 to-pink-500"
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
      gradient: "from-emerald-500 to-cyan-500"
    }
  ]

  const stats = [
    { value: "90%", label: "Faster contract drafting", icon: <FiClock /> },
    { value: "3.5x", label: "Conflict resolution speed", icon: <FiZap /> },
    { value: "70%", label: "Reduced miscommunication", icon: <FiGlobe /> },
    { value: "100%", label: "Data security compliance", icon: <FiLock /> }
  ]

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden pt-10">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-10 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-6 shadow-lg border border-gray-700">
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">AI-Powered Solutions</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]">Gaprio </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">Service</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
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
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`}></div>
              
              <div className="relative h-full bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 group-hover:border-gray-600 transition-all duration-300 overflow-hidden">
                {/* Service header */}
                <div className="flex items-start mb-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} text-white shadow-lg`}>
                    {service.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <p className="text-sm text-gray-400">{service.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6">{service.description}</p>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Features</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheck className="flex-shrink-0 mt-1 mr-2 text-emerald-400" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Business Benefits</h4>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <FiTrendingUp className="flex-shrink-0 mt-1 mr-2 text-purple-400" />
                        <span className="text-gray-400">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link 
                    href="#" 
                    className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${service.gradient} text-white font-medium text-sm hover:shadow-lg transition-all`}
                  >
                    Learn More
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>

                {/* Animated hover element */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${service.gradient.replace('to', 'from')}/20 z-0 group-hover:scale-150 transition-transform duration-700`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 md:p-12 text-center shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Communications?
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Discover how Gaprio can revolutionize your contracts, negotiations, and team collaborations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="#" 
              className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link 
              href="#" 
              className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              Schedule Demo
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
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  )
}