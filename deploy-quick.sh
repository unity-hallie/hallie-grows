#!/bin/bash
# Quick deploy — just sync data files (no rebuild needed for live.json changes)
# Use this to push live feed updates without a full deploy

KEY=~/.ssh/freezer_droplet_temp
HOST=root@157.230.139.213
REMOTE=/srv/hallie-grows

scp -i "$KEY" data/live.json "$HOST:$REMOTE/data/live.json"
echo "✓ live.json synced"
