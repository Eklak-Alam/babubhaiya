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

export default function CenteredHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // All content data
  const heroContent = {
    title: "Smarter Negotiations",
    subtitle: "Powered by AI Mediation",
    description: "Our platform transforms difficult negotiations into productive conversations with real-time AI mediation, smart compromise suggestions, and automated contract generation.",
    buttons: [
      { text: "Start Free Trial", icon: <FiMessageSquare /> },
      { text: "See All Features", icon: <FiUsers /> }
    ]
  };

  const features = [
    {
      icon: <RiShieldCheckLine className="w-8 h-8" />,
      title: "End-to-End Encryption",
      description: "Military-grade security for all conversations"
    },
    {
      icon: <FaRegLightbulb className="w-8 h-8" />,
      title: "Smart Compromises",
      description: "AI suggests fair middle-ground solutions"
    },
    {
      icon: <BsHourglassSplit className="w-8 h-8" />,
      title: "Timeline Analysis",
      description: "Evaluates proposed deadlines for realism"
    },
    {
      icon: <RiTranslate className="w-8 h-8" />,
      title: "Multi-Language",
      description: "Real-time translation for global negotiations"
    },
    {
      icon: <BsFileEarmarkText className="w-8 h-8" />,
      title: "Contract Drafting",
      description: "Automatically generates legal documents"
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: "Group Mediation",
      description: "Supports multi-party negotiations"
    }
  ];

  const workflow = [
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: "Find Participants",
      description: "Search and connect with negotiation partners"
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: "AI Joins Session",
      description: "Neutral mediator activates automatically"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Discuss terms with AI guidance"
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Generate Agreement",
      description: "AI drafts contract from your discussion"
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Digital Signatures",
      description: "Secure confirmation from all parties"
    }
  ];

  return (
    <div className="relative w-full h-full bg-gray-950 text-white overflow-x-hidden">
      <ChatHero />

      <ChatFeature />

      <ChatHowItWorks />

      <ChatCTA />

    </div>
  );
}