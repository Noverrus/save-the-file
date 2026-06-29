import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFiles: (files: FileList) => void;
  accept: string;
  inputId: string;
  multiple?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function DropZone({
  onFiles,
  accept,
  inputId,
  multiple = false,
  children,
  className,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      document.getElementById(inputId)?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Drop files here or press Enter to browse"
      onKeyDown={handleKeyDown}
      onClick={() => document.getElementById(inputId)?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer?.files?.length) {
          onFiles(e.dataTransfer.files);
        }
      }}
      className={cn(
        "w-full h-48 border-3 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer focus-visible:ring-3 focus-visible:ring-black outline-none",
        isDragOver
          ? "border-black bg-[#a3e635]/10 scale-[1.01]"
          : "border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:bg-slate-50",
        className
      )}
    >
      <input
        id={inputId}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            onFiles(e.target.files);
          }
        }}
      />
      {children}
    </div>
  );
}
