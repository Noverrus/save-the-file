import { Link } from "react-router-dom";
import { Image, FileText, Video, Music, ArrowRight, ShieldCheck, Zap, HardDrive } from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    name: "Image Converter",
    description: "Convert WEBP, PNG, JPG locally.",
    icon: Image,
    href: "/image",
    color: "bg-blue-500",
  },
  {
    name: "Media Converter",
    description: "Convert videos to MP4, WebM, and more.",
    icon: Video,
    href: "/media",
    color: "bg-indigo-500",
  },
  {
    name: "Audio Converter",
    description: "Extract or convert audio into MP3/WAV.",
    icon: Music,
    href: "/audio",
    color: "bg-purple-500",
  },
  {
    name: "Document Converter",
    description: "Convert documents to standard formats.",
    icon: FileText,
    href: "/document",
    color: "bg-rose-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Home() {
  return (
    <div className="flex-1 flex flex-col space-y-12 pb-8">
      
      {/* Hero Section */}
      <section className="text-center pt-12 pb-8 px-4 sm:px-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Uncompromised Privacy. <br className="hidden sm:block" />
          <span className="text-indigo-600">Pure Client-Side File Conversion.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert files completely offline using WebAssembly. Your files never leave your device. Zero servers, zero limits, zero privacy risks.
        </p>
      </section>

      {/* Tools Grid */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4"
      >
        {tools.map((tool) => (
          <motion.div key={tool.name} variants={item}>
            <Link
              to={tool.href}
              className="group relative flex flex-col items-start justify-between p-6 h-full bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all"
            >
              <div className="space-y-4">
                <div className={`inline-flex items-center justify-center p-3 rounded-lg ${tool.color} text-white shadow-sm`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 mt-1 text-sm">{tool.description}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-indigo-600 opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Launch tool <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 px-4 max-w-5xl mx-auto text-center border-t border-slate-100">
        <div className="flex flex-col items-center">
           <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
             <ShieldCheck className="h-6 w-6 text-slate-700" />
          </div>
          <h4 className="font-bold text-slate-900">100% Privacy First</h4>
          <p className="text-sm text-slate-500 mt-2">Zero tracking, no uploads. Everything processes securely and locally in your browser's memory sandbox.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-amber-500" />
          </div>
          <h4 className="font-bold text-slate-900">WASM Powered</h4>
          <p className="text-sm text-slate-500 mt-2">Leverages highly optimized WebAssembly (via FFmpeg) for incredibly fast local encoding.</p>
        </div>
        <div className="flex flex-col items-center">
           <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
             <HardDrive className="h-6 w-6 text-blue-500" />
          </div>
          <h4 className="font-bold text-slate-900">Auto Memory Cleanup</h4>
          <p className="text-sm text-slate-500 mt-2">Links automatically expire and clear out of RAM after exactly 1 hour to keep your device running smooth.</p>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">Supported Offline Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-6 h-6 text-blue-500" />
              <h4 className="font-bold text-slate-900 text-lg">Image Conversions</h4>
            </div>
            <div className="space-y-4">
              <div>
                 <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inputs Allowed</span>
                 <p className="text-slate-700 font-medium mt-1">.jpg, .jpeg, .png, .webp, .heic, .heif, .bmp, .gif, .tif, .tiff</p>
              </div>
              <div>
                 <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Outputs Available</span>
                 <p className="text-slate-700 font-medium mt-1">.webp, .png, .jpg, .gif</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-6 h-6 text-indigo-500" />
              <h4 className="font-bold text-slate-900 text-lg">Media Conversions</h4>
            </div>
            <div className="space-y-4">
              <div>
                 <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inputs Allowed</span>
                 <p className="text-slate-700 font-medium mt-1">.mp4, .webm, .avi, .mov, .mkv, .wmv, .flv, .mp3, .wav, .ogg, .m4a, .aac, .flac</p>
              </div>
              <div>
                 <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Outputs Available</span>
                 <p className="text-slate-700 font-medium mt-1">.mp4, .webm, .avi, .mp3, .wav</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
          To ensure 100% privacy and safety, unsupported formats and heavily compressed/proprietary files (like .wmz, .eps) are intentionally blocked from being uploaded to memory.
        </p>
      </section>

    </div>
  );
}
