'use client'
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import MarketLandscape from "@/components/MarketLandscape";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import TeamLeadership from "@/components/TeamLeadership";
import USPsSection from "@/components/USPsSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);

  useGSAP(() => {
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
    <main ref={mainRef} className="relative bg-gray-900 text-white overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
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