"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';

export default function DemoNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  // Auto open after 2.5s on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Theme-based styles
  const overlayBg = theme === 'dark' ? 'bg-black/50' : 'bg-black/40'
  const modalBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const textMuted = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const textBrand = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const closeButton = theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-700'
  const dividerBg = theme === 'dark' ? 'bg-red-500' : 'bg-red-600'
  const ctaBg = theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${overlayBg} backdrop-blur-sm px-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`relative w-full max-w-lg ${modalBg} rounded-3xl shadow-2xl p-8 md:p-10 ${textColor} border ${borderColor}`}
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 18, stiffness: 250 }}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${
                theme === 'dark' ? 'bg-red-500/10' : 'bg-red-400/10'
              }`} />
              <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl ${
                theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/10'
              }`} />
            </div>

            {/* Close button */}
            <button
              className={`absolute top-4 right-4 ${closeButton} transition-colors duration-200 z-10`}
              onClick={() => setIsOpen(false)}
              aria-label="Close notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 
                     0L10 8.586l4.293-4.293a1 1 0 
                     111.414 1.414L11.414 10l4.293 
                     4.293a1 1 0 01-1.414 1.414L10 
                     11.414l-4.293 4.293a1 1 0 
                     01-1.414-1.414L8.586 10 
                     4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Logo / Brand name */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${textBrand}`}>
                  ⚡ <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">Gaprio</span> Notice
                </h1>
              </motion.div>

              {/* Divider */}
              <motion.div 
                className={`w-16 h-1 ${dividerBg} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: "4rem" }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />

              {/* Heading */}
              <motion.h2 
                className={`text-xl md:text-2xl font-semibold ${textColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                🚨 Important Website Update
              </motion.h2>

              {/* Message */}
              <motion.p 
                className={`max-w-md text-base md:text-lg ${textMuted} leading-relaxed`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Welcome to{" "}
                <span className="font-bold text-red-500">Gaprio</span>. This is
                currently a <span className="font-semibold">demo version</span>{" "}
                of our platform. AI-powered features are temporarily
                <span className="text-red-500 font-semibold">
                  {" "}
                  unavailable{" "}
                </span>{" "}
                due to limited server funding.
              </motion.p>

              {/* Additional Info */}
              <motion.div 
                className={`text-sm ${textMuted} bg-gradient-to-r ${
                  theme === 'dark' ? 'from-gray-800/50 to-gray-800/30' : 'from-gray-100 to-gray-50'
                } rounded-xl p-4 border ${borderColor}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p>🔧 <strong>Current Status:</strong> Core features available</p>
                <p>⚡ <strong>AI Features:</strong> Temporarily disabled</p>
                <p>🔄 <strong>Updates:</strong> Follow our progress</p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <a
                  href="mailto:hanu_24a12res261@iitp.ac.in"
                  className={`inline-flex items-center gap-2 px-7 py-3 text-sm md:text-base font-medium text-white ${ctaBg} rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <span>📧</span>
                  Contact Gaprio Support
                </a>
              </motion.div>

              {/* Footer note */}
              <motion.p 
                className={`text-xs ${textMuted} mt-2`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                This message will auto-dismiss when closed
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}