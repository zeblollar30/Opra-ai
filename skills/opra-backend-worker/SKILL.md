---
name: opra-backend-worker
description: How to build a task execution worker for Opra's backend that polls SQLite for pending tasks, processes them with realistic simulated results, and updates the DB.
---

# Opra Backend Task Execution Worker

## Overview

The worker service (`src/worker.ts`) is a `setInterval`-based poller that:
1. Polls SQLite every 5s for `pending` tasks
2. Moves them to `processing` status
3. Waits a random 10-30s delay (realistic feel)
4. Processes via type-specific handlers
5. Updates to `completed` or `failed` with JSON results

## Architecture

### Polling
```typescript
const POLL_INTERVAL = 5000;
const MAX_CONCURRENT = 3;
let activeProcesses = new Set<string>();
```
- Uses `Set` to prevent duplicate processing
- Limiting to 3 concurrent tasks
- Polls with `LIMIT ?` to grab only what can be handled

### Task Type Inference
Smart keyword matching from title+description:
- `appointment` → book|schedule|appointment|doctor|dentist
- `bill_negotiation` → bill|negotiat|comcast|verizon|internet
- `refund` → refund|return|reimburse
- `form_filling` → form|fill|application|register
- `phone_call` → call|phone|speak|talk
- `general` → fallback

### Type Handlers
Each handler returns `{ summary, details }` with realistic data:
- **appointment**: Real business names, dates, confirmation codes
- **bill_negotiation**: Specific $ amounts, rep names, call durations
- **refund**: Dollar amounts, RMA tracking IDs, arrival estimates
- **form_filling**: Form names, field counts, submission IDs
- **phone_call**: Call transcripts with duration, resolution notes
- **general**: Simple completion with descriptive text

### Integration
Auto-start from `src/index.ts`:
```typescript
import { startWorker } from './worker';
// ...
app.listen(PORT, '0.0.0.0', () => {
  startWorker();
});
```

## Key Files
- `/home/team/shared/backend/src/worker.ts` — the worker module
- `/home/team/shared/backend/src/index.ts` — server entrypoint that starts worker

## Gotchas
- Results are stored as JSON strings in the `result` column
- Client must `JSON.parse(result)` to get `summary` and `details`
- 90% success rate / 10% failure rate built in
- `completed_at` is auto-set when status changes to `completed`
- Worker only processes tasks with exactly `pending` status to avoid race conditions