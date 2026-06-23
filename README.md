# Image Batch Converter Pro

A high-performance file media converter built with React (Vite) as a 100% Client-Side, Privacy-First application. This application uses a single Local Browser Engine architecture abandoning all server costs and payload limitations.

1. **Local Browser Engine**: Heavy lifting is done on the client side using Web Workers, Canvas APIs, and WebAssembly (WASM via FFmpeg), processing standard images and heavy media formats entirely locally to preserve privacy and reduce server costs.
2. **Absolute Privacy**: Files never upload anywhere. The processing happens strictly inside your device's memory. Unsafe or extremely obscure vector formats are gracefully rejected to preserve performance and privacy.

![App Setup State](https://img.shields.io/badge/Architecture-React%20%2B%20Vite%20%2B%20WASM-blue)

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
