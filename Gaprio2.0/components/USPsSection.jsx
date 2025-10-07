'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCpu, FiBook, FiActivity, FiAward, FiMessageSquare } from 'react-icons/fi'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function USPsSection() {
  const sectionRef = useRef(null)
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
          opacity: 0.25,
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
          opacity: 0.1,
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
  }, [])

  return (
    <section ref={sectionRef} className="usps-section relative py-20 md:py-24 overflow-hidden bg-gray-900">
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] bg-[length:60px_60px]"></div>
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Advantages</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
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
              <div className="relative h-full bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 group-hover:border-gray-700 transition-all duration-300 overflow-hidden">
                {/* Gradient corner accent */}
                <div className={`gradient-corner absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-3xl`}></div>
                
                {/* Feature icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Feature content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                
                {/* Hover indicator */}
                <div className={`hover-indicator absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} transition-all duration-500`}></div>
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
          className="stats-bar mt-16 bg-gradient-to-r from-gray-900 to-gray-800/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="stat-number">98</span>%
              </div>
              <div className="text-sm text-gray-400">Accuracy Rate</div>
            </div>
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-gray-400">Availability</div>
            </div>
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="stat-number">10</span>x
              </div>
              <div className="text-sm text-gray-400">Faster Negotiations</div>
            </div>
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="stat-number">100</span>+
              </div>
              <div className="text-sm text-gray-400">Legal Jurisdictions</div>
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