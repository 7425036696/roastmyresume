import React, { useEffect } from 'react';

interface Props {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
      <div className="bg-stone-900 border border-red-500/50 text-red-200 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;