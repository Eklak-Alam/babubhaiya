"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoNotification() {
  const [isOpen, setIsOpen] = useState(false);

  // Auto open after 2.5s on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-gray-800"
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 18, stiffness: 250 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
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
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Logo / Brand name */}
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                ⚡ Gaprio Notice
              </h1>

              {/* Divider */}
              <div className="w-16 h-1 bg-red-600 rounded-full"></div>

              {/* Heading */}
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                🚨 Important Website Update
              </h2>

              {/* Message */}
              <p className="max-w-md text-base md:text-lg text-gray-600 leading-relaxed">
                Welcome to{" "}
                <span className="font-bold text-red-600">Gaprio</span>. This is
                currently a <span className="font-semibold">demo version</span>{" "}
                of our platform. AI-powered features are temporarily
                <span className="text-red-600 font-semibold">
                  {" "}
                  unavailable{" "}
                </span>{" "}
                due to limited server funding.
              </p>

              {/* CTA */}
              <div>
                <a
                  href="mailto:hanu_24a12res261@iitp.ac.in"
                  className="inline-block px-7 py-3 text-sm md:text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg transition-colors"
                >
                  📧 Contact Gaprio Support
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
