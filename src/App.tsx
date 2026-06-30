import React, { useState, useEffect, useRef } from 'react';
import { 
  AnimatePresence, 
  motion 
} from 'framer-motion';
import { 
  Menu, X, ChevronDown, ChevronUp, Home, FileText, Image as ImageIcon, 
  Video, Music, Table, Presentation, BookOpen, Archive, PenTool, Type, 
  ShieldCheck, Zap, Plus, Trash2, Check, Search, HelpCircle, ArrowRight
} from 'lucide-react';

// ==========================================
// 1. LIGHTWEIGHT SPA ROUTER
// ==========================================
interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Link: React.FC<LinkProps> = ({ to, children, className, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (onClick) onClick();
  };
  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// ==========================================
// 2. CONVERTER TYPES DEFINITIONS
// ==========================================
interface ConverterInfo {
  id: string;
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  desc: string;
  color: string;
}

const CONVERTERS: ConverterInfo[] = [
  { id: 'documents', path: '/converter/documents', name: 'Documents Converter', icon: FileText, desc: 'Konversi teks, PDF, buat file dokumen kustom secara privat.', color: 'from-blue-500 to-indigo-600' },
  { id: 'images', path: '/converter/images', name: 'Images Converter', icon: ImageIcon, desc: 'Ubah format gambar, kompres, sesuaikan ukuran tanpa server eksternal.', color: 'from-emerald-500 to-teal-600' },
  { id: 'video', path: '/converter/video', name: 'Video Converter', icon: Video, desc: 'Proses video secara lokal, ekstrak bingkai visual, dan kelola resolusi.', color: 'from-rose-500 to-pink-600' },
  { id: 'audio', path: '/converter/audio', name: 'Audio Converter', icon: Music, desc: 'Rekam, potong durasi audio, dan kelola kualitas suara instan.', color: 'from-violet-500 to-purple-600' },
  { id: 'spreadsheets', path: '/converter/spreadsheets', name: 'Spreadsheets Converter', icon: Table, desc: 'Edit tabel data secara lokal, ubah format CSV ke JSON dan sebaliknya.', color: 'from-green-500 to-emerald-600' },
  { id: 'slides', path: '/converter/slides', name: 'Slides Converter', icon: Presentation, desc: 'Ubah naskah tulisan Markdown menjadi tayangan presentasi modern.', color: 'from-amber-500 to-orange-600' },
  { id: 'ebooks', path: '/converter/e-books', name: 'E-books Converter', icon: BookOpen, desc: 'Format ulang teks e-book kustom dan sesuaikan statistik membaca.', color: 'from-cyan-500 to-blue-600' },
  { id: 'archives', path: '/converter/archives', name: 'Archives Converter', icon: Archive, desc: 'Buat bundel arsip lokal .zip atau ekstrak folder lokal aman.', color: 'from-slate-500 to-zinc-600' },
  { id: 'vector', path: '/converter/vector', name: 'Vector Converter', icon: PenTool, desc: 'Render format gambar SVG menjadi PNG, edit properti vektor.', color: 'from-pink-500 to-rose-600' },
  { id: 'cad', path: '/converter/cad', name: 'CAD Converter', icon: PenTool, desc: 'Gambar desain arsitektur/teknik CAD lokal dan ekspor ke DXF/SVG.', color: 'from-sky-500 to-blue-600' },
  { id: 'fonts', path: '/converter/fonts', name: 'Fonts Converter', icon: Type, desc: 'Unggah berkas fonta TTF/WOFF Anda, uji visualisasi pengetikan.', color: 'from-fuchsia-500 to-purple-600' },
];

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [converterDropdownOpen, setConverterDropdownOpen] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper navigation function
  const navigateTo = (to: string) => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F3EF] text-black font-sans selection:bg-[#FFE600] selection:text-black">
      
      {/* ==========================================
          HEADER BAR
         ========================================== */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-black py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 border-2 border-black bg-[#FFE600] flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000] rotate-[-3deg]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-black font-display uppercase">SaveTheFile</span>
          </Link>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 border-3 border-black bg-[#A5F3FC] text-black font-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer rounded-xl focus:outline-none"
            aria-label="Buka Menu"
          >
            {menuOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
          </button>
        </div>
      </header>

      {/* ==========================================
          HAMBURGER DRAWER (SIDEBAR)
         ========================================== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white flex flex-col border-l-4 border-black shadow-[-8px_0px_0px_0px_#000000]"
            >
              <div className="p-5 border-b-4 border-black bg-[#FFE600] flex items-center justify-between">
                <span className="font-extrabold text-xl text-black font-display uppercase tracking-tight">Menu Navigasi</span>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 border-2 border-black bg-[#FFA8E8] text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer rounded-lg"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F4F3EF]">
                <Link 
                  to="/" 
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 border-3 border-black rounded-xl transition-all ${
                    path === '/' 
                      ? 'bg-[#FFE600] text-black font-bold shadow-[4px_4px_0px_0px_#000000]' 
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000]'
                  }`}
                >
                  <Home className="w-5 h-5 stroke-[2.5]" />
                  <span className="font-display font-extrabold">Home</span>
                </Link>

                <Link 
                  to="/converter" 
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 border-3 border-black rounded-xl transition-all ${
                    path === '/converter' 
                      ? 'bg-[#FFE600] text-black font-bold shadow-[4px_4px_0px_0px_#000000]' 
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000]'
                  }`}
                >
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                  <span className="font-display font-extrabold">Converter Hub</span>
                </Link>

                <div className="pt-2 border-t-2 border-black mt-2">
                  <button 
                    onClick={() => setConverterDropdownOpen(!converterDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 border-2 border-black bg-[#A5F3FC] text-black rounded-xl shadow-[2px_2px_0px_0px_#000000] transition-all hover:bg-cyan-200"
                  >
                    <span className="font-bold text-xs tracking-wider uppercase font-display">Daftar Converter</span>
                    {converterDropdownOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                  </button>

                  <AnimatePresence>
                    {converterDropdownOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2 mt-3 pl-1"
                      >
                        {CONVERTERS.map((conv) => {
                          const Icon = conv.icon;
                          const isActive = path === conv.path;
                          return (
                            <Link
                              key={conv.id}
                              to={conv.path}
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center space-x-3 px-3 py-2 border-2 border-black rounded-lg text-sm transition-all ${
                                isActive 
                                  ? 'bg-[#86EFAC] text-black font-bold shadow-[2px_2px_0px_0px_#000000]' 
                                  : 'bg-white text-black shadow-[1px_1px_0px_0px_#000000] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_#000000]'
                              }`}
                            >
                              <Icon className="w-4 h-4 stroke-[2.5]" />
                              <span className="font-medium">{conv.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-5 border-t-3 border-black bg-[#86EFAC] text-black font-bold flex items-center space-x-2.5 text-xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span className="font-display font-extrabold uppercase tracking-wider">100% Client-Side & Privat</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          MAIN BODY ROUTER
         ========================================== */}
      <main className="flex-1 flex flex-col">
        {(() => {
          if (path === '/' || path === '/index.html') {
            return <HomePage navigateTo={navigateTo} />;
          } else if (path === '/converter') {
            return <ConverterHubPage navigateTo={navigateTo} />;
          } else if (path === '/converter/documents') {
            return <DocumentsConverter />;
          } else if (path === '/converter/images') {
            return <ImagesConverter />;
          } else if (path === '/converter/video') {
            return <VideoConverter />;
          } else if (path === '/converter/audio') {
            return <AudioConverter />;
          } else if (path === '/converter/spreadsheets') {
            return <SpreadsheetsConverter />;
          } else if (path === '/converter/slides') {
            return <SlidesConverter />;
          } else if (path === '/converter/e-books') {
            return <EbooksConverter />;
          } else if (path === '/converter/archives') {
            return <ArchivesConverter />;
          } else if (path === '/converter/vector') {
            return <VectorConverter />;
          } else if (path === '/converter/cad') {
            return <CadConverter />;
          } else if (path === '/converter/fonts') {
            return <FontsConverter />;
          } else {
            // Fallback to Home
            return <HomePage navigateTo={navigateTo} />;
          }
        })()}
      </main>

      {/* ==========================================
          FOOTER
         ========================================== */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 border-t border-slate-800 text-center text-sm">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="font-semibold text-white text-base">SaveTheFile</p>
          <p className="max-w-md mx-auto text-slate-400 text-xs">
            Semua konversi file terjadi langsung di browser Anda menggunakan Web APIs, Canvas, AudioContext, dan Web Assembly lokal. File Anda aman dan tidak pernah dikirim ke server.
          </p>
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 max-w-xl mx-auto">
            <span>© 2026 SaveTheFile. All rights reserved.</span>
            <span className="flex items-center space-x-1.5 mt-1.5 sm:mt-0">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Privasi Terjamin 100%</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// PAGE: HOME PAGE
// ============================================================================
function HomePage({ navigateTo }: { navigateTo: (to: string) => void }) {
  const getFlatColor = (id: string) => {
    switch(id) {
      case 'documents': return 'bg-[#FFE600]'; // Yellow
      case 'images': return 'bg-[#86EFAC]'; // Green
      case 'video': return 'bg-[#FFA8E8]'; // Pink
      case 'audio': return 'bg-[#A5F3FC]'; // Cyan
      case 'spreadsheets': return 'bg-[#FFD0A3]'; // Peach
      case 'slides': return 'bg-[#FFE600]';
      case 'e-books': return 'bg-[#FFA8E8]';
      case 'archives': return 'bg-[#86EFAC]';
      case 'vector': return 'bg-[#A5F3FC]';
      case 'cad': return 'bg-[#FFD0A3]';
      case 'fonts': return 'bg-[#FFE600]';
      default: return 'bg-[#FFE600]';
    }
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 border-3 border-black bg-[#86EFAC] text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000]"
          >
            <ShieldCheck className="w-4 h-4 stroke-[3]" />
            <span className="font-display font-extrabold tracking-wider">Lokal & 100% Privat</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-[1.1] font-display uppercase"
          >
            Konversi File <br />
            <span className="bg-[#FFE600] border-3 border-black px-3 py-1 inline-block rotate-[-1.5deg] shadow-[5px_5px_0px_0px_#000000] mt-2 mb-1">
              Lokal &amp; Instan
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-black font-semibold max-w-2xl leading-relaxed bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000000]"
          >
            SaveTheFile memproses seluruh dokumen, gambar, audio, presentasi, dan font secara lokal langsung di dalam browser Anda. Tidak ada data yang diunggah ke server eksternal mana pun. Privasi total dengan performa kilat.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => navigateTo('/converter')}
              className="inline-flex items-center space-x-2 px-8 py-4.5 border-4 border-black bg-[#FFE600] text-black font-black uppercase font-display tracking-wider shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer text-base rounded-none"
            >
              <span>Jelajahi Hub Konverter</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </motion.div>
        </div>

        {/* Neo-brutalist Interactive CSS Illustration */}
        <motion.div 
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
          className="lg:col-span-5 flex flex-col items-center justify-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000000] p-6 relative overflow-hidden group select-none"
        >
          {/* Accent Badge */}
          <div className="absolute top-3 left-3 bg-[#FFE600] border-2 border-black px-2.5 py-1 text-xs font-black uppercase rotate-[-3deg] shadow-[2px_2px_0px_0px_#000000] z-10">
            input file
          </div>
          <div className="absolute top-3 right-3 bg-[#86EFAC] border-2 border-black px-2.5 py-1 text-xs font-black uppercase rotate-[2deg] shadow-[2px_2px_0px_0px_#000000] z-10">
            100% lokal
          </div>

          {/* Graphical Mockup of conversion flow */}
          <div className="w-full py-8 px-4 flex flex-col items-center space-y-6">
            <div className="flex items-center justify-between w-full max-w-sm gap-4">
              {/* Input doc representation */}
              <div className="flex-1 border-3 border-black bg-[#FFE600] p-4 shadow-[4px_4px_0px_0px_#000000] text-center transform group-hover:rotate-[-2deg] transition-all">
                <FileText className="w-10 h-10 mx-auto stroke-[2.5]" />
                <span className="font-mono text-xs font-extrabold mt-2 block uppercase">source.any</span>
              </div>

              {/* Action converting arrows */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-10 h-10 rounded-full border-3 border-black bg-[#FFA8E8] flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] animate-bounce">
                  <Zap className="w-5 h-5 stroke-[2.5] fill-black" />
                </div>
                <span className="font-display font-extrabold text-[10px] uppercase tracking-wider">instan</span>
              </div>

              {/* Output doc representation */}
              <div className="flex-1 border-3 border-black bg-[#86EFAC] p-4 shadow-[4px_4px_0px_0px_#000000] text-center transform group-hover:rotate-[2deg] transition-all">
                <Check className="w-10 h-10 mx-auto stroke-[3] text-black" />
                <span className="font-mono text-xs font-extrabold mt-2 block uppercase text-black">output.file</span>
              </div>
            </div>

            {/* Simulated file conversion progress bars */}
            <div className="w-full max-w-sm border-3 border-black bg-[#F4F3EF] p-3 shadow-[3px_3px_0px_0px_#000000] space-y-2">
              <div className="flex justify-between text-xs font-extrabold uppercase">
                <span>MEMPROSES SECARA PRIVAT...</span>
                <span>100%</span>
              </div>
              <div className="w-full h-4 border-2 border-black bg-white overflow-hidden p-0.5">
                <div className="h-full bg-[#A5F3FC] border-r-2 border-black animate-[pulse_1.5s_infinite]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-2 w-full text-center border-t-3 border-black pt-3 bg-[#F4F3EF] px-2 py-1.5">
            <span className="font-mono text-xs text-black font-extrabold uppercase tracking-wide">
              Mulai bimbing untuk membuat modul konversi lokal Anda!
            </span>
          </div>
        </motion.div>
      </section>

      {/* Grid of Features / Converters */}
      <section className="space-y-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black uppercase font-display text-black">Pilih Modul Konversi</h2>
            <p className="text-black font-semibold text-sm">Toolkit pengolah file offline instan dan aman.</p>
          </div>
          <div className="bg-[#FFA8E8] border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000]">
            11 Modul Aktif
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONVERTERS.map((conv, idx) => {
            const Icon = conv.icon;
            const flatColor = getFlatColor(conv.id);
            return (
              <motion.div
                key={conv.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.04 * idx }}
                onClick={() => navigateTo(conv.path)}
                className="group relative bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 border-3 border-black ${flatColor} flex items-center justify-center text-black shadow-[3px_3px_0px_0px_#000000] group-hover:rotate-[-6deg] transition-transform`}>
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-xl text-black font-display uppercase tracking-tight">{conv.name}</h3>
                    <p className="text-black font-medium text-xs leading-relaxed opacity-85">{conv.desc}</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between text-black font-black text-xs uppercase tracking-wider">
                  <span>Buka Konverter</span>
                  <div className="w-6 h-6 border-2 border-black bg-white flex items-center justify-center group-hover:bg-[#FFE600] group-hover:translate-x-1 transition-all shadow-[1px_1px_0px_0px_#000000]">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// PAGE: CONVERTER HUB (SEARCH & CATEGORIES)
// ============================================================================
function ConverterHubPage({ navigateTo }: { navigateTo: (to: string) => void }) {
  const [search, setSearch] = useState('');

  const getFlatColor = (id: string) => {
    switch(id) {
      case 'documents': return 'bg-[#FFE600]'; // Yellow
      case 'images': return 'bg-[#86EFAC]'; // Green
      case 'video': return 'bg-[#FFA8E8]'; // Pink
      case 'audio': return 'bg-[#A5F3FC]'; // Cyan
      case 'spreadsheets': return 'bg-[#FFD0A3]'; // Peach
      case 'slides': return 'bg-[#FFE600]';
      case 'e-books': return 'bg-[#FFA8E8]';
      case 'archives': return 'bg-[#86EFAC]';
      case 'vector': return 'bg-[#A5F3FC]';
      case 'cad': return 'bg-[#FFD0A3]';
      case 'fonts': return 'bg-[#FFE600]';
      default: return 'bg-[#FFE600]';
    }
  };

  const filteredConverters = CONVERTERS.filter(conv => 
    conv.name.toLowerCase().includes(search.toLowerCase()) || 
    conv.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000]">
        <h1 className="text-4xl font-black uppercase font-display text-black tracking-tight">Converter Hub</h1>
        <p className="text-black font-semibold text-sm">Cari dan pilih jenis modul konversi file spesifik yang Anda butuhkan di bawah.</p>
        
        {/* Search bar */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-4 top-4 w-5 h-5 text-black stroke-[3]" />
          <input
            type="text"
            placeholder="Cari jenis file... (e.g., pdf, image, wav)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-3 border-black bg-[#F4F3EF] text-black font-bold placeholder-black/50 shadow-[3px_3px_0px_0px_#000000] focus:bg-white focus:shadow-[5px_5px_0px_0px_#000000] transition-all rounded-none outline-none"
          />
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b-4 border-black pb-3">
          <h2 className="text-2xl font-black uppercase font-display text-black">
            {search ? `Hasil Pencarian (${filteredConverters.length})` : 'Semua Modul Konverter'}
          </h2>
          <span className="bg-[#FFE600] border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000]">
            Pencarian Cepat
          </span>
        </div>
        
        {filteredConverters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredConverters.map((conv) => {
              const Icon = conv.icon;
              const flatColor = getFlatColor(conv.id);
              return (
                <div
                  key={conv.id}
                  onClick={() => navigateTo(conv.path)}
                  className="bg-white border-3 border-black p-5 shadow-[5px_5px_0px_0px_#000000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer flex items-start space-x-4"
                >
                  <div className={`w-12 h-12 shrink-0 border-3 border-black ${flatColor} flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]`}>
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg font-display uppercase tracking-tight text-black">{conv.name}</h3>
                    <p className="text-black/80 font-medium text-xs leading-relaxed">{conv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-3 border-black p-12 text-center space-y-4 shadow-[6px_6px_0px_0px_#000000]">
            <HelpCircle className="w-12 h-12 text-black stroke-[2.5] mx-auto" />
            <div className="space-y-1">
              <p className="font-black text-xl uppercase font-display text-black">Modul tidak ditemukan</p>
              <p className="text-xs text-black font-semibold">Silakan masukkan kata kunci pencarian lainnya.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// BASE CONVERTER PLACEHOLDER (NEO BRUTALIST STYLE)
// ============================================================================
interface BaseConverterPlaceholderProps {
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  badgeText: string;
  acceptedFileTypes?: string;
}

function BaseConverterPlaceholder({
  title,
  desc,
  icon: Icon,
  colorClass,
  badgeText,
  acceptedFileTypes = "*/*"
}: BaseConverterPlaceholderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 border-3 border-black ${colorClass} flex items-center justify-center text-black shadow-[3px_3px_0px_0px_#000000]`}>
            <Icon className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase font-display text-black tracking-tight">{title}</h1>
            <p className="text-black font-semibold text-sm opacity-90">{desc}</p>
          </div>
        </div>
        <div className="bg-[#FFE600] border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000] self-start md:self-center">
          {badgeText}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Workspace Card */}
        <div className="md:col-span-8 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_#000000] transition-all min-h-[300px] flex flex-col items-center justify-center relative ${
              isDragging ? 'bg-cyan-50 border-dashed' : ''
            }`}
          >
            {/* Input Element */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={acceptedFileTypes}
              className="hidden" 
            />

            {!selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 border-3 border-black bg-[#A5F3FC] flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000000]">
                  <Plus className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black uppercase font-display text-black">Pilih atau Seret Berkas Anda</p>
                  <p className="text-xs text-black font-semibold opacity-70">Mendukung format file terkait</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 border-3 border-black bg-[#FFE600] text-black font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer text-xs"
                >
                  Pilih Berkas
                </button>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                <div className="border-3 border-black bg-[#86EFAC] p-4 shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-left">
                    <FileText className="w-8 h-8 stroke-[2.5]" />
                    <div>
                      <p className="font-extrabold text-sm text-black truncate max-w-xs sm:max-w-md">{selectedFile.name}</p>
                      <p className="text-[10px] font-mono font-bold opacity-70">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleClear}
                    className="p-1.5 border-2 border-black bg-[#FFA8E8] text-black hover:bg-rose-300 transition-colors shadow-[1px_1px_0px_0px_#000000]"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="bg-[#FFE600] border-3 border-black p-4 text-left shadow-[3px_3px_0px_0px_#000000] space-y-2">
                  <span className="font-black font-display text-xs uppercase block">Status Berkas:</span>
                  <p className="text-xs font-semibold text-black leading-relaxed">
                    Berkas <span className="font-mono bg-white px-1 border border-black">{selectedFile.name}</span> berhasil dimuat secara lokal. Silakan bimbing saya untuk membuat fungsi konversi spesifik yang Anda inginkan untuk berkas ini!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guide Panel */}
        <div className="md:col-span-4 space-y-6">
          <div className="border-3 border-black bg-[#FFA8E8] p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
            <h3 className="font-black text-lg font-display uppercase tracking-tight text-black">Bimbing Saya!</h3>
            <p className="text-xs font-semibold text-black leading-relaxed">
              Fungsi konversi halaman ini sengaja dikosongkan agar kita bisa membangunnya bersama dari awal.
            </p>
            <div className="border-t border-black/20 pt-3 space-y-2 text-xs font-semibold text-black">
              <p className="flex items-start space-x-1.5">
                <span className="bg-black text-[#FFA8E8] w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</span>
                <span>Tentukan input &amp; output yang diinginkan.</span>
              </p>
              <p className="flex items-start space-x-1.5">
                <span className="bg-black text-[#FFA8E8] w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</span>
                <span>Tulis instruksi di kolom chat samping.</span>
              </p>
              <p className="flex items-start space-x-1.5">
                <span className="bg-black text-[#FFA8E8] w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">3</span>
                <span>Saya akan mengimplementasikan kodenya secara bertahap sesuai keinginan Anda!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODUL CONVERTER: INDIVIDUAL COMPONENT WRAPPERS
// ============================================================================

function DocumentsConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Documents Converter"
      desc="Ekstrak teks, buat dokumen, atau ubah format dokumen secara instan dan lokal."
      icon={FileText}
      colorClass="bg-[#FFE600]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".txt,.pdf,.docx,.html"
    />
  );
}

function ImagesConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Images Converter"
      desc="Kompres, ubah format, atau sesuaikan ukuran gambar Anda secara langsung."
      icon={ImageIcon}
      colorClass="bg-[#86EFAC]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes="image/*"
    />
  );
}

function VideoConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Video Converter"
      desc="Ekstrak bingkai video, potong durasi, atau periksa metadata berkas video."
      icon={Video}
      colorClass="bg-[#FFA8E8]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes="video/*"
    />
  );
}

function AudioConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Audio Converter"
      desc="Rekam, potong, atau visualisasikan gelombang suara berkas audio Anda."
      icon={Music}
      colorClass="bg-[#A5F3FC]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes="audio/*"
    />
  );
}

function SpreadsheetsConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Spreadsheets Converter"
      desc="Ubah berkas CSV menjadi JSON atau sebaliknya, dan edit tabel secara lokal."
      icon={Table}
      colorClass="bg-[#FFD0A3]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".csv,.json,.xlsx"
    />
  );
}

// Renamed appropriately to match EbooksConverter in router
function EbooksConverter() {
  return (
    <BaseConverterPlaceholder 
      title="E-books Converter"
      desc="Format ulang tulisan e-book, hitung statistik, atau baca dalam mode Serif."
      icon={BookOpen}
      colorClass="bg-[#FFA8E8]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".epub,.txt,.pdf"
    />
  );
}

function SlidesConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Slides Converter"
      desc="Ubah naskah Markdown menjadi tayangan presentasi interaktif siap pakai."
      icon={Presentation}
      colorClass="bg-[#FFE600]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".md,.txt"
    />
  );
}

function ArchivesConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Archives Converter"
      desc="Buat bundel arsip virtual (.zip) atau ekstrak berkas lokal secara langsung."
      icon={Archive}
      colorClass="bg-[#86EFAC]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".zip,.tar,.gz"
    />
  );
}

function VectorConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Vector Converter"
      desc="Render SVG menjadi gambar PNG atau sesuaikan properti visual grafis vektor."
      icon={PenTool}
      colorClass="bg-[#A5F3FC]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".svg"
    />
  );
}

function CadConverter() {
  return (
    <BaseConverterPlaceholder 
      title="CAD Converter"
      desc="Gambar sketsa vektor CAD interaktif dan ekspor menjadi DXF/SVG."
      icon={PenTool}
      colorClass="bg-[#FFD0A3]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".dxf,.svg,.json"
    />
  );
}

function FontsConverter() {
  return (
    <BaseConverterPlaceholder 
      title="Fonts Converter"
      desc="Uji ketikan berkas fonta (TTF, OTF, WOFF) lokal Anda secara langsung."
      icon={Type}
      colorClass="bg-[#FFE600]"
      badgeText="0% CODE - SIAP DIBENTUK"
      acceptedFileTypes=".ttf,.otf,.woff,.woff2"
    />
  );
}
