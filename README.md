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

### Image Converter Details
Mengonversi dan mengoptimasi berbagai format gambar standar.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Gambar** | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif`, `.bmp`, `.gif`, `.tif`, `.tiff` | `.webp`, `.png`, `.jpg`, `.gif` | Pemrosesan di latar belakang menggunakan Web Worker & Canvas API luring. |

</details>

<details>
<summary><b>📄 Document Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Document Converter Details
Menggabungkan barisan gambar atau manuskrip mentah menjadi file dokumen PDF terkompilasi.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Dokumen** | Gambar (`.jpg`, `.png`, `.webp`, dll.) atau draf manuskrip teks lurus (`.txt`) | `.pdf` | Menggunakan jsPDF secara luring untuk menyusun tata urutan halaman, orientasi, dan margin dokumen. |

</details>

<details>
<summary><b>🎥 Video & Audio Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Video & Audio Converter Details
Mengonversi berkas video dan audio populer dengan presisi tinggi.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Multimedia** | `.mp4`, `.webm`, `.avi`, `.mov`, `.mkv`, `.wmv`, `.flv`, `.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`, `.flac` | `.mp4`, `.webm`, `.avi`, `.mp3`, `.wav` | Menjalankan mesin biner FFmpeg WebAssembly (`@ffmpeg/ffmpeg`) langsung dalam memori browser secara berurutan. |

</details>

<details>
<summary><b>📦 Archive Manager</b> (Click to expand / Klik untuk membuka)</summary>

### Archive Manager Details
Mengompresi sekumpulan berkas menjadi format ZIP atau mengekstrak isi file arsip ZIP secara luring.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Arsip** | File digital apa pun (kompresi) ATAU dokumen `.zip` (ekstraksi) | `.zip` terkompresi atau berkas hasil ekstraksi asli | Menggunakan JSZip untuk pengompresan cepat tanpa batas payload upload server. |

</details>

<details>
<summary><b>📐 CAD Vector Converter</b> (Click to expand / Klik untuk membuka)</summary>

### CAD Vector Converter Details
Mengurai entitas garis cetak biru CAD untuk digambar ke kanvas interaktif dan diekspor.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **CAD** | `.dxf` (AutoCAD Standard), `.svg` | `.png`, `.pdf` (vektor), `.svg` | Pembacaan matematika entitas kurva dan garis ke HTML5 Canvas dilengkapi kontrol zoom & pan. |

</details>

<details>
<summary><b>📚 Ebook Publisher</b> (Click to expand / Klik untuk membuka)</summary>

### Ebook Publisher Details
Menyusun naskah digital Anda menjadi buku elektronik EPUB yang siap dipublikasikan.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **E-book** | `.txt`, `.md`, `.html` (naskah bab) | `.epub`, `.pdf`, `.txt` | Membuntal struktur manifest e-book EPUB valid yang siap dibaca di Google Books, Apple Books, dan Kindle. |

</details>

<details>
<summary><b>🔤 Font CSS Packager</b> (Click to expand / Klik untuk membuka)</summary>

### Font CSS Packager Details
Menganalisis rupa huruf tipografi Anda dan membuat file stylesheet `@font-face` siap pakai.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Tipografi** | `.ttf`, `.otf`, `.woff`, `.woff2` | Pratinjau interaktif & Bundel berkas `@font-face` CSS | Menggunakan FontFace API browser secara real-time untuk merender huruf secara luring. |

</details>

<details>
<summary><b>📊 Presentation Slideshow</b> (Click to expand / Klik untuk membuka)</summary>

### Presentation Slideshow Details
Membuat draf presentasi minimalis rasio 16:9 dan mengekspornya ke PDF resolusi tinggi.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Presentasi** | Judul, subjudul, teks isi, dan warna tema slide | `.pdf` (Widescreen 16:9) | Menggunakan generator koordinat canvas jsPDF luring untuk tata letak presentasi instan. |

</details>

<details>
<summary><b>📋 Spreadsheet & Data Converter</b> (Click to expand / Klik untuk membuka)</summary>

### Spreadsheet & Data Converter Details
Mengonversi format tabular koma menjadi format JSON terstruktur untuk pemrograman.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Data** | `.csv` (koma/titik-koma) ATAU berkas `.json` (array objek) | `.json` (terstruktur) ATAU `.csv` | Penguraian teks data secara instan di sisi klien untuk melindungi rahasia data perusahaan. |

</details>

<details>
<summary><b>📈 Vector Rasterizer</b> (Click to expand / Klik untuk membuka)</summary>

### Vector Rasterizer Details
Mengubah gambar kurva vektor SVG menjadi format piksel raster jernih dengan kontrol kualitas.

| Kategori | Format Input (Converts From) | Format Output (Converts To) | Mekanisme |
| --- | --- | --- | --- |
| **Vektor** | `.svg` | `.png`, `.jpg`, `.webp`, `.pdf` | Mendukung faktor penskalaan (scale multiplier) dari 1x hingga 4x untuk menjaga ketajaman resolusi kurva SVG. |

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
