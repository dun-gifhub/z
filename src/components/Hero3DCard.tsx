import React, { useState, useRef, useEffect } from 'react';
import { Crown } from 'lucide-react';
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

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(-((y - centerY) / centerY) * 16);
    setRotateY(((x - centerX) / centerX) * 16);
    setIsHovered(true);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleNextShowcase = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    sound.playCardFlip();
    setCardIndex(prev => (prev + 1) % showcaseCards.length);
  };

  return (
    <div className="relative flex flex-col items-center justify-center perspective-1000 py-3 select-none">
      {/* Dynamic 3D Card Object */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleNextShowcase}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="group relative w-[270px] sm:w-80 h-[390px] sm:h-[460px] max-w-[88vw] rounded-2xl cursor-pointer transform-style-3d transition-[color,background-color,border-color,opacity,transform] duration-300"
      >
        {/* Physical Bevel Border Frame */}
        <div
          style={{ borderColor: domainInfo.color }}
          className="relative w-full h-full rounded-2xl p-3 border overflow-hidden flex flex-col justify-between bg-slate-900"
        >
          
          {/* Inner Card Slab Background with Carbon / Runic Texture */}
          <div className="absolute inset-2 rounded-xl border border-slate-800 overflow-hidden bg-slate-950" />

          {/* Card Top Banner: Rarity Crest & Domain Badge */}
          <div className="relative z-10 flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[11px] font-mono font-medium text-amber-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{currentCard.rarity}</span>
            </div>

            <div
              style={{ borderColor: domainInfo.color, color: domainInfo.color }}
              className="px-3 py-1 rounded-full border text-[11px] font-mono font-medium"
            >
              Hệ {domainInfo.nameVi}
            </div>
          </div>

          {/* Central Artwork Window */}
          <div className="relative z-10 my-2 mx-1 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center overflow-hidden bg-slate-900/90">
            {/* Ambient Rune Circle in Artwork */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-48 h-48 rounded-full border border-dashed border-amber-400" />
            </div>

            {/* Glowing Domain Art Hero */}
            <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 transform transition-transform duration-500">
              <DomainArt category={currentCard.domainId} size="lg" className="w-full h-full" />
            </div>

            {/* Point Value Seal */}
            <div className="mt-3 px-4 py-1 rounded-xl text-on-accent font-medium text-lg sm:text-xl flex items-center gap-2 bg-amber-600">
              <span>+{currentCard.pointValue} điểm</span>
            </div>
          </div>

          {/* Card Bottom: Skill & Magic Lore */}
          <div className="relative z-10 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-200 truncate">
                {currentCard.skillName}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                #{currentCard.id}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
              {currentCard.skillDesc}
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Helper Text */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
        <span>Chạm để đổi thẻ ({cardIndex + 1}/{showcaseCards.length})</span>
      </div>
    </div>
  );
};
