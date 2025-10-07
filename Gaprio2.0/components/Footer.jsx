'use client'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail, FiPhone } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Case Studies", href: "#cases" },
        { name: "Updates", href: "#updates" }
      ]
    },
    {
      title: "Company",
      items: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
        { name: "Blog", href: "#blog" }
      ]
    },
    {
      title: "Support",
      items: [
        { name: "Documentation", href: "#docs" },
        { name: "Community", href: "#community" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Help Center", href: "#help" }
      ]
    }
  ]

  const socialLinks = [
    { icon: <FiGithub />, url: "#", name: "GitHub", color: "hover:bg-gray-700" },
    { icon: <FiLinkedin />, url: "#", name: "LinkedIn", color: "hover:bg-blue-700" },
    { icon: <FiTwitter />, url: "#", name: "Twitter", color: "hover:bg-blue-500" },
    { icon: <FiInstagram />, url: "#", name: "Instagram", color: "hover:bg-pink-600" },
    { icon: <FiMail />, url: "mailto:hanushashwat733@gmail.com", name: "Email", color: "hover:bg-amber-600" }
  ]

  return (
    <footer className="relative bg-gray-900 border-t border-gray-800/50 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Logo and company info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="relative w-10 h-10 rounded-lg overflow-hidden"
              >
                <Image 
                  src="/logo.png" // Replace with your logo path
                  alt="Gaprio Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Gaprio
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered mediator bridging human communication gaps with cutting-edge technology.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <FiPhone className="w-4 h-4" />
                <a href="tel:+916201668873" className="hover:text-white transition-colors">+91 62016 68873</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMail className="w-4 h-4" />
                <a href="mailto:hanushashwat733@gmail.com" className="hover:text-white transition-colors">hanushashwat733@gmail.com</a>
              </div>
            </div>
          </motion.div>

          {/* Footer links */}
          {links.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link 
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Connect
            </h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all`}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Gaprio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}