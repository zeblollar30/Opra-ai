import { Router, Response } from 'express';
import { signupUser, loginUser, authenticate, AuthRequest } from '../auth';

const router = Router();

// POST /api/signup
router.post('/signup', (req: AuthRequest, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ error: 'Email, name, and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const result = signupUser(email, name, password);
  if (!result) {
    res.status(409).json({ error: 'A user with this email already exists' });
    return;
  }

  res.status(201).json({
    user: result.user,
    token: result.token,
  });
});

// POST /api/login
router.post('/login', (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const result = loginUser(email, password);
  if (!result) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.json({
    user: result.user,
    token: result.token,
  });
});

// GET /api/me
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;