import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import { eq, desc, and } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function getUsers(currentUserId?: number) {
  const allUsers = await db.select().from(schema.users);
  
  if (!currentUserId) return allUsers;
  
  const result = await Promise.all(allUsers.map(async (user) => {
    const follow = await db.select()
      .from(schema.follows)
      .where(and(eq(schema.follows.followerId, currentUserId), eq(schema.follows.followingId, user.id)));
    
    const postsCount = await db.select().from(schema.posts).where(eq(schema.posts.userId, user.id));
    const followersCount = await db.select().from(schema.follows).where(eq(schema.follows.followingId, user.id));
    const followingCount = await db.select().from(schema.follows).where(eq(schema.follows.followerId, user.id));
    
    return {
      ...user,
      posts: postsCount.length,
      followers: followersCount.length,
      following: followingCount.length,
      isFollowing: follow.length > 0,
    };
  }));
  
  return result;
}

export async function getUserById(id: number, currentUserId?: number) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
  
  if (!user) return null;
  
  const postsCount = await db.select().from(schema.posts).where(eq(schema.posts.userId, user.id));
  const followersCount = await db.select().from(schema.follows).where(eq(schema.follows.followingId, user.id));
  const followingCount = await db.select().from(schema.follows).where(eq(schema.follows.followerId, user.id));
  
  let isFollowing = false;
  if (currentUserId) {
    const follow = await db.select()
      .from(schema.follows)
      .where(and(eq(schema.follows.followerId, currentUserId), eq(schema.follows.followingId, user.id)));
    isFollowing = follow.length > 0;
  }
  
  return {
    ...user,
    posts: postsCount.length,
    followers: followersCount.length,
    following: followingCount.length,
    isFollowing,
  };
}

export async function createUser(data: {
  username: string;
  name: string;
  email?: string;
  password?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}) {
  const [user] = await db.insert(schema.users).values(data).returning();
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
  return user;
}

export async function getPosts(currentUserId?: number) {
  const posts = await db.select({
    id: schema.posts.id,
    userId: schema.posts.userId,
    image: schema.posts.image,
    caption: schema.posts.caption,
    likes: schema.posts.likes,
    comments: schema.posts.comments,
    location: schema.posts.location,
    createdAt: schema.posts.createdAt,
    user: {
      id: schema.users.id,
      username: schema.users.username,
      name: schema.users.name,
      avatar: schema.users.avatar,
      isVerified: schema.users.isVerified,
    },
  })
  .from(schema.posts)
  .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id))
  .orderBy(desc(schema.posts.createdAt));
  
  const result = await Promise.all(posts.map(async (p) => {
    let isLiked = false;
    let isSaved = false;
    
    if (currentUserId) {
      const like = await db.select()
        .from(schema.postLikes)
        .where(and(eq(schema.postLikes.postId, p.id), eq(schema.postLikes.userId, currentUserId)));
      isLiked = like.length > 0;
      
      const saved = await db.select()
        .from(schema.savedPosts)
        .where(and(eq(schema.savedPosts.postId, p.id), eq(schema.savedPosts.userId, currentUserId)));
      isSaved = saved.length > 0;
    }
    
    return {
      id: p.id.toString(),
      user: p.user,
      image: p.image,
      caption: p.caption,
      likes: p.likes || 0,
      comments: p.comments || 0,
      isLiked,
      isSaved,
      location: p.location || '',
      timeAgo: getTimeAgo(p.createdAt),
      likedBy: [],
    };
  }));
  
  return result;
}

export async function getPostById(id: number) {
  const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
  return post || null;
}

export async function createPost(data: {
  userId: number;
  image: string;
  caption?: string;
  location?: string;
}) {
  const [post] = await db.insert(schema.posts).values(data).returning();
  
  await createNotification({
    userId: data.userId,
    type: 'new_post',
    postId: post.id,
  });
  
  return post;
}

export async function deletePost(postId: number, userId: number) {
  const post = await getPostById(postId);
  
  if (!post || post.userId !== userId) {
    throw new Error('Unauthorized');
  }
  
  await db.delete(schema.posts).where(eq(schema.posts.id, postId));
  return { success: true };
}

export async function togglePostLike(postId: number, userId: number) {
  const existingLike = await db.select()
    .from(schema.postLikes)
    .where(and(eq(schema.postLikes.postId, postId), eq(schema.postLikes.userId, userId)));
  
  if (existingLike.length > 0) {
    await db.delete(schema.postLikes)
      .where(and(eq(schema.postLikes.postId, postId), eq(schema.postLikes.userId, userId)));
    
    const post = await getPostById(postId);
    const newLikes = Math.max(0, (post?.likes || 0) - 1);
    
    await db.update(schema.posts)
      .set({ likes: newLikes })
      .where(eq(schema.posts.id, postId));
    
    return { isLiked: false, likes: newLikes };
  } else {
    await db.insert(schema.postLikes).values({ postId, userId });
    
    const post = await getPostById(postId);
    const newLikes = (post?.likes || 0) + 1;
    
    await db.update(schema.posts)
      .set({ likes: newLikes })
      .where(eq(schema.posts.id, postId));
    
    if (post && post.userId !== userId) {
      await createNotification({
        userId: post.userId,
        actorId: userId,
        type: 'like',
        postId,
      });
    }
    
    return { isLiked: true, likes: newLikes };
  }
}

