#!/bin/bash
cd /home/team/shared/backend
npx tsx src/index.ts &
sleep 2
echo "Server should be running..."
curl -s http://localhost:3000/api/health