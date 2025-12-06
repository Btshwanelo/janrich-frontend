#!/bin/bash
cd /root/janrich-frontend
echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building app..."
npm run build

echo "Restarting PM2..."
pm2 restart janrich-frontend || pm2 restart nextjs-app

echo "✅ Deployment complete!"