export async function togglePostSave(postId: number, userId: number) {
  const existingSave = await db.select()
    .from(schema.savedPosts)
    .where(and(eq(schema.savedPosts.postId, postId), eq(schema.savedPosts.userId, userId)));
  
  if (existingSave.length > 0) {
    await db.delete(schema.savedPosts)
      .where(and(eq(schema.savedPosts.postId, postId), eq(schema.savedPosts.userId, userId)));
    
    return { isSaved: false };
  } else {
    await db.insert(schema.savedPosts).values({ postId, userId });
    
    return { isSaved: true };
  }
}

export async function getSavedPosts(userId: number) {
  const savedPosts = await db.select({
    id: schema.posts.id,
    userId: schema.posts.userId,
    image: schema.posts.image,
    caption: schema.posts.caption,
    likes: schema.posts.likes,
    comments: schema.posts.comments,
    location: schema.posts.location,
    createdAt: schema.posts.createdAt,
    user: {
      id: schema.users.id,
      username: schema.users.username,
      name: schema.users.name,
      avatar: schema.users.avatar,
      isVerified: schema.users.isVerified,
    },
  })
  .from(schema.savedPosts)
  .leftJoin(schema.posts, eq(schema.savedPosts.postId, schema.posts.id))
  .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id))
  .where(eq(schema.savedPosts.userId, userId))
  .orderBy(desc(schema.savedPosts.createdAt));
  
  return savedPosts.map(p => ({
    id: p.id?.toString() || '',
    user: p.user,
    image: p.image || '',
    caption: p.caption,
    likes: p.likes || 0,
    comments: p.comments || 0,
    isLiked: false,
    isSaved: true,
    location: p.location || '',
    timeAgo: getTimeAgo(p.createdAt),
    likedBy: [],
  }));
}

export async function getStories(currentUserId?: number) {
  const stories = await db.select({
    id: schema.stories.id,
    userId: schema.stories.userId,
    image: schema.stories.image,
    isLive: schema.stories.isLive,
    isSeen: schema.stories.isSeen,
    createdAt: schema.stories.createdAt,
    user: {
      id: schema.users.id,
      username: schema.users.username,
      name: schema.users.name,
      avatar: schema.users.avatar,
      isVerified: schema.users.isVerified,
    },
  })
  .from(schema.stories)
  .leftJoin(schema.users, eq(schema.stories.userId, schema.users.id))
  .orderBy(desc(schema.stories.createdAt));
  
  return stories.map(s => ({
    id: s.id.toString(),
    user: s.user,
    image: s.image,
    isLive: s.isLive || false,
    isSeen: s.isSeen || false,
    isYourStory: currentUserId ? s.userId === currentUserId : false,
    timeAgo: getTimeAgo(s.createdAt),
  }));
}

export async function createStory(data: {
  userId: number;
  image: string;
  isLive?: boolean;
}) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const [story] = await db.insert(schema.stories).values({
    userId: data.userId,
    image: data.image,
    isLive: data.isLive || false,
    isSeen: false,
    expiresAt,
  }).returning();
  
  return story;
}

export async function getComments(postId: number) {
  const comments = await db.select({
    id: schema.comments.id,
    postId: schema.comments.postId,
    userId: schema.comments.userId,
    text: schema.comments.text,
    createdAt: schema.comments.createdAt,
    user: {
      id: schema.users.id,
      username: schema.users.username,
      name: schema.users.name,
      avatar: schema.users.avatar,
      isVerified: schema.users.isVerified,
    },
  })
  .from(schema.comments)
  .leftJoin(schema.users, eq(schema.comments.userId, schema.users.id))
  .where(eq(schema.comments.postId, postId))
  .orderBy(desc(schema.comments.createdAt));
  
  return comments.map(c => ({
    id: c.id.toString(),
    user: c.user,
    text: c.text,
    timeAgo: getTimeAgo(c.createdAt),
  }));
}

export async function createComment(data: {
  postId: number;
  userId: number;
  text: string;
}) {
  const [comment] = await db.insert(schema.comments).values(data).returning();
  
  const post = await getPostById(data.postId);
  const newComments = (post?.comments || 0) + 1;
  
  await db.update(schema.posts)
    .set({ comments: newComments })
    .where(eq(schema.posts.id, data.postId));
  
  if (post && post.userId !== data.userId) {
    await createNotification({
      userId: post.userId,
      actorId: data.userId,
      type: 'comment',
      postId: data.postId,
      commentId: comment.id,
      text: data.text,
    });
  }
  
  return comment;
}

export async function deleteComment(commentId: number, userId: number) {
  const [comment] = await db.select().from(schema.comments).where(eq(schema.comments.id, commentId));
  
  if (!comment || comment.userId !== userId) {
    throw new Error('Unauthorized');
  }
  
  await db.delete(schema.comments).where(eq(schema.comments.id, commentId));
  
  const post = await getPostById(comment.postId);
  const newComments = Math.max(0, (post?.comments || 0) - 1);
  
  await db.update(schema.posts)
    .set({ comments: newComments })
    .where(eq(schema.posts.id, comment.postId));
  
  return { success: true };
}

