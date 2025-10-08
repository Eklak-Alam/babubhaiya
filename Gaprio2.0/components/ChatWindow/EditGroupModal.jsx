import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { STYLES } from "./styles";

export default function EditGroupModal({
  isOpen,
  editForm,
  onClose,
  onEditFormChange,
  onSubmit,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-green-400/50">
              <FaCheck size={24} />
            </div>
            <p className="text-lg font-semibold">Group Updated!</p>
            <p className="text-green-100 text-sm mt-1">Changes saved successfully</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div
          className={`bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 backdrop-blur-xl relative overflow-hidden`}
        >
          <div
            className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit Group</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-1 hover:bg-blue-600/30 rounded-xl transition-colors disabled:opacity-50"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-300 mb-2`}
                >
                  Group Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    onEditFormChange({ ...editForm, name: e.target.value })
                  }
                  className={`w-full p-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm disabled:opacity-50`}
                  placeholder="Enter group name"
                  required
                  disabled={isSubmitting}
                  maxLength={50}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {editForm.name.length}/50
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-300 mb-2`}
                >
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    onEditFormChange({ ...editForm, description: e.target.value })
                  }
                  rows="3"
                  className={`w-full p-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm resize-none disabled:opacity-50`}
                  placeholder="Enter group description (optional)"
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {editForm.description?.length || 0}/200
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !editForm.name.trim()}
                className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg backdrop-blur-sm border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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