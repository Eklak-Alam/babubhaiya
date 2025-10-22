'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCpu, FiBook, FiActivity, FiAward, FiMessageSquare } from 'react-icons/fi'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '@/context/ThemeContext'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function USPsSection() {
  const sectionRef = useRef(null)
  const { theme } = useTheme()

  const features = [
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: "Multi-User AI Chatbot",
      description: "Handles group chats with full context awareness across all participants",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FiCpu className="w-5 h-5" />,
      title: "Logic over Diplomacy",
      description: "Makes decisions based on facts and data, not flattery or politics",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FiBook className="w-5 h-5" />,
      title: "Regular Law Revisions",
      description: "Always updated with the latest legal changes and compliance requirements",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FiActivity className="w-5 h-5" />,
      title: "Integrated Agentic AI",
      description: "Acts on your behalf with full context memory and permission-based actions",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      title: "Research-Backed Training",
      description: "Informed by credible, peer-reviewed evidence-based sources",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiMessageSquare className="w-5 h-5" />,
      title: "Zero Learning Curve",
      description: "Familiar chat interface - like WhatsApp but for professional negotiations",
      color: "from-violet-500 to-fuchsia-500"
    }
  ]

  // Theme-based styles
  const sectionBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/80'
  const cardBorder = theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'
  const cardHoverBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
  const statsBg = theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800/50' : 'bg-gradient-to-r from-white to-gray-100/50'
  const statsBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const dividerBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'

  // GSAP animations for the USPs section
  useGSAP(() => {
    // Animate section header
    gsap.fromTo('.usps-header', 
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
          trigger: '.usps-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animate feature cards with staggered effect
    gsap.fromTo('.feature-card', 
      { 
        opacity: 0, 
        y: 60,
        scale: 0.92
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animate stats bar
    gsap.fromTo('.stats-bar', 
      { 
        opacity: 0, 
        y: 30
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-bar',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Add interactive animations to feature cards
    const cards = document.querySelectorAll('.feature-card')
    cards.forEach(card => {
      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.gradient-corner'), {
          opacity: theme === 'dark' ? 0.25 : 0.15,
          duration: 0.3
        })
        gsap.to(card.querySelector('.hover-indicator'), {
          width: '100%',
          duration: 0.4
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.gradient-corner'), {
          opacity: theme === 'dark' ? 0.1 : 0.08,
          duration: 0.3
        })
        gsap.to(card.querySelector('.hover-indicator'), {
          width: 0,
          duration: 0.4
        })
      })
    })

    // Animate stats numbers
    const stats = document.querySelectorAll('.stat-number')
    stats.forEach(stat => {
      const value = parseInt(stat.textContent)
      const duration = 2
      
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(stat, {
            innerText: value,
            duration: duration,
            snap: { innerText: 1 },
            ease: 'power2.out',
            onUpdate: function() {
              stat.textContent = Math.floor(stat.innerText)
            }
          })
        }
      })
    })
  }, [theme])

  return (
    <section ref={sectionRef} className={`usps-section relative pt-10 md:py-24 overflow-hidden transition-colors duration-300 ${sectionBg}`}>
      {/* Decorative grid pattern */}
      <div className={`absolute inset-0 ${
        theme === 'dark' ? 'opacity-5' : 'opacity-10'
      }`}>
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,${btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
            <g fill="none" fill-rule="evenodd" stroke="${theme === 'dark' ? '#555' : '#999'}" stroke-width="1" opacity="${theme === 'dark' ? '0.2' : '0.3'}">
              <path d="M0 0h60v60H0z"/>
            </g>
          </svg>
        `)}')] bg-[length:60px_60px]`}></div>
      </div>

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/5'
          } rounded-full blur-3xl -z-10`}
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/5'
          } rounded-full blur-3xl -z-10`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="usps-header text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${textColor} mb-4`}>
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Advantages</span>
          </h2>
          <p className={`text-lg md:text-xl ${textMuted} max-w-3xl mx-auto leading-relaxed`}>
            Why professionals choose our platform for critical negotiations
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card group relative"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <div className={`relative h-full ${cardBg} backdrop-blur-sm rounded-xl p-6 border ${cardBorder} group-hover:${cardHoverBorder} transition-all duration-300 overflow-hidden ${
                theme === 'light' ? 'shadow-sm hover:shadow-md' : ''
              }`}>
                {/* Gradient corner accent */}
                <div className={`gradient-corner absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.color} ${
                  theme === 'dark' ? 'opacity-10' : 'opacity-8'
                } group-hover:${
                  theme === 'dark' ? 'opacity-20' : 'opacity-15'
                } transition-opacity duration-500 rounded-bl-3xl`}></div>
                
                {/* Feature icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  theme === 'light' ? 'shadow-md' : 'shadow-lg'
                }`}>
                  {feature.icon}
                </div>
                
                {/* Feature content */}
                <h3 className={`text-xl font-semibold ${textColor} mb-2 group-hover:${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                } transition-colors duration-300`}>{feature.title}</h3>
                <p className={`${textMuted} group-hover:${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                } transition-colors duration-300`}>{feature.description}</p>
                
                {/* Hover indicator */}
                <div className={`hover-indicator absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} transition-all duration-500 ${
                  theme === 'light' ? 'opacity-90' : ''
                }`}></div>

                {/* Subtle shine effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${
                  theme === 'dark' ? 'white/5' : 'black/5'
                } to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`stats-bar mt-16 ${statsBg} rounded-xl border ${statsBorder} p-6 backdrop-blur-sm ${
            theme === 'light' ? 'shadow-sm' : ''
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className={`border-r ${dividerBorder} pr-6 last:border-0 last:pr-0`}>
              <div className={`text-3xl md:text-4xl font-bold ${textColor} mb-2`}>
                <span className="stat-number">98</span>%
              </div>
              <div className={`text-sm ${textMuted}`}>Accuracy Rate</div>
            </div>
            <div className={`border-r ${dividerBorder} pr-6 last:border-0 last:pr-0`}>
              <div className={`text-3xl md:text-4xl font-bold ${textColor} mb-2`}>24/7</div>
              <div className={`text-sm ${textMuted}`}>Availability</div>
            </div>
            <div className={`border-r ${dividerBorder} pr-6 last:border-0 last:pr-0`}>
              <div className={`text-3xl md:text-4xl font-bold ${textColor} mb-2`}>
                <span className="stat-number">10</span>x
              </div>
              <div className={`text-sm ${textMuted}`}>Faster Negotiations</div>
            </div>
            <div className={`border-r ${dividerBorder} pr-6 last:border-0 last:pr-0`}>
              <div className={`text-3xl md:text-4xl font-bold ${textColor} mb-2`}>
                <span className="stat-number">100</span>+
              </div>
              <div className={`text-sm ${textMuted}`}>Legal Jurisdictions</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-pulse {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .features-grid {
            gap: 1rem;
          }
          
          .stats-bar .grid {
            gap: 1.5rem;
          }
          
          .stats-bar .border-r {
            border-right: none;
            padding-right: 0;
            margin-bottom: 1.5rem;
          }
          
          .stats-bar .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}