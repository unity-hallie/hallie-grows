#!/bin/bash
# Deploy hallie-grows to moveslow.info
# Usage: ./deploy.sh [commit message]

set -e

MSG="${1:-deploy}"
KEY=~/.ssh/freezer_droplet_temp
HOST=root@157.230.139.213
REMOTE=/srv/hallie-grows

echo "→ building locally..."
npm run build 2>&1 | tail -3

echo "→ committing..."
git add -A
git commit -m "$MSG

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>" 2>/dev/null || echo "  (nothing to commit)"

echo "→ pushing..."
git push origin main 2>&1 | tail -2

echo "→ deploying to droplet..."
ssh -i "$KEY" "$HOST" "cd $REMOTE && git pull && npm install --production 2>&1 | tail -1 && npm run build 2>&1 | tail -3 && pm2 restart hallie-grows"

echo ""
echo "✓ live at https://moveslow.info"
