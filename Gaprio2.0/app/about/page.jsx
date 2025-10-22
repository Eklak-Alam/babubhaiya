"use client";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Users,
  DollarSign,
  Mic,
  ArrowRight,
  Brain,
  Handshake,
  GitMerge,
  Sparkles,
  Target,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Rocket,
  Heart,
  Globe,
  Code,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useTheme } from '@/context/ThemeContext';

export default function AboutPage() {
  const { theme } = useTheme();

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textMuted = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80'
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200/70'
  const cardHoverBorder = theme === 'dark' ? 'hover:border-indigo-500' : 'hover:border-indigo-400'
  const sectionBg = theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-white via-blue-50/30 to-white'
  const accentColor = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
  const gradientFrom = theme === 'dark' ? 'from-indigo-400' : 'from-indigo-600'
  const gradientTo = theme === 'dark' ? 'to-purple-500' : 'to-purple-600'

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${bgColor} ${textColor}`}>
      
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 opacity-20 ${
          theme === 'dark' 
            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
        } bg-[size:64px_64px]`} />
      </div>

      {/* Hero Section - Compact */}
      <section className={`relative py-16 md:py-20 overflow-hidden ${sectionBg}`}>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cardBg} backdrop-blur-sm border ${cardBorder} mb-6`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className={`text-sm font-medium ${accentColor}`}>Next-Gen AI Communication Platform</span>
            </motion.div>

            {/* Main Heading - Single Row */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight"
            >
              Intelligent{" "}
              <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent animate-gradient`}>
                Communication
              </span>{" "}
              Reimagined
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`text-lg md:text-xl lg:text-2xl ${textMuted} mb-6 max-w-4xl mx-auto`}
            >
              Transforming collaboration with <span className={`font-bold ${accentColor}`}>AI-powered clarity</span>
            </motion.p>

            {/* Stats - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto p-4"
            >
              {[
                { icon: Zap, value: "10x", label: "Faster" },
                { icon: Shield, value: "99.9%", label: "Accuracy" },
                { icon: Users, value: "24/7", label: "Available" },
                { icon: CheckCircle, value: "100+", label: "Features" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className={`w-6 h-6 ${accentColor} mx-auto mb-1`} />
                  <div className={`text-lg font-bold ${textColor}`}>{stat.value}</div>
                  <div className={`text-xs ${textMuted}`}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Link href="/get-started" passHref>
                <motion.div
                  className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free Trial
                    <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.div>
              </Link>
              
              <Link href="/demo" passHref>
                <motion.div
                  className={`group relative px-6 py-3 rounded-xl ${cardBg} backdrop-blur-sm border ${cardBorder} hover:border-indigo-400 font-medium shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <PlayIcon className="w-4 h-4" />
                    Watch Demo
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section - Compact */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Communication barriers cost{" "}
                <span className={`${accentColor}`}>millions</span>
              </motion.h3>
            </div>

            {/* Problem Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: DollarSign,
                  title: "Costly Negotiations",
                  desc: "Manual contract discussions waste time and resources",
                  stats: "$2.3M average loss",
                  color: "from-red-500 to-orange-500",
                },
                {
                  icon: MessageSquare,
                  title: "Team Misalignment",
                  desc: "Unclear communication leads to project delays",
                  stats: "47% productivity loss",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Users,
                  title: "Inefficient Collaboration",
                  desc: "Traditional tools fail complex group dynamics",
                  stats: "62% more meeting time",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative p-6 rounded-2xl ${cardBg} backdrop-blur-sm border ${cardBorder} ${cardHoverBorder} transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                  </div>
                  <p className={`${textMuted} mb-3`}>{item.desc}</p>
                  <div className={`text-sm font-semibold ${accentColor}`}>{item.stats}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section - Compact */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                AI-powered tools for{" "}
                <span className={`${accentColor}`}>smarter communication</span>
              </motion.h3>
            </div>

            {/* Solution Cards */}
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Mic,
                  title: "Clause",
                  subtitle: "Contract Harmony",
                  desc: "Intelligent contract negotiation with real-time legal insights",
                  features: ["Real-time Analysis", "Legal Compliance", "Smart Drafting"],
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: GitMerge,
                  title: "Accord",
                  subtitle: "Team Productivity",
                  desc: "Multi-user AI chatbot understanding complex group dynamics",
                  features: ["Group Intelligence", "Context Memory", "Project Sync"],
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Handshake,
                  title: "Harmony",
                  subtitle: "Conflict Mediation",
                  desc: "Evidence-based psychology to bridge perspectives",
                  features: ["Emotional Intelligence", "Bias Detection", "Win-Win"],
                  color: "from-purple-500 to-pink-500",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative p-6 rounded-2xl ${cardBg} backdrop-blur-sm border ${cardBorder} ${cardHoverBorder} transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <p className={`text-sm ${textMuted}`}>{item.subtitle}</p>
                    </div>
                  </div>

                  <p className={`${textMuted} mb-4`}>{item.desc}</p>

                  <div className="space-y-2">
                    {item.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${accentColor}`} />
                        <span className={`text-sm ${textMuted}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className={`relative rounded-2xl ${cardBg} backdrop-blur-sm border ${cardBorder} p-8`}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to transform{" "}
                <span className={`${accentColor}`}>communication</span>?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`text-lg ${textMuted} mb-6`}
              >
                Join teams experiencing AI-powered collaboration
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <Link href="/get-started" passHref>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300"
                  >
                    Start Free Trial
                    <Rocket className="w-4 h-4" />
                  </motion.div>
                </Link>
                
                <Link href="/demo" passHref>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 ${cardBg} border ${cardBorder} font-medium rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300`}
                  >
                    <PlayIcon className="w-4 h-4" />
                    Watch Demo
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gradient animation */}
      <style jsx>{`
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }
      `}</style>
    </div>
  );
}

// Play icon component
const PlayIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);