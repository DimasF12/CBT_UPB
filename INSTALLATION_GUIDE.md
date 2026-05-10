# Panduan Instalasi ExtraordinaryLMS (Modern Stack)

Dokumen ini berisi panduan instalasi dan persyaratan sistem setelah project dimigrasi ke stack teknologi modern (Node.js 22 & PHP 8.1+).

## 1. Persyaratan Sistem (Technical Requirements)

### Software Utama:
*   **PHP**: Minimal versi **8.1** (Direkomendasikan 8.1.x atau 8.2.x).
*   **Node.js**: Versi **22.x (LTS)**.
*   **Composer**: Versi **2.x**.
*   **Database**: MySQL atau MariaDB (Bawaan XAMPP).
*   **Web Server**: Apache (Bawaan XAMPP) atau Nginx.

### Ekstensi PHP yang Diperlukan:
Pastikan ekstensi berikut aktif di `php.ini` Anda:
*   `bcmath`, `curl`, `fileinfo`, `gd`, `mbstring`, `mysqli`, `openssl`, `pdo_mysql`, `xml`, `zip`.

---

## 2. Langkah Instalasi Backend (Service)

1.  Masuk ke folder backend:
    ```bash
    cd extraordinary-learning-service
    ```
2.  Install dependensi PHP:
    ```bash
    composer install
    ```
3.  Konfigurasi Environment:
    *   Copy file `.env.example` menjadi `.env`.
    *   Sesuaikan konfigurasi database:
        ```env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=extraordinary_lms
        DB_USERNAME=root
        DB_PASSWORD=
        ```
4.  Persiapan Database:
    *   Buat database bernama `extraordinary_lms` di phpMyAdmin.
    *   Jalankan migrasi dan isi data awal:
        ```bash
        php artisan migrate:fresh --seed
        ```
5.  Generate Security Keys:
    ```bash
    php artisan key:generate
    php artisan passport:install --force
    ```
6.  Jalankan Server Backend:
    ```bash
    php artisan serve
    ```
    *(Backend akan berjalan di http://127.0.0.1:8000)*

---

## 3. Langkah Instalasi Frontend (Client)

1.  Masuk ke folder frontend:
    ```bash
    cd extraordinary-learning-client
    ```
2.  Install dependensi Node.js:
    ```bash
    npm install
    ```
3.  Konfigurasi Environment:
    *   Buat file `.env`.
    *   Pastikan URL mengarah ke API Backend:
        ```env
        VUE_APP_API_URL=http://localhost:8000
        ```
4.  Jalankan Server Frontend:
    ```bash
    npm run serve
    ```
    *(Frontend akan berjalan di http://localhost:8080 atau port lain yang tersedia)*

---

## 4. Akun Login Default

Daftar akun hasil seeding dapat dilihat di file `CREDENTIALS.txt` di root project:

*   **Administrator**: `admin@shellrean.com` | Password: `criticalpassword`
*   **Guru**: `sefna@shellrean.com` | Password: `password`
*   **Siswa**: `ibrahim@shellrean.com` | Password: `password`

---

## 5. Catatan Penting Hasil Migrasi
1.  **Node.js 22**: Project ini sudah kompatibel dengan Node 22 berkat upgrade Vue CLI ke versi 5.
2.  **MySQL Compatibility**: Jika muncul error "Field doesn't have default value" di tabel lain selain `tokens`, tambahkan `->default()` atau `->nullable()` di file migrasi terkait.
3.  **Core-JS**: Proyek ini menggunakan `core-js@3.6.5` untuk menjaga kompatibilitas dengan plugin-plugin lama.

---
*Dibuat oleh Antigravity AI Coding Assistant*
