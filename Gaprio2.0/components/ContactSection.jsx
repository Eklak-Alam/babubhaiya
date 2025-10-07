'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiPhone, FiGlobe, FiMail, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ContactSection() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const visualSideRef = useRef(null)
  const contactCardsRef = useRef([])
  const socialLinksRef = useRef([])
  const thankYouTextRef = useRef(null)
  const circlesRef = useRef([])

  const contactMethods = [
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: "Call Us",
      value: "+91 62016 68873",
      link: "tel:+916201668873",
      color: "from-green-500 to-emerald-500",
      hover: "hover:shadow-emerald-500/30"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Visit Us",
      value: "gaprio.vercel.app",
      link: "https://gaprio.vercel.app",
      color: "from-blue-500 to-cyan-500",
      hover: "hover:shadow-blue-500/30"
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Email Us",
      value: "hanushashwat733@gmail.com",
      link: "mailto:hanushashwat733@gmail.com",
      color: "from-amber-500 to-orange-500",
      hover: "hover:shadow-amber-500/30"
    }
  ]

  const socialLinks = [
    { icon: <FiGithub className="w-5 h-5" />, url: "#", name: "GitHub", hover: "hover:bg-gray-800 hover:text-white" },
    { icon: <FiLinkedin className="w-5 h-5" />, url: "#", name: "LinkedIn", hover: "hover:bg-blue-600 hover:text-white" },
    { icon: <FiTwitter className="w-5 h-5" />, url: "#", name: "Twitter", hover: "hover:bg-blue-400 hover:text-white" },
    { icon: <FiInstagram className="w-5 h-5" />, url: "#", name: "Instagram", hover: "hover:bg-pink-600 hover:text-white" }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the main container
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate the visual side
      gsap.fromTo(visualSideRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: visualSideRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate the thank you text with a typing effect
      const thankYouText = thankYouTextRef.current
      if (thankYouText) {
        const text = thankYouText.textContent
        thankYouText.textContent = ""
        
        gsap.to(thankYouText, {
          duration: 1.5,
          scrollTrigger: {
            trigger: thankYouText,
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          onStart: () => {
            let i = 0
            const typeInterval = setInterval(() => {
              if (i < text.length) {
                thankYouText.textContent += text.charAt(i)
                i++
              } else {
                clearInterval(typeInterval)
              }
            }, 50)
          }
        })
      }

      // Animate contact cards with stagger
      contactCardsRef.current.forEach((card, index) => {
        if (!card) return
        
        gsap.fromTo(card,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        )

        // Hover animation for cards
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out"
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        })
      })

      // Animate social links
      socialLinksRef.current.forEach((link, index) => {
        if (!link) return
        
        gsap.fromTo(link,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: 0.8 + index * 0.1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: link,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        )

        // Hover animation for social links
        link.addEventListener('mouseenter', () => {
          gsap.to(link, {
            y: -5,
            scale: 1.1,
            duration: 0.2,
            ease: "power2.out"
          })
        })

        link.addEventListener('mouseleave', () => {
          gsap.to(link, {
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          })
        })
      })

      // Animate rotating circles
      circlesRef.current.forEach((circle, index) => {
        if (!circle) return
        
        const direction = index % 2 === 0 ? 360 : -360
        const duration = 40 + (index * 10)
        
        gsap.to(circle, {
          rotation: direction,
          duration: duration,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center"
        })
      })

      // Add floating particles to the visual side
      const visualSide = visualSideRef.current
      if (visualSide) {
        for (let i = 0; i < 15; i++) {
          const particle = document.createElement('div')
          particle.className = 'absolute rounded-full opacity-20'
          particle.style.width = `${Math.random() * 15 + 5}px`
          particle.style.height = particle.style.width
          particle.style.left = `${Math.random() * 100}%`
          particle.style.top = `${Math.random() * 100}%`
          particle.style.backgroundColor = ['#8b5cf6', '#3b82f6', '#ec4899'][i % 3]
          visualSide.appendChild(particle)
          
          // Animate particles
          gsap.to(particle, {
            y: -20,
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          })
        }
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      <div ref={containerRef} className="relative max-w-6xl mx-auto px-6 lg:px-8 w-full opacity-0">
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div ref={visualSideRef} className="hidden lg:block relative h-full min-h-[500px] bg-gradient-to-br from-indigo-900/30 to-purple-900/30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      ref={el => circlesRef.current[0] = el}
                      className="absolute w-64 h-64 border-2 border-dashed border-indigo-500/30 rounded-full"
                    ></div>
                    <div
                      ref={el => circlesRef.current[1] = el}
                      className="absolute w-80 h-80 border-2 border-dashed border-purple-500/20 rounded-full"
                    ></div>
                    <div className="relative z-10 text-center p-8">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Let's Connect
                      </h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        We're excited to hear from you and discuss how we can work together.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Info */}
            <div className="p-12">
              <div>
                <h2 ref={thankYouTextRef} className="text-4xl md:text-5xl font-extrabold mb-6">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Thank You!
                  </span>
                </h2>
                <p className="text-lg text-gray-400 mb-10">
                  Reach out to us through any of these channels
                </p>

                {/* Contact Cards */}
                <div className="space-y-6 mb-12">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      ref={el => contactCardsRef.current[index] = el}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-6 p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-transparent shadow-lg ${method.hover} transition-all duration-300 opacity-0`}
                    >
                      <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} text-white shadow-md`}>
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{method.title}</h3>
                        <p className="text-gray-400">{method.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Follow Us</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        ref={el => socialLinksRef.current[index] = el}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 ${social.hover} border border-gray-700 hover:border-transparent transition-all duration-300 shadow-md`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}