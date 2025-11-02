const API_URL = 'https://0f8e534a-2504-4dbe-a7fb-9a8708dfd214-00-3axfv169hql92.sisko.replit.dev:3000/api';

const CURRENT_USER_ID = 1;

export const api = {
  async getUsers() {
    const response = await fetch(`${API_URL}/users?userId=${CURRENT_USER_ID}`);
    return response.json();
  },

  async getUserById(id: number) {
    const response = await fetch(`${API_URL}/users/${id}`);
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
};
