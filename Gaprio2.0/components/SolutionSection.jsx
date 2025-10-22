'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiMic, FiHeart, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function SolutionSection() {
  const sectionRef = useRef(null)
  const { theme } = useTheme()

  const solutions = [
    {
      icon: <FiMic className="w-6 h-6" />,
      name: "Clause",
      tagline: "Voice-Powered Contract Drafting",
      description: "Listens to live negotiations & distinguishes parties through voice recognition to draft legally valid contracts.",
      features: [
        "Continuously updated from International Contract Law",
        "Real-time legal compliance checks",
        "Automated clause suggestions"
      ],
      principle: "Clarity > Complexity",
      color: theme === 'dark' ? "from-indigo-500 to-purple-600" : "from-violet-600 to-purple-600"
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      name: "Harmony",
      tagline: "AI Mediation Engine",
      description: "Facilitates understanding by mediating conversations and bridging multifaceted perspectives.",
      features: [
        "Modeled on evidence-based parenting science",
        "Emotional tone analysis",
        "Conflict resolution protocols"
      ],
      principle: "Understanding > Arguing",
      color: theme === 'dark' ? "from-amber-500 to-pink-500" : "from-amber-500 to-pink-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      name: "Accord",
      tagline: "Collaborative AI Workspace",
      description: "Multi-user AI chatbot that helps teams maximize productivity on complex group projects.",
      features: [
        "Trained on logic & psychology research",
        "Real-time consensus building",
        "Automated meeting summaries"
      ],
      principle: "Directness > Diplomacy",
      color: theme === 'dark' ? "from-emerald-500 to-cyan-500" : "from-emerald-500 to-cyan-500"
    }
  ]

  // Theme-based styles
  const sectionBackground = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const cardBackground = theme === 'dark' ? 'bg-gray-900/80' : 'bg-white'
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const cardHoverBorder = theme === 'dark' ? 'group-hover:border-gray-700' : 'group-hover:border-gray-300'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtitleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const taglineColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const featureTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const principleBackground = theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-100'
  const principleBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const principleTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const headerGradient = theme === 'dark' ? 'from-indigo-400 via-purple-500 to-pink-500' : 'from-violet-600 via-purple-600 to-pink-600'
  const ctaGradient = theme === 'dark' ? 'from-indigo-600 to-purple-600' : 'from-violet-600 to-purple-600'
  const ctaHoverGradient = theme === 'dark' ? 'from-indigo-700 to-purple-700' : 'from-violet-700 to-purple-700'

  // GSAP animations for the solution section
  useGSAP(() => {
    // Animate section header
    gsap.fromTo('.solution-header', 
      { 
        opacity: 0, 
        y: 40,
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.solution-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animate solution cards with staggered effect
    gsap.fromTo('.solution-card', 
      { 
        opacity: 0, 
        y: 80,
        scale: 0.92
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        stagger: 0.2,
        duration: 0.9,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.solutions-grid',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animate CTA button
    gsap.fromTo('.solution-cta', 
      { 
        opacity: 0, 
        scale: 0.8
      },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.solution-cta',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Add interactive animations to cards
    const cards = document.querySelectorAll('.solution-card')
    cards.forEach(card => {
      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.gradient-border'), {
          opacity: theme === 'dark' ? 0.25 : 0.15,
          duration: 0.3
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.gradient-border'), {
          opacity: theme === 'dark' ? 0.1 : 0.05,
          duration: 0.3
        })
      })
    })
  }, [theme])

  return (
    <section ref={sectionRef} className={`solution-section relative py-20 md:py-24 overflow-hidden ${sectionBackground}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="solution-header text-center mb-16 md:mb-20 px-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            The{" "}
            <span className="relative inline-block">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${headerGradient}`}>
                Solution
              </span>
              <span className={`absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r ${headerGradient} rounded-full shadow-lg`} />
            </span>
          </h2>

          <p className={`text-lg md:text-xl ${subtitleColor} max-w-3xl mx-auto leading-relaxed`}>
            Our <span className={`${titleColor} font-semibold`}>AI-powered tools</span> 
            transform negotiation challenges into{" "}
            <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-violet-600'} font-medium`}>
              seamless collaboration
            </span>, 
            making complex discussions smooth, efficient, and results-driven.
          </p>
        </motion.div>

        {/* Solutions grid */}
        <div className="solutions-grid grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="solution-card group relative"
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              {/* Gradient border effect */}
              <div className={`gradient-border absolute inset-0 rounded-2xl bg-gradient-to-br ${solution.color} opacity-${theme === 'dark' ? '10' : '5'} blur-md transition-opacity duration-500 z-0`}></div>
              
              <div className={`relative h-full ${cardBackground} backdrop-blur-sm rounded-2xl p-6 md:p-8 border ${cardBorder} ${cardHoverBorder} transition-all duration-300 overflow-hidden z-10 shadow-sm hover:shadow-md`}>
                {/* Solution header */}
                <div className="flex items-start mb-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${solution.color} text-white shadow-lg flex-shrink-0`}>
                    {solution.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-xl font-bold ${titleColor}`}>{solution.name}</h3>
                    <p className={`text-sm ${taglineColor} mt-1`}>{solution.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className={`${descriptionColor} mb-6`}>{solution.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheckCircle className={`flex-shrink-0 mt-1 mr-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                      <span className={`${featureTextColor} text-sm md:text-base`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Principle badge */}
                <div className="mt-auto pt-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full ${principleBackground} border ${principleBorder} backdrop-blur-sm`}>
                    <span className={`text-xs font-medium ${principleTextColor}`}>{solution.principle}</span>
                  </div>
                </div>

                {/* Animated hover element */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${solution.color.split(' ')[0]}/${theme === 'dark' ? '20' : '10'} z-0 group-hover:scale-150 transition-transform duration-700`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="solution-cta mt-16 md:mt-20 text-center"
        >
          <Link
            href="/get-started"
            className={`group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r ${ctaGradient} hover:${ctaHoverGradient} text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
          >
            <span className="relative z-10 flex items-center justify-center">
              Explore All Solutions
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className={`absolute inset-0 bg-gradient-to-r ${ctaHoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </Link>
        </motion.div>

      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .solutions-grid {
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .solution-card {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 640px) {
          .solution-header h2 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  )
}