export async function toggleUserFollow(followerId: number, followingId: number) {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }
  
  const existingFollow = await db.select()
    .from(schema.follows)
    .where(and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)));
  
  if (existingFollow.length > 0) {
    await db.delete(schema.follows)
      .where(and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)));
    
    return { isFollowing: false };
  } else {
    await db.insert(schema.follows).values({ followerId, followingId });
    
    await createNotification({
      userId: followingId,
      actorId: followerId,
      type: 'follow',
    });
    
    return { isFollowing: true };
  }
}

export async function getFollowers(userId: number) {
  const followers = await db.select({
    id: schema.users.id,
    username: schema.users.username,
    name: schema.users.name,
    avatar: schema.users.avatar,
    bio: schema.users.bio,
    isVerified: schema.users.isVerified,
  })
  .from(schema.follows)
  .leftJoin(schema.users, eq(schema.follows.followerId, schema.users.id))
  .where(eq(schema.follows.followingId, userId));
  
  return followers.map(f => f);
}

export async function getFollowing(userId: number) {
  const following = await db.select({
    id: schema.users.id,
    username: schema.users.username,
    name: schema.users.name,
    avatar: schema.users.avatar,
    bio: schema.users.bio,
    isVerified: schema.users.isVerified,
  })
  .from(schema.follows)
  .leftJoin(schema.users, eq(schema.follows.followingId, schema.users.id))
  .where(eq(schema.follows.followerId, userId));
  
  return following.map(f => f);
}

export async function getNotifications(userId: number) {
  const notifications = await db.select({
    id: schema.notifications.id,
    type: schema.notifications.type,
    text: schema.notifications.text,
    isRead: schema.notifications.isRead,
    createdAt: schema.notifications.createdAt,
    postId: schema.notifications.postId,
    actor: {
      id: schema.users.id,
      username: schema.users.username,
      name: schema.users.name,
      avatar: schema.users.avatar,
      isVerified: schema.users.isVerified,
    },
  })
  .from(schema.notifications)
  .leftJoin(schema.users, eq(schema.notifications.actorId, schema.users.id))
  .where(eq(schema.notifications.userId, userId))
  .orderBy(desc(schema.notifications.createdAt));
  
  return notifications.map(n => ({
    id: n.id.toString(),
    type: n.type,
    text: n.text,
    isRead: n.isRead || false,
    timeAgo: getTimeAgo(n.createdAt),
    postId: n.postId?.toString(),
    actor: n.actor,
  }));
}

export async function createNotification(data: {
  userId: number;
  actorId?: number;
  type: string;
  postId?: number;
  commentId?: number;
  text?: string;
}) {
  const [notification] = await db.insert(schema.notifications).values(data).returning();
  return notification;
}

export async function markNotificationRead(notificationId: number, userId: number) {
  await db.update(schema.notifications)
    .set({ isRead: true })
    .where(and(eq(schema.notifications.id, notificationId), eq(schema.notifications.userId, userId)));
  
  return { success: true };
}

export async function markAllNotificationsRead(userId: number) {
  await db.update(schema.notifications)
    .set({ isRead: true })
    .where(eq(schema.notifications.userId, userId));
  
  return { success: true };
}

export async function getMessages(userId: number, otherUserId: number) {
  const messages = await db.select({
    id: schema.messages.id,
    senderId: schema.messages.senderId,
    receiverId: schema.messages.receiverId,
    text: schema.messages.text,
    imageUrl: schema.messages.imageUrl,
    isRead: schema.messages.isRead,
    createdAt: schema.messages.createdAt,
  })
  .from(schema.messages)
  .where(
    and(
      eq(schema.messages.senderId, userId),
      eq(schema.messages.receiverId, otherUserId)
    )
  )
  .orderBy(desc(schema.messages.createdAt));
  
  const messages2 = await db.select({
    id: schema.messages.id,
    senderId: schema.messages.senderId,
    receiverId: schema.messages.receiverId,
    text: schema.messages.text,
    imageUrl: schema.messages.imageUrl,
    isRead: schema.messages.isRead,
    createdAt: schema.messages.createdAt,
  })
  .from(schema.messages)
  .where(
    and(
      eq(schema.messages.senderId, otherUserId),
      eq(schema.messages.receiverId, userId)
    )
  )
  .orderBy(desc(schema.messages.createdAt));
  
  return [...messages, ...messages2].sort((a, b) => 
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );
}

export async function sendMessage(data: {
  senderId: number;
  receiverId: number;
  text: string;
  imageUrl?: string;
}) {
  const [message] = await db.insert(schema.messages).values(data).returning();
  
  await createNotification({
    userId: data.receiverId,
    actorId: data.senderId,
    type: 'message',
    text: data.text,
  });
  
  return message;
}

function getTimeAgo(date: Date | null): string {
  if (!date) return 'Just now';
  
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
