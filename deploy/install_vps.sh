#!/bin/bash
set -e

echo "=========================================="
echo " AITCOIN Node - VPS Installation Script"
echo "=========================================="
echo ""

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo bash install_vps.sh"
    exit 1
fi

echo "[1/6] Updating system packages..."
apt-get update -y
apt-get upgrade -y

echo "[2/6] Installing build dependencies..."
apt-get install -y \
    build-essential \
    libtool \
    autotools-dev \
    automake \
    pkg-config \
    libssl-dev \
    libevent-dev \
    bsdmainutils \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-chrono-dev \
    libboost-test-dev \
    libboost-thread-dev \
    libdb-dev \
    libdb++-dev \
    libzmq3-dev \
    cmake \
    git \
    wget \
    curl \
    ufw

echo "[3/6] Creating aitcoin user..."
if ! id "aitcoin" &>/dev/null; then
    useradd -m -s /bin/bash aitcoin
    echo "User 'aitcoin' created."
else
    echo "User 'aitcoin' already exists."
fi

echo "[4/6] Building AITCOIN from source..."
AITCOIN_DIR="/home/aitcoin/aitcoin-src"
if [ -d "$AITCOIN_DIR" ]; then
    rm -rf "$AITCOIN_DIR"
fi

cp -r "$(dirname "$0")/.." "$AITCOIN_DIR"
chown -R aitcoin:aitcoin "$AITCOIN_DIR"

cd "$AITCOIN_DIR"
if [ -f "autogen.sh" ]; then
    sudo -u aitcoin bash autogen.sh
    sudo -u aitcoin ./configure --disable-tests --disable-bench --with-gui=no
    sudo -u aitcoin make -j$(nproc)
else
    mkdir -p build && cd build
    cmake .. -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF
    make -j$(nproc)
fi

echo "[5/6] Installing binaries..."
make install 2>/dev/null || cp src/aitcoind src/aitcoin-cli /usr/local/bin/ 2>/dev/null || true

echo "[6/6] Setting up configuration..."
AITCOIN_DATA="/home/aitcoin/.aitcoin"
mkdir -p "$AITCOIN_DATA"

if [ ! -f "$AITCOIN_DATA/aitcoin.conf" ]; then
    RPC_USER="aitcoinrpc"
    RPC_PASS=$(openssl rand -hex 32)

    cat > "$AITCOIN_DATA/aitcoin.conf" << EOF
server=1
daemon=1
txindex=1

rpcuser=$RPC_USER
rpcpassword=$RPC_PASS
rpcallowip=127.0.0.1
rpcport=9882

port=9883

maxconnections=64
dbcache=512

listen=1
discover=1

addnode=seed1.aitcoin.com
addnode=seed2.aitcoin.com

printtoconsole=0
debug=0
EOF

    echo ""
    echo "RPC credentials saved to $AITCOIN_DATA/aitcoin.conf"
    echo "  RPC User: $RPC_USER"
    echo "  RPC Pass: $RPC_PASS"
fi

chown -R aitcoin:aitcoin "$AITCOIN_DATA"

echo ""
echo "Setting up systemd service..."
cat > /etc/systemd/system/aitcoind.service << 'EOF'
[Unit]
Description=AITCOIN Node
After=network.target

[Service]
User=aitcoin
Group=aitcoin
Type=forking
ExecStart=/usr/local/bin/aitcoind -daemon -conf=/home/aitcoin/.aitcoin/aitcoin.conf -datadir=/home/aitcoin/.aitcoin
ExecStop=/usr/local/bin/aitcoin-cli -conf=/home/aitcoin/.aitcoin/aitcoin.conf stop
Restart=on-failure
RestartSec=30
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable aitcoind

echo ""
echo "Setting up firewall..."
ufw allow 9883/tcp
ufw allow 22/tcp
ufw --force enable

echo ""
echo "=========================================="
echo " Installation Complete!"
echo "=========================================="
echo ""
echo " Start the node:  sudo systemctl start aitcoind"
echo " Stop the node:   sudo systemctl stop aitcoind"
echo " Check status:    sudo systemctl status aitcoind"
echo " View logs:       tail -f /home/aitcoin/.aitcoin/debug.log"
echo " CLI access:      aitcoin-cli -conf=/home/aitcoin/.aitcoin/aitcoin.conf getblockchaininfo"
echo " Vesting info:    aitcoin-cli -conf=/home/aitcoin/.aitcoin/aitcoin.conf getvestinginfo"
echo ""
echo " Config file: $AITCOIN_DATA/aitcoin.conf"
echo ""
