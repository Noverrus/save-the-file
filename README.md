# WASM File Converter

A high-performance, 100% client-side offline file converter. Supports multiple document, media, archive, sheet, vector, and CAD formats using a single, secure Local Browser Sandbox model. 

Written with **React**, **Vite**, **TypeScript**, and **WebAssembly**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?logo=webassembly&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007800?logo=ffmpeg&logoColor=white)

## Features

- **100% Client-Side Engine**: Heavy processing is executed inside your browser using WebWorkers, HTML5 Canvas, and WebAssembly (via FFmpeg WASM) with zero server-side storage or API latency.
- **Privacy First Sandbox**: Files are never uploaded. Everything is handled inside the volatile sandbox memory of your device.
- **Sequential Queue System**: Large multi-job operations run in serial tasks, ensuring RAM stability and preventing browser crashes.
- **Auto Memory Purge**: Secure client-side garbage cleanup removes volatile memory blobs after 1 hour.

---

## 🛠️ Panduan Format yang Didukung (Collapsible / Gunakan Panah untuk Membaca)

Silakan klik setiap kategori konverter di bawah ini untuk melihat detail format file asal yang didukung dan format tujuan hasil konversinya.

<details>
<summary><b>🖼️ Image Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Konversi Gambar (Image Flows)

<details>
<summary><b>Image --> PNG --> JPG, WEBP, GIF</b></summary>

- **Format Asal**: `.png`
- **Format Hasil**: `.jpg`, `.webp`, `.gif`
- **Detail**: Mengonversi file PNG transparan maupun opak menjadi JPG berkualitas tinggi, WEBP ultra terkompresi, atau GIF luring.
</details>

<details>
<summary><b>Image --> JPG / JPEG --> PNG, WEBP, GIF</b></summary>

- **Format Asal**: `.jpg`, `.jpeg`
- **Format Hasil**: `.png`, `.webp`, `.gif`
- **Detail**: Mengonversi gambar JPEG/JPG standar menjadi PNG tanpa penurunan kualitas (lossless), WEBP modern, atau animasi GIF tunggal.
</details>

<details>
<summary><b>Image --> WEBP --> PNG, JPG, GIF</b></summary>

- **Format Asal**: `.webp`
- **Format Hasil**: `.png`, `.jpg`, `.gif`
- **Detail**: Mendekompresi gambar WEBP modern menjadi PNG berkualitas tinggi atau JPG standar secara offline.
</details>

<details>
<summary><b>Image --> HEIC / HEIF --> PNG, JPG, WEBP, GIF</b></summary>

- **Format Asal**: `.heic`, `.heif`
- **Format Hasil**: `.png`, `.jpg`, `.webp`, `.gif`
- **Detail**: Membongkar format gambar Apple HEIC berdefinisi tinggi langsung di browser menjadi format ramah web luring.
</details>

<details>
<summary><b>Image --> BMP --> PNG, JPG, WEBP, GIF</b></summary>

- **Format Asal**: `.bmp`
- **Format Hasil**: `.png`, `.jpg`, `.webp`, `.gif`
- **Detail**: Mengubah gambar Bitmap mentah menjadi format web terkompresi.
</details>

<details>
<summary><b>Image --> GIF --> PNG, JPG, WEBP</b></summary>

- **Format Asal**: `.gif`
- **Format Hasil**: `.png`, `.jpg`, `.webp`
- **Detail**: Mengekstrak atau mengubah berkas GIF menjadi gambar statis berkinerja tinggi.
</details>

<details>
<summary><b>Image --> TIFF / TIF --> PNG, JPG, WEBP, GIF</b></summary>

- **Format Asal**: `.tiff`, `.tif`
- **Format Hasil**: `.png`, `.jpg`, `.webp`, `.gif`
- **Detail**: Mengonversi format gambar TIFF cetak berkualitas tinggi menjadi format yang kompatibel dengan browser.
</details>

</details>

<details>
<summary><b>📄 Document Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Konversi Dokumen (Document Flows)

<details>
<summary><b>Document --> Gambar (PNG, JPG, BMP) --> PDF Dokumen Terpadu</b></summary>

