import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, usersData] = await Promise.all([
        api.getPosts(),
        api.getUsers(),
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
    
    try {
      const result = await api.togglePostLike(postId, 1);
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
    try {
      const result = await api.togglePostSave(postId);
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
    try {
      const result = await api.toggleUserFollow(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isFollowing: result.isFollowing } : user
        )
      );
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const addPost = async (newPostData) => {
    try {
      const post = await api.createPost({
        userId: 1,
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
    loading,
    toggleLike,
    toggleSave,
    toggleFollow,
    addPost,
    refreshData: loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
