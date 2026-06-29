import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FileCode2, Image, FileText, Video, Archive, FileCode, BookOpen, Type, Presentation, FileSpreadsheet, Layers, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Image", path: "/image-converter", icon: Image },
  { name: "Document", path: "/document-converter", icon: FileText },
  { name: "Video", path: "/video-converter", icon: Video },
  { name: "Archive", path: "/archive-converter", icon: Archive },
  { name: "CAD", path: "/cad-converter", icon: FileCode },
  { name: "Ebook", path: "/ebook-converter", icon: BookOpen },
  { name: "Font", path: "/font-converter", icon: Type },
  { name: "Presentation", path: "/presentation-converter", icon: Presentation },
  { name: "Spreadsheet", path: "/spreadsheet-converter", icon: FileSpreadsheet },
  { name: "Vector", path: "/vector-converter", icon: Layers },
  { name: "PDF Viewer", path: "/pdf-viewer", icon: Eye },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-sans flex flex-col antialiased">
      {/* Navbar - Premium Neo-brutalist Design */}
      <header className="sticky top-0 z-40 w-full border-b-[3px] border-black bg-white shrink-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-4 w-full">
            <Link 
              to="/" 
              className="flex items-center space-x-2 font-display font-black text-sm sm:text-base uppercase tracking-wider bg-[#ffde43] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all shrink-0 active:scale-95"
            >
              <FileCode2 className="h-5 w-5 stroke-[2.5]" />
              <span className="font-extrabold tracking-tight">WASM CONVERTER</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 overflow-x-auto scrollbar-none py-2 flex-1 mask-linear">
              <Link 
                to="/"
                className={cn(
                  "text-xs font-bold font-display uppercase tracking-wider px-3 py-2 rounded-lg border-2 transition-all shrink-0 active:scale-95",
                  location.pathname === "/" 
                    ? "bg-[#ff90e8] border-black text-black font-extrabold shadow-[2px_2px_0px_0px_#000]" 
                    : "bg-white border-transparent text-slate-700 hover:border-black hover:bg-slate-100"
                )}
              >
                Dashboard
              </Link>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider border-2 transition-all shrink-0 active:scale-95",
                      isActive 
                        ? "bg-[#38bdf8] border-black text-black font-extrabold shadow-[2px_2px_0px_0px_#000]" 
                        : "bg-white border-transparent text-slate-700 hover:border-black hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-4 w-4 stroke-[2.5]" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile/Tablet Dropdown Navigation */}
            <div className="flex md:hidden items-center shrink-0">
              <select
                value={location.pathname === "/" ? "/" : "/" + location.pathname.split("/")[1]}
                onChange={(e) => navigate(e.target.value)}
                className="border-2 border-black rounded-lg px-2 py-1.5 text-xs font-mono font-black bg-[#ffde43] text-black shadow-[2.5px_2.5px_0px_0px_#000] focus-visible:ring-2 focus-visible:ring-black outline-none cursor-pointer"
                aria-label="Navigate to another converter"
              >
                <option value="/">Dashboard</option>
                {navLinks.map((link) => (
                  <option key={link.path} value={link.path}>
                    {link.name} Converter
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <Outlet />
      </main>

      {/* Footer - Redesigned simple Neo-brutalist footer */}
      <footer className="shrink-0 border-t-[3px] border-black py-10 bg-white text-black font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-8 border-b-2 border-black">
            <div className="space-y-3">
              <div className="inline-block bg-[#ff90e8] border-2 border-black px-3 py-1 font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                Convert To Everything
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed max-w-sm">
                A high-speed, client-side, offline-first digital compilation suite. All your files are processed securely inside your browser. No server uploads, ever.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-6">
              <div className="space-y-2">
                <span className="font-display font-black text-xs uppercase tracking-wider text-slate-500 block">Quick Links</span>
                <div className="flex flex-wrap gap-3">
                  <Link to="/" className="text-xs font-mono font-bold hover:underline bg-[#38bdf8]/10 hover:bg-[#38bdf8]/30 px-2 py-1 rounded border-2 border-black transition-colors">
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => setActiveModal("privacy")} 
                    className="text-xs font-mono font-bold hover:underline bg-[#a3e635]/10 hover:bg-[#a3e635]/30 px-2.5 py-1.5 rounded-lg border-2 border-black transition-colors cursor-pointer text-black"
                  >
                    Privacy
                  </button>
                  <button 
                    onClick={() => setActiveModal("terms")} 
                    className="text-xs font-mono font-bold hover:underline bg-[#ffde43]/10 hover:bg-[#ffde43]/30 px-2.5 py-1.5 rounded-lg border-2 border-black transition-colors cursor-pointer text-black"
                  >
                    Terms
                  </button>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs font-mono font-bold hover:underline bg-[#fb923c]/10 hover:bg-[#fb923c]/30 px-2 py-1 rounded border-2 border-black transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600 font-semibold">
            <span>&copy; 2026 Convert To Everything. Crafted with local-first WebAssembly technology.</span>
            <div className="bg-[#a3e635] border-2 border-black px-2.5 py-0.5 text-[10px] font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
              Secure Client Sandbox
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy / Terms Custom Neo-brutalist Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setActiveModal(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div 
            role="dialog"
            aria-modal="true"
            aria-label={activeModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
            className="relative w-full max-w-md bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_#000] z-10 text-black"
          >
            <h3 className="font-display font-black text-lg uppercase tracking-wider mb-3">
              {activeModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </h3>
            <p className="text-xs font-sans font-semibold text-slate-800 leading-relaxed mb-6">
              {activeModal === "privacy" ? (
                "All conversion operations are done 100% locally in your browser using local web workers and WebAssembly (WASM) compiler technology. No files, logs, metadata, or telemetry are ever uploaded to any external servers. Your digital assets remain entirely within your device sandbox."
              ) : (
                "This browser-side conversion suite is provided free of charge, entirely open-source, and runs local-only. Use at your own convenience. Convert To Everything Corp makes no representations or warranties of any kind concerning the safety, suitability, or accuracy of local processing."
              )}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#ffde43] hover:bg-[#ffe566] text-black border-2 border-black py-2.5 rounded-lg font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer focus-visible:ring-3 focus-visible:ring-black outline-none"
            >
              Understand & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
