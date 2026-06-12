# Bookplan - Perencanaan Keuangan Syariah (Web App)

Aplikasi web interaktif untuk Bookplan Perencanaan Keuangan Syariah
(Mata Kuliah EKS124507). Dibuat dengan React + Vite.

## Menjalankan secara lokal

Pastikan Node.js (versi 18+) sudah terinstall, lalu jalankan:

```bash
npm install
npm run dev
```

Buka link yang muncul di terminal (biasanya http://localhost:5173).

## Build untuk produksi

```bash
npm run build
```

Hasilnya ada di folder `dist/` - folder ini yang diupload ke hosting statis mana pun.

---

## Cara Deploy Jadi Website Publik

### Opsi 1: Vercel (disarankan, paling mudah)

1. Buat akun gratis di https://vercel.com (bisa login dengan GitHub/Google).
2. Upload folder project ini ke GitHub (buat repo baru, lalu push semua file).
3. Di dashboard Vercel, klik "Add New Project", pilih repo tersebut.
4. Vercel akan otomatis mendeteksi project Vite. Klik "Deploy".
5. Setelah selesai (1-2 menit), kamu akan mendapat link publik seperti:
   `https://bookplan-perencanaan-keuangan-syariah.vercel.app`

### Opsi 2: Netlify

1. Buat akun gratis di https://netlify.com.
2. Jalankan `npm run build` di komputer, lalu drag-and-drop folder `dist/`
   ke halaman "Deploys" Netlify (Netlify Drop).
3. Netlify langsung memberi link publik, contoh:
   `https://nama-acak.netlify.app`

### Opsi 3: StackBlitz (tanpa install apapun)

1. Buka https://stackblitz.com, klik "Create" > "Import from GitHub"
   (jika sudah diupload ke GitHub), atau buat project React/Vite baru
   lalu salin isi `src/App.jsx`, `src/main.jsx`, `index.html`,
   `package.json`, dan `vite.config.js` dari folder ini.
2. StackBlitz akan menjalankan preview otomatis.
3. Klik tombol "Deploy" di pojok kanan atas, pilih "Deploy to Netlify"
   untuk mendapatkan link publik.

### Opsi 4: GitHub Pages

1. Push project ini ke repo GitHub.
2. Tambahkan `base: '/nama-repo/'` pada `vite.config.js`.
3. Jalankan `npm run build`, lalu deploy folder `dist/` ke branch
   `gh-pages` (bisa menggunakan package `gh-pages`:
   `npm install -D gh-pages` lalu tambahkan script
   `"deploy": "gh-pages -d dist"` di package.json, kemudian
   `npm run build && npm run deploy`).
4. Aktifkan GitHub Pages di Settings repo, pilih branch `gh-pages`.

---

## Catatan

- Aplikasi ini bersifat front-end only, data tidak tersimpan permanen
  (akan hilang jika browser di-refresh). Untuk menyimpan data,
  gunakan versi Excel Bookplan.
- Tema warna (peach/orange) konsisten dengan Bookplan.xlsx.
- Seluruh perhitungan (rasio keuangan, anggaran, dana darurat, TVM,
  investasi, pensiun, ZISWAF, dashboard) berjalan otomatis di sisi
  client (browser).
