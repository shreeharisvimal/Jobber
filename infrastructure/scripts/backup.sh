#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."
docker compose exec -T postgres pg_dump -U jobber jobber | gzip > "$BACKUP_DIR/jobber_$TIMESTAMP.sql.gz"

echo "Backup completed: $BACKUP_DIR/jobber_$TIMESTAMP.sql.gz"
