'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaEye, FaEyeSlash, FaUser, FaUserCheck } from "react-icons/fa"

export default function Signup() {
  const router = useRouter();
  const { user, register } = useAuth();

  // --- State Management inside the component ---
  const [formData, setFormData] = useState({
    name: '', // Changed back to 'name' to match AuthContext
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // --- Redirect if already logged in ---
  useEffect(() => {
    if (user) {
      router.push('/chat/dashboard');
    }
  }, [user, router]);

  // --- Redirect on successful registration ---
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
      setFormErrors(prev => ({ ...prev, [name]: null }))
    }
    if (error) setError('');
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
    setSuccessMessage('')
    
    try {
      // Use AuthContext register function
      await register(formData.name, formData.username, formData.email, formData.password)
      setSuccessMessage('Account created successfully! Redirecting to login...')
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

  // --- Success Screen ---
  if (registerSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Head>
          <title>Gaprio - Registration Successful</title>
        </Head>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaUserCheck size={32} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-300 mb-4">Welcome to Gaprio, {formData.name}!</p>
          <p className="text-gray-400">Redirecting to login page...</p>
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <Head>
        <title>Gaprio - Sign Up</title>
        <meta name="description" content="Create your Gaprio account" />
      </Head>

      {/* Animated Blobs Background */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative pt-28"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Gaprio Logo"
              width={160}
              height={160}
              className="rounded-xl"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/160x160/7c3aed/ffffff?text=Gaprio'; }}
            />
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold mb-2 drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]"
        >
          Gaprio
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg mb-12 text-center max-w-sm"
        >
          Join our community and connect with people worldwide
        </motion.p>
      </motion.div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-gray-400 mb-8">Join Gaprio today, it's fast and easy!</p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                <FaUser className="inline mr-2 text-indigo-400" />Full Name
              </label>
              <input
                id="name" 
                name="name" 
                type="text"
                value={formData.name} 
                onChange={handleChange} 
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Eklak Alam"
                disabled={loading}
              />
              {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
              <input
                id="username" 
                name="username" 
                type="text"
                value={formData.username} 
                onChange={handleChange} 
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="eklak_alam"
                disabled={loading}
              />
              {formErrors.username && <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                disabled={loading}
              />
              {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password} 
                  onChange={handleChange} 
                  required
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
            </div>
            
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/chat/login" 
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>

          {/* Social Signup Options (Optional) */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400 mb-4">Or sign up with</p>
            <div className="flex justify-center space-x-4">
              <button 
                type="button"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                <FaGoogle className="text-white text-xl" />
              </button>
              <button 
                type="button"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                <FaFacebook className="text-white text-xl" />
              </button>
              <button 
                type="button"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                <FaTwitter className="text-white text-xl" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

       <style jsx>{`
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// Add FaGoogle import if you want social buttons
import { FaGoogle } from "react-icons/fa";
import { useAuth } from '@/context/ApiContext'