- **Format Asal**: `.png`, `.jpg`, `.jpeg`, `.bmp`
- **Format Hasil**: `.pdf`
- **Detail**: Menyusun beberapa lembar gambar cetak/pindaian menjadi berkas laporan PDF terpadu luring.
</details>

<details>
<summary><b>Document --> Teks Polos (.txt) --> PDF Dokumen Terpadu</b></summary>

- **Format Asal**: `.txt`
- **Format Hasil**: `.pdf`
- **Detail**: Mengemas draf manuskrip polos teks lurus menjadi berkas tata letak PDF modern.
</details>

</details>

<details>
<summary><b>🎥 Video & Audio Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Konversi Multimedia (Video & Audio Flows)

<details>
<summary><b>Video --> MP4 --> WEBM, AVI, MP3, WAV</b></summary>

- **Format Asal**: `.mp4`
- **Format Hasil**: `.webm`, `.avi`, `.mp3`, `.wav`
- **Detail**: Mengekstrak klip audio MP3 atau mengubah format video wadah MP4 ke WEBM berkecepatan tinggi.
</details>

<details>
<summary><b>Video --> WEBM --> MP4, AVI, MP3, WAV</b></summary>

- **Format Asal**: `.webm`
- **Format Hasil**: `.mp4`, `.avi`, `.mp3`, `.wav`
- **Detail**: Mengonversi video ramah web WEBM ke format biner MP4 universal.
</details>

<details>
<summary><b>Video --> AVI --> MP4, WEBM, MP3, WAV</b></summary>

- **Format Asal**: `.avi`
- **Format Hasil**: `.mp4`, `.webm`, `.mp3`, `.wav`
- **Detail**: Mengompilasi video AVI lama ke kompresi modern H.264 MP4 atau audio saja.
</details>

<details>
<summary><b>Video --> MOV / MKV --> MP4, WEBM, MP3, WAV</b></summary>

- **Format Asal**: `.mov`, `.mkv`
- **Format Hasil**: `.mp4`, `.webm`, `.mp3`, `.wav`
- **Detail**: Membuka wadah multimedia Apple MOV atau mkv luring untuk dikompresi.
</details>

<details>
<summary><b>Audio --> MP3, WAV, FLAC, AAC, M4A --> MP3, WAV</b></summary>

- **Format Asal**: `.mp3`, `.wav`, `.flac`, `.aac`, `.m4a`
- **Format Hasil**: `.mp3`, `.wav`
- **Detail**: Mengompresi format audio lossless atau lossy ke tingkat bit rate target.
</details>

</details>

<details>
<summary><b>📦 Archive Manager</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Manajemen Arsip (Archive Flows)

<details>
<summary><b>Archive --> Semua File Digital --> Arsip Terkompresi ZIP</b></summary>

- **Format Asal**: Semua jenis file digital
- **Format Hasil**: `.zip` terkompresi
- **Detail**: Mengemas banyak file sekaligus menjadi satu bundel ZIP terkompresi secara offline.
</details>

<details>
<summary><b>Archive --> Berkas ZIP --> Ekstraksi File Asli</b></summary>

- **Format Asal**: `.zip`
- **Format Hasil**: Ekstraksi berkas asli di dalamnya
- **Detail**: Mengekstrak isi dari berkas ZIP langsung ke sistem memori browser untuk diunduh terpisah.
</details>

</details>

<details>
<summary><b>📐 CAD Vector Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Konversi CAD (CAD Flows)

<details>
<summary><b>CAD --> DXF (AutoCAD Blueprint) --> PNG, PDF, SVG</b></summary>

- **Format Asal**: `.dxf`
- **Format Hasil**: `.png`, `.pdf` (vektor), `.svg`
- **Detail**: Membaca garis kurva koordinat kartesius dan merendernya ke format visual.
</details>

<details>
<summary><b>CAD --> SVG (Scalable Vector) --> PNG, PDF</b></summary>

- **Format Asal**: `.svg`
- **Format Hasil**: `.png`, `.pdf`
- **Detail**: Merender garis vektor mentah menjadi format gambar bitmap piksel atau PDF cetak.
</details>

</details>

<details>
<summary><b>📚 Ebook Publisher</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Penerbitan E-book (Ebook Flows)

<details>
<summary><b>Ebook --> TXT / MD / HTML --> EPUB (Standard Ebook)</b></summary>

