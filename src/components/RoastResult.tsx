import React, { useEffect, useState } from 'react';
import type{ RoastResponse } from '../types';

interface Props {
  result: RoastResponse;
  onReset: () => void;
}

const RoastResult: React.FC<Props> = ({ result, onReset }) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    // Animate score count up
    let start = 0;
    const end = result.score;
    if (start === end) return;

    const duration = 1500;
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setDisplayedScore(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [result.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500 animate-pulse-fast';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "GODLIKE";
    if (score >= 70) return "HIREABLE";
    if (score >= 50) return "MEH";
    if (score >= 30) return "TRAGIC";
    return "UNEMPLOYABLE";
  };

  return (
    <div className="w-full max-w-5xl animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
      
      {/* Score Section */}
      <div className="flex flex-col items-center justify-center mb-10 relative z-10">
        <div className="text-stone-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Verdict</div>
        <div className={`text-8xl md:text-9xl font-black ${getScoreColor(displayedScore)} tabular-nums leading-none tracking-tighter drop-shadow-2xl`}>
          {displayedScore}
        </div>
        <div className={`text-2xl font-bold tracking-widest mt-4 ${getScoreColor(displayedScore)} opacity-90`}>
          {getScoreMessage(result.score)}
        </div>
      </div>

      {/* One Liner Quote */}
      <div className="w-full max-w-3xl mb-12 text-center relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-stone-900/40 border border-stone-800 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
             <span className="text-4xl absolute top-4 left-4 text-stone-700 font-serif opacity-50">"</span>
             <p className="text-xl md:text-2xl text-stone-200 font-medium leading-relaxed italic">
               {result.oneLiner}
             </p>
             <span className="text-4xl absolute bottom-4 right-4 text-stone-700 font-serif opacity-50">"</span>
          </div>
      </div>

      {/* Roast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {result.sections.map((section, idx) => (
          <div 
            key={idx}
            className="bg-stone-900 border border-stone-800 rounded-xl p-6 hover:border-stone-700 transition-all duration-300 shadow-xl overflow-hidden group"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center gap-3 mb-4 border-b border-stone-800 pb-3">
               <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
               <h3 className="text-lg font-bold text-stone-100 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                 {section.title}
               </h3>
            </div>
            <ul className="space-y-3">
              {section.content.map((point, pIdx) => (
                <li key={pIdx} className="text-stone-400 text-sm md:text-base leading-relaxed flex gap-3">
                   <span className="text-stone-600 mt-1.5">•</span>
                   <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pb-12">
        <button
          onClick={onReset}
          className="group relative px-8 py-3 bg-stone-100 text-stone-950 font-bold rounded-full overflow-hidden transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Roast Another
          </span>
          <div className="absolute inset-0 bg-ember-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out opacity-20"></div>
        </button>
      </div>
    </div>
  );
};

export default RoastResult;