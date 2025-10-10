'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiPhone, FiGlobe, FiMail, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi'

// Predefined particle data to avoid hydration mismatches
const PARTICLE_DATA = [
  { width: 12.8, height: 7.7, left: 26.9, top: 90.2, color: '#8b5cf6' },
  { width: 14.7, height: 11.2, left: 75.4, top: 55.0, color: '#3b82f6' },
  { width: 14.6, height: 11.8, left: 50.6, top: 56.3, color: '#ec4899' },
  { width: 4.6, height: 7.7, left: 83.4, top: 59.3, color: '#8b5cf6' },
  { width: 9.3, height: 9.9, left: 14.8, top: 17.3, color: '#3b82f6' },
  { width: 13.3, height: 12.7, left: 75.3, top: 14.9, color: '#ec4899' },
  { width: 15.5, height: 4.2, left: 37.4, top: 36.5, color: '#8b5cf6' },
  { width: 11.2, height: 11.8, left: 23.7, top: 44.9, color: '#3b82f6' }
]

export default function ContactSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const contactMethods = [
    {
      icon: <FiPhone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Call Us",
      value: "+91 62016 68873",
      link: "tel:+916201668873",
      color: "from-green-500 to-emerald-500",
      hover: "hover:shadow-emerald-500/30"
    },
    {
      icon: <FiGlobe className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Visit Us",
      value: "gaprio.vercel.app",
      link: "https://gaprio.vercel.app",
      color: "from-blue-500 to-cyan-500",
      hover: "hover:shadow-blue-500/30"
    },
    {
      icon: <FiMail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Email Us",
      value: "hanushashwat733@gmail.com",
      link: "mailto:hanushashwat733@gmail.com",
      color: "from-amber-500 to-orange-500",
      hover: "hover:shadow-amber-500/30"
    }
  ]

  const socialLinks = [
    { icon: <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />, url: "#", name: "GitHub", hover: "hover:bg-gray-800 hover:text-white" },
    { icon: <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />, url: "#", name: "LinkedIn", hover: "hover:bg-blue-600 hover:text-white" },
    { icon: <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />, url: "#", name: "Twitter", hover: "hover:bg-blue-400 hover:text-white" },
    { icon: <FiInstagram className="w-4 h-4 sm:w-5 sm:h-5" />, url: "#", name: "Instagram", hover: "hover:bg-pink-600 hover:text-white" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const socialVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    hover: {
      scale: 1.1,
      y: -4,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const circleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 40,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const reverseCircleVariants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 50,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  // Don't render particles during SSR
  const renderParticles = isClient && PARTICLE_DATA.map((particle, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full opacity-20"
      style={{
        width: `${particle.width}px`,
        height: `${particle.height}px`,
        left: `${particle.left}%`,
        top: `${particle.top}%`,
        backgroundColor: particle.color
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
    />
  ))

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-8 sm:py-16 md:py-20 px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-4xl lg:max-w-6xl mx-auto w-full"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Visual (Hidden on mobile) */}
            <motion.div 
              variants={itemVariants}
              className="hidden lg:block relative h-full min-h-[400px] lg:min-h-[500px] bg-gradient-to-br from-indigo-900/30 to-purple-900/30 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
                <div className="relative w-full h-full">
                  {/* Animated Circles */}
                  <motion.div
                    variants={circleVariants}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 border-2 border-dashed border-indigo-500/30 rounded-full"
                  />
                  <motion.div
                    variants={reverseCircleVariants}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 lg:w-80 lg:h-80 border-2 border-dashed border-purple-500/20 rounded-full"
                  />
                  
                  {/* Floating Particles - Only render on client */}
                  {renderParticles}

                  {/* Content */}
                  <div className="relative z-10 text-center p-6 lg:p-8">
                    <motion.h3
                      variants={itemVariants}
                      className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4"
                    >
                      Let's Connect
                    </motion.h3>
                    <motion.p
                      variants={itemVariants}
                      className="text-gray-400 text-sm lg:text-base max-w-xs lg:max-w-md mx-auto leading-relaxed"
                    >
                      We're excited to hear from you and discuss how we can work together.
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Info */}
            <div className="p-6 sm:p-8 lg:p-12">
              <motion.div variants={containerVariants}>
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Thank You!
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed">
                    Reach out to us through any of these channels. We're always happy to help!
                  </p>
                </motion.div>

                {/* Contact Cards */}
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                  {contactMethods.map((method, index) => (
                    <motion.a
                      key={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      whileHover="hover"
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-transparent shadow-lg ${method.hover} transition-all duration-300 cursor-pointer`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${method.color} text-white shadow-md flex-shrink-0`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                          {method.title}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base truncate">
                          {method.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social Links */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                    Follow Us
                  </h3>
                  <div className="flex gap-3 sm:gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        variants={socialVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        whileHover="hover"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 ${social.hover} border border-gray-700 hover:border-transparent transition-all duration-300 shadow-md`}
                        aria-label={social.name}
                        style={{ transitionDelay: `${800 + index * 100}ms` }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

                {/* Mobile Visual Element */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:hidden mt-8 pt-8 border-t border-gray-700"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
                    >
                      <FiMail className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-sm text-gray-400">
                      Ready to start a conversation?
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>
    </section>
  )
}