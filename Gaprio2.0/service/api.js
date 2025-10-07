/* File: client/src/services/api.js
   Purpose: Add a new function for leaving a chat.
*/
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const API_URL = "http://localhost:5001/api";

// --- Register User ---
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// --- Login User ---
export const loginUser = async (credentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    const idToken = await userCredential.user.getIdToken();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Authentication failed on server");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// --- Get All Users ---
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// --- Search User ---
export const searchUser = async (username) => {
  try {
    const response = await fetch(`${API_URL}/users/search?username=${username}`);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error("Failed to search for user");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// --- Create Chat ---
export const createChat = async (chatData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to create a chat.");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/chats/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(chatData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to create chat");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// --- Delete Message For Everyone ---
export const deleteMessageForEveryone = async (chatId, messageId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in.");
    const token = await user.getIdToken();

    const response = await fetch(
      `${API_URL}/chats/${chatId}/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete message");
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};

// --- Add Member To Group ---
export const addMemberToGroup = async (chatId, newMember) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in.");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/chats/${chatId}/members/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newMember }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to add member");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// --- Remove Member From Group ---
export const removeMemberFromGroup = async (chatId, memberIdToRemove) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in.");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/chats/${chatId}/members/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ memberIdToRemove }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to remove member");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// --- NEW LEAVE CHAT FUNCTION ---
export const leaveChat = async (chatId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in.");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/chats/${chatId}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to leave chat");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// --- Import Messages ---
export const importMessages = async (chatId, messages) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to import messages.");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/chats/${chatId}/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to import messages");
    }
    return data;
  } catch (error) {
    throw error;
  } 
};
