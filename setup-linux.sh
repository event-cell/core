#!/bin/bash

# Fedora 38 development environment setup
# Takes a fresh Fedora 38 VM to a working dev environment for this repo:
# Node 22, Yarn 4, Docker CE, dependencies, Prisma clients and a dev config.
#
# Docker cannot run on the macOS host (it is itself a VM guest with no nested
# virtualisation), so all container work happens on this Linux VM instead.
#
# Safe to re-run - every step is idempotent.

set -e  # Exit on any error

echo "🐧 Fedora development environment setup"
echo "======================================="
echo ""

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the core directory."
    exit 1
fi

if [ "$(id -u)" -eq 0 ]; then
    echo "❌ Error: do not run this script as root."
    echo "   It needs your real user account to add you to the 'docker' group."
    echo "   Run it as yourself; it will call sudo where required."
    exit 1
fi

if ! command -v sudo >/dev/null 2>&1; then
    echo "❌ Error: sudo not found. This script needs sudo to install packages."
    exit 1
fi

if ! command -v dnf >/dev/null 2>&1; then
    echo "❌ Error: dnf not found. This script targets Fedora."
    exit 1
fi

if [ -r /etc/os-release ]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    if [ "${ID:-}" != "fedora" ]; then
        echo "❌ Error: this script targets Fedora, but /etc/os-release reports '${ID:-unknown}'."
        exit 1
    fi
    if [ "${VERSION_ID:-}" != "38" ]; then
        echo "⚠️  Warning: expected Fedora 38, found Fedora ${VERSION_ID:-unknown}."
        echo "   Continuing anyway - package names should still be correct."
        echo ""
    fi
else
    echo "⚠️  Warning: /etc/os-release not readable, skipping distro check."
    echo ""
fi

REPO_DIR="$(pwd)"

# ---------------------------------------------------------------------------
# 1. Repository metadata (Fedora 38 is EOL - mirrors have moved to the archive)
# ---------------------------------------------------------------------------

echo "📡 Checking dnf repository metadata..."
if sudo dnf -q makecache >/dev/null 2>&1; then
    echo "✅ Repository metadata OK"
else
    echo ""
    echo "⚠️  dnf could not refresh its metadata."
    echo "   Fedora 38 reached end of life in May 2024, so its mirrors have moved to:"
    echo "     https://dl.fedoraproject.org/pub/archive/fedora/linux/"
    echo ""
    echo "   This script can repoint the base and updates repos at the archive."
    echo "   Existing files are backed up as *.bak before any change."
    echo ""
    read -p "⚠️  Repoint /etc/yum.repos.d/fedora{,-updates}.repo at the archive? (y/N): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ARCHIVE="https://dl.fedoraproject.org/pub/archive/fedora/linux/"

        echo "🗃️  Repointing base repo..."
        sudo sed -i.bak \
            -e 's|^metalink=|#metalink=|' \
            -e "s|^#\?baseurl=.*/pub/fedora/linux/|baseurl=${ARCHIVE}|" \
            /etc/yum.repos.d/fedora.repo

        echo "🗃️  Repointing updates repo..."
        sudo sed -i.bak \
            -e 's|^metalink=|#metalink=|' \
            -e "s|^#\?baseurl=.*/pub/fedora/linux/|baseurl=${ARCHIVE}|" \
            /etc/yum.repos.d/fedora-updates.repo

        echo "📡 Retrying metadata refresh..."
        sudo dnf -q makecache
        echo "✅ Repository metadata OK (archive mirrors)"
    else
        echo "❌ Cannot continue without working repository metadata."
        echo "   Repoint the repos manually, then re-run this script."
        exit 1
    fi
fi
echo ""

# ---------------------------------------------------------------------------
# 2. Base packages
# ---------------------------------------------------------------------------

echo "📦 Installing base packages..."
# dnf-plugins-core provides 'dnf config-manager', needed for the Docker repo.
# openssl matters for Prisma: on Fedora its 'native' engine target resolves to
# rhel-openssl-3.0.x, which the schemas already declare.
sudo dnf install -y \
    ca-certificates \
    curl \
    git \
    rsync \
    openssh-clients \
    openssl \
    gcc \
    gcc-c++ \
    make \
    dnf-plugins-core
