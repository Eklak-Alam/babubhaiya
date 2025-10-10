'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiDollarSign, FiUsers, FiZap, FiLayers } from 'react-icons/fi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default function MarketLandscape() {
  const sectionRef = useRef(null)
  const comparisonsRef = useRef([])
  const cardsRef = useRef([])

  const comparisons = [
    {
      category: "User Capacity",
      traditional: {
        icon: <FiUsers className="text-red-400" />,
        text: "Single-user only",
        cons: ["Limited to 1:1 interactions", "No group context"]
      },
      gaprio: {
        icon: <FiUsers className="text-emerald-400" />,
        text: "Multi-user AI",
        pros: ["Group negotiation support", "Full context awareness"]
      }
    },
    {
      category: "Pricing Model",
      traditional: {
        icon: <FiDollarSign className="text-red-400" />,
        text: "Expensive services",
        cons: ["High per-hour rates", "Hidden fees"]
      },
      gaprio: {
        icon: <FiDollarSign className="text-emerald-400" />,
        text: "Affordable AI",
        pros: ["Predictable pricing", "No surprise costs"]
      }
    },
    {
      category: "Technology",
      traditional: {
        icon: <FiLayers className="text-red-400" />,
        text: "Manual processes",
        cons: ["Human bottlenecks", "Inconsistent quality"]
      },
      gaprio: {
        icon: <FiZap className="text-emerald-400" />,
        text: "Agentic AI",
        pros: ["Automated workflows", "Continuous improvements"]
      }
    },
    {
      category: "Legal Compliance",
      traditional: {
        icon: <FiLayers className="text-red-400" />,
        text: "Static contracts",
        cons: ["Manual updates needed", "Compliance risks"]
      },
      gaprio: {
        icon: <FiCheck className="text-emerald-400" />,
        text: "Auto-updating",
        pros: ["Real-time law revisions", "Always compliant"]
      }
    }
  ]

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
      
      // Animate comparison rows with staggered effect
      comparisonsRef.current.forEach((row, i) => {
        gsap.fromTo(row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
      
      // Animate cards with a cool scaling effect
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(card,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.2,
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
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative pt-10 overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Landscape</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400 max-w-3xl mx-auto"
          >
            How Gaprio compares to traditional solutions
          </motion.p>
        </div>

        {/* Comparison table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden transform-gpu">
          {/* Table header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-12 bg-gray-800/50 border-b border-gray-800"
          >
            <div className="col-span-12 md:col-span-3 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Comparison</h3>
            </div>
            <div className="col-span-6 md:col-span-4 p-6 border-l border-gray-800">
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Traditional Solutions</h3>
            </div>
            <div className="col-span-6 md:col-span-5 p-6 border-l border-gray-800">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Gaprio Advantage</h3>
            </div>
          </motion.div>

          {/* Comparison rows */}
          {comparisons.map((item, index) => (
            <div
              key={index}
              ref={el => comparisonsRef.current[index] = el}
              className="grid grid-cols-12 border-b border-gray-800 last:border-0 group hover:bg-gray-800/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {/* Category */}
              <div className="col-span-12 md:col-span-3 p-6">
                <h4 className="text-lg font-medium text-white">{item.category}</h4>
              </div>

              {/* Traditional solution */}
              <div className="col-span-6 md:col-span-4 p-6 border-l border-gray-800">
  <div className="flex items-center gap-3 mb-3">
    {item.traditional.icon}
    <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
      {item.traditional.text}
    </span>
  </div>
  <ul className="space-y-2">
    {item.traditional.cons.map((con, i) => (
      <motion.li 
        key={i} 
        className="flex items-start text-sm text-gray-400"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <FiX className="flex-shrink-0 mt-0.5 mr-2 text-red-400" />
        {con}
      </motion.li>
    ))}
  </ul>
</div>


              {/* Gaprio advantage */}
              <div className="col-span-6 md:col-span-5 p-6 border-l border-gray-800">
  <div className="flex items-center gap-3 mb-3">
    {item.gaprio.icon}
    <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
      {item.gaprio.text}
    </span>
  </div>
  <ul className="space-y-2">
    {item.gaprio.pros.map((pro, i) => (
      <motion.li 
        key={i} 
        className="flex items-start text-sm text-gray-400"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <FiCheck className="flex-shrink-0 mt-0.5 mr-2 text-emerald-400" />
        {pro}
      </motion.li>
    ))}
  </ul>
</div>

            </div>
          ))}
        </div>

        {/* Key differentiators */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FiUsers className="w-5 h-5" />,
              title: "Multi-User First",
              description: "First-of-its-kind AI designed specifically for group negotiations and team collaborations.",
              color: "indigo"
            },
            {
              icon: <FiDollarSign className="w-5 h-5" />,
              title: "Cost Effective",
              description: "Fraction of the cost of traditional legal and negotiation services with better results.",
              color: "purple"
            },
            {
              icon: <FiZap className="w-5 h-5" />,
              title: "Always Current",
              description: "Continuously updated with the latest legal frameworks and negotiation best practices.",
              color: "emerald"
            }
          ].map((card, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transform-gpu hover:shadow-lg hover:shadow-${card.color}-500/10 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-${card.color}-500/20 flex items-center justify-center text-${card.color}-400`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              </div>
              <p className="text-gray-400">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}