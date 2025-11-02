import express from 'express';
import cors from 'cors';
import * as storage from './storage';
import * as auth from './auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Piple API is running', status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await auth.registerUser(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await auth.loginUser(req.body.email, req.body.password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const decoded = auth.verifyToken(req.body.token);
    const user = await storage.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const currentUserId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const users = await storage.getUsers(currentUserId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const currentUserId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const user = await storage.getUserById(parseInt(req.params.id), currentUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await storage.createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:id/followers', async (req, res) => {
  try {
    const followers = await storage.getFollowers(parseInt(req.params.id));
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

app.get('/api/users/:id/following', async (req, res) => {
  try {
    const following = await storage.getFollowing(parseInt(req.params.id));
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const currentUserId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const posts = await storage.getPosts(currentUserId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const post = await storage.createPost(req.body);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const result = await storage.deletePost(parseInt(req.params.id), req.body.userId);
    res.json(result);
  } catch (error: any) {
    res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const result = await storage.togglePostLike(parseInt(req.params.id), req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

app.post('/api/posts/:id/save', async (req, res) => {
  try {
    const result = await storage.togglePostSave(parseInt(req.params.id), req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle save' });
  }
});

app.get('/api/posts/saved', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const posts = await storage.getSavedPosts(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved posts' });
  }
});

app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await storage.getComments(parseInt(req.params.id));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const comment = await storage.createComment({
      postId: parseInt(req.params.id),
      userId: req.body.userId,
      text: req.body.text,
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const result = await storage.deleteComment(parseInt(req.params.id), req.body.userId);
    res.json(result);
  } catch (error: any) {
    res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
  }
});

app.get('/api/stories', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const stories = await storage.getStories(userId);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

app.post('/api/stories', async (req, res) => {
  try {
    const story = await storage.createStory(req.body);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create story' });
  }
});

app.post('/api/stories/:id/view', async (req, res) => {
  try {
    const result = await storage.addStoryViewer(parseInt(req.params.id), req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add story viewer' });
  }
});

app.get('/api/stories/:id/viewers', async (req, res) => {
  try {
    const viewers = await storage.getStoryViewers(parseInt(req.params.id));
    res.json(viewers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch story viewers' });
  }
});

app.post('/api/users/:id/follow', async (req, res) => {
  try {
    const result = await storage.toggleUserFollow(req.body.followerId, parseInt(req.params.id));
    res.json(result);
  } catch (error: any) {
    res.status(error.message === 'Cannot follow yourself' ? 400 : 500).json({ error: error.message });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications/:id/read', async (req, res) => {
  try {
    const result = await storage.markNotificationRead(parseInt(req.params.id), req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

app.post('/api/notifications/read-all', async (req, res) => {
  try {
    const result = await storage.markAllNotificationsRead(req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const otherUserId = parseInt(req.query.otherUserId as string);
    const messages = await storage.getMessages(userId, otherUserId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = await storage.sendMessage(req.body);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
