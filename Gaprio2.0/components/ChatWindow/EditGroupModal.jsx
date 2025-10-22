import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { useTheme } from '@/context/ThemeContext';

export default function EditGroupModal({
  isOpen,
  editForm,
  onClose,
  onEditFormChange,
  onSubmit,
}) {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95',
    modalBackground: theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95',
    modalBorder: theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50',
    headerBackground: theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    input: {
      background: theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/80',
      border: theme === 'dark' ? 'border-gray-600/50' : 'border-gray-300/50',
      focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
    },
    button: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border border-blue-500/30',
      secondary: theme === 'dark' ? 'text-gray-300 border-gray-600/50 hover:bg-gray-700/50' : 'text-gray-700 border-gray-300/50 hover:bg-gray-100/50',
    },
    success: {
      background: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/15',
      text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert("Group name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(e);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Overlay */}
      {showSuccess && (
        <div className={`absolute inset-0 ${themeStyles.success.background} backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl`}>
          <div className={`text-center ${themeStyles.success.text}`}>
            <div className={`w-16 h-16 ${
              theme === 'dark' ? 'bg-green-500' : 'bg-green-400'
            } rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ${
              theme === 'dark' ? 'ring-green-400/50' : 'ring-green-400/30'
            }`}>
              <FaCheck size={24} className="text-white" />
            </div>
            <p className="text-lg font-semibold">Group Updated!</p>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-green-100' : 'text-green-700'
            }`}>
              Changes saved successfully
            </p>
          </div>
        </div>
      )}

      <div className={`absolute inset-0 ${
        theme === 'dark' ? 'bg-black/70' : 'bg-black/50'
      } z-50 flex items-center justify-center p-4 animate-in fade-in duration-300`}>
        <div
          className={`${themeStyles.modalBackground} rounded-2xl shadow-2xl w-full max-w-md border ${themeStyles.modalBorder} backdrop-blur-xl relative overflow-hidden`}
        >
          <div
            className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-blue-500/20'
            } ${themeStyles.headerBackground} text-white`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit Group</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-1 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${themeStyles.text.secondary} mb-2`}
                >
                  Group Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    onEditFormChange({ ...editForm, name: e.target.value })
                  }
                  className={`w-full p-3 border ${themeStyles.input.border} rounded-xl ${themeStyles.input.focus} ${themeStyles.input.background} ${
                    themeStyles.text.primary
                  } placeholder-gray-400 backdrop-blur-sm disabled:opacity-50`}
                  placeholder="Enter group name"
                  required
                  disabled={isSubmitting}
                  maxLength={50}
                />
                <div className={`text-xs ${themeStyles.text.tertiary} mt-1 text-right`}>
                  {editForm.name.length}/50
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${themeStyles.text.secondary} mb-2`}
                >
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    onEditFormChange({ ...editForm, description: e.target.value })
                  }
                  rows="3"
                  className={`w-full p-3 border ${themeStyles.input.border} rounded-xl ${themeStyles.input.focus} ${themeStyles.input.background} ${
                    themeStyles.text.primary
                  } placeholder-gray-400 backdrop-blur-sm resize-none disabled:opacity-50`}
                  placeholder="Enter group description (optional)"
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <div className={`text-xs ${themeStyles.text.tertiary} mt-1 text-right`}>
                  {editForm.description?.length || 0}/200
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 ${themeStyles.button.secondary}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !editForm.name.trim()}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${themeStyles.button.primary}`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}