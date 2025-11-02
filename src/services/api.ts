const API_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://bdc64ffa-35ab-48e4-a208-e7f93a6bc05a-00-1tji46rvmvft7.pike.replit.dev:3000/api';

const CURRENT_USER_ID = 1;

export const api = {
  async getUsers() {
    const response = await fetch(`${API_URL}/users?userId=${CURRENT_USER_ID}`);
    return response.json();
  },

  async getUserById(id: number) {
    const response = await fetch(`${API_URL}/users/${id}?userId=${CURRENT_USER_ID}`);
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

  async getPosts() {
    const response = await fetch(`${API_URL}/posts?userId=${CURRENT_USER_ID}`);
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

  async deletePost(postId: string) {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID }),
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

  async togglePostSave(postId: string) {
    const response = await fetch(`${API_URL}/posts/${postId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID }),
    });
    return response.json();
  },

  async getSavedPosts() {
    const response = await fetch(`${API_URL}/posts/saved?userId=${CURRENT_USER_ID}`);
    return response.json();
  },

  async getComments(postId: string) {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    return response.json();
  },

  async createComment(postId: string, text: string) {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, text }),
    });
    return response.json();
  },

  async deleteComment(commentId: number) {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID }),
    });
    return response.json();
  },

  async getStories() {
    const response = await fetch(`${API_URL}/stories`);
    return response.json();
  },

  async toggleUserFollow(userId: number) {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId: CURRENT_USER_ID }),
    });
    return response.json();
  },

  async getNotifications() {
    const response = await fetch(`${API_URL}/notifications?userId=${CURRENT_USER_ID}`);
    return response.json();
  },

  async markNotificationRead(notificationId: number) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID }),
    });
    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID }),
    });
    return response.json();
  },

  async getMessages(otherUserId: number) {
    const response = await fetch(`${API_URL}/messages?userId=${CURRENT_USER_ID}&otherUserId=${otherUserId}`);
    return response.json();
  },

  async sendMessage(receiverId: number, text: string, imageUrl?: string) {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: CURRENT_USER_ID, receiverId, text, imageUrl }),
    });
    return response.json();
  },
};
