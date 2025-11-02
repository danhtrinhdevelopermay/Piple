import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as storage from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string | null;
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  name: string;
}) {
  const existingUser = await storage.getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const existingUsername = await storage.getUserByUsername(data.username);
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  
  const user = await storage.createUser({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    name: data.name,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=C6FF00&color=000`,
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email!,
      name: user.name,
      avatar: user.avatar,
    },
  };
}

export async function loginUser(email: string, password: string) {
  const user = await storage.getUserByEmail(email);
  
  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email!,
      name: user.name,
      avatar: user.avatar,
    },
  };
}

export function verifyToken(token: string): { userId: number; email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
