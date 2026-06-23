import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, FileImage, Download, Loader2, AlertCircle, Trash2, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversionJob, WorkerMessageOut } from "@/workers/converter.worker.ts";

const MAX_CONCURRENT_JOBS = 2; // Prevent OOM by limiting concurrent processing
const MEMORY_TIMEOUT_MS = 3600000; // 1 hour memory limit
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'bmp', 'gif', 'tif', 'tiff'];

export function ImageConverter() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  // Initialize Worker
  useEffect(() => {
    // Standard Vite module worker import
    workerRef.current = new Worker(new URL('../workers/converter.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onerror = (e) => {
      console.error("Worker error:", e);
    };

    workerRef.current.onmessage = (e: MessageEvent<WorkerMessageOut>) => {
      const { type, id } = e.data;
      
      setJobs(currentJobs => currentJobs.map(job => {
        if (job.id !== id) return job;

        switch (type) {
          case 'PROGRESS':
            return { ...job, progress: e.data.progress };
          case 'COMPLETE':
            // Generate Object URL that must be manually revoked to prevent leaks
            const url = URL.createObjectURL(e.data.blob);
            return { ...job, status: 'done', progress: 100, outputUrl: url };
          case 'ERROR':
            return { ...job, status: 'error', error: e.data.error, progress: 0 };
          default:
            return job;
        }
      }));
    };

    return () => {
      workerRef.current?.terminate();
      jobs.forEach(job => {
        if (job.outputUrl) URL.revokeObjectURL(job.outputUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global Memory Cleanup Timer (1 Hour after any successful job)
  useEffect(() => {
    const hasCompletes = jobs.some(j => j.status === 'done');
    
    if (hasCompletes && timeLeft === null) {
      setTimeLeft(MEMORY_TIMEOUT_MS);
    } else if (!hasCompletes) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1000) {
          clearInterval(interval);
          handleClearAll();
          return null;
        }
        return prev ? prev - 1000 : null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [jobs, timeLeft]);

  // Handle Smart Queue Processing
  useEffect(() => {
    const processQueue = () => {
      const activeCount = jobs.filter(j => j.status === 'processing').length;
      if (activeCount >= MAX_CONCURRENT_JOBS) return;

      const queuedJobs = jobs.filter(j => j.status === 'queued');
      const jobsToStart = queuedJobs.slice(0, MAX_CONCURRENT_JOBS - activeCount);

      if (jobsToStart.length > 0) {
        setJobs(current => current.map(job => 
          jobsToStart.find(j => j.id === job.id) ? { ...job, status: 'processing' } : job
        ));

        jobsToStart.forEach(job => {
          workerRef.current?.postMessage({
            type: 'START_CONVERSION',
            job: { id: job.id, file: job.file, targetFormat: job.targetFormat }
          });
        });
      }
    };

    processQueue();
  }, [jobs]);

  const loadFiles = (filesList: FileList | File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    Array.from(filesList).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setToastError("Unsupported format. To ensure your privacy and device performance, this app only processes supported offline formats.");
      setTimeout(() => setToastError(null), 5000);
    }

    if (validFiles.length > 0) {
      const newJobs = validFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        targetFormat: 'webp', // Default format
        status: 'idle' as const,
        progress: 0
      }));
      setJobs(prev => [...prev, ...newJobs]);
    }
  };

  const handleFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      loadFiles(e.dataTransfer.files);
    }
  };

  const handleFormatChange = (id: string, format: string) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, targetFormat: format } : job));
  };

  const handleRemove = (id: string) => {
    setJobs(prev => {
      const job = prev.find(j => j.id === id);
      if (job?.outputUrl) {
        URL.revokeObjectURL(job.outputUrl); // Strict memory cleanup
      }
      return prev.filter(j => j.id !== id);
    });
  };

  const handleClearAll = useCallback(() => {
    jobs.forEach(job => {
      if (job.outputUrl) URL.revokeObjectURL(job.outputUrl);
    });
    setJobs([]);
  }, [jobs]);

  const formatMS = (ms: number | null) => {
    if (ms === null) return '';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {toastError && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-4 max-w-md">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{toastError}</p>
          <button onClick={() => setToastError(null)} className="shrink-0 p-1 hover:bg-red-100 rounded-full transition-colors ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-slate-800">Image Batch Converter</h2>
        <p className="text-slate-500 mt-1">
          High-performance background rendering engine. 100% Client-Side processing.
        </p>
      </div>

      {timeLeft !== null && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-sm transition-all animate-in slide-in-from-top-2">
          <div className="flex items-center">
             <ShieldCheck className="w-5 h-5 mr-3 shrink-0 text-amber-600" />
             <p className="font-medium">Strict Privacy Policy Active</p>
          </div>
          <div className="font-mono bg-white px-3 py-1 rounded shadow-sm">
            Auto-Purge in: <span className="font-bold">{formatMS(timeLeft)}</span>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div 
        className="w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-400 bg-white hover:bg-indigo-50/10 cursor-pointer transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFilesDrop}
        onClick={() => document.getElementById("img-upload")?.click()}
      >
        <input 
          id="img-upload" 
          type="file" 
          multiple 
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.bmp,.gif,.tif,.tiff"
          className="hidden" 
          onChange={(e) => {
            if (e.target.files) {
              loadFiles(e.target.files);
            }
          }}
        />
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
          <Upload className="h-8 w-8 text-slate-500" />
        </div>
        <p className="font-semibold text-slate-800">Drag & Drop images or folders</p>
        <p className="text-sm text-slate-500 mt-1">Queue supports HEIC, JPG, PNG, WEBP and more locally.</p>
      </div>

      {/* Jobs Queue */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
             <h3 className="font-semibold text-slate-700">Conversion Queue ({jobs.length})</h3>
             <button onClick={handleClearAll} className="text-sm text-red-600 hover:text-red-700 flex items-center">
                <Trash2 className="w-4 h-4 mr-1"/> Clear All
             </button>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {jobs.map(job => (
              <div key={job.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 flex items-center w-full min-w-0">
                  <div className="h-10 w-10 bg-indigo-100 rounded flex items-center justify-center shrink-0 mr-4">
                    <FileImage className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                     <p className="font-medium text-slate-900 truncate pr-4">{job.file.name}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{(job.file.size / 1024 / 1024).toFixed(2)} MB • Engine: WASM/Canvas</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end border-t sm:border-0 pt-4 sm:pt-0">
                   {job.status === 'idle' && (
                     <div className="flex items-center gap-2">
                       <select 
                         value={job.targetFormat}
                         onChange={(e) => handleFormatChange(job.id, e.target.value)}
                         className="border rounded px-3 py-1.5 text-sm bg-white focus:ring-2 outline-none focus:ring-indigo-500"
                       >
                         <option value="webp">to WEBP</option>
                         <option value="png">to PNG</option>
                         <option value="jpg">to JPG</option>
                         <option value="gif">to GIF</option>
                       </select>
                       <button
                         onClick={() => setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'queued' } : j))}
                         className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-indigo-700 transition"
                       >
                         Convert
                       </button>
                     </div>
                   )}

                   {job.status === 'queued' && (
                     <div className="flex items-center text-slate-500 font-medium text-sm">
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Waiting in queue...
                     </div>
                   )}

                   {job.status === 'processing' && (
                     <div className="flex items-center text-indigo-600 font-medium text-sm">
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       {job.progress}%
                     </div>
                   )}

                   {job.status === 'error' && (
                     <div className="flex items-center text-red-600 text-sm font-medium" title={job.error}>
                       <AlertCircle className="w-4 h-4 mr-1.5" />
                       Failed
                     </div>
                   )}

                   {job.status === 'done' && job.outputUrl && (
                     <a 
                       href={job.outputUrl}
                       download={`converted_${job.file.name.split('.')[0]}.${job.targetFormat}`}
                       className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                     >
                       <Download className="w-4 h-4 mr-1.5" />
                       Save
                     </a>
                   )}

                   <button 
                     onClick={() => handleRemove(job.id)}
                     className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