echo ""

# ---------------------------------------------------------------------------
# 3. Node.js 22 (via nvm)
# ---------------------------------------------------------------------------

# nvm rather than the NodeSource RPM repo: NodeSource is versioned per distro
# release and Fedora 38 is EOL, so nvm avoids that dependency and needs no sudo.

export NVM_DIR="$HOME/.nvm"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    echo "⬇️  Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
else
    echo "✅ nvm already installed"
fi

# Load nvm into this shell so the steps below can see node
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"

# Add the nvm init lines to ~/.bashrc only if they aren't there already
if ! grep -q 'NVM_DIR' "$HOME/.bashrc" 2>/dev/null; then
    echo "📝 Adding nvm to ~/.bashrc..."
    cat >> "$HOME/.bashrc" <<'BASHRC_EOF'

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
BASHRC_EOF
fi

if nvm ls 22 >/dev/null 2>&1; then
    echo "✅ Node.js 22 already installed via nvm"
else
    echo "⬇️  Installing Node.js 22..."
    nvm install 22
fi
nvm alias default 22 >/dev/null
nvm use 22 >/dev/null
echo ""

# ---------------------------------------------------------------------------
# 4. Yarn 4 (via corepack)
# ---------------------------------------------------------------------------

# The exact version comes from "packageManager" in package.json
echo "🧶 Enabling corepack for Yarn..."
corepack enable
echo "   Yarn version: $(yarn --version)"
echo ""

# ---------------------------------------------------------------------------
# 5. Docker CE
# ---------------------------------------------------------------------------

if command -v docker >/dev/null 2>&1; then
    echo "✅ Docker already installed: $(docker --version)"
else
    echo "🐳 Adding the Docker CE repository..."
    # Docker CE rather than Fedora's moby-engine, so that 'docker buildx' and
    # 'docker compose' match what the build scripts and docker-compose.yml expect
    sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

    echo "🐳 Installing Docker CE..."
    sudo dnf install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin
fi

echo "🐳 Enabling and starting the Docker service..."
sudo systemctl enable --now docker

if ! getent group docker >/dev/null 2>&1 || ! id -nG "$USER" | grep -qw docker; then
    echo "👤 Adding $USER to the 'docker' group..."
    sudo usermod -aG docker "$USER"
fi

DOCKER_GROUP_ACTIVE=true
if ! id -nG | grep -qw docker; then
    DOCKER_GROUP_ACTIVE=false
fi
echo ""

# ---------------------------------------------------------------------------
# 6. SELinux and firewalld (report only - we don't reconfigure these for you)
# ---------------------------------------------------------------------------

if command -v getenforce >/dev/null 2>&1; then
    SELINUX_MODE="$(getenforce)"
    echo "🔒 SELinux: $SELINUX_MODE"
    if [ "$SELINUX_MODE" = "Enforcing" ]; then
        echo "   test-docker.sh passes ':z' on its bind mounts to relabel them,"
        echo "   so the container can read them. No need to disable SELinux."
    fi
else
    echo "🔒 SELinux: not present"
fi

if command -v firewall-cmd >/dev/null 2>&1 && sudo firewall-cmd --state >/dev/null 2>&1; then
    echo "🧱 firewalld is active."
    echo "   To reach the test container from other machines on the network:"
    echo "     sudo firewall-cmd --add-port=3000/tcp --permanent && sudo firewall-cmd --reload"
fi
echo ""

# ---------------------------------------------------------------------------
# 7. Project dependencies
# ---------------------------------------------------------------------------

echo "📦 Installing dependencies..."
yarn
echo ""

echo "🔧 Generating Prisma clients..."
cd server && yarn prismaGenerate && cd ..
echo ""

# ---------------------------------------------------------------------------
# 8. Development config
# ---------------------------------------------------------------------------

