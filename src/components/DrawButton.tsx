import React, { useState } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface DrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const DrawButton: React.FC<DrawButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setClicked(true);
    sound.playDraw();
    setTimeout(() => setClicked(false), 250);
    onClick();
  };

  return (
    <div className={`relative group inline-block w-full ${className}`}>
      {/* Outer Radiant Glow when enabled */}
      {!disabled && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 animate-pulse pointer-events-none" />
      )}

      {/* Button Body */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`relative w-full overflow-hidden py-4 sm:py-5 px-6 rounded-2xl font-cinzel font-black tracking-wider text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 select-none ${
          disabled
            ? 'bg-slate-900/90 border border-slate-850 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
            : clicked
            ? 'scale-[0.96] shadow-inner bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 text-slate-950'
            : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-[1.03] active:scale-[0.96] cursor-pointer'
        }`}
      >
        {/* Animated Light Sweep Beam on Hover */}
        {!disabled && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] transform -translate-x-full group-hover:animate-light-sweep" />
          </div>
        )}

        {/* Decorative corner metallic pins */}
        {!disabled && (
          <>
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-950/60" />
            <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-950/60" />
            <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-950/60" />
            <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-950/60" />
          </>
        )}

        {/* Button Content */}
        <div className="relative z-10 flex items-center justify-center gap-2.5">
          <span className="text-xl sm:text-2xl filter drop-shadow">🃏</span>
          <span className="drop-shadow-sm font-extrabold uppercase">
            RÚT BÀI (DRAW)
          </span>
          <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
        </div>
      </button>
    </div>
  );
};
