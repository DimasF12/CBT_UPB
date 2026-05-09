#!/bin/bash

# =============================================================
# ExtraordinaryLMS - Cloud Shell Setup Script (SQLite + PHP 7.4)
# =============================================================

echo "======================================================"
echo "  ExtraordinaryLMS Backend - Cloud Shell Setup"
echo "======================================================"

# --- Step 0: Install PHP 7.4 ---
echo ""
echo "[0/7] Checking PHP 7.4..."

if ! command -v php7.4 &> /dev/null; then
    echo "    PHP 7.4 not found. Installing..."

    # Deteksi OS: Ubuntu atau Debian
    OS_ID=$(grep -oP '(?<=^ID=).+' /etc/os-release | tr -d '"')
    echo "    Detected OS: $OS_ID"

    if [ "$OS_ID" = "ubuntu" ]; then
        echo "    Using ondrej/php PPA (Ubuntu)..."
        sudo apt-get install -y software-properties-common
        sudo add-apt-repository -y ppa:ondrej/php
        sudo apt-get update -q
    else
        echo "    Using sury.org repo (Debian)..."
        sudo apt-get install -y lsb-release apt-transport-https ca-certificates wget
        sudo wget -qO /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
        echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/php.list
        sudo apt-get update -q
    fi

    echo "    Installing PHP 7.4 packages..."
    sudo apt-get install -y php7.4-cli php7.4-sqlite3 php7.4-mbstring php7.4-xml php7.4-zip php7.4-curl php7.4-gd

    if command -v php7.4 &> /dev/null; then
        echo "    PHP 7.4 installed: $(php7.4 --version | head -1)"
    else
        echo "    ERROR: PHP 7.4 installation failed!"
        echo "    Coba jalankan manual: sudo apt-get install -y php7.4-cli"
        exit 1
    fi
else
    echo "    PHP 7.4 already installed: $(php7.4 --version | head -1)"
fi

PHP_CMD="php7.4"

# --- Step 1: Setup .env ---
CURRENT_DIR=$(pwd)
DB_PATH="$CURRENT_DIR/database/database.sqlite"

echo ""
echo "[1/7] Setting up .env for SQLite..."
cp .env.example .env 2>/dev/null || true

sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i '/^DB_HOST=/d' .env
sed -i '/^DB_PORT=/d' .env
sed -i '/^DB_DATABASE=/d' .env
sed -i '/^DB_USERNAME=/d' .env
sed -i '/^DB_PASSWORD=/d' .env
sed -i "s|^DB_CONNECTION=sqlite|DB_CONNECTION=sqlite\nDB_DATABASE=$DB_PATH|" .env

echo "    DB_DATABASE set to: $DB_PATH"

# --- Step 2: Buat file SQLite ---
echo ""
echo "[2/7] Creating SQLite database file..."
mkdir -p database
touch "$DB_PATH"
echo "    Created: $DB_PATH"

# --- Step 3: Install Composer dependencies ---
echo ""
echo "[3/7] Installing Composer dependencies with PHP 7.4..."

if [ -d "vendor" ]; then
    echo "    Cleaning up existing vendor directory..."
    rm -rf vendor
fi

$PHP_CMD $(which composer) install --no-interaction --prefer-dist --optimize-autoloader

# --- Step 4: Generate app key ---
echo ""
echo "[4/7] Generating application key..."
$PHP_CMD artisan key:generate

# --- Step 5: Run migrations ---
echo ""
echo "[5/7] Running database migrations..."
$PHP_CMD artisan migrate --force

# --- Step 6: Install Laravel Passport ---
echo ""
echo "[6/7] Installing Laravel Passport..."
$PHP_CMD artisan passport:install --force

# --- Step 7: Storage link ---
echo ""
echo "[7/7] Creating storage symlink..."
$PHP_CMD artisan storage:link 2>/dev/null || true

echo ""
echo "======================================================"
echo "  Setup SELESAI!"
echo "======================================================"
echo ""
echo "  Jalankan server dengan:"
echo "  php7.4 artisan serve --host=0.0.0.0 --port=8000"
echo ""
echo "  Lalu klik Web Preview -> Preview on port 8000"
echo "======================================================"
