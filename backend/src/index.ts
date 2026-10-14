import { createApp } from './app';
import { startWorker } from './worker';

const PORT = parseInt(process.env.PORT || '3001', 10);

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log('Opra API server running on http://0.0.0.0:' + PORT);
  startWorker();
});
