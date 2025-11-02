import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, usersData, storiesData] = await Promise.all([
        api.getPosts(user?.id),
        api.getUsers(user?.id),
        api.getStories(),
      ]);
      setPosts(postsData);
      setUsers(usersData);
      setStories(storiesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    if (!user) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
    
    try {
      const result = await api.togglePostLike(postId, user.id);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: result.isLiked, likes: result.likes }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
    }
  };

  const toggleSave = async (postId) => {
    if (!user) return;

    try {
      const result = await api.togglePostSave(postId, user.id);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isSaved: result.isSaved } : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  const toggleFollow = async (userId) => {
    if (!user) return;

    try {
      const result = await api.toggleUserFollow(userId, user.id);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, isFollowing: result.isFollowing } : u
        )
      );
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const addPost = async (newPostData) => {
    if (!user) return;
    
    try {
      const post = await api.createPost({
        userId: user.id,
        image: newPostData.image,
        caption: newPostData.caption,
        location: newPostData.location,
      });
      await loadData();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const value = {
    posts,
    users,
    stories,
    loading,
    toggleLike,
    toggleSave,
    toggleFollow,
    addPost,
    refreshData: loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
