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
echo "[3/6] Installing Composer dependencies (ignoring PHP version)..."

# Bersihkan folder vendor jika ada sisa kegagalan sebelumnya
if [ -d "vendor" ]; then
    echo "    Cleaning up existing vendor directory..."
    rm -rf vendor
fi

# Menggunakan --ignore-platform-reqs karena Cloud Shell menggunakan PHP 8.3
composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs

# --- Step 3.5: PHP 8 Compatibility Patch ---
echo ""
echo "[3.5/6] Applying PHP 8 Compatibility Patch..."
# Patch untuk Collection.php, Container.php, dll agar tidak error di PHP 8.1+
find vendor/laravel/framework/src/Illuminate/ -name "*.php" -type f -exec sed -i 's/public function offsetExists(/#\[\\ReturnTypeWillChange\]\n    public function offsetExists(/g' {} +
find vendor/laravel/framework/src/Illuminate/ -name "*.php" -type f -exec sed -i 's/public function offsetGet(/#\[\\ReturnTypeWillChange\]\n    public function offsetGet(/g' {} +
find vendor/laravel/framework/src/Illuminate/ -name "*.php" -type f -exec sed -i 's/public function offsetSet(/#\[\\ReturnTypeWillChange\]\n    public function offsetSet(/g' {} +
find vendor/laravel/framework/src/Illuminate/ -name "*.php" -type f -exec sed -i 's/public function offsetUnset(/#\[\\ReturnTypeWillChange\]\n    public function offsetUnset(/g' {} +
find vendor/laravel/framework/src/Illuminate/ -name "*.php" -type f -exec sed -i 's/public function getIterator(/#\[\\ReturnTypeWillChange\]\n    public function getIterator(/g' {} +
find vendor/laravel/framework/src/Illuminate/ -name "*.php" -type f -exec sed -i 's/public function count(/#\[\\ReturnTypeWillChange\]\n    public function count(/g' {} +

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
