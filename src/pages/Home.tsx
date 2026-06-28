import { useState } from "react";
import { Link } from "react-router-dom";
import { Image, FileText, Video, Archive, FileCode, BookOpen, Type, Presentation, FileSpreadsheet, Layers, ArrowRight, ShieldCheck, Zap, HardDrive, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tools = [
  {
    name: "Image Converter",
    description: "Convert and optimize WEBP, PNG, JPG, and GIF locally.",
    icon: Image,
    href: "/image",
    borderColor: "border-blue-200 hover:border-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    name: "Document Converter",
    description: "Convert PDF, TXT, Word, HTML and PDF structures instantly.",
    icon: FileText,
    href: "/document",
    borderColor: "border-rose-200 hover:border-rose-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
  },
  {
    name: "Video Converter",
    description: "WASM-encoded sequential offline video & audio conversions.",
    icon: Video,
    href: "/video",
    borderColor: "border-indigo-200 hover:border-indigo-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    name: "Archive Manager",
    description: "Build custom ZIP files or extract ZIPs offline securely.",
    icon: Archive,
    href: "/archive",
    borderColor: "border-emerald-200 hover:border-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    name: "CAD Vector Converter",
    description: "Render DXF/SVG lines to canvas and export to standard image or PDF.",
    icon: FileCode,
    href: "/cad",
    borderColor: "border-amber-200 hover:border-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    name: "Ebook Publisher",
    description: "Compile TXT, MD, and HTML manuscripts directly into EPUB publications.",
    icon: BookOpen,
    href: "/ebook",
    borderColor: "border-cyan-200 hover:border-cyan-500",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
  },
  {
    name: "Font CSS Packager",
    description: "Load dynamic typography faces and build embedding @font-face CSS packages.",
    icon: Type,
    href: "/font",
    borderColor: "border-purple-200 hover:border-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    name: "Presentation Slideshow",
    description: "Draft, style, and compile high-resolution PDF presentation slide decks.",
    icon: Presentation,
    href: "/presentation",
    borderColor: "border-teal-200 hover:border-teal-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
  },
  {
    name: "Spreadsheet & Data",
    description: "Instantly parse CSV to JSON or generate CSV from JSON arrays locally.",
    icon: FileSpreadsheet,
    href: "/spreadsheet",
    borderColor: "border-slate-300 hover:border-slate-600",
    bgColor: "bg-slate-100",
    textColor: "text-slate-800",
  },
  {
    name: "Vector Rasterizer",
    description: "Convert vector SVGs into PNG, JPEG, or WEBP at crisp resolutions.",
    icon: Layers,
    href: "/vector",
    borderColor: "border-sky-200 hover:border-sky-500",
    bgColor: "bg-sky-50",
    textColor: "text-sky-700",
  },
];

const formatData = [
  {
    id: "image",
    name: "Image Converter",
    icon: Image,
    description: "Konversi dan optimasi gambar secara mandiri & luring langsung di browser Anda.",
    from: "JPG, JPEG, PNG, WEBP, HEIC, HEIF, BMP, GIF, TIF, TIFF",
    to: "WEBP, PNG, JPG, GIF",
    details: "Mendukung kompresi tingkat lanjut, rotasi sudut, dan penyesuaian dimensi piksel secara instan di sisi pengguna tanpa perlu server tambahan.",
    accentColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "document",
    name: "Document Converter",
    icon: FileText,
    description: "Kompilasi sekumpulan gambar hasil pindaian atau teks lurus menjadi PDF utuh.",
    from: "Gambar (PNG, JPG, BMP, WEBP, dll.) atau draf manuskrip polos (.txt)",
    to: "PDF Dokumen yang disatukan dan dioptimalkan",
    details: "Membantu menata tata urutan lembar halaman, mengatur margin tepi dokumen, serta menyesuaikan layout Portrait / Landscape secara luring.",
    accentColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "video",
    name: "Video & Audio Converter",
    icon: Video,
    description: "Konversi video multimedia dan format audio lengkap bertenaga WebAssembly.",
    from: "MP4, WEBM, AVI, MOV, MKV, WMV, FLV, MP3, WAV, OGG, M4A, AAC, FLAC",
    to: "MP4, WEBM, AVI, MP3, WAV",
    details: "Menjalankan kompilasi offline murni di browser menggunakan porting binary FFmpeg WASM. Dilengkapi antrean proses berurutan untuk menjamin efisiensi memori.",
    accentColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "archive",
    name: "Archive Manager",
    icon: Archive,
    description: "Bundel berkas ke folder ZIP terenkripsi atau bongkar arsip ZIP Anda.",
    from: "Semua jenis berkas file digital, atau dokumen kompresi berbentuk .zip",
    to: "File kompresi .zip baru atau ekstraksi berkas asli di dalamnya",
    details: "Sistem pengompresan JSZip berkecepatan tinggi yang bebas dari batasan payload unggahan. Mengamankan file rahasia dari intaian server pihak ketiga.",
    accentColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "cad",
    name: "CAD Vector Converter",
    icon: FileCode,
    description: "Urai file cetak biru DXF & format SVG menjadi representasi kanvas interaktif.",
    from: "DXF (autocad standard), SVG",
    to: "PNG (gambar), PDF (vektor), SVG",
    details: "Membaca data entitas vektor seperti lingkaran, garis lurus, dan busur secara matematis ke kanvas HTML5 lengkap dengan navigasi zoom dan pan.",
    accentColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "ebook",
    name: "Ebook Publisher",
    icon: BookOpen,
    description: "Tautkan manuskrip Markdown atau draf teks menjadi publikasi e-book siap edar.",
    from: "TXT, MD, HTML manuskrip naskah buku",
    to: "EPUB (buku elektronik standar), PDF, TXT (clean)",
    details: "Sangat ideal untuk penulis mandiri. Unggah naskah bab demi bab, tambahkan berkas sampul luar, dan ekspor e-book yang lolos uji baca Google Books, Apple Books, maupun Kindle.",
    accentColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: "font",
    name: "Font CSS Packager",
    icon: Type,
    description: "Inspeksi rupa tipografi kustom Anda dan kemas ke stylesheet @font-face.",
    from: "TTF, OTF, WOFF, WOFF2",
    to: "Pratinjau visual interaktif di tempat & file biner @font-face CSS",
    details: "Menggunakan FontFace API browser secara real-time untuk memuat rupa huruf. Mempermudah pengembang web untuk memeriksa karakter glif secara luring.",
    accentColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "presentation",
    name: "Presentation Slideshow",
    icon: Presentation,
    description: "Rancang slide presentasi bergaya widescreen dan kompilasi langsung ke PDF.",
    from: "Formulir teks materi, tata judul, dan pilihan warna latar",
    to: "Dokumen slide presentasi PDF (Widescreen 16:9)",
    details: "Pilihan cepat pengganti PowerPoint. Cukup masukkan konten presentasi Anda ke editor visual kami dan sistem akan menata grid dokumen secara dinamis.",
    accentColor: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: "spreadsheet",
    name: "Spreadsheet & Data Converter",
    icon: FileSpreadsheet,
    description: "Konversi berkas baris CSV menjadi format JSON terstruktur atau sebaliknya.",
    from: "CSV (berpemisah tanda baca), JSON (berkas array objek)",
    to: "JSON (siap integrasi API) atau CSV (siap dibuka di Excel)",
    details: "Sangat berguna untuk pengolahan data spreadsheet yang aman. Penguraian baris data berlangsung cepat di browser tanpa risiko kebocoran data rahasia perusahaan.",
    accentColor: "bg-slate-100 text-slate-800 border-slate-300",
  },
  {
    id: "vector",
    name: "Vector Rasterizer",
    icon: Layers,
    description: "Rastersi kurva tajam vektor SVG menjadi gambar berbasis piksel resolusi tinggi.",
    from: "SVG",
    to: "PNG, JPG, WEBP, PDF",
    details: "Mendukung penskalaan pengali hingga 4x lipat ukuran dasar untuk memastikan kurva tipografi dan logo SVG tetap tajam saat diekspor menjadi format raster.",
    accentColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

export function Home() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex-1 flex flex-col space-y-12 pb-8">
      
      {/* Hero Section */}
      <section className="text-center pt-10 pb-6 px-4 sm:px-6 space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Uncompromised Privacy. <br />
          <span className="text-indigo-600 font-bold">Pure Client-Side Conversion.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Convert documents, archives, multimedia, fonts, CAD diagrams, and sheets completely offline inside your browser's secure memory sandbox.
        </p>
      </section>

      {/* Tools Grid - Flat design style */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4"
      >
        {tools.map((tool) => (
          <motion.div key={tool.name} variants={item}>
            <Link
              to={tool.href}
              className={`group relative flex flex-col items-start justify-between p-6 h-full bg-white border-2 rounded-xl transition-all ${tool.borderColor}`}
            >
              <div className="space-y-4 w-full">
                <div className={`inline-flex items-center justify-center p-3 rounded-lg ${tool.bgColor} ${tool.textColor}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 mt-1 text-xs leading-relaxed">{tool.description}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-indigo-600 transition-all">
                Launch Tool <ArrowRight className="ml-1 w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Features - Flat layout */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 px-4 max-w-5xl mx-auto text-center border-t border-slate-200">
        <div className="flex flex-col items-center p-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">100% Privacy Sandbox</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">No tracking, no server storage. Everything processes in local client memory securely.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Pure Offline Architecture</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Leverages client-side WebAssembly rendering kernels to perform high-speed compilation.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <HardDrive className="h-5 w-5 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Auto Garbage Cleanup</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Memory blobs expire and purge automatically after 1 hour to prevent system memory leaks.</p>
        </div>
      </section>

      {/* Collapsible Supported Formats Guide - Interactive Accordion with Chevron Arrows */}
      <section className="max-w-4xl mx-auto w-full px-4 pt-4 pb-12 border-t border-slate-200">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            Panduan Format yang Didukung
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Klik pada kategori konverter di bawah ini untuk melihat format file asal yang didukung dan format tujuan hasil konversinya.
          </p>
        </div>

        <div className="space-y-3">
          {formatData.map((item) => {
            const isExpanded = expandedId === item.id;
            const IconComponent = item.icon;
            
            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 focus:outline-none"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2 rounded-lg ${item.accentColor.split(" ")[0]} ${item.accentColor.split(" ")[1]}`}>
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pl-4">
                    <span className="text-slate-400 text-[10px] hidden sm:inline-block font-medium">
                      {isExpanded ? "Tutup" : "Lihat Detail"}
                    </span>
                    <div className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Collapsible Content Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                        {/* Format Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                            <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-600 block">
                              Format Asal (Converts From)
                            </span>
                            <p className="font-mono text-slate-800 text-xs break-all">
                              {item.from}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                            <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-600 block">
                              Format Hasil (Converts To)
                            </span>
                            <p className="font-mono text-slate-800 text-xs break-all">
                              {item.to}
                            </p>
                          </div>
                        </div>

                        {/* Extra Description / Method details */}
                        <div className="bg-slate-100 p-3.5 rounded-lg border border-slate-200/60 leading-relaxed text-slate-600">
                          <strong className="text-slate-900 block mb-1">Mekanisme Kerja Sandbox:</strong>
                          {item.details}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

