'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiX, FiMail, FiCalendar, FiUser, FiEdit2, FiSave, FiCopy, FiCheck, FiKey, FiShield, FiGlobe } from 'react-icons/fi'
import { FaCrown, FaShieldAlt, FaRobot, FaUserCheck, FaUserClock } from 'react-icons/fa'
import { useTheme } from '@/context/ThemeContext'

export default function ProfileModal({ isOpen, onClose, user }) {
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [copiedField, setCopiedField] = useState(null)

  useEffect(() => {
    setEditedUser(user)
  }, [user])

  // Theme-based styles
  const getStyles = (theme) => ({
    // Backgrounds
    modalBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    backdrop: theme === 'dark' ? 'bg-black/60' : 'bg-black/40',
    cardBg: theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50',
    headerBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    
    // Borders
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    borderLight: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
    
    // Text colors
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    },
    
    // Buttons
    button: {
      close: theme === 'dark' 
        ? 'bg-black/40 hover:bg-black/60 text-white border-white/10 hover:border-white/20' 
        : 'bg-white/80 hover:bg-white text-gray-700 border-gray-300 hover:border-gray-400',
      edit: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
      cancel: theme === 'dark' 
        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
      save: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
      copy: theme === 'dark' 
        ? 'text-gray-400 hover:text-blue-400' 
        : 'text-gray-500 hover:text-blue-600'
    },
    
    // Status badges
    status: {
      verified: theme === 'dark' 
        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
        : 'bg-green-100 border-green-200 text-green-700',
      online: theme === 'dark' 
        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
        : 'bg-blue-100 border-blue-200 text-blue-700',
      admin: theme === 'dark' 
        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' 
        : 'bg-yellow-100 border-yellow-200 text-yellow-700',
      standard: theme === 'dark' 
        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
        : 'bg-blue-100 border-blue-200 text-blue-700'
    },
    
    // Input fields
    input: {
      background: theme === 'dark' ? 'bg-transparent' : 'bg-transparent',
      border: theme === 'dark' ? 'border-blue-500' : 'border-blue-400',
      text: theme === 'dark' ? 'text-white' : 'text-gray-900',
      placeholder: theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
    }
  })

  const STYLES = getStyles(theme)

  if (!isOpen || !user) return null

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRandomColor = (str) => {
    const colors = [
      'from-purple-600 to-blue-600',
      'from-blue-600 to-cyan-600',
      'from-green-600 to-emerald-600',
      'from-orange-600 to-red-600',
      'from-pink-600 to-rose-600',
    ]
    const index = str ? str.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSave = async () => {
    try {
      console.log('Saving user data:', editedUser)
      setIsEditing(false)
      // await API.put('/users/profile', editedUser)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusIcon = () => {
    return user.username === 'EklakAdmin' ? <FaCrown className="text-yellow-400" size={14} /> : <FaUserCheck className="text-blue-400" size={14} />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-lg transition-colors duration-300 ${STYLES.backdrop}`}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden max-h-[85vh] transition-colors duration-300 ${STYLES.modalBg} ${STYLES.border}`}
          >
            {/* Header */}
            <div className={`relative h-32 transition-colors duration-300 ${STYLES.headerBg}`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-16 h-16 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-2 right-2 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-3 right-3 z-10 p-2 rounded-lg transition-all duration-300 backdrop-blur-sm border ${STYLES.button.close}`}
              >
                <FiX size={16} />
              </button>

              {/* Profile Header Content */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-end gap-4">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRandomColor(user.name)} shadow-lg border border-white/20 flex items-center justify-center transition-transform duration-300 hover:scale-105`}>
                    <span className="text-xl font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="mb-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                          className={`font-bold bg-transparent border-b outline-none w-40 text-lg ${STYLES.input.text} ${STYLES.input.border} ${STYLES.input.placeholder}`}
                          placeholder="Your name"
                        />
                        <input
                          type="text"
                          value={editedUser.username}
                          onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                          className={`text-sm bg-transparent border-b outline-none w-32 ${STYLES.text.muted} ${STYLES.input.border} ${STYLES.input.placeholder}`}
                          placeholder="username"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className={`text-xl font-bold flex items-center gap-2 transition-colors duration-300 ${STYLES.text.primary}`}>
                          {user.name}
                          {getStatusIcon()}
                        </h1>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm border transition-colors duration-300 ${STYLES.cardBg} ${STYLES.borderLight}`}>
                            <FiUser size={12} className={STYLES.text.accent} />
                            <span className={STYLES.text.secondary}>@{user.username}</span>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm border transition-colors duration-300 ${STYLES.status.online}`}>
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium">Online</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-1">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedUser(user)
                        }}
                        className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-1 ${STYLES.button.cancel}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-1 ${STYLES.button.save}`}
                      >
                        <FiSave size={12} />
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-1 ${STYLES.button.edit}`}
                    >
                      <FiEdit2 size={12} />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
              <div className="space-y-4">
                {/* Basic Information Card */}
                <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${STYLES.cardBg} ${STYLES.border}`}>
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${STYLES.text.primary}`}>
                    <FiUser className={STYLES.text.accent} size={14} />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={`text-xs transition-colors duration-300 ${STYLES.text.muted}`}>User ID</label>
                      <div className={`text-sm font-mono px-2 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'} ${STYLES.text.primary}`}>
                        #{user.id}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={`text-xs transition-colors duration-300 ${STYLES.text.muted}`}>Member Since</label>
                      <div className={`text-sm px-2 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'} ${STYLES.text.primary}`}>
                        {formatJoinDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${STYLES.cardBg} ${STYLES.border}`}>
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${STYLES.text.primary}`}>
                    <FiMail className={STYLES.text.accent} size={14} />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'} ${STYLES.borderLight}`}>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs transition-colors duration-300 ${STYLES.text.muted}`}>Email Address</div>
                        <div className={`text-sm font-medium truncate transition-colors duration-300 ${STYLES.text.primary}`}>
                          {user.email}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(user.email, 'email')}
                        className={`p-2 transition-colors duration-200 ml-2 ${STYLES.button.copy}`}
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <FiCheck className="text-green-400" size={14} /> : <FiCopy size={14} />}
                      </button>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'} ${STYLES.borderLight}`}>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs transition-colors duration-300 ${STYLES.text.muted}`}>Username</div>
                        <div className={`text-sm font-medium transition-colors duration-300 ${STYLES.text.primary}`}>
                          @{user.username}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(user.username, 'username')}
                        className={`p-2 transition-colors duration-200 ml-2 ${STYLES.button.copy}`}
                        title="Copy username"
                      >
                        {copiedField === 'username' ? <FiCheck className="text-green-400" size={14} /> : <FiCopy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Status Card */}
                <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${STYLES.cardBg} ${STYLES.border}`}>
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${STYLES.text.primary}`}>
                    <FaShieldAlt className="text-green-400" size={14} />
                    Account Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border transition-colors duration-300 ${STYLES.status.verified}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                      <div className="text-xs mt-1 opacity-80">Email confirmed</div>
                    </div>
                    <div className={`p-3 rounded-lg border transition-colors duration-300 ${STYLES.status.online}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">Online</span>
                      </div>
                      <div className="text-xs mt-1 opacity-80">Active now</div>
                    </div>
                  </div>
                </div>

                {/* Account Type Card */}
                <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${STYLES.cardBg} ${STYLES.border}`}>
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${STYLES.text.primary}`}>
                    <FaCrown className="text-yellow-400" size={14} />
                    Account Type
                  </h3>
                  <div className={`text-center py-3 rounded-lg border transition-colors duration-300 ${
                    user.username === 'EklakAdmin' ? STYLES.status.admin : STYLES.status.standard
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      {user.username === 'EklakAdmin' ? <FaCrown size={16} /> : <FiUser size={16} />}
                      <span className="text-sm font-medium">
                        {user.username === 'EklakAdmin' ? 'Administrator' : 'Standard User'}
                      </span>
                    </div>
                    <div className="text-xs mt-1 opacity-80">
                      {user.username === 'EklakAdmin' ? 'Full system access' : 'Regular user privileges'}
                    </div>
                  </div>
                </div>

                {/* Security Card */}
                <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${STYLES.cardBg} ${STYLES.border}`}>
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${STYLES.text.primary}`}>
                    <FiShield className="text-purple-400" size={14} />
                    Security & Privacy
                  </h3>
                  <div className={`text-center py-2 px-3 rounded-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'} ${STYLES.borderLight}`}>
                    <p className={`text-xs transition-colors duration-300 ${STYLES.text.muted}`}>
                      <FiKey className="inline mr-1" size={10} />
                      Your password is securely encrypted and never stored in plain text
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}