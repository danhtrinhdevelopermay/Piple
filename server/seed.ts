import { db } from './storage';
import * as schema from '../shared/schema';

async function seed() {
  console.log('Seeding database...');

  const users = await db.insert(schema.users).values([
    {
      username: 'your_username',
      name: 'Your Name',
      email: 'user1@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Content creator & Filmmaker',
      location: 'New York, USA',
      isVerified: true,
    },
    {
      username: 'akmalnslih',
      name: 'Akmal Nslih',
      email: 'akmal@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'Photographer & Visual Artist',
      location: 'Bekasi, Indonesia',
    },
    {
      username: 'calire.gd',
      name: 'Claire Gordon',
      email: 'claire@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Fashion & Lifestyle',
      location: 'Los Angeles, USA',
      isVerified: true,
    },
    {
      username: 'calista33',
      name: 'Calista Miller',
      email: 'calista@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Travel Blogger',
      location: 'Barcelona, Spain',
    },
    {
      username: 'azizahm',
      name: 'Azizah M',
      email: 'azizah@example.com',
      avatar: 'https://i.pravatar.cc/150?img=10',
      bio: 'Food & Recipe Creator',
      location: 'Jakarta, Indonesia',
      isVerified: true,
    },
    {
      username: 'adamuseno',
      name: 'Adam Useno',
      email: 'adam@example.com',
      avatar: 'https://i.pravatar.cc/150?img=13',
      bio: 'Tech Enthusiast',
      location: 'Singapore',
    },
    {
      username: 'aditya_prasodjo',
      name: 'Aditya Prasodjo',
      email: 'aditya@example.com',
      avatar: 'https://i.pravatar.cc/150?img=14',
      bio: 'Content creator & Filmmaker',
      location: 'Surabaya, Indonesia',
    },
  ]).returning();

  console.log(`Created ${users.length} users`);

  const posts = await db.insert(schema.posts).values([
    {
      userId: users[1].id,
      image: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=800',
      caption: 'When life gives you limes, arrange them in a zesty flatlay and create a lime-light masterpiece! ...more',
      likes: 349,
      comments: 12,
      location: 'Bekasi',
    },
    {
      userId: users[2].id,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      caption: 'Sneaker game strong 💪 New kicks, who dis?',
      likes: 892,
      comments: 234,
      location: 'Los Angeles',
    },
    {
      userId: users[6].id,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      caption: 'Golden hour perfection 🌅',
      likes: 1245,
      comments: 456,
      location: 'Surabaya',
    },
    {
      userId: users[3].id,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      caption: 'Coffee and contemplation ☕',
      likes: 567,
      comments: 123,
      location: 'Barcelona',
    },
    {
      userId: users[4].id,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      caption: 'Food is my love language 🍝',
      likes: 1890,
      comments: 342,
      location: 'Jakarta',
    },
    {
      userId: users[0].id,
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      caption: 'Chasing sunsets and good vibes ✨',
      likes: 2341,
      comments: 567,
      location: 'New York',
    },
  ]).returning();

  console.log(`Created ${posts.length} posts`);

  const stories = await db.insert(schema.stories).values([
    {
      userId: users[0].id,
      image: 'https://i.pravatar.cc/150?img=1',
      isLive: false,
      isSeen: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      userId: users[2].id,
      image: 'https://i.pravatar.cc/150?img=5',
      isLive: true,
      isSeen: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      userId: users[1].id,
      image: 'https://i.pravatar.cc/150?img=12',
      isLive: false,
      isSeen: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      userId: users[3].id,
      image: 'https://i.pravatar.cc/150?img=9',
      isLive: false,
      isSeen: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      userId: users[5].id,
      image: 'https://i.pravatar.cc/150?img=13',
      isLive: false,
      isSeen: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      userId: users[6].id,
      image: 'https://i.pravatar.cc/150?img=14',
      isLive: false,
      isSeen: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ]).returning();

  console.log(`Created ${stories.length} stories`);

  const comments = await db.insert(schema.comments).values([
    {
      postId: posts[0].id,
      userId: users[2].id,
      text: 'This is amazing! 🔥',
    },
    {
      postId: posts[0].id,
      userId: users[3].id,
      text: 'Love the composition!',
    },
    {
      postId: posts[1].id,
      userId: users[0].id,
      text: 'Those are fire! 🔥',
    },
  ]).returning();

  console.log(`Created ${comments.length} comments`);

  const follows = await db.insert(schema.follows).values([
    { followerId: users[0].id, followingId: users[1].id },
    { followerId: users[0].id, followingId: users[2].id },
    { followerId: users[1].id, followingId: users[2].id },
    { followerId: users[2].id, followingId: users[0].id },
    { followerId: users[3].id, followingId: users[0].id },
    { followerId: users[4].id, followingId: users[0].id },
  ]).returning();

  console.log(`Created ${follows.length} follows`);

  const postLikes = await db.insert(schema.postLikes).values([
    { postId: posts[0].id, userId: users[0].id },
    { postId: posts[1].id, userId: users[0].id },
    { postId: posts[2].id, userId: users[1].id },
  ]).returning();

  console.log(`Created ${postLikes.length} post likes`);

  console.log('Seeding complete!');
}

seed()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
