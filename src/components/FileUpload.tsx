import React, { useCallback, useState } from 'react';
import type{ FileData } from '../types';

interface Props {
  onFileSelect: (fileData: FileData) => void;
  onError: (message: string) => void;
  disabled: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUpload: React.FC<Props> = ({ onFileSelect, onError, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file) return;

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      onError("File is too large (Max 5MB). Please compress it.");
      return;
    }
    
    // Validate type
    // Gemini 2.5 Flash only supports PDF and Images natively via inlineData. 
    // DOCX/ODT require text extraction which is not supported in this client-side demo.
    const validTypes = [
      'application/pdf', 
      'image/png', 
      'image/jpeg', 
      'image/webp', 
      'image/heic',
    ];
    
    // Check if type is valid
    if (!validTypes.includes(file.type)) {
      onError("Invalid file type. Please upload PDF or Images.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Handle base64 extraction safely
      const base64 = result.split(',')[1];
      
      onFileSelect({
        file,
        base64,
        mimeType: file.type
      });
    };
    reader.onerror = () => {
      onError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, [onFileSelect, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled, processFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative w-full h-48 sm:h-64 border border-dashed rounded-xl transition-all duration-300
        flex flex-col items-center justify-center text-center p-6 group overflow-hidden
        ${isDragging 
          ? 'border-orange-500 bg-orange-950/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]' 
          : 'border-stone-800 hover:border-orange-500/50 bg-stone-900/30'}
        ${disabled ? 'pointer-events-none opacity-30 grayscale' : ''}
      `}
    >
      <input
        type="file"
        onChange={handleChange}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.heic"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        disabled={disabled}
      />
      
      <div className="z-10 pointer-events-none flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105">
        <div className={`p-3 rounded-xl bg-stone-900 border border-stone-800 shadow-xl transition-colors duration-300 ${isDragging ? 'text-orange-500 border-orange-500' : 'text-stone-400 group-hover:text-orange-400 group-hover:border-orange-500/30'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold text-stone-200 tracking-tight">
            {isDragging ? "DROP IT" : "Upload Resume"}
          </p>
          <p className="text-xs text-stone-500 mt-1 font-mono uppercase tracking-wider">
            PDF • PNG • JPG (Max 5MB)
          </p>
        </div>
      </div>

      {/* Grid pattern background effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default FileUpload;