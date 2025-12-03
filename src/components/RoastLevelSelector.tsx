import React from 'react';
import type { Language } from '../types';

import { RoastLevel } from "../types"
interface Props {
  value: RoastLevel;
  onChange: (level: RoastLevel) => void;
  disabled: boolean;
  language: Language;
}

const RoastLevelSelector: React.FC<Props> = ({ value, onChange, disabled, language }) => {
  const getLabels = (id: RoastLevel) => {
    switch (id) {
      case RoastLevel.MILD:
        return { ENGLISH: 'Simmer', HINDI: 'Halka Phulka' };
      case RoastLevel.SPICY:
        return { ENGLISH: 'Flame Grill', HINDI: 'Masaledaar' };
      case RoastLevel.SCORCHED_EARTH:
        return { ENGLISH: 'Incinerate', HINDI: 'Satyanaash' };
    }
  };

  const levels = [
    { id: RoastLevel.MILD, icon: '🍲', color: 'bg-green-500/10 text-green-500 border-green-500/50' },
    { id: RoastLevel.SPICY, icon: '🔥', color: 'bg-orange-500/10 text-orange-500 border-orange-500/50' },
    { id: RoastLevel.SCORCHED_EARTH, icon: '☢️', color: 'bg-red-600/10 text-red-500 border-red-500/50' },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => {
          const isSelected = value === level.id;
          const labels = getLabels(level.id);

          return (
            <button
              key={level.id}
              onClick={() => onChange(level.id)}
              disabled={disabled}
              className={`
                relative overflow-hidden p-3 rounded-xl border transition-all duration-300
                flex flex-col items-center justify-center gap-1
                ${isSelected
                  ? `${level.color} shadow-lg`
                  : 'border-stone-800 bg-stone-900/40 text-stone-500 hover:border-stone-700 hover:text-stone-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
            >
              <span className={`text-2xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale opacity-70'}`}>
                {level.icon}
              </span>
              <span
                key={language}
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-[fadeIn_0.5s_ease-out]"
              >
                {labels[language]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoastLevelSelector;