'use client';

import { motion, useInView } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUsers, FiSearch, FiFileText, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { FaRobot, FaHandshake, FaRegLightbulb } from 'react-icons/fa';
import { RiShieldCheckLine, RiTranslate } from 'react-icons/ri';
import { BsHourglassSplit, BsFileEarmarkText } from 'react-icons/bs';
import { useRef } from 'react';
import ChatHero from '@/components/chat/ChatHero';
import ChatFeature from '@/components/chat/ChatFeature';
import ChatHowItWorks from '@/components/chat/ChatHowItWorks';
import ChatCTA from '@/components/chat/ChatCTA';
import { useTheme } from '@/context/ThemeContext';

export default function CenteredHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { theme } = useTheme();

  // Theme-based styles
  const containerBg = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const gradientBg = theme === 'dark' 
    ? 'from-purple-900/20 via-blue-900/20 to-gray-900' 
    : 'from-purple-50 via-blue-50 to-gray-50';

  // All content data with theme-aware colors
  const heroContent = {
    title: "Smarter Negotiations",
    subtitle: "Powered by AI Mediation",
    description: "Our platform transforms difficult negotiations into productive conversations with real-time AI mediation, smart compromise suggestions, and automated contract generation.",
    buttons: [
      { text: "Start Free Trial", icon: <FiMessageSquare /> },
      { text: "See All Features", icon: <FiUsers /> }
    ],
    theme: {
      containerBg,
      textColor,
      mutedTextColor,
      gradientBg
    }
  };

  const features = [
    {
      icon: <RiShieldCheckLine className="w-8 h-8" />,
      title: "End-to-End Encryption",
      description: "Military-grade security for all conversations",
      theme: {
        iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <FaRegLightbulb className="w-8 h-8" />,
      title: "Smart Compromises",
      description: "AI suggests fair middle-ground solutions",
      theme: {
        iconColor: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <BsHourglassSplit className="w-8 h-8" />,
      title: "Timeline Analysis",
      description: "Evaluates proposed deadlines for realism",
      theme: {
        iconColor: theme === 'dark' ? 'text-green-400' : 'text-green-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <RiTranslate className="w-8 h-8" />,
      title: "Multi-Language",
      description: "Real-time translation for global negotiations",
      theme: {
        iconColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <BsFileEarmarkText className="w-8 h-8" />,
      title: "Contract Drafting",
      description: "Automatically generates legal documents",
      theme: {
        iconColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: "Group Mediation",
      description: "Supports multi-party negotiations",
      theme: {
        iconColor: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    }
  ];

  const workflow = [
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: "Find Participants",
      description: "Search and connect with negotiation partners",
      theme: {
        iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: "AI Joins Session",
      description: "Neutral mediator activates automatically",
      theme: {
        iconColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Discuss terms with AI guidance",
      theme: {
        iconColor: theme === 'dark' ? 'text-green-400' : 'text-green-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Generate Agreement",
      description: "AI drafts contract from your discussion",
      theme: {
        iconColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Digital Signatures",
      description: "Secure confirmation from all parties",
      theme: {
        iconColor: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
        bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
        descriptionColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }
    }
  ];

  const ctaContent = {
    title: "Ready to Transform Your Negotiations?",
    description: "Join thousands of professionals who trust our AI mediation platform for fair, efficient, and secure negotiations.",
    buttons: [
      { 
        text: "Start Free Trial", 
        icon: <FiMessageSquare />,
        theme: {
          bgColor: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
          textColor: 'text-white'
        }
      },
      { 
        text: "Schedule Demo", 
        icon: <FiUsers />,
        theme: {
          bgColor: theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-100 border-gray-300',
          textColor: theme === 'dark' ? 'text-white' : 'text-gray-900'
        }
      }
    ],
    theme: {
      containerBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
      textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
      mutedTextColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      borderColor: theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
    }
  };

  return (
    <div className={`relative w-full h-full ${containerBg} ${textColor} overflow-x-hidden transition-colors duration-300`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} pointer-events-none`} />
      
      <ChatHero />

      <ChatFeature />

      <ChatHowItWorks />

      <ChatCTA />
    </div>
  );
}