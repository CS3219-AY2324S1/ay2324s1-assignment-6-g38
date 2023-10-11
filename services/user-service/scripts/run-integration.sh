#!/usr/bin/env bash
# src/run-integration.sh

echo '🟡 - Step 1'
DIR="$(cd "$(dirname "$0")" && pwd)"
echo '🟡 - Step 2'
source $DIR/setenv.sh
docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
npx prisma db push
