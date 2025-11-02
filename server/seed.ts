import { db } from './storage';
import * as schema from '../shared/schema';

async function seed() {
  console.log('Seeding database...');

  const users = await db.insert(schema.users).values([
    {
      username: 'your_username',
      name: 'Your Name',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Content creator & Filmmaker',
      location: 'New York, USA',
      posts: 200,
      followers: 97500,
      following: 121,
      likes: 3250000,
      isFollowing: false,
    },
    {
      username: 'akmalnslih',
      name: 'Akmal Nslih',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'Photographer & Visual Artist',
      location: 'Bekasi, Indonesia',
      posts: 150,
      followers: 45200,
      following: 312,
      likes: 892000,
      isFollowing: false,
    },
    {
      username: 'calire.gd',
      name: 'Claire Gordon',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Fashion & Lifestyle',
      location: 'Los Angeles, USA',
      posts: 324,
      followers: 128500,
      following: 245,
      likes: 1450000,
      isFollowing: true,
    },
    {
      username: 'calista33',
      name: 'Calista Miller',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Travel Blogger',
      location: 'Barcelona, Spain',
      posts: 287,
      followers: 92300,
      following: 189,
      likes: 1120000,
      isFollowing: false,
    },
    {
      username: 'azizahm',
      name: 'Azizah M',
      avatar: 'https://i.pravatar.cc/150?img=10',
      bio: 'Food & Recipe Creator',
      location: 'Jakarta, Indonesia',
      posts: 412,
      followers: 156700,
      following: 98,
      likes: 2340000,
      isFollowing: false,
    },
    {
      username: 'adamuseno',
      name: 'Adam Useno',
      avatar: 'https://i.pravatar.cc/150?img=13',
      bio: 'Tech Enthusiast',
      location: 'Singapore',
      posts: 189,
      followers: 67800,
      following: 543,
      likes: 945000,
      isFollowing: true,
    },
    {
      username: 'aditya_prasodjo',
      name: 'Aditya Prasodjo',
      avatar: 'https://i.pravatar.cc/150?img=14',
      bio: 'Content creator & Filmmaker',
      location: 'Surabaya, Indonesia',
      posts: 200,
      followers: 97500,
      following: 121,
      likes: 3250000,
      isFollowing: false,
    },
  ]).returning();

  console.log(`Created ${users.length} users`);

  const posts = await db.insert(schema.posts).values([
    {
      userId: users[1].id,
      image: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=800',
      caption: 'When life gives you limes, arrange them in a zesty flatlay and create a lime-light masterpiece! ...more',
      likes: 349,
      comments: 760,
      isLiked: false,
      isSaved: false,
      location: 'Bekasi',
    },
    {
      userId: users[2].id,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      caption: 'Sneaker game strong 💪 New kicks, who dis?',
      likes: 892,
      comments: 234,
      isLiked: true,
      isSaved: false,
      location: 'Los Angeles',
    },
    {
      userId: users[6].id,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      caption: 'Golden hour perfection 🌅',
      likes: 1245,
      comments: 456,
      isLiked: false,
      isSaved: true,
      location: 'Surabaya',
    },
    {
      userId: users[3].id,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      caption: 'Coffee and contemplation ☕',
      likes: 567,
      comments: 123,
      isLiked: true,
      isSaved: false,
      location: 'Barcelona',
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
