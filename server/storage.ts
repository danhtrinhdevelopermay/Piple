import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import { eq, desc, and } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function getUsers() {
  return await db.select().from(schema.users);
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

export async function getPosts() {
  const posts = await db.select({
    id: schema.posts.id,
    userId: schema.posts.userId,
    image: schema.posts.image,
    caption: schema.posts.caption,
    likes: schema.posts.likes,
    comments: schema.posts.comments,
    isLiked: schema.posts.isLiked,
    isSaved: schema.posts.isSaved,
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
  
  return posts.map(p => ({
    id: p.id.toString(),
    user: p.user,
    image: p.image,
    caption: p.caption,
    likes: p.likes || 0,
    comments: p.comments || 0,
    isLiked: p.isLiked || false,
    isSaved: p.isSaved || false,
    location: p.location || '',
    timeAgo: getTimeAgo(p.createdAt),
    likedBy: [],
  }));
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
  const post = await db.select().from(schema.posts).where(eq(schema.posts.id, postId));
  
  if (!post[0]) throw new Error('Post not found');
  
  const isLiked = !post[0].isLiked;
  const newLikes = isLiked ? (post[0].likes || 0) + 1 : (post[0].likes || 0) - 1;
  
  await db.update(schema.posts)
    .set({ isLiked, likes: newLikes })
    .where(eq(schema.posts.id, postId));
    
  return { isLiked, likes: newLikes };
}

export async function togglePostSave(postId: number) {
  const post = await db.select().from(schema.posts).where(eq(schema.posts.id, postId));
  
  if (!post[0]) throw new Error('Post not found');
  
  const isSaved = !post[0].isSaved;
  
  await db.update(schema.posts)
    .set({ isSaved })
    .where(eq(schema.posts.id, postId));
    
  return { isSaved };
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

export async function toggleUserFollow(userId: number) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
  
  if (!user) throw new Error('User not found');
  
  const isFollowing = !user.isFollowing;
  
  await db.update(schema.users)
    .set({ isFollowing })
    .where(eq(schema.users.id, userId));
    
  return { isFollowing };
}

function getTimeAgo(date: Date | null): string {
  if (!date) return 'Just now';
  
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
