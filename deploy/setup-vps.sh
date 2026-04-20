#!/bin/bash
# ============================================================
# AITCOIN VPS Setup Script — AI Layer + Full Node
# Tested on Ubuntu 22.04 LTS
# ============================================================

set -e

echo "=== AITCOIN VPS Setup ==="

# 1. Update system
apt update && apt upgrade -y
apt install -y git curl wget build-essential pkg-config \
               libssl-dev libboost-all-dev libminiupnpc-dev \
               libzmq3-dev nginx certbot python3-certbot-nginx \
               postgresql postgresql-contrib

# 2. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install pnpm
npm install -g pnpm

# 4. Setup PostgreSQL
sudo -u postgres psql << 'SQL'
CREATE USER aitcoin WITH PASSWORD 'CHANGE_THIS_PASSWORD';
CREATE DATABASE aitcoin_db OWNER aitcoin;
GRANT ALL PRIVILEGES ON DATABASE aitcoin_db TO aitcoin;
SQL

# 5. Clone or copy project
# Upload your AITCOIN project to /opt/aitcoin
# Example: scp -r AITCOIN/ root@VPS_IP:/opt/aitcoin/

PROJECT_DIR="/opt/aitcoin"
mkdir -p $PROJECT_DIR

# 6. Setup environment
cat > $PROJECT_DIR/ai-layer/.env << 'ENV'
PORT=3000
DATABASE_URL=postgresql://aitcoin:CHANGE_THIS_PASSWORD@localhost:5432/aitcoin_db
NODE_TYPE=AI_NODE
P2P_PORT=9080
AITCOIN_RPC_URL=http://127.0.0.1:8332
AITCOIN_RPC_USER=rpcuser
AITCOIN_RPC_PASS=CHANGE_RPC_PASSWORD
ALLOWED_ORIGINS=https://your-domain.com
ENV

echo "=== Setup environment variables in $PROJECT_DIR/ai-layer/.env ==="

# 7. Install dependencies
cd $PROJECT_DIR/ai-layer
pnpm install

# 8. Run database migration
psql postgresql://aitcoin:CHANGE_THIS_PASSWORD@localhost:5432/aitcoin_db \
  -f migrations/001_vesting_schedule.sql

echo "=== Migration done ==="

# 9. Setup systemd service
cp deploy/aitcoin-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable aitcoin-api
systemctl start aitcoin-api

# 10. Setup nginx
cp deploy/nginx.conf /etc/nginx/sites-available/aitcoin
ln -sf /etc/nginx/sites-available/aitcoin /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "=== AITCOIN AI Layer is running! ==="
echo "API available at http://VPS_IP:3000"
echo ""
echo "NEXT STEPS:"
echo "1. Edit .env with real passwords"
echo "2. Run: psql < migrations/001_vesting_schedule.sql"
echo "3. Register wallet: POST /api/wallet/register"
echo "4. Claim free 100K: POST /api/wallet/claim/free"
