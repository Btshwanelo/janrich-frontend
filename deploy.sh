#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Config
APP_DIR="/root/janrich-frontend"
PM2_NAME="janrich-frontend"          # pm2 process name
GIT_BRANCH="main"
LOGFILE="/var/log/janrich-deploy.log"

# Helpers
log() { echo "[$(date -Iseconds)] $*"; }
log_to_file() { log "$@" | tee -a "$LOGFILE"; }

log_to_file "=== Starting deploy ==="

# 1. Go to repo
if [ ! -d "$APP_DIR" ]; then
  log_to_file "ERROR: app directory $APP_DIR not found"
  exit 1
fi
cd "$APP_DIR"

# 2. Ensure clean working tree (optional - safe if you only deploy committed code)
log_to_file "Fetching latest from origin/$GIT_BRANCH"
git fetch origin "$GIT_BRANCH" --quiet
git reset --hard "origin/$GIT_BRANCH"

# 3. Backup previous build (fast rollback)
if [ -d ".next" ]; then
  ts=$(date +%s)
  mv .next ".next.bak.$ts" || true
  log_to_file "Backed up previous .next -> .next.bak.$ts"
fi

# 4. Install dependencies (use npm ci for reproducible installs)
log_to_file "Installing dependencies (npm ci)"
npm ci --silent

# 5. Build
log_to_file "Building app (npm run build)"
npm run build --silent

# 6. Ensure no conflicting process on port 3000 (best-effort)
if ss -ltn "( sport = :3000 )" 2>/dev/null | grep -q ':3000'; then
  log_to_file "Warning: something is listening on :3000 — listing processes:"
  ss -ltnp | grep ':3000' || true
fi

# 7. Start or restart with PM2
if pm2 pid "$PM2_NAME" >/dev/null 2>&1; then
  log_to_file "Restarting pm2 process: $PM2_NAME"
  pm2 restart "$PM2_NAME" --update-env
else
  log_to_file "Starting pm2 process: $PM2_NAME"
  pm2 start npm --name "$PM2_NAME" -- start --update-env
fi

# 8. Persist pm2 list
pm2 save

# 9. Reload nginx to ensure changes served immediately
if command -v nginx >/dev/null 2>&1; then
  log_to_file "Testing nginx config"
  sudo nginx -t
  log_to_file "Reloading nginx"
  sudo systemctl reload nginx
fi

log_to_file "✅ Deployment complete!"
