#!/bin/bash
echo "Pulling latest code..."
git pull origin main

echo "Building frontend..."
cd frontend
npm install
npm run build
cp -r dist ../dist
cd ../

echo "Installing backend dependencies..."
npm install

echo "Restarting server..."
pm2 restart ctprecorp

echo "Deployment complete!"