- **Format Asal**: `.txt`, `.md`, `.html`
- **Format Hasil**: `.epub`
- **Detail**: Mengemas naskah bab per bab lengkap dengan file cover menjadi berkas buku digital standar e-reader.
</details>

<details>
<summary><b>Ebook --> TXT / MD --> PDF Dokumen, TXT Bersih</b></summary>

- **Format Asal**: `.txt`, `.md`
- **Format Hasil**: `.pdf`, `.txt`
- **Detail**: Mengekspor draf tulisan menjadi layout PDF siap cetak atau file teks terformat.
</details>

</details>

<details>
<summary><b>🔤 Font CSS Packager</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Pemaketan Font (Font Flows)

<details>
<summary><b>Font --> TTF / OTF --> CSS @font-face & Pratinjau</b></summary>

- **Format Asal**: `.ttf`, `.otf`
- **Format Hasil**: `@font-face` CSS & Pratinjau interaktif
- **Detail**: Menganalisis rupa huruf tipografi Anda dan membuat file stylesheet @font-face siap pakai luring.
</details>

<details>
<summary><b>Font --> WOFF / WOFF2 --> CSS @font-face & Pratinjau</b></summary>

- **Format Asal**: `.woff`, `.woff2`
- **Format Hasil**: `@font-face` CSS & Pratinjau interaktif
- **Detail**: Mengonverifikasi font web agar kompatibel dengan peramban lama atau modern.
</details>

</details>

<details>
<summary><b>📊 Presentation Slideshow</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Presentasi Slide (Presentation Flows)

<details>
<summary><b>Presentation --> Draf Slide Editor --> Slide PDF (16:9)</b></summary>

- **Format Asal**: Judul, subjudul, teks isi, warna tema
- **Format Hasil**: `.pdf` widescreen (16:9)
- **Detail**: Membuat dokumen draf presentasi widescreen lalu mengonversinya langsung menjadi berkas dokumen PDF tajam.
</details>

</details>

<details>
<summary><b>📋 Spreadsheet & Data Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Konversi Spreadsheet & Data (Data Flows)

<details>
<summary><b>Spreadsheet --> CSV --> JSON Terstruktur (Array)</b></summary>

- **Format Asal**: `.csv`
- **Format Hasil**: `.json` (array objek)
- **Detail**: Mengonversi data tabular dari Microsoft Excel ke data array JSON siap pakai untuk integrasi API.
</details>

<details>
<summary><b>Spreadsheet --> JSON (Array of Objects) --> CSV Tabular</b></summary>

- **Format Asal**: `.json`
- **Format Hasil**: `.csv`
- **Detail**: Mengonversi format data raw JSON menjadi berkas spreadsheet CSV terformat koma.
</details>

</details>

<details>
<summary><b>📈 Vector Rasterizer</b> (Click to expand / Klik untuk membuka)</summary>

### Aliran Rasterisasi Vektor (Vector Flows)

<details>
<summary><b>Vector --> SVG --> PNG, JPG, WEBP, PDF</b></summary>

- **Format Asal**: `.svg`
- **Format Hasil**: `.png`, `.jpg`, `.webp`, `.pdf`
- **Detail**: Meraster berkas SVG tajam menjadi gambar piksel raster (lossy/lossless) dengan kontrol pengali ketajaman hingga 4x lipat.
</details>

</details>

---

## 🚀 Deployment

Sistem ini bersifat **Client-Side Pure Static App**, sehingga dapat di-host secara gratis di platform static hosting seperti GitHub Pages, Vercel, Netlify, atau Cloudflare Pages.

### Menjalankan Docker lokal (Opsional)
Aplikasi dikemas dalam container luring mandiri:

```bash
docker run -d -p 3000:3000 wasm-file-converter
```

---

## 🛠️ Development

Untuk memulai pengembangan lokal di komputer Anda:

1. **Instal dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

3. **Kompilasi produksi**:
   ```bash
   npm run build
   ```

---

## 📝 Lisensi

**Copyright (c) 2026 Noverrus Dev. Hak Cipta Dilindungi Undang-Undang.**

Penggunaan komersial dilarang keras. Segala proses berjalan 100% pada peranti keras pengguna secara luring untuk privasi yang absolut.
