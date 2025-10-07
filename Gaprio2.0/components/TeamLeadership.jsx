'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TeamLeadership() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef([])
  const ethosRef = useRef(null)

  const teamMembers = [
    {
      name: "Abhijeet Singh",
      role: "Chief Technology Officer",
      image: "/team/preet.jpg",
      social: [
        { icon: <FiLinkedin />, url: "#" },
        { icon: <FiTwitter />, url: "#" },
        { icon: <FiMail />, url: "#" }
      ],
      borderColor: "from-amber-500 to-orange-500"
    },
    {
      name: "Hanu Shashwat",
      role: "Chief Executive Officer",
      image: "/team/hanu.jpg",
      social: [
        { icon: <FiGithub />, url: "#" },
        { icon: <FiLinkedin />, url: "#" },
        { icon: <FiMail />, url: "#" }
      ],
      borderColor: "from-blue-500 to-cyan-500"
    },
    {
      name: "Eklak Alam",
      role: "Lead Developer",
      image: "/team/eklak.jpg",
      social: [
        { icon: <FiGithub />, url: "#" },
        { icon: <FiLinkedin />, url: "#" },
        { icon: <FiTwitter />, url: "#" },
        { icon: <FiMail />, url: "#" }
      ],
      borderColor: "from-purple-500 to-indigo-500"
    }
  ]

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const initSmoothScrolling = async () => {
      const Lenis = (await import('lenis')).default
      
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      // Connect Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    initSmoothScrolling()

    // GSAP animations
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(headingRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Card animations
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        
        gsap.fromTo(card, 
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        )

        // Hover animations for cards
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            duration: 0.4,
            ease: "power2.out"
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: "power2.out"
          })
        })
      })

      // Ethos section animation
      gsap.fromTo(ethosRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ethosRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Background particles animation
      const particles = document.querySelectorAll('.particle')
      particles.forEach(particle => {
        gsap.to(particle, {
          y: -20,
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Team</span> Leadership
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            The brilliant minds powering Gaprio's vision
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="relative group opacity-0"
            >
              {/* Electric border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${member.borderColor} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500`}></div>
              
              {/* Main card */}
              <div className="relative h-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 group-hover:border-transparent transition-all duration-300 overflow-hidden">
                {/* Glowing corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${member.borderColor} opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-bl-3xl`}></div>
                
                {/* Profile image with shine effect */}
                <motion.div 
                  className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-transparent transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.borderColor} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="relative z-10 object-cover w-full h-full"
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
                
                {/* Member details */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className={`text-sm font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r ${member.borderColor}`}>
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    {index === 2 ? (
                      "Full-stack architect bridging AI with human-centered design"
                    ) : (
                      "Visionary leader driving innovation and growth"
                    )}
                  </p>
                </div>
                
                {/* Social links with lightning effect */}
                <div className="flex justify-center gap-4">
                  {member.social.map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ 
                        y: -5,
                        scale: 1.2,
                        color: index === 0 ? "#f59e0b" : index === 1 ? "#3b82f6" : "#8b5cf6"
                      }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-gray-400 hover:text-white p-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 group-hover:border-transparent transition-all duration-300 ${index === 2 ? 'group-hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)]' : ''}`}
                      style={{
                        boxShadow: index === 2 ? '0 0 15px -3px rgba(139, 92, 246, 0)' : 'none'
                      }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
                
                {/* Special lightning effect for your card */}
                {index === 2 && (
                  <>
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full from-purple-500/20 to-indigo-500/20 bg-gradient-to-br z-0 group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full from-purple-600/10 to-indigo-600/10 bg-gradient-to-br z-0 group-hover:scale-125 transition-transform duration-1000"></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Team ethos */}
        <div ref={ethosRef} className="mt-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-gray-800 rounded-2xl p-8 opacity-0">
          <h3 className="text-2xl font-bold text-white mb-6">Our Leadership Ethos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Innovation First</h4>
                <p className="text-gray-400">Pushing boundaries in AI-human collaboration</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <span className="text-lg">🤝</span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Collaborative Spirit</h4>
                <p className="text-gray-400">Strength through diverse perspectives</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <span className="text-lg">🚀</span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Future Focused</h4>
                <p className="text-gray-400">Building tomorrow's communication tools today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}