/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export type JobStatus = 'idle' | 'queued' | 'processing' | 'done' | 'error';

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

let ffmpeg: FFmpeg | null = null;

async function getFFmpeg() {
  if (ffmpeg) return ffmpeg;
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  return ffmpeg;
}

self.onmessage = async (e: MessageEvent<WorkerMessageIn>) => {
  if (e.data.type === 'START_CONVERSION') {
    const { id, file, targetFormat } = e.data.job;

    try {
      const memoryCapacity = (navigator as any).deviceMemory || 8;
      
      if (memoryCapacity <= 2 && file.size > 200 * 1024 * 1024) {
        throw new Error('File too large for available device memory.');
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      self.postMessage({ type: 'PROGRESS', id, progress: 10 } as WorkerMessageOut);

      let blobResponse: Blob | null = null;
      let mimeType = `image/${targetFormat}`;
      if (targetFormat === 'jpg') mimeType = 'image/jpeg';

      // --- ROUTE 1: HEIC Polyfill ---
      if (ext === 'heic' || ext === 'heif') {
        self.postMessage({ type: 'PROGRESS', id, progress: 40 } as WorkerMessageOut);
        const heic2any = (await import('heic2any')).default;
        const result = await heic2any({ blob: file, toType: mimeType });
        blobResponse = Array.isArray(result) ? result[0] : result;
      }
      // --- ROUTE 2: Native Browser Capabilities (Canvas API) ---
      else if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext)) {
        self.postMessage({ type: 'PROGRESS', id, progress: 30 } as WorkerMessageOut);
        
        const imageBitmap = await createImageBitmap(file);
        
        if (imageBitmap.width * imageBitmap.height > 50000000 && memoryCapacity <= 4) {
             throw new Error('Image too large for device memory.');
        }

        self.postMessage({ type: 'PROGRESS', id, progress: 60 } as WorkerMessageOut);
        
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(imageBitmap, 0, 0);
           blobResponse = await canvas.convertToBlob({ type: mimeType, quality: 0.95 });
        }
      }
      // --- ROUTE 3: FFmpeg WASM for heavy/media formats ---
      else {
        self.postMessage({ type: 'PROGRESS', id, progress: 20 } as WorkerMessageOut);
        const ff = await getFFmpeg();
        
        const inputName = `input.${ext || 'img'}`;
        const outputName = `output.${targetFormat}`;
        
        await ff.writeFile(inputName, await fetchFile(file));
        
        self.postMessage({ type: 'PROGRESS', id, progress: 60 } as WorkerMessageOut);
        
        await ff.exec(['-i', inputName, outputName]);
        
        const fileData = await ff.readFile(outputName);
        blobResponse = new Blob([(fileData as Uint8Array).buffer], { type: mimeType });
        
        // Cleanup memory
        await ff.deleteFile(inputName);
        await ff.deleteFile(outputName);
      }

      self.postMessage({ type: 'PROGRESS', id, progress: 95 } as WorkerMessageOut);

      if (!blobResponse) {
        throw new Error('Failed to generate output file.');
      }

      self.postMessage({ type: 'COMPLETE', id, blob: blobResponse } as WorkerMessageOut);

    } catch (err: any) {
      const errorMsg = err.message || 'Unknown processing error. Ensure file is not corrupted.';
      self.postMessage({ type: 'ERROR', id, error: errorMsg } as WorkerMessageOut);
    }
  }
};
