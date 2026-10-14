import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRouter from './routes/auth';
import tasksRouter from './routes/tasks';
import { getDb } from './database';

const app = express();

app.use(cors());
app.use(express.json());

const sitePath = process.env.SITE_PATH || path.join(__dirname, '..', '..', 'site');

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime(), worker: 'active' });
});

app.use('/api', authRouter);
app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
    return;
  }
  const indexHtml = path.join(sitePath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(404).send('Not found');
  }
});

export function createApp() {
  getDb();
  return app;
}

export default createApp();
