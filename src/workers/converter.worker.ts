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
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  } catch (error) {
    ffmpeg = null; // Reset so they can retry
    throw new Error("Could not download WebAssembly conversion engine (FFmpeg) from CDN. Please check your internet connection or verify network permissions.");
  }
  return ffmpeg;
}

async function convertJpegToPdf(file: File, width: number, height: number): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const binaryData = new Uint8Array(arrayBuffer);
  
  const w = width;
  const h = height;
  
  const header = `%PDF-1.4\r\n`;
  const obj1 = `1 0 obj\r\n<<\r\n  /Type /Catalog\r\n  /Pages 2 0 R\r\n>>\r\nendobj\r\n`;
  const obj2 = `2 0 obj\r\n<<\r\n  /Type /Pages\r\n  /Kids [3 0 R]\r\n  /Count 1\r\n>>\r\nendobj\r\n`;
  const obj3 = `3 0 obj\r\n<<\r\n  /Type /Page\r\n  /Parent 2 0 R\r\n  /Resources <<\r\n    /XObject << /Im1 4 0 R >>\r\n  >>\r\n  /MediaBox [0 0 ${w} ${h}]\r\n  /Contents 5 0 R\r\n>>\r\nendobj\r\n`;
  
  const obj4Header = `4 0 obj\r\n<<\r\n  /Type /XObject\r\n  /Subtype /Image\r\n  /Width ${width}\r\n  /Height ${height}\r\n  /ColorSpace /DeviceRGB\r\n  /BitsPerComponent 8\r\n  /Filter /DCTDecode\r\n  /Length ${binaryData.length}\r\n>>\r\nstream\r\n`;
  const obj4Footer = `\r\nendstream\r\nendobj\r\n`;
  
  const contentStream = `q\r\n${w} 0 0 ${h} 0 0 cm\r\n/Im1 Do\r\nQ\r\n`;
  const obj5 = `5 0 obj\r\n<< /Length ${contentStream.length} >>\r\nstream\r\n${contentStream}endstream\r\nendobj\r\n`;
  
  const encoder = new TextEncoder();
  
  const pHeader = encoder.encode(header);
  const pObj1 = encoder.encode(obj1);
  const pObj2 = encoder.encode(obj2);
  const pObj3 = encoder.encode(obj3);
  const pObj4Header = encoder.encode(obj4Header);
  const pObj4Footer = encoder.encode(obj4Footer);
  const pObj5 = encoder.encode(obj5);
  
  const offset1 = pHeader.length;
  const offset2 = offset1 + pObj1.length;
  const offset3 = offset2 + pObj2.length;
  const offset4 = offset3 + pObj3.length;
  const offset5 = offset4 + pObj4Header.length + binaryData.length + pObj4Footer.length;
  const offsetXref = offset5 + pObj5.length;
  
  const xref = `xref\r\n0 6\r\n0000000000 65535 f\r\n` +
    `${offset1.toString().padStart(10, '0')} 00000 n\r\n` +
    `${offset2.toString().padStart(10, '0')} 00000 n\r\n` +
    `${offset3.toString().padStart(10, '0')} 00000 n\r\n` +
    `${offset4.toString().padStart(10, '0')} 00000 n\r\n` +
    `${offset5.toString().padStart(10, '0')} 00000 n\r\n`;
    
  const trailer = `trailer\r\n<<\r\n  /Size 6\r\n  /Root 1 0 R\r\n>>\r\nstartxref\r\n${offsetXref}\r\n%%EOF\r\n`;
  
  const pXref = encoder.encode(xref);
  const pTrailer = encoder.encode(trailer);
  
  const blobParts = [
    pHeader,
    pObj1,
    pObj2,
    pObj3,
    pObj4Header,
    binaryData,
    pObj4Footer,
    pObj5,
    pXref,
    pTrailer
  ];
  
  return new Blob(blobParts, { type: 'application/pdf' });
}

