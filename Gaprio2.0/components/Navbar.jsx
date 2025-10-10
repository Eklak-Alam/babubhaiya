'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiArrowRight, FiMessageSquare, FiHome, FiInfo, FiSettings } from 'react-icons/fi'
import { BsFileEarmarkText } from 'react-icons/bs'
import { usePathname } from 'next/navigation'

export default function PremiumNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: <FiHome className="text-lg" /> },
    { name: "About", href: "/about", icon: <FiInfo className="text-lg" /> },
    { name: "Services", href: "/services", icon: <FiSettings className="text-lg" /> },
    { name: "Contract Generator", href: "/contract-generator", icon: <BsFileEarmarkText className="text-lg" /> },
    { name: "Chat", href: "/chat", icon: <FiMessageSquare className="text-lg" /> },
  ]

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Simple scroll handling
  useEffect(() => {
    if (!isClient) return

    let lastScrollY = window.scrollY
    let ticking = false

    const updateNavbar = () => {
      const currentScrollY = window.scrollY
        
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      
      // Background change
      setIsScrolled(currentScrollY > 10)
      lastScrollY = currentScrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const textGradient = `bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`

  // Enhanced Lightning Button Component
const LightningButton = ({ href, children, className = "", mobile = false }) => (
  <Link href={href} className={`focus-visible:outline-none group ${className}`}>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
          relative cursor-pointer px-6 py-3 rounded-xl font-semibold text-white overflow-hidden
          bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
          border border-gray-700 shadow-lg
          transition-all duration-300
          group-hover:shadow-xl
          ${mobile ? 'text-base w-full justify-center' : 'text-sm'}
          flex items-center gap-2
        `}
    >
      {/* NO background colors - only animated effects */}
      
      {/* Main content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Animated lightning bolts */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: -20 }}
        whileHover={{ 
          x: "100vw",
          transition: { 
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2
          }
        }}
      />
      
      <motion.div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: -10 }}
        whileHover={{ 
          x: "100vw",
          transition: { 
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1.5
          }
        }}
      />

      {/* Sparkle particles */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
        initial={{ scale: 0 }}
        whileHover={{ 
          scale: [0, 1, 0],
          x: [0, 20, 40],
          y: [0, -10, 5],
          transition: { 
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5
          }
        }}
        style={{ top: '20%', left: '10%' }}
      />
      
      <motion.div
        className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100"
        initial={{ scale: 0 }}
        whileHover={{ 
          scale: [0, 1, 0],
          x: [0, -15, -30],
          y: [0, 8, -5],
          transition: { 
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 0.8
          }
        }}
        style={{ top: '70%', left: '90%' }}
      />

      <motion.div
        className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100"
        initial={{ scale: 0 }}
        whileHover={{ 
          scale: [0, 1, 0],
          x: [0, 25, 50],
          y: [0, 15, -10],
          transition: { 
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 0.3
          }
        }}
        style={{ top: '50%', left: '20%' }}
      />

      <motion.div
        className="absolute w-1 h-1 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100"
        initial={{ scale: 0 }}
        whileHover={{ 
          scale: [0, 1, 0],
          x: [0, -20, -40],
          y: [0, -12, 8],
          transition: { 
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 0.6
          }
        }}
        style={{ top: '30%', left: '80%' }}
      />

      {/* Subtle pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-transparent opacity-0 group-hover:opacity-100"
        whileHover={{ 
          borderColor: ["rgba(255,255,255,0)", "rgba(96,165,250,0.3)", "rgba(255,255,255,0)"],
          transition: { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
    </motion.button>
  </Link>
)
  if (!isClient) {
    // Return a simplified version for SSR to prevent hydration mismatches
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-900 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-18 px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg overflow-hidden relative bg-gray-700" />
                <span className="text-xl font-bold text-gray-400">Gaprio</span>
              </div>
            </div>
            <button className="md:hidden p-2.5 rounded-lg text-gray-600">
              <FiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-16 lg:h-18" />
      </header>
    )
  }

  return (
    <>
      {/* Main Navbar - Enhanced Design */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out
          ${visible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-800' 
            : 'bg-gray-900/80 backdrop-blur-lg'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-18 px-4 sm:px-6 lg:px-8">
            {/* Logo - Enhanced with glow effect */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/" className="flex items-center gap-3 focus-visible:outline-none group">
                <div className="h-9 w-9 rounded-xl overflow-hidden relative p-0.5">
                  <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                    <Image 
                      src="/logo.png" 
                      alt="Gaprio Logo" 
                      width={32} 
                      height={32} 
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <span className={`text-xl font-bold ${textGradient} group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300`}>
                  Gaprio
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none rounded-xl group
                    ${pathname === item.href 
                      ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <motion.span 
                      className={`text-base transition-all duration-300 ${
                        pathname === item.href 
                          ? 'text-blue-400 drop-shadow-glow' 
                          : 'text-gray-500 group-hover:text-blue-400 group-hover:scale-110'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  
                  {/* Enhanced active indicator */}
                  {pathname === item.href && (
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation - Enhanced */}
            <nav className="hidden md:flex lg:hidden items-center space-x-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative p-3 transition-all duration-300 focus-visible:outline-none rounded-xl group
                    ${pathname === item.href 
                      ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
                    }`}
                  title={item.name}
                >
                  <motion.div 
                    className={`text-lg transition-all ${
                      pathname === item.href 
                        ? 'text-blue-300 scale-110' 
                        : 'text-gray-500 group-hover:text-blue-300'
                    }`}
                    whileHover={{ scale: 1.15 }}
                  >
                    {item.icon}
                  </motion.div>
                  
                  {/* Mini active indicator */}
                  {pathname === item.href && (
                    <motion.div 
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                      layoutId="tabletIndicator"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Enhanced CTA Button */}
            <div className="hidden md:flex items-center">
              <LightningButton href="/get-started">
                <span>Get Started</span>
                <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
              </LightningButton>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 focus-visible:outline-none border border-transparent hover:border-gray-700"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Enhanced Mobile Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gray-900/95 backdrop-blur-2xl border-l border-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Enhanced Header Section */}
              <div className="flex items-center justify-between py-4 px-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="h-10 w-10 rounded-xl p-0.5">
                    <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                      <Image 
                        src="/logo.png" 
                        alt="Gaprio Logo" 
                        width={28} 
                        height={28} 
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <span className={`text-xl font-bold ${textGradient}`}>
                    Gaprio
                  </span>
                </motion.div>

                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-gray-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Enhanced Navigation Items */}
              <div className="p-6 space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Link 
                      href={item.href}
                      className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold transition-all duration-300 focus-visible:outline-none group
                        ${pathname === item.href 
                          ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40 shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
                        }`}
                    >
                      <motion.span 
                        className={`flex-shrink-0 text-xl transition-all ${
                          pathname === item.href 
                            ? 'text-blue-300 scale-110' 
                            : 'text-gray-500 group-hover:text-blue-300'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="flex-1">{item.name}</span>
                      <FiArrowRight className={`text-base transition-all duration-300 ${
                        pathname === item.href 
                          ? 'text-blue-400 translate-x-1' 
                          : 'text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1'
                      }`} />
                    </Link>
                  </motion.div>
                ))}

                {/* Enhanced Mobile CTA Button */}
                <motion.div 
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <LightningButton href="/get-started" mobile>
                    <span>Get Started</span>
                    <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                  </LightningButton>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add padding to prevent content from being hidden behind navbar */}
      <div className="h-16 lg:h-18" />
    </>
  )
}