'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/ApiContext'
import { useTheme } from '@/context/ThemeContext'
import { FaCheckCircle, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaShieldAlt, FaRocket, FaUser, FaUserCheck } from 'react-icons/fa'

// Client-only particles component to prevent hydration errors
function ClientOnlyParticles({ isDark }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-600/30'}`}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

export default function Signup() {
  const router = useRouter();
  const { user, register } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/80',
    cardBorder: theme === 'dark' ? 'border-white/10' : 'border-gray-200/50',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    input: {
      background: theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/60',
      border: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
      focus: 'focus:ring-2 focus:ring-purple-500 focus:border-transparent',
    },
    button: {
      primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
      secondary: theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700',
    },
    error: theme === 'dark' ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-100 border-red-300 text-red-700',
    success: theme === 'dark' ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-green-100 border-green-300 text-green-700'
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/chat/dashboard');
    }
  }, [user, router]);

  // Redirect on successful registration
  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        router.push('/chat/login')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [registerSuccess, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) setError('')
  }
  
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Full name is required'
    if (!formData.username.trim()) {
        errors.username = 'Username is required'
    } else if (!/^[a-zA-Z0-9_]{3,}$/.test(formData.username)) {
        errors.username = 'Username must be 3+ characters (letters, numbers, or _)'
    }
    if (!formData.email.trim()) {
        errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
        errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    setError('')
    
    try {
      await register(formData.name, formData.username, formData.email, formData.password)
      setRegisterSuccess(true)
    } catch (err) {
      console.error('Registration error:', err)
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to create account. The username or email might already be taken.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Enhanced Success Screen
  if (registerSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeStyles.background} p-4 transition-colors duration-300`}>
        <Head>
          <title>Registration Successful - Gaprio</title>
        </Head>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-8 rounded-3xl shadow-2xl border ${themeStyles.cardBorder} backdrop-blur-xl max-w-md w-full ${
            theme === 'dark' ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50' : 'bg-gradient-to-br from-purple-50 to-blue-50'
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaUserCheck size={32} className="text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-2xl font-bold ${themeStyles.text.primary} mb-3`}
          >
            Welcome to Gaprio!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${themeStyles.text.secondary} mb-2`}
          >
            Hello, <span className="text-purple-500 font-semibold">{formData.name}</span>
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`${themeStyles.text.tertiary} mb-6 text-sm`}
          >
            Your account has been created successfully
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-2 overflow-hidden`}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`${themeStyles.text.tertiary} text-sm`}
          >
            Redirecting to login...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex ${themeStyles.background} transition-colors duration-300 relative overflow-hidden`}>
      <Head>
        <title>Sign Up - Gaprio</title>
        <meta name="description" content="Create your Gaprio account" />
      </Head>

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-400/20'
          }`}
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-400/20'
          }`}
        />
        
        {/* Floating Particles - Client Only */}
        <ClientOnlyParticles isDark={theme === 'dark'} />
      </div>

      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 flex-col items-center justify-center p-8 relative"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Gaprio Logo"
              width={100}
              height={100}
              className="rounded-xl shadow-lg"
              onError={(e) => { 
                e.currentTarget.src = `https://placehold.co/100x100/${theme === 'dark' ? '7c3aed' : '8b5cf6'}/ffffff?text=G`; 
              }}
              priority
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-4xl font-bold mb-4 bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-white to-purple-200' 
              : 'from-gray-900 to-purple-600'
          } bg-clip-text text-transparent`}
        >
          Gaprio
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-center max-w-sm leading-relaxed ${themeStyles.text.secondary}`}
        >
          Join our community and start connecting with amazing people worldwide
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3 text-left mt-8"
        >
          {[
            { icon: FaShieldAlt, text: "Secure & Encrypted", color: "text-green-500" },
            { icon: FaRocket, text: "Lightning Fast", color: "text-blue-500" },
            { icon: FaCheckCircle, text: "Easy to Use", color: "text-purple-500" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className={`flex items-center gap-3 ${themeStyles.text.secondary}`}
            >
              <feature.icon className={`${feature.color} text-lg`} />
              <span className="text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl border backdrop-blur-xl ${themeStyles.card} ${themeStyles.cardBorder}`}
        >
          {/* Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Join Gaprio
            </h2>
            <p className={themeStyles.text.secondary}>
              Create your account in seconds
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-3 rounded-lg border ${themeStyles.error} text-sm backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="name" className={`block text-sm font-medium mb-2 ${themeStyles.text.secondary}`}>
                <FaUser className="inline mr-2 text-purple-500" />
                Full Name
              </label>
              <input
                id="name" 
                name="name" 
                type="text"
                value={formData.name} 
                onChange={handleChange} 
                required
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none placeholder-gray-400 backdrop-blur-sm ${
                  themeStyles.input.background
                } ${themeStyles.input.border} ${themeStyles.input.focus} ${themeStyles.text.primary}`}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {formErrors.name && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2"
                >
                  {formErrors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Username Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <label htmlFor="username" className={`block text-sm font-medium mb-2 ${themeStyles.text.secondary}`}>
                Username
              </label>
              <input
                id="username" 
                name="username" 
                type="text"
                value={formData.username} 
                onChange={handleChange} 
                required
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none placeholder-gray-400 backdrop-blur-sm ${
                  themeStyles.input.background
                } ${themeStyles.input.border} ${themeStyles.input.focus} ${themeStyles.text.primary}`}
                placeholder="Choose a username"
                disabled={loading}
              />
              {formErrors.username && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2"
                >
                  {formErrors.username}
                </motion.p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${themeStyles.text.secondary}`}>
                Email Address
              </label>
              <input
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                required
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none placeholder-gray-400 backdrop-blur-sm ${
                  themeStyles.input.background
                } ${themeStyles.input.border} ${themeStyles.input.focus} ${themeStyles.text.primary}`}
                placeholder="you@example.com"
                disabled={loading}
              />
              {formErrors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2"
                >
                  {formErrors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${themeStyles.text.secondary}`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password} 
                  onChange={handleChange} 
                  required
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none placeholder-gray-400 pr-12 backdrop-blur-sm ${
                    themeStyles.input.background
                  } ${themeStyles.input.border} ${themeStyles.input.focus} ${themeStyles.text.primary}`}
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? 
                    <FaEyeSlash size={16} className={themeStyles.text.tertiary} /> : 
                    <FaEye size={16} className={themeStyles.text.tertiary} />
                  }
                </button>
              </div>
              {formErrors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2"
                >
                  {formErrors.password}
                </motion.p>
              )}
            </motion.div>
            
            {/* Submit Button */}
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${
                themeStyles.button.primary
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative flex items-center my-6"
          >
            <div className={`flex-grow border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
            <span className={`flex-shrink mx-4 text-sm ${themeStyles.text.tertiary}`}>or continue with</span>
            <div className={`flex-grow border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
          </motion.div>

          {/* Social Signup */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                themeStyles.button.secondary
              }`}
            >
              <FaGoogle className="text-red-500" size={16} />
              Google
            </button>
            <button
              type="button"
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                themeStyles.button.secondary
              }`}
            >
              <FaGithub size={16} />
              GitHub
            </button>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 text-center"
          >
            <p className={`text-sm ${themeStyles.text.secondary}`}>
              Already have an account?{' '}
              <Link 
                href="/chat/login" 
                className="font-semibold text-purple-500 hover:text-purple-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}