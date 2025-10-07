'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// --- SVG Icon Components ---
const ArrowRightIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const BotIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
);

// --- Custom Hook to load external scripts ---
const useExternalScript = (url, callback) => {
    useEffect(() => {
        if (!url) return;
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            if (callback) callback();
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [url, callback]);
};

// --- Animated Magnetic Button Component ---
const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

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
  );
};


// --- Main Hero Section Component ---
export default function Hero() {
  const heroRef = useRef(null);
  const [isGsapReady, setIsGsapReady] = useState(false);

  // Load GSAP and then set ready state
  useExternalScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
    setIsGsapReady(true);
  });

  const textGradient = `bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent`;

  // GSAP Animations
  useEffect(() => {
    if (!isGsapReady || !heroRef.current) return;
    const gsap = window.gsap;
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});

    tl.fromTo('.hero-element', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.5 }
    );
  }, [isGsapReady]);

  // Mouse move spotlight effect
  useEffect(() => {
    if (!heroRef.current) return;
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      heroRef.current.style.setProperty('--x', `${x}%`);
      heroRef.current.style.setProperty('--y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full bg-gray-900 text-white overflow-hidden flex items-center justify-center"
      style={{ '--x': '50%', '--y': '50%' }}
    >
      <div className="absolute inset-0 -z-10 grid-pattern"></div>
      <div 
        className="pointer-events-none absolute inset-0 -z-10 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at var(--x) var(--y), rgba(139, 92, 246, 0.15), transparent 35%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
            className="hero-element inline-flex items-center gap-2 border border-white/20 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
          >
            <BotIcon className="text-purple-400 w-5 h-5" />
            <span className="text-sm font-medium text-gray-300">
              Bridging the Human-AI Divide
            </span>
          </motion.div>
          
          <h1 className="hero-element text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-tight">
            AI-Powered <span className={`${textGradient} animate-gradient`}>WhatsApp for Professionals</span>
          </h1>

          <p className="hero-element text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Harnessing advanced AI to streamline communication, automate workflows, and empower professionals with smarter, faster, and more reliable conversations.
          </p>
          
          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton>
              <a href="#get-started" className="group relative flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/40">
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#learn-more" className="group relative flex items-center justify-center w-full sm:w-auto bg-transparent border-2 border-white/20 hover:bg-white/10 text-gray-300 font-medium py-3 px-8 rounded-full transition-colors duration-300">
                Learn More
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
       <style jsx>{`
            .grid-pattern {
                background-image:
                    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                background-size: 2rem 2rem;
            }
             .animate-gradient {
              background-size: 200% 200%;
              animation: gradientMove 5s ease infinite;
            }
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
        `}</style>
    </section>
  )
}
