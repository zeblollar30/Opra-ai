import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth';
import tasksRouter from './routes/tasks';
import { startWorker } from './worker';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

const sitePath = process.env.SITE_PATH || path.join(__dirname, '..', '..', 'site');
app.use(express.static(sitePath));

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
  res.sendFile(path.join(sitePath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Opra API server running on http://0.0.0.0:' + PORT);
  console.log('Serving static site from: ' + sitePath);
  startWorker();
});
