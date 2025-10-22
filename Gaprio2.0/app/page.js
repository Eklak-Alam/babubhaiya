'use client'
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/context/ThemeContext';

import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import MarketLandscape from "@/components/MarketLandscape";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import TeamLeadership from "@/components/TeamLeadership";
import USPsSection from "@/components/USPsSection";

// Register ScrollTrigger plugin only once
let pluginsRegistered = false;

export default function Home() {
  const mainRef = useRef(null);
  const { theme } = useTheme();

  // Theme-based styles
  const mainBackground = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const blob1Color = theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
  const blob2Color = theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
  const blob3Color = theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-300'
  const blobOpacity = theme === 'dark' ? 'opacity-70' : 'opacity-30'

  useGSAP(() => {
    // Register plugins only on client side
    if (!pluginsRegistered && typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, useGSAP);
      pluginsRegistered = true;
    }

    // Only run animations on client side
    if (typeof window === 'undefined') return;

    // Animate all direct children sections of the main element
    const sections = gsap.utils.toArray('section', mainRef.current);
    
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { autoAlpha: 0, y: 50 },  
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%', // Animate when 85% of the section is visible
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

  }, { scope: mainRef });

  return (
    <main ref={mainRef} className={`relative ${mainBackground} ${textColor} overflow-hidden`}>

      {/* Background blobs */}
      <div className={`absolute inset-0 -z-10 ${theme === 'dark' ? 'opacity-20' : 'opacity-15'}`}>
        <div className={`absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 ${blob1Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity} animate-blob`}></div>
        <div className={`absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 ${blob2Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity} animate-blob animation-delay-2000`}></div>
        <div className={`absolute bottom-0 left-1/2 w-56 h-56 sm:w-72 sm:h-72 ${blob3Color} rounded-full mix-blend-multiply filter blur-3xl ${blobOpacity} animate-blob animation-delay-4000`}></div>
      </div>

      
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <USPsSection />
      <MarketLandscape />
      <CompetitorAnalysis />
      <TeamLeadership />
      <ContactSection />
    </main>
  );
}