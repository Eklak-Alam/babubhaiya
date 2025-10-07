'use client'
import { motion } from 'framer-motion'
import { 
  FileText, MessageSquare, Users, 
  DollarSign, Mic, ArrowRight,
  Brain, Handshake, GitMerge 
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Gradient Background Blur */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
            <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
            >
            {/* Animated Gradient Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                AI-Powered Mediator
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Bridging human communication gaps with <span className="text-indigo-400 font-medium">intelligent AI</span> solutions
            </p>

            {/* Call to Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition duration-300"
            >
                Get Started
            </motion.button>
            </motion.div>
        </div>

        {/* Gradient animation keyframes */}
        <style jsx>{`
            @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
            }
            .animate-gradient {
            background-size: 200% 200%;
            animation: gradientMove 5s ease infinite;
            }
        `}</style>
        </section>


      {/* Problem Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-500" />
              <h2 className="text-xl text-indigo-400">The Problem</h2>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-8">
              Communication barriers cost businesses <span className="text-indigo-400">time</span>, money, and relationships
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: DollarSign, title: "Costly Negotiations", desc: "Manual contract discussions waste time and resources" },
                { icon: MessageSquare, title: "Miscommunication", desc: "Teams lose productivity due to unclear discussions" },
                { icon: Users, title: "No Multi-User AI", desc: "Existing tools don't handle group dynamics well" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-800/60 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <item.icon className="w-6 h-6 text-indigo-400" />
                    <h4 className="text-xl font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-500" />
              <h2 className="text-xl text-indigo-400">Our Solution</h2>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-8">
              AI-powered tools for smarter communication
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Mic, title: "Clause", subtitle: "Contract Harmony", desc: "Listens to negotiations and drafts legally sound contracts", principle: "Clarity > Complexity" },
                { icon: GitMerge, title: "Accord", subtitle: "Team Productivity", desc: "Multi-user AI chatbot for complex group projects", principle: "Directness > Diplomacy" },
                { icon: Handshake, title: "Harmony", subtitle: "Conflict Mediation", desc: "Bridges perspectives using evidence-based psychology", principle: "Understanding > Arguing" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <item.icon className="w-6 h-6 text-indigo-400" />
                    <div>
                      <h4 className="text-xl font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{item.desc}</p>
                  <p className="text-sm font-medium text-indigo-400">{item.principle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your communication?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the future of AI-mediated discussions
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-lg flex items-center gap-2 mx-auto"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
