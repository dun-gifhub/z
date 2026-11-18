import React, { useState, useEffect } from 'react';
import { Card } from '../../shared/types.ts';
import { MathCard } from './MathCard.tsx';
import { sound } from '../utils/soundEffects.ts';
import { Sparkles, RotateCcw } from 'lucide-react';

interface FlipCardRevealProps {
  card: Card;
  autoFlip?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}

export const FlipCardReveal: React.FC<FlipCardRevealProps> = ({
  card,
  autoFlip = true,
  size = 'md',
  className = '',
}) => {
  // isFlipped = true means FRONT is visible (card revealed)
  // isFlipped = false means BACK is visible (rune card back)
  const [isFlipped, setIsFlipped] = useState<boolean>(!autoFlip);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (autoFlip) {
      // Start face down, flip face up after a brief dramatic pause
      setIsFlipped(false);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsFlipped(true);
        sound.playCardFlip();
        setTimeout(() => setIsAnimating(false), 700);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [card.id, autoFlip]);

  const handleManualFlip = () => {
    setIsFlipped(prev => !prev);
    sound.playCardFlip();
  };

  const dimensions =
    size === 'lg'
      ? 'w-48 sm:w-56 h-72 sm:h-80'
      : 'w-36 sm:w-40 h-52 sm:h-60';

  return (
    <div
      className={`relative group cursor-pointer select-none perspective-1000 ${dimensions} ${className}`}
      onClick={handleManualFlip}
      title="Nhấp để lật bài 3D"
    >
      {/* 3D Flipper Container */}
      <div
        className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-0' : 'rotate-y-180'
        } ${isAnimating ? 'scale-105 shadow-2xl' : 'hover:scale-[1.02]'}`}
      >
        {/* ========================================================= */}
        {/* FRONT FACE (LÁ BÀI THẬT)                                 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl">
          <MathCard card={card} variant="standard" />

          {/* Reveal Shimmer Starburst */}
          {isAnimating && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-amber-400/20 animate-ping opacity-60" />
              <Sparkles className="w-10 h-10 text-amber-300 animate-spin absolute" />
            </div>
          )}

          {/* Flip Hint Icon */}
          <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-slate-950/80 border border-slate-700/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE (MẶT SAU CỔ NGỮ MA THUẬT)                      */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-2 border-amber-500/70 p-3 flex flex-col items-center justify-between shadow-2xl overflow-hidden">
          {/* Ornate corner gold brackets */}
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400/80" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400/80" />
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400/80" />
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400/80" />

          {/* Top text */}
          <div className="text-[10px] font-cinzel font-bold text-amber-400/90 tracking-widest uppercase">
            Math Rune
          </div>

          {/* Center Magic Seal */}
          <div className="relative flex items-center justify-center">
            {/* Spinning rune orbit ring */}
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border-2 border-dashed border-amber-400/50 animate-rune-spin" />
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border border-indigo-400/40 absolute" />
            
            {/* Center Symbol */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl select-none filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                🧮
              </span>
              <span className="text-[8px] font-mono text-amber-300 font-bold tracking-tighter mt-0.5">
                CỔ NGỮ
              </span>
            </div>
          </div>

          {/* Bottom text */}
          <div className="flex items-center gap-1 text-[9px] font-mono text-indigo-300/80">
            <RotateCcw className="w-2.5 h-2.5" />
            <span>NHẤP ĐỂ LẬT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
