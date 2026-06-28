import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../auth';
import { getDb } from '../database';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/tasks - Create a new task
router.post('/', (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const user = req.user!;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const db = getDb();
  const id = uuidv4();

  db.prepare(
    'INSERT INTO tasks (id, user_id, title, description, status) VALUES (?, ?, ?, ?, ?)'
  ).run(id, user.id, title, description || null, 'pending');

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  res.status(201).json({ task });
});

// GET /api/tasks - List user's tasks
router.get('/', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const db = getDb();
  const status = req.query.status as string | undefined;

  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params: any[] = [user.id];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const tasks = db.prepare(query).all(...params);

  res.json({ tasks });
});

// GET /api/tasks/:id - Get a specific task
router.get('/:id', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const db = getDb();

  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, user.id) as any;

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json({ task });
});

// PATCH /api/tasks/:id - Update task status/result
router.patch('/:id', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, user.id) as any;
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const { title, description, status, result } = req.body;
  const updates: string[] = [];
  const params: any[] = [];

  if (title !== undefined) { updates.push('title = ?'); params.push(title); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (result !== undefined) { updates.push('result = ?'); params.push(result); }

  // If status changed to completed, set completed_at
  if (status === 'completed' && existing.status !== 'completed') {
    updates.push("completed_at = datetime('now')");
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  params.push(req.params.id, user.id);
  db.prepare('UPDATE tasks SET ' + updates.join(', ') + ' WHERE id = ? AND user_id = ?').run(...params);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ task });
});

export default router;