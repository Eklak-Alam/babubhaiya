"use client"
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaTwitter,
//   FaFacebook,
//   FaLinkedin,
//   FaInstagram,
//   FaEye,
//   FaEyeSlash,
//   FaUserCheck,
//   FaGoogle,
//   FaShield,
//   FaRocket
// } from "react-icons/fa";
import { useAuth } from "@/context/ApiContext";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle, FaRocket, FaRocketchat, FaShieldAlt, FaTwitter, FaUserCheck } from "react-icons/fa";
import { IconBase } from "react-icons/lib";
import { Icons } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/chat/dashboard");
    }
  }, [user, router]);

  // Redirect on successful login
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        router.push("/chat/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      setLoginSuccess(true);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Success Screen
  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <Head>
          <title>Gaprio - Login Successful</title>
        </Head>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 max-w-md w-full"
        >
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: 0.2 
            }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaUserCheck size={32} className="text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-3"
          >
            Welcome Back!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 mb-6 text-lg"
          >
            Login successful. Redirecting to dashboard...
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 text-sm"
          >
            Securely connecting you...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <Head>
        <title>Gaprio - Login</title>
        <meta name="description" content="Login to your Gaprio account" />
      </Head>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
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
      </div>

      {/* Left Side - Enhanced Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100,
            delay: 0.3
          }}
          className="mb-8 relative"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-2xl blur-md opacity-50"
            />
            <Image
              src="/logo.png"
              alt="Gaprio Logo"
              width={140}
              height={140}
              className="rounded-2xl relative z-10 shadow-2xl"
              onError={(e) => { 
                e.currentTarget.src = 'https://placehold.co/140x140/7c3aed/ffffff?text=Gaprio'; 
              }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
        >
          Gaprio
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-300 text-xl mb-8 text-center max-w-md leading-relaxed"
        >
          Connect, collaborate, and communicate seamlessly with our AI-powered platform
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-6 text-gray-400"
        >
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-green-400" />
            <span className="text-sm">Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRocketchat className="text-blue-400" />
            <span className="text-sm">Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserCheck className="text-purple-400" />
            <span className="text-sm">Reliable</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Enhanced Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-lg">
              Sign in to continue your journey
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-600 bg-gray-700/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-4 rounded-xl border border-gray-600 bg-gray-700/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 pr-12 backdrop-blur-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </motion.div>
            
            {/* Submit Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 group"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <motion.span
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/chat/register" 
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline"
              >
                Create Account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}