import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { DomainArt } from './DomainArt.tsx';
import { DECK_60_CARDS, MATH_DOMAINS } from '../../shared/cards.ts';
import { sound } from '../utils/soundEffects.ts';

export const Hero3DCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Showcase legendaries & archetypes
  const showcaseCards = DECK_60_CARDS.filter(c => c.rarity === 'Legendary' || c.pointValue >= 25);
  const currentCard = showcaseCards[cardIndex % showcaseCards.length] || DECK_60_CARDS[0];
  const domainInfo = MATH_DOMAINS[currentCard.domainId] || MATH_DOMAINS.NGUYEN_TO;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Pitch and Yaw (-15deg to +15deg)
    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleNextShowcase = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCardFlip();
    setCardIndex(prev => (prev + 1) % showcaseCards.length);
  };

  return (
    <div className="relative flex flex-col items-center justify-center perspective-1000 py-4 select-none">
      {/* Dynamic 3D Card Object */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleNextShowcase}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="group relative w-72 sm:w-80 h-[430px] sm:h-[460px] rounded-3xl cursor-pointer transform-style-3d shadow-2xl transition-all duration-300"
      >
        {/* Outer 3D Halo Ambient Glow */}
        <div
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${domainInfo.glow}, transparent 75%)`,
          }}
          className="absolute -inset-4 rounded-3xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity"
        />

        {/* Physical Bevel Border Frame */}
        <div className="relative w-full h-full rounded-3xl p-3 bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-900 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-amber-300/60 overflow-hidden flex flex-col justify-between">
          
          {/* Inner Card Slab Background with Carbon / Runic Texture */}
          <div className="absolute inset-1.5 rounded-[22px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 overflow-hidden" />

          {/* Holographic Specular Foil Layer (Follows cursor) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl opacity-40 group-hover:opacity-75 transition-opacity foil-texture"
            style={{
              backgroundPosition: `${glarePos.x}% ${glarePos.y}%`,
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* Card Top Banner: Rarity Crest & Domain Badge */}
          <div className="relative z-10 flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/50 text-[11px] font-mono font-bold text-amber-300 shadow">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentCard.rarity}</span>
            </div>

            <div
              style={{ backgroundColor: `${domainInfo.color}30`, borderColor: domainInfo.color }}
              className="px-2.5 py-1 rounded-full border text-[11px] font-mono font-black text-amber-200 shadow"
            >
              HỆ: {domainInfo.nameVi.toUpperCase()}
            </div>
          </div>

          {/* Central Artwork Window */}
          <div className="relative z-10 my-2 mx-1 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-700/60 p-4 shadow-inner flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Rune Circle in Artwork */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-amber-400 animate-rune-spin" />
            </div>

            {/* Glowing Domain Art Hero */}
            <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <DomainArt category={currentCard.domainId} size="lg" className="w-full h-full" />
            </div>

            {/* Point Value Seal */}
            <div className="mt-3 px-4 py-1 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-cinzel font-black text-lg sm:text-xl shadow-[0_4px_12px_rgba(245,158,11,0.6)] flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>+{currentCard.pointValue} ĐIỂM</span>
            </div>
          </div>

          {/* Card Bottom: Skill & Magic Lore */}
          <div className="relative z-10 p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-1 text-left shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-sm font-black text-amber-200 truncate">
                {currentCard.skillName}
              </span>
              <span className="text-[10px] font-mono text-indigo-400">
                #{currentCard.id}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed line-clamp-2">
              {currentCard.skillDesc}
            </p>
          </div>

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-300 pointer-events-none" />
        </div>
      </div>

      {/* Interactive Helper Text */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Di chuyển chuột để nghiêng 3D • Nhấp để đổi lá bài ({cardIndex + 1}/{showcaseCards.length})</span>
      </div>
    </div>
  );
};