async function convertToPdf(file: File, ext: string): Promise<Blob> {
  const imageBitmap = await createImageBitmap(file);
  const width = imageBitmap.width;
  const height = imageBitmap.height;
  
  let jpegFile = file;
  if (ext !== 'jpg' && ext !== 'jpeg') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not create canvas context");
    ctx.drawImage(imageBitmap, 0, 0);
    const jpegBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.95 });
    jpegFile = new File([jpegBlob], "temp.jpg", { type: "image/jpeg" });
  }
  
  return convertJpegToPdf(jpegFile, width, height);
}

async function convertToPsd(file: File): Promise<Blob> {
  const imageBitmap = await createImageBitmap(file);
  const w = imageBitmap.width;
  const h = imageBitmap.height;
  
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not create canvas context");
  ctx.drawImage(imageBitmap, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = imageData.data;
  
  const header = new ArrayBuffer(26);
  const view = new DataView(header);
  
  view.setUint8(0, 56);  // '8'
  view.setUint8(1, 66);  // 'B'
  view.setUint8(2, 80);  // 'P'
  view.setUint8(3, 83);  // 'S'
  
  view.setUint16(4, 1);  // Version = 1
  view.setUint16(12, 3); // Channels = 3 (RGB)
  view.setUint32(14, h); // Height
  view.setUint32(18, w); // Width
  view.setUint16(22, 8); // Depth = 8 bits
  view.setUint16(24, 3); // ColorMode = 3 (RGB)
  
  const sections = new ArrayBuffer(12);
  const sView = new DataView(sections);
  sView.setUint32(0, 0);
  sView.setUint32(4, 0);
  sView.setUint32(8, 0);
  
  const numPixels = w * h;
  const pixelData = new Uint8Array(2 + numPixels * 3);
  const pView = new DataView(pixelData.buffer);
  pView.setUint16(0, 0); // Compression = 0 (Raw plane data)
  
  let rOffset = 2;
  let gOffset = 2 + numPixels;
  let bOffset = 2 + numPixels * 2;
  
  for (let i = 0; i < pixels.length; i += 4) {
    pixelData[rOffset++] = pixels[i];
    pixelData[gOffset++] = pixels[i + 1];
    pixelData[bOffset++] = pixels[i + 2];
  }
  
  return new Blob([header, sections, pixelData], { type: 'image/vnd.adobe.photoshop' });
}

async function convertToOdd(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const binary = new Uint8Array(arrayBuffer);
  let base64 = "";
  const len = binary.byteLength;
  for (let i = 0; i < len; i += 8192) {
    base64 += String.fromCharCode.apply(null, binary.subarray(i, Math.min(i + 8192, len)) as any);
  }
  const base64Data = btoa(base64);
  const mimeType = file.type || "image/jpeg";
  
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Converted Image ODD Document</title>
      </titleStmt>
      <publicationStmt>
        <p>Generated by WASM Converter</p>
      </publicationStmt>
      <sourceDesc>
        <p>Converted from original image: ${file.name}</p>
      </sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <p>
        <graphic url="data:${mimeType};base64,${base64Data}" />
      </p>
    </body>
  </text>
</TEI>`;

  return new Blob([xmlContent], { type: 'application/xml' });
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
      if (targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'jfif') {
        mimeType = 'image/jpeg';
      } else if (targetFormat === 'pdf') {
        mimeType = 'application/pdf';
      } else if (targetFormat === 'psd' || targetFormat === 'psb') {
        mimeType = 'image/vnd.adobe.photoshop';
      } else if (targetFormat === 'odd') {
        mimeType = 'application/xml';
      } else if (targetFormat === 'eps' || targetFormat === 'ps') {
        mimeType = 'application/postscript';
      } else if (targetFormat === 'ico') {
        mimeType = 'image/x-icon';
      } else if (targetFormat === 'bmp') {
        mimeType = 'image/bmp';
      } else if (targetFormat === 'tiff' || targetFormat === 'tif') {
        mimeType = 'image/tiff';
      } else if (targetFormat === 'avif') {
        mimeType = 'image/avif';
      } else if (targetFormat === 'icns') {
        mimeType = 'image/x-icns';
      } else if (targetFormat === 'tga') {
        mimeType = 'image/x-targa';
      } else if (targetFormat === 'xcf') {
        mimeType = 'image/x-xcf';
      } else if (targetFormat === 'ppm') {
        mimeType = 'image/x-portable-pixmap';
      } else if (targetFormat === 'odg') {
        mimeType = 'application/vnd.oasis.opendocument.graphics';
      } else if (targetFormat === 'xps') {
        mimeType = 'application/vnd.ms-xpsdocument';
      } else if (targetFormat === 'pub') {
        mimeType = 'application/x-mspublisher';
      } else if (['3fr', 'arw', 'cr2', 'cr3', 'crw', 'dcr', 'dng', 'erf', 'mos', 'mrw', 'nef', 'orf', 'pef', 'raf', 'raw', 'rw2', 'x3f'].includes(targetFormat)) {
        mimeType = 'image/x-raw';
      }

      // Pre-process HEIC/HEIF to intermediate PNG
      let processedFile = file;
      let processedExt = ext;
      if (ext === 'heic' || ext === 'heif') {
        self.postMessage({ type: 'PROGRESS', id, progress: 20 } as WorkerMessageOut);
        const heic2any = (await import('heic2any')).default;
        const result = await heic2any({ blob: file, toType: 'image/png' });
        const pngBlob = Array.isArray(result) ? result[0] : result;
        processedFile = new File([pngBlob], file.name.replace(/\.(heic|heif)$/i, '.png'), { type: 'image/png' });
        processedExt = 'png';
      }

      // --- ROUTE 1: Custom native pure JS converters ---
      if (targetFormat === 'pdf') {
        self.postMessage({ type: 'PROGRESS', id, progress: 40 } as WorkerMessageOut);
        blobResponse = await convertToPdf(processedFile, processedExt);
      } else if (targetFormat === 'psd') {
        self.postMessage({ type: 'PROGRESS', id, progress: 40 } as WorkerMessageOut);
        blobResponse = await convertToPsd(processedFile);
      } else if (targetFormat === 'odd') {
        self.postMessage({ type: 'PROGRESS', id, progress: 40 } as WorkerMessageOut);
        blobResponse = await convertToOdd(processedFile);
      }
      // --- ROUTE 2: Native Browser Canvas capabilities for standard web formats ---
      else if (['png', 'webp', 'jpg', 'jpeg', 'avif', 'bmp'].includes(targetFormat) && ['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(processedExt)) {
        self.postMessage({ type: 'PROGRESS', id, progress: 30 } as WorkerMessageOut);
        
        const imageBitmap = await createImageBitmap(processedFile);
        
        if (imageBitmap.width * imageBitmap.height > 50000000 && memoryCapacity <= 4) {
             throw new Error('Image too large for device memory.');
        }

        self.postMessage({ type: 'PROGRESS', id, progress: 60 } as WorkerMessageOut);
        
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(imageBitmap, 0, 0);
           try {
             blobResponse = await canvas.convertToBlob({ type: mimeType, quality: 0.95 });
           } catch (err) {
             // Fall through to FFmpeg WASM if canvas fails or is not supported (e.g. avif in some browsers)
             blobResponse = null;
           }
        }
      }

      // --- ROUTE 3: FFmpeg WASM for heavy/media and advanced fallback formats ---
      if (!blobResponse) {
        self.postMessage({ type: 'PROGRESS', id, progress: 30 } as WorkerMessageOut);
        const ff = await getFFmpeg();
        
        const inputName = `input.${processedExt || 'img'}`;
        const outputName = `output.${targetFormat}`;
        
        await ff.writeFile(inputName, await fetchFile(processedFile));
        
        self.postMessage({ type: 'PROGRESS', id, progress: 65 } as WorkerMessageOut);
        
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
