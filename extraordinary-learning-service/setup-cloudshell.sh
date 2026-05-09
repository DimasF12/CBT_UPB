#!/bin/bash

# =============================================================
# ExtraordinaryLMS - Cloud Shell Setup Script (SQLite Mode)
# =============================================================

set -e

echo "======================================================"
echo "  ExtraordinaryLMS Backend - Cloud Shell Setup"
echo "======================================================"

# --- Step 1: Set DB_DATABASE path ke current directory ---
CURRENT_DIR=$(pwd)
DB_PATH="$CURRENT_DIR/database/database.sqlite"

echo ""
echo "[1/6] Setting up .env for SQLite..."
cp .env.example .env 2>/dev/null || true

# Update konfigurasi DB di .env
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i '/^DB_HOST=/d' .env
sed -i '/^DB_PORT=/d' .env
sed -i '/^DB_DATABASE=/d' .env
sed -i '/^DB_USERNAME=/d' .env
sed -i '/^DB_PASSWORD=/d' .env

# Tambahkan DB_DATABASE path yang benar setelah DB_CONNECTION
sed -i "s|^DB_CONNECTION=sqlite|DB_CONNECTION=sqlite\nDB_DATABASE=$DB_PATH|" .env

echo "    DB_DATABASE set to: $DB_PATH"

# --- Step 2: Buat file SQLite ---
echo ""
echo "[2/6] Creating SQLite database file..."
touch "$DB_PATH"
echo "    Created: $DB_PATH"

# --- Step 3: Install Composer dependencies ---
echo ""
echo "[3/6] Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

# --- Step 4: Generate app key ---
echo ""
echo "[4/6] Generating application key..."
php artisan key:generate

# --- Step 5: Run migrations ---
echo ""
echo "[5/6] Running database migrations..."
php artisan migrate --force

# --- Step 6: Install Laravel Passport ---
echo ""
echo "[6/6] Installing Laravel Passport..."
php artisan passport:install --force

echo ""
echo "======================================================"
echo "  Setup selesai!"
echo "======================================================"
echo ""
echo "  Untuk menjalankan server, gunakan perintah:"
echo "  php artisan serve --host=0.0.0.0 --port=8000"
echo ""
echo "  Lalu klik Web Preview -> Preview on port 8000"
echo "======================================================"
