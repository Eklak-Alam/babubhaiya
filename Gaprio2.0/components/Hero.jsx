'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// --- Lucide Icons ---
const ArrowRightIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
)

const BotIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/>
    <path d="M20 14h2"/>
    <path d="M15 13v2"/>
    <path d="M9 13v2"/>
  </svg>
)

const UsersIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const FileTextIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
)

const MessageCircleIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
)

const SparklesIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
)

const ZapIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

// --- Enhanced Auto-Play Image Gallery Component ---
const AutoPlayImageGallery = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Enhanced Main Card with Better Aesthetics */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        {/* Main Card Container */}
        <div className="relative bg-gray-800/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 rounded-2xl animate-border-flow"></div>
          
          {/* Content */}
          <div className="relative p-1">
            <div className="relative w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
                  animate={{ 
                    opacity: index === currentIndex ? 1 : 0,
                    scale: index === currentIndex ? 1 : 1.1,
                    filter: index === currentIndex ? "blur(0px)" : "blur(4px)"
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  {/* Image with Enhanced Styling */}
                  <div 
                    className="w-full h-full bg-cover bg-center transform transition-transform duration-1000"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shine" />
                </motion.div>
              ))}
              
              {/* Enhanced Navigation Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/40 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Enhanced Indicator Dots */}
                <div className="flex space-x-3">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-500 transform ${
                        index === currentIndex 
                          ? 'bg-white scale-125 shadow-lg ring-2 ring-purple-400' 
                          : 'bg-white/40 hover:bg-white/60 hover:scale-110'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: interval / 1000, 
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  key={currentIndex}
                />
              </div>

              {/* Image Counter
              <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10">
                <span className="text-sm font-medium text-white">
                  {currentIndex + 1} / {images.length}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Custom Hook to load external scripts ---
const useExternalScript = (url, callback) => {
  useEffect(() => {
    if (!url) return
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => {
      if (callback) callback()
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [url, callback])
}

// --- Animated Magnetic Button Component ---
const MagneticButton = ({ children }) => {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
      className="relative"
    >
      {children}
    </motion.div>
  )
}

// --- Floating Icons ---
const FloatingIcon = ({ icon: Icon, delay, position, size = "w-8 h-8" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`absolute ${position} ${size} text-white/20`}
  >
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay }}
    >
      <Icon />
    </motion.div>
  </motion.div>
)

// --- Main Hero Section Component ---
export default function Hero() {
  const heroRef = useRef(null)
  const [isGsapReady, setIsGsapReady] = useState(false)

  // Your images array
  const galleryImages = [
    '/heroimg/contract.png',
    '/heroimg/contractgenerate.png',
    '/heroimg/chathero.png',
    '/heroimg/chatdashboard.png',
    '/heroimg/groupchat.png',
    '/heroimg/groupdashboard.png',
  ]

  // Load GSAP and then set ready state
  useExternalScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
    setIsGsapReady(true)
  })

  const textGradient = `bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent`

  // GSAP Animations
  useEffect(() => {
    if (!isGsapReady || !heroRef.current) return
    const gsap = window.gsap
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }})

    tl.fromTo('.hero-element', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.5 }
    )
  }, [isGsapReady])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 100
      const y = (clientY / window.innerHeight) * 100
      heroRef.current.style.setProperty('--x', `${x}%`)
      heroRef.current.style.setProperty('--y', `${y}%`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative">
      {/* Main Section with Graph Background */}
      <section
        ref={heroRef}
        className="relative w-full bg-gray-900 text-white overflow-hidden"
        style={{ '--x': '50%', '--y': '50%' }}
      >
        {/* Graph Line Pattern Background */}
        <div className="absolute inset-0 graph-pattern opacity-90"></div>
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 -z-10 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at var(--x) var(--y), rgba(139, 92, 246, 0.15), transparent 40%)`,
          }}
        />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"
        />

        {/* Floating Icons */}
        <div className="hidden sm:block">
          <FloatingIcon icon={SparklesIcon} delay={1.2} position="top-10 right-10" />
          <FloatingIcon icon={ZapIcon} delay={1.4} position="bottom-20 left-10" />
          <FloatingIcon icon={BotIcon} delay={1.6} position="top-20 left-20" size="w-10 h-10" />
          <FloatingIcon icon={MessageCircleIcon} delay={1.8} position="bottom-32 right-20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center min-h-screen">
          <div className="max-w-6xl mx-auto text-center">
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
              className="hero-element inline-flex items-center gap-2 border border-white/20 bg-black/40 backdrop-blur-lg rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-8 shadow-2xl"
            >
              <BotIcon className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                Next-Gen AI Workspace
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="hero-element text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4 sm:mb-6 leading-tight">
              Your All-in-One <span className={`${textGradient} animate-gradient`}>AI Workspace</span>
            </h1>

            {/* Description */}
            <p className="hero-element text-base sm:text-xl lg:text-2xl text-gray-300 max-w-2xl sm:max-w-4xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
              Generate contracts, collaborate in group chats, and leverage AI assistants—all in one intelligent platform for modern teams.
            </p>

            {/* Feature Highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hero-element grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12 max-w-md sm:max-w-2xl mx-auto px-2"
            >
              {[
                { icon: FileTextIcon, text: "Smart Contracts" },
                { icon: UsersIcon, text: "Group Chats" },
                { icon: MessageCircleIcon, text: "AI Assistants" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <feature.icon className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-300 text-center leading-tight">
                    {feature.text.split(' ').map((word, i) => (
                      <span key={i}>
                        {word}
                        {i < feature.text.split(' ').length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2">
              <MagneticButton>
                <Link href="/chat" className="group relative flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 text-sm sm:text-base">
                  Start your journey
                  <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/contract-generator" className="group relative flex items-center justify-center w-full sm:w-auto bg-transparent border-2 border-white/20 hover:bg-white/10 hover:border-white/30 text-gray-300 font-medium py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all duration-300 backdrop-blur-sm text-sm sm:text-base">
                  Generate Contract
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Image Gallery Section - Now part of the same background */}
        <section className="relative pb-32 -mt-10">
          <AutoPlayImageGallery images={galleryImages} interval={4000} />
        </section>
      </section>

      {/* Enhanced Styles */}
      <style jsx>{`
        .graph-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 3s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-border-flow {
          background-size: 200% 200%;
          animation: borderFlow 3s ease infinite;
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}