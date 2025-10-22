'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiInstagram } from 'react-icons/fi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { FiZap, FiUsers, FiArrowUpRight } from "react-icons/fi"
import { useTheme } from '@/context/ThemeContext'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TeamLeadership() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef([])
  const ethosRef = useRef(null)
  const { theme } = useTheme()

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
        { icon: <FiGithub />, url: "https://github.com/Eklak-Alam" },
        { icon: <FiLinkedin />, url: "https://www.linkedin.com/in/eklak-alam/" },
        { icon: <FiTwitter />, url: "https://x.com/dev_eklak" },
        { icon: <FiMail />, url: "mailto:eklakalam420@gmail.com" }
      ],
      borderColor: "from-purple-500 to-indigo-500"
    },
    {
      name: "Aadil naushad khan",
      role: "Team Member",
      image: "/team/aadil.webp",
      social: [
        { icon: <FiGithub />, url: "https://github.com/hackingverse8" },
        { icon: <FiLinkedin />, url: "https://www.linkedin.com/in/aadilnaushadkhan" },
        { icon: <FiInstagram />, url: "https://instagram.com/aadilnaushadkhan" },
      ],
      borderColor: "from-purple-500 to-indigo-500"
    }
  ]

  // Theme-based styles
  const sectionBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200/70'
  const socialBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/70'
  const socialBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
  const ethosBg = theme === 'dark' ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-r from-indigo-50 to-purple-50'
  const ethosBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const iconBg = theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/15'
  const iconColor = theme === 'dark' ? 'text-purple-400' : 'text-purple-600'

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
  }, [theme])

  return (
    <section ref={sectionRef} className={`relative py-24 overflow-hidden transition-colors duration-300 ${sectionBg}`}>
      
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
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Team</span> Leadership
          </h2>
          <p className={`text-lg ${textMuted} max-w-3xl mx-auto`}>
            The brilliant minds powering Gaprio's vision
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="relative group opacity-0"
            >
              {/* Electric border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${member.borderColor} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 ${
                theme === 'light' ? 'group-hover:opacity-70' : ''
              }`}></div>
              
              {/* Main card */}
              <div className={`relative h-full ${cardBg} backdrop-blur-sm rounded-2xl p-6 border ${cardBorder} ${
                theme === 'dark' ? 'group-hover:border-transparent' : 'group-hover:border-gray-300'
              } transition-all duration-300 overflow-hidden ${
                theme === 'light' ? 'shadow-sm hover:shadow-lg' : ''
              }`}>
                {/* Glowing corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${member.borderColor} ${
                  theme === 'dark' ? 'opacity-0 group-hover:opacity-30' : 'opacity-0 group-hover:opacity-20'
                } transition-opacity duration-500 rounded-bl-3xl`}></div>
                
                {/* Profile image with shine effect */}
                <motion.div 
                  className={`relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 ${
                    theme === 'dark' ? 'border-gray-700 group-hover:border-transparent' : 'border-gray-300 group-hover:border-gray-400'
                  } transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.borderColor} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="relative z-10 object-cover w-full h-full"
                  />
                  {/* Shine effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-${
                    theme === 'dark' ? 'white/10' : 'black/10'
                  } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </motion.div>
                
                {/* Member details */}
                <div className="text-center">
                  <h3 className={`text-lg font-bold ${textColor} mb-1`}>{member.name}</h3>
                  <p className={`text-sm font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r ${member.borderColor}`}>
                    {member.role}
                  </p>
                  <p className={`text-xs ${textMuted} mb-4 leading-relaxed`}>
                    {index === 2 ? (
                      "Full-stack architect bridging AI with human-centered design"
                    ) : index === 3 ? (
                      "Innovative developer creating cutting-edge solutions"
                    ) : (
                      "Visionary leader driving innovation and growth"
                    )}
                  </p>
                </div>
                
                {/* Social links with lightning effect */}
                <div className="flex justify-center gap-3">
                  {member.social.map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ 
                        y: -3,
                        scale: 1.1,
                        color: index === 0 ? "#f59e0b" : index === 1 ? "#3b82f6" : "#8b5cf6"
                      }}
                      whileTap={{ scale: 0.9 }}
                      className={`${textMuted} hover:text-white p-2 rounded-full ${socialBg} backdrop-blur-sm border ${socialBorder} ${
                        theme === 'dark' ? 'group-hover:border-transparent' : 'group-hover:border-gray-400'
                      } transition-all duration-300 ${
                        index === 2 ? `group-hover:shadow-[0_0_15px_-3px_${
                          theme === 'dark' ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.3)'
                        }]` : ''
                      }`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
                
                {/* Special lightning effect for Eklak's card */}
                {index === 2 && (
                  <>
                    <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full from-purple-500/20 to-indigo-500/20 bg-gradient-to-br z-0 group-hover:scale-150 transition-transform duration-700 ${
                      theme === 'light' ? 'from-purple-400/15 to-indigo-400/15' : ''
                    }`}></div>
                    <div className={`absolute -bottom-16 -right-16 w-32 h-32 rounded-full from-purple-600/10 to-indigo-600/10 bg-gradient-to-br z-0 group-hover:scale-125 transition-transform duration-1000 ${
                      theme === 'light' ? 'from-purple-400/10 to-indigo-400/10' : ''
                    }`}></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Team ethos */}
        <div ref={ethosRef} className={`mt-16 ${ethosBg} border ${ethosBorder} rounded-2xl p-6 md:p-8 opacity-0 ${
          theme === 'light' ? 'shadow-sm' : ''
        }`}>
          <h3 className={`text-xl md:text-2xl font-bold ${textColor} mb-6`}>Our Leadership Ethos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            <div className="flex items-start gap-3 md:gap-4">
              <div className={`flex-shrink-0 mt-1 w-7 h-7 md:w-8 md:h-8 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
                <FiZap className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h4 className={`text-base md:text-lg font-medium ${textColor} mb-1 md:mb-2`}>Innovation First</h4>
                <p className={`text-xs md:text-sm ${textMuted}`}>Pushing boundaries in AI-human collaboration</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 mt-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FiUsers className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h4 className={`text-base md:text-lg font-medium ${textColor} mb-1 md:mb-2`}>Collaborative Spirit</h4>
                <p className={`text-xs md:text-sm ${textMuted}`}>Strength through diverse perspectives</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 mt-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h4 className={`text-base md:text-lg font-medium ${textColor} mb-1 md:mb-2`}>Future Focused</h4>
                <p className={`text-xs md:text-sm ${textMuted}`}>Building tomorrow's communication tools today</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}