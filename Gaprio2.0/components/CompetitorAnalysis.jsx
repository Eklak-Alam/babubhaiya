'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiUser, FiUsers, FiLock, FiZap, FiDollarSign, FiAward, FiTrendingUp, FiShield, FiHeart } from 'react-icons/fi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useTheme } from '@/context/ThemeContext'

export default function CompetitorAnalysis() {
  const sectionRef = useRef(null)
  const competitorCardsRef = useRef([])
  const featureRowsRef = useRef([])
  const takeawayCardsRef = useRef([])
  const { theme } = useTheme()

  const competitors = [
    {
      name: "ChatGPT",
      icon: "🤖",
      features: {
        multiUser: false,
        automated: true,
        encrypted: false,
        affordable: false
      },
      color: theme === 'dark' ? "text-blue-400" : "text-blue-600",
      bgColor: theme === 'dark' ? "bg-blue-500/10" : "bg-blue-500/10",
      borderColor: theme === 'dark' ? "border-blue-500/30" : "border-blue-500/30"
    },
    {
      name: "Lawyer",
      icon: "⚖️",
      features: {
        multiUser: true,
        automated: false,
        encrypted: false,
        affordable: false
      },
      color: theme === 'dark' ? "text-amber-400" : "text-amber-600",
      bgColor: theme === 'dark' ? "bg-amber-500/10" : "bg-amber-500/10",
      borderColor: theme === 'dark' ? "border-amber-500/30" : "border-amber-500/30"
    },
    {
      name: "Counselor",
      icon: "🧠",
      features: {
        multiUser: true,
        automated: false,
        encrypted: false,
        affordable: false
      },
      color: theme === 'dark' ? "text-purple-400" : "text-purple-600",
      bgColor: theme === 'dark' ? "bg-purple-500/10" : "bg-purple-500/10",
      borderColor: theme === 'dark' ? "border-purple-500/30" : "border-purple-500/30"
    },
    {
      name: "Gaprio",
      icon: "🚀",
      features: {
        multiUser: true,
        automated: true,
        encrypted: true,
        affordable: true
      },
      color: theme === 'dark' ? "text-emerald-400" : "text-emerald-600",
      bgColor: theme === 'dark' ? "bg-emerald-500/10" : "bg-emerald-500/10",
      borderColor: theme === 'dark' ? "border-emerald-500/30" : "border-emerald-500/30",
      highlight: true
    }
  ]

  const features = [
    {
      name: "Multi-User",
      icon: <FiUsers className="w-5 h-5" />,
      description: "Supports group negotiations with full context awareness"
    },
    {
      name: "Automated",
      icon: <FiZap className="w-5 h-5" />,
      description: "AI-powered processes without human bottlenecks"
    },
    {
      name: "Encrypted",
      icon: <FiLock className="w-5 h-5" />,
      description: "Enterprise-grade security for sensitive discussions"
    },
    {
      name: "Affordable",
      icon: <FiDollarSign className="w-5 h-5" />,
      description: "Fraction of traditional service costs"
    }
  ]

  // Theme-based styles
  const sectionBackground = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const tableBackground = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'
  const tableBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtitleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const headerColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const rowHover = theme === 'dark' ? 'hover:bg-gray-800/20' : 'hover:bg-gray-50'
  const gradientFrom = theme === 'dark' ? 'from-indigo-400' : 'from-violet-600'
  const gradientTo = theme === 'dark' ? 'to-purple-500' : 'to-purple-600'
  const highlightBackground = theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-900/80' : 'bg-gradient-to-b from-gray-50 to-white'
  const takeawaysBackground = theme === 'dark' ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-r from-violet-50 to-purple-50'
  const takeawaysBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const takeawayCardBackground = theme === 'dark' ? 'bg-gray-900/30' : 'bg-white/50'
  const takeawayCardBorder = theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200'
  const takeawayCardHover = theme === 'dark' ? 'hover:border-indigo-500/30' : 'hover:border-violet-500/30'

  // Initialize Lenis smooth scroll and GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })
    
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
    
    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)
    
    return () => {
      lenis.destroy()
      gsap.ticker.remove(() => {})
    }
  }, [])

  // Set up animations with GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo('.section-title', 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: '.section-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Animate competitor cards with staggered effect
      competitorCardsRef.current.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
      
      // Animate feature rows with staggered effect
      featureRowsRef.current.forEach((row, i) => {
        gsap.fromTo(row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
      
      // Animate takeaway cards with a cool scaling effect
      takeawayCardsRef.current.forEach((card, i) => {
        gsap.fromTo(card,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
      
      // Add a subtle floating animation to decorative elements
      gsap.to('.float-animation', {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      
      // Add pulse animation to Gaprio card
      gsap.to('.gaprio-highlight', {
        boxShadow: theme === 'dark' ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(5, 150, 105, 0.3)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [theme])

  return (
    <section ref={sectionRef} className={`relative py-24 overflow-hidden ${sectionBackground}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl font-bold ${titleColor} mb-4`}
          >
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>Competitor</span> Analysis
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-lg ${subtitleColor} max-w-3xl mx-auto`}
          >
            How Gaprio outperforms traditional solutions across key metrics
          </motion.p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`${tableBackground} backdrop-blur-sm border ${tableBorder} rounded-2xl min-w-[800px] transform-gpu shadow-sm`}
          >
            {/* Table header */}
            <div className={`grid grid-cols-5 border-b ${tableBorder}`}>
              <div className="col-span-1 p-6">
                <h3 className={`text-sm font-semibold ${headerColor} uppercase tracking-wider`}>Features</h3>
              </div>
              {competitors.map((competitor, index) => (
                <div 
                  key={index}
                  ref={el => competitorCardsRef.current[index] = el}
                  className={`col-span-1 p-6 border-l ${tableBorder} ${competitor.highlight ? 'gaprio-highlight' : ''} ${competitor.highlight ? highlightBackground : ''} ${competitor.bgColor} ${competitor.borderColor} border-l-2`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{competitor.icon}</span>
                    <h3 className={`text-lg font-semibold ${competitor.color}`}>{competitor.name}</h3>
                    {competitor.highlight && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                        className="ml-auto"
                      >
                        <FiAward className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            {features.map((feature, rowIndex) => (
              <div
                key={rowIndex}
                ref={el => featureRowsRef.current[rowIndex] = el}
                className={`grid grid-cols-5 border-b ${tableBorder} last:border-0 group ${rowHover} transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                {/* Feature name */}
                <div className="col-span-1 p-6">
                  <div className="flex items-center gap-3">
                    <div className={theme === 'dark' ? 'text-indigo-400' : 'text-violet-600'}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className={`text-lg font-medium ${titleColor}`}>{feature.name}</h4>
                      <p className={`text-sm ${textColor} mt-1`}>{feature.description}</p>
                    </div>
                  </div>
                </div>

                {/* Competitor features */}
                {competitors.map((competitor, colIndex) => (
                  <div 
                    key={colIndex}
                    className={`col-span-1 p-6 border-l ${tableBorder} flex items-center justify-center ${
                      competitor.highlight ? highlightBackground : ''
                    } ${competitor.borderColor} border-l-2`}
                  >
                    {Object.values(competitor.features)[rowIndex] ? (
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 * rowIndex }}
                      >
                        <FiCheck className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-500/20 text-red-600'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 * rowIndex }}
                      >
                        <FiX className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Key takeaways */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className={`${takeawaysBackground} border ${takeawaysBorder} rounded-2xl p-8 relative overflow-hidden shadow-sm`}>
            {/* Decorative elements */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full filter blur-xl ${
              theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/20'
            }`}></div>
            <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full filter blur-xl ${
              theme === 'dark' ? 'bg-indigo-500/10' : 'bg-violet-500/20'
            }`}></div>
            
            <h3 className={`text-2xl font-bold ${titleColor} mb-6 relative z-10`}>Why Gaprio Stands Out</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {[
                {
                  icon: <FiAward className="w-5 h-5" />,
                  title: "Complete Solution",
                  description: "Only Gaprio offers all critical features in one platform"
                },
                {
                  icon: <FiTrendingUp className="w-5 h-5" />,
                  title: "No Compromises",
                  description: "Enterprise security without enterprise pricing"
                },
                {
                  icon: <FiUsers className="w-5 h-5" />,
                  title: "Built for Teams",
                  description: "First AI negotiation tool designed for group dynamics"
                },
                {
                  icon: <FiShield className="w-5 h-5" />,
                  title: "Always Improving",
                  description: "Continuous updates with latest legal frameworks"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  ref={el => takeawayCardsRef.current[index] = el}
                  className={`flex items-start gap-4 p-4 ${takeawayCardBackground} rounded-lg backdrop-blur-sm border ${takeawayCardBorder} ${takeawayCardHover} transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className={`flex-shrink-0 mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className={`text-lg font-medium ${titleColor} mb-2`}>{item.title}</h4>
                    <p className={textColor}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}