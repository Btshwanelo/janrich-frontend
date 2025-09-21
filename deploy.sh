#!/bin/bash
cd janrich-frontend
git pull origin main
npm install
npm run build
pm2 restart janrich-frontend
echo "✅ Deployment complete!"