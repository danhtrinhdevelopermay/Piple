import React, { createContext, useState, useContext } from 'react';
import { posts as initialPosts, users as initialUsers } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState(initialUsers);

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleSave = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const toggleFollow = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const value = {
    posts,
    users,
    toggleLike,
    toggleSave,
    toggleFollow,
    addPost,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
