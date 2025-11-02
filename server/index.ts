import express from 'express';
import cors from 'cors';
import * as storage from './storage';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await storage.getUserById(parseInt(req.params.id));
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

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await storage.getPosts();
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
    const result = await storage.togglePostSave(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle save' });
  }
});

app.get('/api/stories', async (req, res) => {
  try {
    const stories = await storage.getStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

app.post('/api/users/:id/follow', async (req, res) => {
  try {
    const result = await storage.toggleUserFollow(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle follow' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
