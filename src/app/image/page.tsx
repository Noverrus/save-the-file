"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Upload, Loader2, CheckCircle, Download, Settings } from "lucide-react";

export default function SupabaseImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "uploaded" | "pending" | "processing" | "completed" | "error">("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [publicSourceUrl, setPublicSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState("webp");

  // Realtime Database Subscription
  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel(`job_${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversions",
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          const updated = payload.new;
          setStatus(updated.status);
          if (updated.status === "completed") {
            setResultUrl(updated.converted_url);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  const handleUploadFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("uploading");

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Bypasses Next.js API limits by directly sending the Blob up to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, selectedFile, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from("files").getPublicUrl(filePath);
      
      setPublicSourceUrl(publicData.publicUrl);
      setStatus("uploaded");
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("error");
    }
  };

  const handleConvert = async () => {
    if (!publicSourceUrl) return;
    setStatus("pending");

    try {
      // Create a Database Job Row (Triggers the Node.js Webhook remotely)
      const { data: insertData, error: dbError } = await supabase
        .from("conversions")
        .insert({
          original_url: publicSourceUrl,
          target_format: targetFormat,
          status: "pending",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setJobId(insertData.id);
    } catch (err) {
      console.error("Conversion trigger failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cloud Image Converter</h1>
        <p className="text-slate-500 mt-2">Enterprise-grade server-side processing via Supabase & Async Workers.</p>
      </div>

      {/* Direct-to-Storage Dropzone */}
      {(status === "idle" || status === "error") && (
        <div
          className="w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-400 bg-white hover:bg-indigo-50/10 cursor-pointer transition-colors"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUploadFile(e.target.files[0]);
            }}
          />
          <Upload className="h-10 w-10 text-slate-400 mb-4" />
          <p className="font-medium text-slate-700">Drag & Drop or click to upload</p>
          <p className="text-sm text-slate-500 mt-1">Direct upload to Storage bucket limits (1GB+)</p>
        </div>
      )}

      {status === "uploading" && (
        <div className="bg-white p-8 rounded-xl border flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="font-medium text-slate-700 text-lg">Directing stream to secure storage...</p>
          <p className="text-sm text-slate-500">Uploading {file?.name}</p>
        </div>
      )}

      {status === "uploaded" && (
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">Upload Complete</p>
              <p className="text-sm text-slate-500">{file?.name}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Target Format</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="webp">Convert to WEBP</option>
                <option value="png">Convert to PNG</option>
                <option value="jpg">Convert to JPG</option>
              </select>
              <button
                onClick={handleConvert}
                className="px-8 py-3 w-full sm:w-auto bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center shadow-sm"
              >
                <Settings className="w-5 h-5 mr-2" />
                Start Conversion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Realtime Progress Tracking */}
      {(status === "pending" || status === "processing" || status === "completed") && (
        <div className="bg-white rounded-xl border p-6 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 {status === "completed" ? (
                   <CheckCircle className="w-8 h-8 text-emerald-500" />
                 ) : (
                   <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                 )}
                 <div>
                    <p className="font-semibold text-slate-800 capitalize text-lg">{status}</p>
                    <p className="text-sm text-slate-500">
                       {status === "pending" && "Streaming webhook dispatch to Worker..."}
                       {status === "processing" && "Headless server node is converting the visual data..."}
                       {status === "completed" && "Successfully rendered and cached!"}
                    </p>
                 </div>
              </div>
           </div>

           {status === "completed" && resultUrl && (
             <div className="pt-4 border-t flex flex-col sm:flex-row items-center gap-4">
               <a
                 href={resultUrl}
                 download
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
               >
                 <Download className="w-5 h-5 mr-2" />
                 Download Result File
               </a>
               <button 
                 onClick={() => {
                   setStatus("idle");
                   setFile(null);
                   setPublicSourceUrl(null);
                   setJobId(null);
                   setResultUrl(null);
                 }}
                 className="px-6 py-3 w-full sm:w-auto text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
               >
                 Convert Another File
               </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
