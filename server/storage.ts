import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import { eq, desc, and } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function getUsers(currentUserId?: number) {
  const users = await db.select().from(schema.users);
  
  if (!currentUserId) return users;
  
  const result = await Promise.all(users.map(async (user) => {
    const follow = await db.select()
      .from(schema.follows)
      .where(and(eq(schema.follows.followerId, currentUserId), eq(schema.follows.followingId, user.id)));
    
    return {
      ...user,
      isFollowing: follow.length > 0,
    };
  }));
  
  return result;
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
  return user;
}

export async function createUser(data: {
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
}) {
  const [user] = await db.insert(schema.users).values(data).returning();
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

export async function createPost(data: {
  userId: number;
  image: string;
  caption?: string;
  location?: string;
}) {
  const [post] = await db.insert(schema.posts).values(data).returning();
  return post;
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
    
    return { isLiked: true, likes: newLikes };
  }
}

async function getPostById(id: number) {
  const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
  return post || null;
}

export async function togglePostSave(postId: number, userId: number) {
  return { isSaved: false };
}

export async function getStories() {
  const stories = await db.select({
    id: schema.stories.id,
    userId: schema.stories.userId,
    image: schema.stories.image,
    isLive: schema.stories.isLive,
    isSeen: schema.stories.isSeen,
    user: {
      id: schema.users.id,
      username: schema.users.username,
      avatar: schema.users.avatar,
    },
  })
  .from(schema.stories)
  .leftJoin(schema.users, eq(schema.stories.userId, schema.users.id))
  .orderBy(desc(schema.stories.createdAt));
  
  return stories.map(s => ({
    id: s.id.toString(),
    user: s.user,
    isLive: s.isLive || false,
    isSeen: s.isSeen || false,
    isYourStory: false,
  }));
}

export async function toggleUserFollow(followerId: number, followingId: number) {
  const existingFollow = await db.select()
    .from(schema.follows)
    .where(and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)));
  
  if (existingFollow.length > 0) {
    await db.delete(schema.follows)
      .where(and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)));
    
    return { isFollowing: false };
  } else {
    await db.insert(schema.follows).values({ followerId, followingId });
    
    return { isFollowing: true };
  }
}

function getTimeAgo(date: Date | null): string {
  if (!date) return 'Just now';
  
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
