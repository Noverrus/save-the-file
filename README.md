# WASM File Converter

A high-performance, fully client-side file converter utilizing WebAssembly, Web Workers, FFmpeg, and native web APIs. Designed for absolute privacy and speed, all conversions occur seamlessly within the browser's memory—no files are uploaded to any server.

## Features

- **Total Data Privacy**: Zero server communication for file processing.
- **Smart Logic Routing**: Automatically selects the most optimal conversion engine based on format:
  - Native Canvas API for standard images (JPG, PNG, WEBP).
  - Modern Polyfills for specialized formats (HEIC, PSD).
  - WebAssembly (FFmpeg) for heavy media encoding.
- **Intelligent Memory Management**: Implementing strict `URL.revokeObjectURL()` workflows with an autonomous 1-hour memory cleanup.
- **Worker Queues**: Background Web Workers handle heavy computations without blocking the main UI thread.

## Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS
- **Local Processing**:
  - `@ffmpeg/ffmpeg` (WASM)
  - `heic2any` (HEIC parsing)
  - `ag-psd` (PSD parsing)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Contribution

1. Fork the repository
2. Create a feature branch
3. Commit your changes strictly conforming to Prettier styles (`.prettierrc.json`)
4. Open a Pull Request
