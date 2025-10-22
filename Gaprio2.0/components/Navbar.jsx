'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiArrowRight, FiMessageSquare, FiHome, FiInfo, FiSettings, FiSun, FiMoon } from 'react-icons/fi'
import { BsFileEarmarkText } from 'react-icons/bs'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

export default function PremiumNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme();

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

  // Fixed scroll handling
  useEffect(() => {
    if (!isClient) return

    let lastScrollY = window.scrollY
    let ticking = false

    const updateNavbar = () => {
      const currentScrollY = window.scrollY
      
      // Only hide if scrolling down and past a certain threshold
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } 
      // Show if scrolling up
      else if (currentScrollY < lastScrollY) {
        setVisible(true)
      }
      
      // Always show if at the top of the page
      if (currentScrollY < 10) {
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

  // Theme-based styles
  const textGradient = theme === 'dark' 
    ? `bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`
    : `text-gray-900 font-bold`

  const navbarBackground = theme === 'dark'
    ? isScrolled 
      ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl'
      : 'bg-gray-900 backdrop-blur-lg'
    : isScrolled
      ? 'bg-white backdrop-blur-xl shadow-lg'
      : 'bg-white backdrop-blur-lg'

  const mobileMenuBackground = theme === 'dark'
    ? 'bg-gray-900/98 backdrop-blur-2xl'
    : 'bg-white/98 backdrop-blur-2xl'

  const mobileHeaderBackground = theme === 'dark'
    ? 'bg-gray-900/50 border-b border-gray-800'
    : 'bg-white/50 border-b border-gray-200'

  // Enhanced Lightning Button Component
  const LightningButton = ({ href, children, className = "", mobile = false }) => (
    <Link href={href} className={`focus-visible:outline-none group ${className}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative cursor-pointer px-6 py-3 rounded-xl font-semibold overflow-hidden
          border shadow-lg transition-all duration-300
          group-hover:shadow-xl flex items-center gap-2
          ${theme === 'dark'
            ? 'text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700'
            : 'text-gray-900 bg-gradient-to-r from-white via-gray-50 to-white border-gray-300'
          }
          ${mobile ? 'text-base w-full justify-center' : 'text-sm'}
        `}
      >
        {/* Main content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Animated lightning bolts */}
        <motion.div
          className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent ${
            theme === 'dark' ? 'via-white' : 'via-gray-900'
          } to-transparent opacity-0 group-hover:opacity-100`}
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
          className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent ${
            theme === 'dark' ? 'via-blue-300' : 'via-violet-500'
          } to-transparent opacity-0 group-hover:opacity-100`}
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
        {[10, 90, 20, 80].map((left, index) => (
          <motion.div
            key={index}
            className={`absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 ${
              theme === 'dark' ? 'bg-white' : 'bg-gray-900'
            }`}
            initial={{ scale: 0 }}
            whileHover={{ 
              scale: [0, 1, 0],
              x: [0, index % 2 === 0 ? 20 : -15, index % 2 === 0 ? 40 : -30],
              y: [0, index % 2 === 0 ? -10 : 8, index % 2 === 0 ? 5 : -5],
              transition: { 
                duration: 1.2 + index * 0.2,
                repeat: Infinity,
                repeatDelay: 0.3 + index * 0.1
              }
            }}
            style={{ 
              top: `${20 + index * 15}%`, 
              left: `${left}%` 
            }}
          />
        ))}

        {/* Subtle pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border border-transparent opacity-0 group-hover:opacity-100"
          whileHover={{ 
            borderColor: [
              "rgba(255,255,255,0)", 
              theme === 'dark' ? "rgba(96,165,250,0.3)" : "rgba(139,92,246,0.3)", 
              "rgba(255,255,255,0)"
            ],
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

  // Theme Toggle Button Component
  const ThemeToggle = ({ mobile = false, compact = false }) => (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative transition-all duration-300 focus-visible:outline-none
        ${mobile 
          ? 'w-full justify-center p-4 rounded-2xl border text-lg font-semibold flex items-center gap-3'
          : compact
          ? 'p-2 rounded-xl'
          : 'p-2.5 rounded-xl border'
        }
        ${theme === 'dark'
          ? mobile
            ? 'text-gray-300 hover:text-white hover:bg-gray-800/60 border-gray-700'
            : compact
            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-gray-700 hover:border-gray-600'
          : mobile
          ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 border-gray-300'
          : compact
          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border-gray-300 hover:border-gray-400'
        }
        flex items-center gap-2
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      whileHover={{ scale: mobile ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === 'dark' ? (
        <>
          <FiSun className={compact ? "h-4 w-4" : "h-5 w-5"} />
          {mobile && <span className="font-semibold">Light Mode</span>}
        </>
      ) : (
        <>
          <FiMoon className={compact ? "h-4 w-4" : "h-5 w-5"} />
          {mobile && <span className="font-semibold">Dark Mode</span>}
        </>
      )}
      
      {/* Animated background for mobile */}
      {mobile && (
        <motion.div
          className={`absolute inset-0 rounded-2xl -z-10 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' 
              : 'bg-gradient-to-r from-violet-500/10 to-pink-500/10'
          }`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )

  if (!isClient) {
    // Return a simplified version for SSR to prevent hydration mismatches
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-900 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-18 px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg overflow-hidden relative">
                  <div className="w-full h-full bg-gray-700" />
                </div>
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
          ${navbarBackground}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-18 px-4 sm:px-6 lg:px-8">
            {/* Logo - Clean and minimal */}
            <motion.div 
              className="flex-shrink-0"
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/" className="flex items-center gap-3 focus-visible:outline-none group">
                <div className="h-8 w-8 rounded-lg overflow-hidden relative">
                  <Image 
                    src="/logo.png" 
                    alt="Gaprio Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                    priority
                  />
                </div>
                <span className={`text-xl font-bold ${textGradient} transition-all duration-300`}>
                  Gaprio
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none rounded-xl group
                    ${pathname === item.href 
                      ? theme === 'dark'
                        ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                        : 'text-gray-900 bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border border-transparent hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <motion.span 
                      className={`text-base transition-all duration-300 ${
                        pathname === item.href 
                          ? theme === 'dark'
                            ? 'text-blue-400' 
                            : 'text-violet-600'
                          : theme === 'dark'
                            ? 'text-gray-500 group-hover:text-blue-400 group-hover:scale-110'
                            : 'text-gray-400 group-hover:text-violet-600 group-hover:scale-110'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {pathname === item.href && (
                    <motion.div 
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 rounded-full ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                          : 'bg-gradient-to-r from-violet-600 to-pink-600'
                      }`}
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex lg:hidden items-center space-x-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative p-3 transition-all duration-300 focus-visible:outline-none rounded-xl group
                    ${pathname === item.href 
                      ? theme === 'dark'
                        ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40' 
                        : 'text-gray-900 bg-gradient-to-r from-violet-500/30 to-pink-500/30 border border-violet-400/40'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent hover:border-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 border border-transparent hover:border-gray-300'
                    }`}
                  title={item.name}
                >
                  <motion.div 
                    className={`text-lg transition-all ${
                      pathname === item.href 
                        ? theme === 'dark'
                          ? 'text-blue-300 scale-110' 
                          : 'text-violet-600 scale-110'
                        : theme === 'dark'
                          ? 'text-gray-500 group-hover:text-blue-300'
                          : 'text-gray-400 group-hover:text-violet-600'
                    }`}
                    whileHover={{ scale: 1.15 }}
                  >
                    {item.icon}
                  </motion.div>
                  
                  {/* Mini active indicator */}
                  {pathname === item.href && (
                    <motion.div 
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        theme === 'dark' ? 'bg-blue-400' : 'bg-violet-600'
                      }`}
                      layoutId="tabletIndicator"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Enhanced CTA Button */}
              <LightningButton href="/get-started">
                <span>Get Started</span>
                <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
              </LightningButton>
            </div>

            {/* Mobile Actions - Theme Toggle + Menu Button */}
            <div className="flex md:hidden items-center space-x-1">
              {/* Theme Toggle on Mobile */}
              <ThemeToggle compact />
              
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 focus-visible:outline-none ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
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
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`fixed top-0 right-0 bottom-0 w-full max-w-sm backdrop-blur-2xl shadow-2xl z-50 overflow-y-auto ${mobileMenuBackground}`}
            >
              {/* Header Section */}
              <div className={`flex items-center justify-between py-4 px-6 ${mobileHeaderBackground}`}>
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden relative">
                    <Image 
                      src="/logo.png" 
                      alt="Gaprio Logo" 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                  </div>
                  <span className={`text-xl font-bold ${textGradient}`}>
                    Gaprio
                  </span>
                </motion.div>

                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Navigation Items */}
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
                          ? theme === 'dark'
                            ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40' 
                            : 'text-gray-900 bg-gradient-to-r from-violet-500/30 to-pink-500/30 border border-violet-400/40'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent hover:border-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 border border-transparent hover:border-gray-300'
                        }`}
                    >
                      <motion.span 
                        className={`flex-shrink-0 text-xl transition-all ${
                          pathname === item.href 
                            ? theme === 'dark'
                              ? 'text-blue-300 scale-110' 
                              : 'text-violet-600 scale-110'
                            : theme === 'dark'
                              ? 'text-gray-500 group-hover:text-blue-300'
                              : 'text-gray-400 group-hover:text-violet-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="flex-1">{item.name}</span>
                      <FiArrowRight className={`text-base transition-all duration-300 ${
                        pathname === item.href 
                          ? theme === 'dark'
                            ? 'text-blue-400 translate-x-1' 
                            : 'text-violet-600 translate-x-1'
                          : theme === 'dark'
                            ? 'text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1'
                            : 'text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1'
                      }`} />
                    </Link>
                  </motion.div>
                ))}

                {/* Theme Toggle in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ThemeToggle mobile />
                </motion.div>

                {/* Mobile CTA Button */}
                <motion.div 
                  className="pt-4"
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