import { apiRequest, setAuthToken, getAuthToken, API_BASE_URL } from './apiClient';

/**
 * Authentication Service for DevCraft Platform
 * Ready to integrate with Node.js + Express backend (POST /api/auth/login, etc.)
 */
export const authService = {
  /**
   * Log in user via email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{ user: any, token: string }>}
   */
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Register a new client company account
   * @param {object} clientData 
   */
  async register(clientData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Log out current user & clear stored tokens
   */
  logout() {
    setAuthToken(null);
    try {
      localStorage.removeItem('devcraft_current_user');
    } catch (e) {
      console.error(e);
    }
  },

  async getCurrentUser() {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  /**
   * Update the current user's profile
   * @param {object} profileData
   */
  async updateProfile(profileData) {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Upload user avatar
   * @param {File} file
   */
  async uploadAvatar(file) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  /**
   * Get all registered users from backend API
   */
  async getUsers() {
    return apiRequest('/auth/users', {
      method: 'GET'
    });
  },

  /**
   * Update user role by Admin
   * @param {string} userId 
   * @param {string} role 
   */
  async updateUserRole(userId, role) {
    return apiRequest(`/auth/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },


  /**
   * Send password recovery link
   * @param {string} email 
   */
  async forgotPassword(email) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Reset password with recovery token
   * @param {string} token 
   * @param {string} newPassword 
   */
  async resetPassword(token, newPassword) {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  }
};
