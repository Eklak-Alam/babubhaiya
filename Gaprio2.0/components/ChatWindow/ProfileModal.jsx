'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiX, FiMail, FiCalendar, FiUser, FiEdit2, FiSave, FiCopy, FiCheck, FiKey } from 'react-icons/fi'
import { FaCrown, FaShieldAlt } from 'react-icons/fa'

export default function ProfileModal({ isOpen, onClose, user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [copiedField, setCopiedField] = useState(null)

  useEffect(() => {
    setEditedUser(user)
  }, [user])

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
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden max-h-[70vh]"
          >
            {/* Header */}
            <div className="relative h-28 bg-gray-900">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-16 h-16 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-2 right-2 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <FiX size={16} />
              </button>

              {/* Profile Header Content */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="flex items-end gap-3">
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getRandomColor(user.name)} shadow-lg border border-white/20 flex items-center justify-center`}>
                    <span className="text-lg font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="mb-1">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                          className="font-bold bg-transparent text-white border-b border-blue-500 outline-none w-32 text-sm"
                          placeholder="Your name"
                        />
                        <input
                          type="text"
                          value={editedUser.username}
                          onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                          className="text-xs bg-transparent text-gray-300 border-b border-gray-600 outline-none w-24"
                          placeholder="username"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-lg font-bold text-white flex items-center gap-1">
                          {user.name}
                          {user.username === 'EklakAdmin' && (
                            <FaCrown className="text-yellow-400" size={12} />
                          )}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            <FiUser size={10} />
                            <span>@{user.username}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 mb-1">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedUser(user)
                        }}
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-300 font-medium text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-md transition-all duration-300 font-medium text-xs flex items-center gap-1"
                      >
                        <FiSave size={10} />
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md transition-all duration-300 font-medium text-xs flex items-center gap-1"
                    >
                      <FiEdit2 size={10} />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(70vh-7rem)]">
              {/* User Information */}
              <div className="space-y-3">
                {/* Basic Info */}
                <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                    <FiUser className="text-blue-400" size={12} />
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">User ID</span>
                      <span className="text-xs text-white font-mono bg-gray-700/50 px-1.5 py-0.5 rounded">
                        #{user.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Member Since</span>
                      <span className="text-xs text-white">{formatJoinDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                    <FiMail className="text-blue-400" size={12} />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                      <div>
                        <div className="text-xs text-gray-400">Email Address</div>
                        <div className="text-sm text-white font-medium truncate max-w-[180px]">{user.email}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(user.email, 'email')}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <FiCheck className="text-green-400" size={12} /> : <FiCopy size={12} />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                      <div>
                        <div className="text-xs text-gray-400">Username</div>
                        <div className="text-sm text-white font-medium">@{user.username}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(user.username, 'username')}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                        title="Copy username"
                      >
                        {copiedField === 'username' ? <FiCheck className="text-green-400" size={12} /> : <FiCopy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                    <FaShieldAlt className="text-green-400" size={12} />
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">Account Verified</span>
                      </div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-400 font-medium">Online Status</span>
                      </div>
                      <span className="text-xs text-blue-400">Online</span>
                    </div>
                  </div>
                </div>

                {/* Account Type */}
                <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                    <FaCrown className="text-yellow-400" size={12} />
                    Account Type
                  </h3>
                  <div className={`text-center py-2 rounded border ${
                    user.username === 'EklakAdmin' 
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' 
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    <span className="text-sm font-medium">
                      {user.username === 'EklakAdmin' ? 'Administrator' : 'Standard User'}
                    </span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                    <FiKey className="text-purple-400" size={12} />
                    Security
                  </h3>
                  <p className="text-xs text-gray-400 text-center">
                    Your password is securely encrypted and not visible
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}