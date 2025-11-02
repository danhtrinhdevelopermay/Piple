import { pgTable, serial, text, timestamp, integer, boolean, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  posts: integer('posts').default(0),
  followers: integer('followers').default(0),
  following: integer('following').default(0),
  likes: integer('likes').default(0),
  isFollowing: boolean('is_following').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  image: text('image').notNull(),
  caption: text('caption'),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  isLiked: boolean('is_liked').default(false),
  isSaved: boolean('is_saved').default(false),
  location: varchar('location', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stories = pgTable('stories', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  image: text('image').notNull(),
  isLive: boolean('is_live').default(false),
  isSeen: boolean('is_seen').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id),
  userId: integer('user_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const follows = pgTable('follows', {
  id: serial('id').primaryKey(),
  followerId: integer('follower_id').notNull().references(() => users.id),
  followingId: integer('following_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postLikes = pgTable('post_likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
