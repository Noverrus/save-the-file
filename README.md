# Image Batch Converter Pro

A high-performance file media converter built with React (Vite) as a 100% Client-Side, Privacy-First application. This application uses a single Local Browser Engine architecture abandoning all server costs and payload limitations.

1. **Local Browser Engine**: Heavy lifting is done on the client side using Web Workers, Canvas APIs, and WebAssembly (WASM via FFmpeg), processing standard images and heavy media formats entirely locally to preserve privacy and reduce server costs.
2. **Absolute Privacy**: Files never upload anywhere. The processing happens strictly inside your device's memory. Unsafe or extremely obscure vector formats are gracefully rejected to preserve performance and privacy.

![App Setup State](https://img.shields.io/badge/Architecture-React%20%2B%20Vite%20%2B%20WASM-blue)

## Supported Offline Formats

Hanya format offline yang aman dan umum digunakan yang didukung. Format yang tidak didukung atau format vektor yang tidak direkomendasikan (seperti `.wmz`, `.wmf`, `.eps`, `.djv`) **ditolak secara otomatis** pada antarmuka upload file untuk menjaga performa dan memori perangkat.

**Image Conversions**:
- **Format Input (Diterima)**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif`, `.bmp`, `.gif`, `.tif`, `.tiff`
- **Format Output (Dihasilkan)**: `.webp`, `.png`, `.jpg`, `.gif`

**Media Conversions (Video & Audio)**:
- **Format Input (Diterima)**: `.mp4`, `.webm`, `.avi`, `.mov`, `.mkv`, `.wmv`, `.flv`, `.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`, `.flac`
- **Format Output (Dihasilkan)**: `.mp4`, `.webm`, `.avi`, `.mp3`, `.wav`

## Core Technologies

Website ini menggunakan teknologi mutakhir untuk konversi berbasis pada sisi klien sepenuhnya (WebAssembly dan Canvas API).

- **React + Vite**: Menghadirkan antarmuka (Frontend) yang sangat modern dan cepat.
- **Web Workers**: Mengaktifkan kemampuan pemrosesan multithreading yang memisahkan rendering antarmuka dari konversi gambar/media berbeban berat agar UI tidak freeze.
- **WebAssembly via FFmpeg (`@ffmpeg/ffmpeg`)**: Menjalankan file biner engine media konversi secara natif dan offline langsung di dalam memori sandbox web browser pengguna. Dilengkapi mode Queue sekuensial yang mengamankan memori saat memroses video berukuran besar.
- **HTML5 Canvas API / jsPDF**: Digunakan untuk ekstraksi dokumen dan pembuatan file PDF gabungan secara instan, sepenuhnya di klien.
- **JSZip**: Memberikan kemampuan Bulk Export (Download All as ZIP) dalam satu kali klik.

## New Pro Features Rollout
* **Document Converter Engine**: Menggabungkan ribuan gambar atau dokumen teks sederhana ke dalam format `.pdf` dalam hitungan milidetik secara offline. 
* **Media Batch Mode**: Pemrosesan video bertahap dengan kontrol Kompresi Lanjutan (High, Medium, Low `-crf` parameters).
* **ZIP Archive Exporter**: Zipping semua hasil konversi ke satu file arsip yang terkompres rapi untuk menghemat waktu.

## Architecture Overview

- **Frontend (React + Vite)**: Provides a drag-and-drop interface, managing a local queue of jobs via background Web Workers.
- **Web Workers**: Enables true multithreaded processing, separating UI rendering from heavy image encoding/decoding.
- **Pure Client-Side**: 100% offline-capable rendering with zero backend node processes required.

## Code Directory Flow

- `/src/pages/ImageConverter.tsx`: Advanced UI tracking conversion jobs.
- `/src/workers/converter.worker.ts`: Web Worker script mapping standard processing and leveraging WebAssembly capabilities safely off the main JS thread.

## Initial Setup & Initialization

### Run Local Environment
```bash
# Sync platform dependencies
npm install

# Start local React/Vite dev stream
npm run dev
```

## Licensing

**Copyright (c) 2026 Noverrus Dev. Hak Cipta Dilindungi Undang-Undang.**

Please see the `LICENSE` file for usage restrictions. Commercial use is strictly prohibited.
