// components/ConfirmationModal.js

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "OK",
  cancelText,
  confirmClass = "bg-blue-500 hover:bg-blue-600",
  icon: IconComponent,
}) {
  const { theme } = useTheme();
  const [animateIn, setAnimateIn] = useState(false);

  // Theme-based styles
  const modalBg = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-white to-gray-50';
  
  const borderColor = theme === 'dark' 
    ? 'border-gray-700/50' 
    : 'border-gray-300';
  
  const textColor = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-900';
  
  const secondaryText = theme === 'dark' 
    ? 'text-gray-300' 
    : 'text-gray-600';
  
  const iconBg = theme === 'dark' 
    ? 'bg-gray-800/50 ring-gray-700' 
    : 'bg-gray-100 ring-gray-300';
  
  const iconColor = theme === 'dark' 
    ? 'text-blue-400' 
    : 'text-blue-500';
  
  const closeButton = theme === 'dark'
    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200';
  
  const cancelButton = theme === 'dark'
    ? 'bg-gray-700 hover:bg-gray-600 text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-900';
  
  const footerBg = theme === 'dark'
    ? 'bg-gray-900/50'
    : 'bg-gray-50';

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative ${modalBg} border ${borderColor} rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ${
          animateIn
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center ring-1 transition-colors duration-200`}>
                <IconComponent className={`text-lg transition-colors duration-200 ${iconColor}`} />
              </div>
            )}
            <h2 className={`text-xl font-bold transition-colors duration-200 ${textColor}`}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 ${closeButton}`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`leading-relaxed transition-colors duration-200 ${secondaryText}`}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-6 ${footerBg} rounded-b-2xl border-t ${borderColor} transition-colors duration-200`}>
          {cancelText && (
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium ${cancelButton}`}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 text-white rounded-lg transition-all duration-200 font-medium ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}