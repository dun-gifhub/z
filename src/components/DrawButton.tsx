import React, { useState } from 'react';
import { Layers } from 'lucide-react';
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
        <div className="absolute -inset-1 rounded-2xl opacity-60 group-hover:opacity-100 transition-[color,background-color,border-color,opacity,transform] duration-300 pointer-events-none bg-amber-500" />
      )}

      {/* Button Body */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`relative w-full overflow-hidden py-4 sm:py-5 px-6 rounded-2xl font-medium text-base sm:text-lg flex items-center justify-center gap-3 transition-[color,background-color,border-color,opacity,transform] duration-200 select-none ${
          disabled
            ? 'bg-slate-900/90 border border-slate-850 text-slate-500 cursor-not-allowed opacity-50'
            : clicked
            ? 'scale-[0.96] text-on-accent bg-yellow-500'
            : 'text-on-accent active:scale-[0.96] cursor-pointer bg-amber-500 hover:bg-amber-400'
        }`}
      >
        {/* Animated Light Sweep Beam on Hover */}
        {!disabled && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-1/2 h-full skew-x-[-25deg] transform -translate-x-full" />
          </div>
        )}

        {/* Decorative corner metallic pins */}
        {!disabled && (
          <>
            <div className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-slate-950/60" />
            <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-slate-950/60" />
            <div className="absolute bottom-1.5 left-2 w-2 h-2 rounded-full bg-slate-950/60" />
            <div className="absolute bottom-1.5 right-2 w-2 h-2 rounded-full bg-slate-950/60" />
          </>
        )}

        {/* Button Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="font-medium text-xs sm:text-base md:text-lg whitespace-nowrap">
            Rút thẻ tri thức
          </span>
        </div>
      </button>
    </div>
  );
};
