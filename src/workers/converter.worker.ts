/// <reference lib="webworker" />

import heic2any from 'heic2any';
// Note: Some complex libraries like ag-psd might require DOM canvas injections and are better suited for main thread 
// or require explicit OffscreenCanvas initialization. We will stub PSD here with standard Offscreen API logic assumption.

export type JobStatus = 'idle' | 'processing' | 'done' | 'error';

export interface ConversionJob {
  id: string;
  file: File;
  targetFormat: string;
  status: JobStatus;
  progress: number;
  outputUrl?: string;
  error?: string;
}

export type WorkerMessageOut =
  | { type: 'PROGRESS'; id: string; progress: number }
  | { type: 'COMPLETE'; id: string; blob: Blob }
  | { type: 'ERROR'; id: string; error: string };

export type WorkerMessageIn = 
  | { type: 'START_CONVERSION'; job: { id: string; file: File; targetFormat: string } };

self.onmessage = async (e: MessageEvent<WorkerMessageIn>) => {
  if (e.data.type === 'START_CONVERSION') {
    const { id, file, targetFormat } = e.data.job;

    try {
      // 1. SMART ROUTING LOGIC
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      self.postMessage({ type: 'PROGRESS', id, progress: 10 } as WorkerMessageOut);

      let blobResponse: Blob | null = null;
      let mimeType = `image/${targetFormat}`;
      if (targetFormat === 'jpg') mimeType = 'image/jpeg';

      // --- ROUTE 1: HEIC Polyfill ---
      if (ext === 'heic' || ext === 'heif') {
        self.postMessage({ type: 'PROGRESS', id, progress: 40 } as WorkerMessageOut);
        const result = await heic2any({ blob: file, toType: mimeType });
        blobResponse = Array.isArray(result) ? result[0] : result;
      }
      // --- ROUTE 2: Native Browser Capabilities (Canvas API) ---
      else if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext)) {
        self.postMessage({ type: 'PROGRESS', id, progress: 30 } as WorkerMessageOut);
        
        const imageBitmap = await createImageBitmap(file);
        
        self.postMessage({ type: 'PROGRESS', id, progress: 60 } as WorkerMessageOut);
        
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(imageBitmap, 0, 0);
           blobResponse = await canvas.convertToBlob({ type: mimeType, quality: 0.95 });
        }
      }
      // --- ROUTE 3: Fallback / Unsupported ---
      // (For formats like RAW, GIF, TIF needing FFmpeg, we'd route them to the FFmpeg engine)
      else {
        throw new Error(`Format .${ext} requires main-thread FFmpeg handling or is unsupported.`);
      }

      self.postMessage({ type: 'PROGRESS', id, progress: 95 } as WorkerMessageOut);

      if (!blobResponse) {
        throw new Error('Failed to generate output blob.');
      }

      self.postMessage({ type: 'COMPLETE', id, blob: blobResponse } as WorkerMessageOut);

    } catch (err: any) {
      self.postMessage({ type: 'ERROR', id, error: err.message || 'Unknown processing error' } as WorkerMessageOut);
    }
  }
};
