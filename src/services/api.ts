const API_URL = 'https://744f5444-5a7b-47a9-b7fe-c665d2271d89-00-3m19tjbt1h5n5.sisko.replit.dev:3000/api';

export const api = {
  async getUsers(currentUserId?: number) {
    const url = currentUserId ? `${API_URL}/users?userId=${currentUserId}` : `${API_URL}/users`;
    const response = await fetch(url);
    return response.json();
  },

  async getUserById(id: number, currentUserId?: number) {
    const url = currentUserId 
      ? `${API_URL}/users/${id}?userId=${currentUserId}`
      : `${API_URL}/users/${id}`;
    const response = await fetch(url);
    return response.json();
  },

  async createUser(data: any) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getFollowers(userId: number) {
    const response = await fetch(`${API_URL}/users/${userId}/followers`);
    return response.json();
  },

  async getFollowing(userId: number) {
    const response = await fetch(`${API_URL}/users/${userId}/following`);
    return response.json();
  },

  async getPosts(currentUserId?: number) {
    const url = currentUserId ? `${API_URL}/posts?userId=${currentUserId}` : `${API_URL}/posts`;
    const response = await fetch(url);
    return response.json();
  },

  async createPost(data: any) {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deletePost(postId: string, userId: number) {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async togglePostLike(postId: string, userId: number) {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async togglePostSave(postId: string, userId: number) {
    const response = await fetch(`${API_URL}/posts/${postId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async getSavedPosts(userId: number) {
    const response = await fetch(`${API_URL}/posts/saved?userId=${userId}`);
    return response.json();
  },

  async getComments(postId: string) {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    return response.json();
  },

  async createComment(postId: string, userId: number, text: string) {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, text }),
    });
    return response.json();
  },

  async deleteComment(commentId: number, userId: number) {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async getStories(currentUserId?: number) {
    const url = currentUserId ? `${API_URL}/stories?userId=${currentUserId}` : `${API_URL}/stories`;
    const response = await fetch(url);
    return response.json();
  },

  async createStory(data: any) {
    const response = await fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async toggleUserFollow(userId: number, followerId: number) {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId }),
    });
    return response.json();
  },

  async getNotifications(userId: number) {
    const response = await fetch(`${API_URL}/notifications?userId=${userId}`);
    return response.json();
  },

  async markNotificationRead(notificationId: number, userId: number) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async markAllNotificationsRead(userId: number) {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async getMessages(userId: number, otherUserId: number) {
    const response = await fetch(`${API_URL}/messages?userId=${userId}&otherUserId=${otherUserId}`);
    return response.json();
  },

  async sendMessage(senderId: number, receiverId: number, text: string, imageUrl?: string) {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId, text, imageUrl }),
    });
    return response.json();
  },
};