# The server resolves its config via CONFIG_DIR first, then /data/, then a path
# relative to the server dist (see server/src/config.ts). CONFIG_DIR is the
# clean lever for running natively outside a container.
#
# Two configs are seeded, because the paths inside a config file are only valid
# in one place at a time:
#
#   test-data/config.json  test-docker.sh mounts test-data/ as /data, so the
#                          server reads this as /data/config.json from inside
#                          the container. It must use container paths
#                          (/app/prisma/Events, /data/...) — host paths here
#                          produce "Error code 14: Unable to open the database
#                          file", because they do not exist in the container.
#   dev-config/config.json Used by native runs via CONFIG_DIR. Host paths.

if [ ! -d "test-data" ]; then
    echo "📁 Creating test-data directory..."
    mkdir -p test-data
fi

if [ -f "test-data/config.json" ]; then
    echo "✅ test-data/config.json already exists, leaving it alone"
else
    echo "📝 Seeding test-data/config.json (container paths) from config.json.example..."
    # config.json.example already carries the container paths, so it is copied as-is
    cp config.json.example test-data/config.json
    mkdir -p test-data/records test-data/live-timing
fi

if [ -f "dev-config/config.json" ]; then
    echo "✅ dev-config/config.json already exists, leaving it alone"
else
    echo "📝 Seeding dev-config/config.json (host paths) from config.json.example..."
    mkdir -p dev-config
    # Written as .cjs so it stays CommonJS regardless of "type": "module"
    cat > .seed-config.cjs <<'NODE_EOF'
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const repoDir = process.argv[2]
const config = JSON.parse(readFileSync('config.json.example', 'utf8'))

// Point the container paths at local directories for native development
config.eventDatabasePath = join(repoDir, 'Events')
config.recordsDatabasePath = join(repoDir, 'test-data', 'records')
config.liveTimingOutputPath = join(repoDir, 'test-data', 'live-timing')
config.rsyncSshKeyPath = join(repoDir, 'test-data', '.ssh', 'id_rsa')

// Written relative to the repo root, which is where this script must be run from
writeFileSync('dev-config/config.json', JSON.stringify(config, null, 2) + '\n')
NODE_EOF
    node .seed-config.cjs "$REPO_DIR"
    rm -f .seed-config.cjs
    mkdir -p test-data/records test-data/live-timing
fi
echo ""

# ---------------------------------------------------------------------------
# 9. Event database files
# ---------------------------------------------------------------------------

# Events/ and test-data/ are gitignored, so a fresh clone has no .scdb files
if [ ! -d "Events" ] || [ -z "$(ls -A Events 2>/dev/null)" ]; then
    echo "⚠️  No event database files found in ./Events"
    echo "   test-docker.sh requires them. Copy them from the Mac (~300 KB):"
    echo ""
    echo "     rsync -av <mac-user>@<mac-host>:~/IdeaProjects/core/Events/ ./Events/"
    echo ""
else
    echo "✅ Event database files found: $(ls Events | tr '\n' ' ')"
    echo ""
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo "🎉 Setup complete!"
echo ""
echo "Installed:"
echo "   Node:   $(node -v)"
echo "   Yarn:   $(yarn --version)"
echo "   Docker: $(docker --version)"
echo ""

if [ "$DOCKER_GROUP_ACTIVE" = false ]; then
    echo "⚠️  IMPORTANT: you were added to the 'docker' group, but this shell"
    echo "   doesn't have it yet. Docker commands will fail until you either:"
    echo "     - log out and back in, or"
    echo "     - run: newgrp docker"
    echo ""
elif docker info >/dev/null 2>&1; then
    echo "✅ Docker daemon reachable"
    echo ""
else
    echo "⚠️  Docker daemon not reachable. Try: sudo systemctl start docker"
    echo ""
fi

echo "Next steps:"
echo "1. Run the server natively:"
echo "     CONFIG_DIR=$REPO_DIR/test-data yarn server:dev"
echo "2. Run the frontend (separate terminal):"
echo "     yarn client:dev"
echo "3. Or build and test the Docker image:"
echo "     ./build-local.sh"
echo "     ./test-docker.sh"
