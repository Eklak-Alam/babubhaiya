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
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: <FiHome className="text-lg" /> },
    { name: "About", href: "/about", icon: <FiInfo className="text-lg" /> },
    { name: "Services", href: "/services", icon: <FiSettings className="text-lg" /> },
    { name: "Contract Generator", href: "/contract-generator", icon: <BsFileEarmarkText className="text-lg" /> },
    { name: "Chat", href: "/chat", icon: <FiMessageSquare className="text-lg" /> },
  ]

  // Simple scroll handling
  useEffect(() => {
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
  }, [])

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

  const primaryGradient = 'bg-gradient-to-r from-blue-500 to-purple-500'
  const primaryHover = 'hover:from-blue-600 hover:to-purple-600'
  const textGradient = `bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`

  return (
    <>
      {/* Main Navbar - Clean Design */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out
          ${visible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled 
            ? 'bg-gray-900 backdrop-blur-md shadow-sm' 
            : 'bg-gray-900 backdrop-blur-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-18 px-4 sm:px-6 lg:px-8">
            {/* Logo - Clean without background */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 focus-visible:outline-none">
                <div className="h-9 w-9 rounded-lg overflow-hidden relative">
                  <Image 
                    src="/logo.png" 
                    alt="Gaprio Logo" 
                    width={36} 
                    height={36} 
                    className="object-contain"
                    priority
                  />
                </div>
                <span className={`text-xl font-bold ${textGradient}`}>
                  Gaprio
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none rounded-lg group
                    ${pathname === item.href 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-400 hover:text-blue-600'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-base transition-colors ${
                      pathname === item.href ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {pathname === item.href && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex lg:hidden items-center space-x-3">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative p-2.5 transition-all duration-200 focus-visible:outline-none rounded-lg
                    ${pathname === item.href 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  title={item.name}
                >
                  <div className={`text-lg transition-colors ${
                    pathname === item.href ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                  }`}>
                    {item.icon}
                  </div>
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <Link href="/get-started" className="focus-visible:outline-none">
                <button
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg text-white ${primaryGradient} ${primaryHover} shadow-md transition-all flex items-center gap-2 hover:shadow-lg hover:scale-105`}
                >
                  <span>Get Started</span>
                  <FiArrowRight className="text-base" />
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-visible:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-gray-900 backdrop-blur-xl border-l border-gray-800 shadow-xl z-50 overflow-y-auto"
            >
              {/* Header Section */}
              <div className="flex items-center justify-between py-3.5 px-5 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg overflow-hidden">
                    <Image 
                      src="/logo.png" 
                      alt="Gaprio Logo" 
                      width={32} 
                      height={32} 
                      className="object-contain"
                    />
                  </div>
                  <span className={`text-lg font-bold ${textGradient}`}>
                    Gaprio
                  </span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-5 space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-all duration-200 focus-visible:outline-none
                      ${pathname === item.href 
                        ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent'
                      }`}
                  >
                    <span className={`flex-shrink-0 text-lg ${
                      pathname === item.href ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                    <FiArrowRight className={`text-sm transition-transform duration-200 ${
                      pathname === item.href ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                  </Link>
                ))}

                {/* Mobile CTA Button */}
                <div className="pt-4">
                  <Link href="/get-started" className="focus-visible:outline-none">
                    <button
                      className={`w-full px-4 py-3 text-base font-semibold rounded-lg text-white ${primaryGradient} ${primaryHover} shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg`}
                    >
                      <span>Get Started</span>
                      <FiArrowRight className="text-sm" />
                    </button>
                  </Link>
                </div>
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