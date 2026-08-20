import { apiRequest } from './apiClient';

export const messageService = {
  async getUsersByRole(role) {
    return apiRequest(`/messages/users/${role}`);
  },

  async getOrCreateConversation(targetUserId) {
    return apiRequest('/messages/conversation', {
      method: 'POST',
      body: JSON.stringify({ targetUserId })
    });
  },

  async getConversations() {
    return apiRequest('/messages');
  },

  async getConversationById(id) {
    return apiRequest(`/messages/${id}`);
  },

  async sendMessage(conversationId, text) {
    return apiRequest(`/messages/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  async sendMessageWithAttachment(conversationId, text, file) {
    const formData = new FormData();
    if (text) formData.append('text', text);
    if (file) formData.append('attachment', file);

    return apiRequest(`/messages/${conversationId}/messages/with-attachment`, {
      method: 'POST',
      body: formData
    });
  },

  async markAsRead(id) {
    return apiRequest(`/messages/${id}/read`, {
      method: 'PUT'
    });
  }
};
