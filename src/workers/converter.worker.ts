/// <reference lib="webworker" />

import heic2any from 'heic2any';

export type JobStatus = 'idle' | 'queued' | 'processing' | 'done' | 'error' | 'cloud_fallback_required';

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
  | { type: 'ERROR'; id: string; error: string; requiresCloudFallback: boolean };

export type WorkerMessageIn = 
  | { type: 'START_CONVERSION'; job: { id: string; file: File; targetFormat: string } };

self.onmessage = async (e: MessageEvent<WorkerMessageIn>) => {
  if (e.data.type === 'START_CONVERSION') {
    const { id, file, targetFormat } = e.data.job;

    try {
      // 1. SMART ROUTING & LOW-END DEVICE CHECKS
      // `navigator.deviceMemory` may be undefined on some browsers, fallback to 8 if so.
      const memoryCapacity = (navigator as any).deviceMemory || 8;
      
      // If file is > 100MB and memory is 4GB or less, immediately fallback to cloud to prevent OOM
      if (memoryCapacity <= 4 && file.size > 100 * 1024 * 1024) {
        throw new Error('MEMORY_LIMIT_EXCEEDED');
      }

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
        
        // Massive image check to prevent Canvas OOM
        if (imageBitmap.width * imageBitmap.height > 50000000 && memoryCapacity <= 4) {
             throw new Error('CANVAS_DIMENSION_LIMIT_EXCEEDED');
        }

        self.postMessage({ type: 'PROGRESS', id, progress: 60 } as WorkerMessageOut);
        
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(imageBitmap, 0, 0);
           blobResponse = await canvas.convertToBlob({ type: mimeType, quality: 0.95 });
        }
      }
      // --- ROUTE 3: Fallback / Unsupported ---
      else {
        // Formats needing heavy lifting like RAW/TIFF would fall here.
        // We simulate a strict memory boundary by throwing to the cloud fallback for heavy files.
        throw new Error('UNSUPPORTED_FORMAT_LOCAL');
      }

      self.postMessage({ type: 'PROGRESS', id, progress: 95 } as WorkerMessageOut);

      if (!blobResponse) {
        throw new Error('BLOB_GENERATION_FAILED');
      }

      self.postMessage({ type: 'COMPLETE', id, blob: blobResponse } as WorkerMessageOut);

    } catch (err: any) {
      const errorMsg = err.message || 'Unknown processing error';
      const requiresCloudFallback = ['MEMORY_LIMIT_EXCEEDED', 'CANVAS_DIMENSION_LIMIT_EXCEEDED', 'UNSUPPORTED_FORMAT_LOCAL', 'Out of memory'].includes(errorMsg);
      self.postMessage({ type: 'ERROR', id, error: errorMsg, requiresCloudFallback } as WorkerMessageOut);
    }
  }
};
