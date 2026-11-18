import React, { useState, useEffect } from 'react';
import { Card } from '../../shared/types.ts';
import { MathCard } from './MathCard.tsx';
import { sound } from '../utils/soundEffects.ts';
import { RotateCcw, Calculator } from 'lucide-react';

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
        } ${isAnimating ? 'scale-105' : 'hover:scale-[1.02]'}`}
      >
        {/* ========================================================= */}
        {/* FRONT FACE (LÁ BÀI THẬT)                                 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg">
          <MathCard card={card} variant="standard" />

          {/* Reveal Shimmer Starburst */}
          {isAnimating && (
            <div className="absolute inset-0 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-lg bg-brass-400/20 opacity-60" />
            </div>
          )}

          {/* Flip Hint Icon */}
          <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-ink-950/80 border border-ink-700/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <RotateCcw className="w-4 h-4 text-brass-400" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE (MẶT SAU Cổ ngữ MA THUẬT)                      */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg border border-brass-500/70 p-3 flex flex-col items-center justify-between overflow-hidden bg-ink-950">
          {/* Ornate corner gold brackets */}
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-brass-400/80" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-brass-400/80" />
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-brass-400/80" />
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-brass-400/80" />

          {/* Top text */}
          <div className="text-[11px] font-medium text-brass-400/90">
            Math Rune
          </div>

          {/* Center Magic Seal */}
          <div className="relative flex items-center justify-center">
            {/* Spinning rune orbit ring */}
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border border-dashed border-brass-400/50" />
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border border-dusk-400/40 absolute" />
            
            {/* Center Symbol */}
            <div className="absolute flex flex-col items-center justify-center">
              <Calculator className="w-7 h-7 text-brass-300" />
              <span className="text-[11px] font-mono text-brass-300 font-medium mt-0.5">
                Cổ ngữ
              </span>
            </div>
          </div>

          {/* Bottom text */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-dusk-300/80">
            <RotateCcw className="w-3 h-3" />
            <span>Nhấp để lật</span>
          </div>
        </div>
      </div>
    </div>
  );
};
