import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import RoastLevelSelector from './components/RoastLevelSelector';
import RoastResult from './components/RoastResult';
import Toast from './components/Toast';
import { roastResume } from './services/geminiService';
import type { FileData, LoadingState, RoastResponse, Language } from './types';
import { RoastLevel } from "./types"

const LOADING_MSGS = {
  ENGLISH: [
    "Analyzing failures...",
    "Judging life choices...",
    "Laughing at the font...",
    "Finding the typos...",
    "Preparing the roast...",
    "Consulting the roast gods..."
  ],
  HINDI: [
    "Resume padh raha hoon...",
    "Hasi rokna mushkil hai...",
    "Bezzati loading...",
    "Chappal taiyaar hai...",
    "Bhai sahab, ye kya hai?",
    "Sharam aa rahi hai..."
  ]
};

export default function App() {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(RoastLevel.SPICY);
  const [language, setLanguage] = useState<Language>('ENGLISH');
  const [status, setStatus] = useState<LoadingState>('IDLE');
  const [result, setResult] = useState<RoastResponse | null>(null);

  // Loading Text State
  const [loadingText, setLoadingText] = useState("");

  // Toast state
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  // Cycle loading messages
  useEffect(() => {
    if (status !== 'ROASTING') return;

    let index = 0;
    const msgs = LOADING_MSGS[language];
    setLoadingText(msgs[0]);

    const interval = setInterval(() => {
      index = (index + 1) % msgs.length;
      setLoadingText(msgs[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, [status, language]);

  const handleFileSelect = (data: FileData) => {
    setFileData(data);
  };

  const handleRoast = async () => {
    if (!fileData) return;

    setStatus('ROASTING');

    try {
      const response = await roastResume(fileData.base64, fileData.mimeType, roastLevel, language);
      setResult(response);
      setStatus('DONE');
    } catch (err: any) {
      console.error(err);
      setStatus('ERROR');
      triggerToast("Failed to roast. The AI is overwhelmed by the bad formatting. Try again.");
    }
  };

  const reset = () => {
    setFileData(null);
    setResult(null);
    setStatus('IDLE');
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-stone-200 selection:bg-orange-500/30 selection:text-orange-100 flex flex-col items-center font-sans">

      <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />

      {/* Navbar / Header */}
      <nav className="w-full border-b border-white/5 bg-stone-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={reset}>
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <span className="relative text-2xl">🔥</span>
            </div>
            <span className="font-bold tracking-tighter text-stone-100 text-lg">RoastMyResume</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Simple link or social icon could go here */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl px-6 py-12 flex flex-col items-center">

        {status !== 'DONE' && (
          <div className="w-full flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]">

            {/* Header Text */}
            <div className="text-center space-y-3 mb-4">
              <h1 className="text-4xl md:text-6xl font-black text-stone-100 tracking-tight leading-tight">
                Brutal AI Feedback.
              </h1>
              <p className="text-stone-500 text-lg">
                Direct. Honest. No sugar-coating.
              </p>
            </div>

            {/* Controls Container */}
            <div className="w-full bg-stone-900/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">

              {/* Settings Grid */}
              <div className="flex flex-col gap-6 mb-8">

                {/* Language Selector in Form */}
                <div className="flex justify-between items-end">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">Language</label>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
                  {(['ENGLISH', 'HINDI'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      disabled={status === 'ROASTING'}
                      className={`
                          py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200
                          ${language === lang
                          ? 'bg-stone-800 text-stone-100 shadow-md border border-stone-700'
                          : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'}
                        `}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-stone-500 text-xs font-bold uppercase tracking-widest mb-3 pl-1">Intensity</label>
                  <RoastLevelSelector
                    value={roastLevel}
                    onChange={setRoastLevel}
                    disabled={status === 'ROASTING'}
                    language={language}
                  />
                </div>
              </div>

              {/* Upload Area */}
              {!fileData ? (
                <FileUpload onFileSelect={handleFileSelect} onError={triggerToast} disabled={false} />
              ) : (
                <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease-in]">
                  <div className="flex items-center justify-between bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center border border-stone-700 text-stone-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-stone-200 truncate">{fileData.file.name}</span>
                        <span className="text-xs text-stone-500 uppercase">Ready to roast</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setFileData(null)}
                      disabled={status === 'ROASTING'}
                      className="p-2 hover:bg-stone-800 rounded-lg text-stone-500 hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {status === 'IDLE' || status === 'ERROR' ? (
                    <button
                      onClick={handleRoast}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                      <span>{language === 'HINDI' ? 'Jala De Bhai 🔥' : 'Roast Me 🔥'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-400 flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin"></div>
                      <span className="text-sm font-mono uppercase tracking-widest animate-pulse transition-all duration-300">
                        {loadingText}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'DONE' && result && (
          <div className="w-full">
            <RoastResult result={result} onReset={reset} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-stone-700 text-sm font-medium">
        <p>Made with ❤️ by <span className="text-stone-500 hover:text-stone-300 transition-colors cursor-default">Punyansh Singla</span></p>
      </footer>
    </div>
  );
}