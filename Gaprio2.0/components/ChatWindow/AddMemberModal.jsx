import { IoClose, IoSearch } from "react-icons/io5";
import { FaUserFriends, FaUserPlus } from "react-icons/fa";
import { STYLES } from "./styles";

export default function AddMemberModal({
  isOpen,
  searchQuery,
  searchUsers,
  isSearching,
  groupMembers,
  onClose,
  onSearchQueryChange,
  onSearchUsers,
  onAddMember,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className={`bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-700/50 backdrop-blur-xl`}
      >
        <div
          className={`p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Add Members</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-600/30 rounded-xl transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <IoSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400/70"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                onSearchQueryChange(e.target.value);
                onSearchUsers(e.target.value);
              }}
              className={`w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm`}
            />
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {isSearching ? (
              <div className={`text-center py-8 text-gray-500`}>
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Searching users...</p>
              </div>
            ) : searchUsers.length === 0 ? (
              <div className={`text-center py-8 text-gray-500`}>
                <FaUserFriends className="mx-auto text-3xl mb-2 opacity-50" />
                <p>No users found</p>
                <p className="text-sm">
                  Search for users to add to the group
                </p>
              </div>
            ) : (
              searchUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onAddMember(user)}
                  className={`flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-xl cursor-pointer transition-all duration-200 border-b border-gray-700/50 last:border-b-0 backdrop-blur-sm`}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-3 text-white text-sm font-semibold ring-1 ring-blue-500/30">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={`font-medium text-white`}>
                        {user.name}
                      </div>
                      <div className={`text-xs text-gray-400`}>
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  <FaUserPlus className="text-green-400" size={14} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}