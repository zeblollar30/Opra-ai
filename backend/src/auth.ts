import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'opra-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  subscriptionTier: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, JWT_SECRET) as AuthUser;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function signupUser(email: string, name: string, password: string): { user: AuthUser; token: string } | null {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return null;
  }

  const id = uuidv4();
  const passwordHash = hashPassword(password);

  db.prepare(
    'INSERT INTO users (id, email, name, password_hash, subscription_tier) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, name, passwordHash, 'free');

  const user: AuthUser = {
    id,
    email,
    name,
    subscriptionTier: 'free',
  };

  const token = generateToken(user);
  return { user, token };
}

export function loginUser(email: string, password: string): { user: AuthUser; token: string } | null {
  const db = getDb();
  const row = db.prepare('SELECT id, email, name, password_hash, subscription_tier FROM users WHERE email = ?').get(email) as any;
  if (!row) {
    return null;
  }

  if (!comparePassword(password, row.password_hash)) {
    return null;
  }

  const user: AuthUser = {
    id: row.id,
    email: row.email,
    name: row.name,
    subscriptionTier: row.subscription_tier,
  };

  const token = generateToken(user);
  return { user, token };
}