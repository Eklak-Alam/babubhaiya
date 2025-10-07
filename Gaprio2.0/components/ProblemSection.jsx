'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiClock, FiUsers, FiMessageSquare } from 'react-icons/fi'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function ProblemSection() {
  const sectionRef = useRef(null)
  const problems = [
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Costly & Lengthy Business Negotiations",
      description: "Time-consuming processes that delay decisions and increase operational costs"
    },
    {
      icon: <FiAlertTriangle className="w-6 h-6" />,
      title: "Miscommunications hamper Productivity",
      description: "Critical details get lost in translation between teams and stakeholders"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Lack of Multi-User AI Chatbots",
      description: "Existing solutions don't facilitate collaborative AI-assisted negotiations"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Inefficient Communication Channels",
      description: "Disjointed tools create silos instead of bridging understanding gaps"
    }
  ]

  // GSAP animations for the problem section
  useGSAP(() => {
    // Animate section header
    gsap.fromTo('.section-header', 
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
          trigger: '.section-header',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animate problem cards with staggered effect
    gsap.fromTo('.problem-card', 
      { 
        opacity: 0, 
        y: 60,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.problems-grid',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animate stats section
    gsap.fromTo('.stats-container', 
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
          trigger: '.stats-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Add continuous subtle animations to cards on hover
    const cards = document.querySelectorAll('.problem-card')
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="problem-section relative py-20 overflow-hidden bg-gray-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="section-header text-center mb-16 md:mb-20"
        >
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative inline-block"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              The Problem
            </span>
            {/* Underline */}
            <motion.span 
              className="block h-1 w-20 mx-auto mt-3 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed tracking-wide"
          >
            Current negotiation processes are plagued with inefficiencies, costing
            businesses valuable time and resources — and leaving opportunities on
            the table.
          </motion.p>
        </motion.div>

        {/* Problem cards grid */}
        <div className="problems-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="problem-card group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300 cursor-pointer"
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-4 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">{problem.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{problem.description}</p>
              
              {/* Animated underline */}
              <div className="mt-4 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="stats-container mt-12 md:mt-16 text-center"
        >
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 backdrop-blur-sm">
            <p className="text-base md:text-lg text-gray-300">
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">70%</span> of business negotiations
              experience significant delays due to miscommunication
            </p>
          </div>
        </motion.div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .problems-grid {
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 640px) {
          .problem-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  )
}