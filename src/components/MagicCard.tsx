import React, { useState } from 'react';
import { Card, CardRarity, MathCategory } from '../../shared/types.ts';
import { MATH_DOMAINS } from '../../shared/cards.ts';
import {
  Sparkles,
  Zap,
  Flame,
  Box,
  Compass,
  SquareDot,
  MinusCircle,
  Divide,
  Layers,
  Shield,
  Crown,
  Star,
} from 'lucide-react';

export interface MagicCardProps {
  card: Card;
  isFlipped?: boolean; // false = face down (back), true = face up
  isProFoil?: boolean; // Upgraded graphics for PRO tier
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  animateDeal?: boolean;
  showDetails?: boolean;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  card,
  isFlipped = true,
  isProFoil = false,
  size = 'md',
  onClick,
  className = '',
  animateDeal = false,
  showDetails = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const domain = MATH_DOMAINS[card.domainId] || {
    name: card.domainId,
    nameVi: card.domainNameVi,
    color: card.elementColor || '#eab308',
    glow: card.accentGlow || 'rgba(234, 179, 8, 0.5)',
  };

  const rarityBorders: Record<CardRarity, string> = {
    Common: 'border-slate-600',
    Rare: 'border-blue-500 shadow-blue-950/40',
    Epic: 'border-purple-500 shadow-purple-950/60',
    Legendary: 'border-amber-400 shadow-amber-950/80',
  };

  const rarityGems: Record<CardRarity, string> = {
    Common: 'text-slate-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-400',
    Legendary: 'text-amber-300',
  };

  const getDomainIcon = (cat: MathCategory, iconClass = 'w-4 h-4') => {
    switch (cat) {
      case 'NGUYEN_TO':
        return <Flame className={iconClass} />;
      case 'CHINH_PHUONG':
        return <Box className={iconClass} />;
      case 'DAI_SO':
        return <Compass className={iconClass} />;
      case 'KHAI_CAN':
        return <SquareDot className={iconClass} />;
      case 'LUY_THUA':
        return <Zap className={iconClass} />;
      case 'AM_SO':
        return <MinusCircle className={iconClass} />;
      case 'CHIA_HET':
        return <Divide className={iconClass} />;
      case 'PHAN_SO':
        return <Layers className={iconClass} />;
      case 'TUYET_DOI':
        return <Shield className={iconClass} />;
      default:
        return <Zap className={iconClass} />;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (size === 'sm') return; // skip tilt for tiny table cards
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    // max 12 deg tilt
    const rotX = -((y - cy) / cy) * 12;
    const rotY = ((x - cx) / cx) * 12;
    setTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Dimensions
  const sizeClasses = {
    sm: 'w-20 sm:w-24 h-28 sm:h-32 text-[10px]',
    md: 'w-36 sm:w-44 h-52 sm:h-60 text-xs',
    lg: 'w-60 sm:w-68 h-84 sm:h-96 text-sm',
  }[size];

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 select-none cursor-pointer ${sizeClasses} ${className} ${animateDeal ? 'animate-card-flip' : ''}`}
      style={{
        transform: isHovered && size !== 'sm' ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)` : undefined,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
    >
      <div
        className={`w-full h-full relative transform-style-3d transition-transform duration-700 ${
          isFlipped ? '' : 'rotate-y-180'
        }`}
      >
        {/* ======================================================== */}
        {/* 1. CARD FACE (FRONT)                                     */}
        {/* ======================================================== */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${
            isProFoil
              ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] ring-1 ring-amber-300'
              : rarityBorders[card.rarity] || 'border-slate-700'
          }`}
          style={{
            backgroundColor: '#090d16',
            borderColor: isProFoil ? '#fbbf24' : card.elementColor,
            boxShadow: isProFoil
              ? `0 0 30px ${card.accentGlow || 'rgba(245,158,11,0.6)'}, inset 0 0 15px rgba(251,191,36,0.3)`
              : `0 0 16px ${card.accentGlow || 'rgba(15,23,42,0.6)'}`,
          }}
        >
          {/* PRO HOLOGRAPHIC SHIMMER OVERLAY */}
          {isProFoil && <div className="absolute inset-0 pro-foil-overlay z-20" />}

          {/* BACKGROUND ELEMENTAL GLYPH WATERMARK */}
          <div
            className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none text-9xl font-mono"
            style={{ color: card.elementColor }}
          >
            {card.domainId === 'NGUYEN_TO' && 'ℙ'}
            {card.domainId === 'CHINH_PHUONG' && 'x²'}
            {card.domainId === 'DAI_SO' && '∑'}
            {card.domainId === 'KHAI_CAN' && '√'}
            {card.domainId === 'LUY_THUA' && 'aⁿ'}
            {card.domainId === 'AM_SO' && '−'}
            {card.domainId === 'CHIA_HET' && '÷'}
            {card.domainId === 'PHAN_SO' && '½'}
            {card.domainId === 'TUYET_DOI' && '|x|'}
            {card.domainId === 'UOC_BOI' && '∞'}
          </div>

          {/* CARD TOP BAR: Domain Badge & Points */}
          <div className="relative z-10 p-2 sm:p-2.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="p-1 rounded-lg border shrink-0"
                style={{
                  backgroundColor: `${card.elementColor}22`,
                  borderColor: card.elementColor,
                  color: card.elementColor,
                }}
              >
                {getDomainIcon(card.domainId, size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')}
              </span>
              <span
                className="font-black font-cinzel truncate tracking-wide"
                style={{ color: card.elementColor }}
              >
                {card.domainNameVi}
              </span>
            </div>

            {/* Point Gem */}
            <div
              className={`font-black font-mono px-2 py-0.5 rounded-lg border flex items-center gap-0.5 shadow-sm ${
                isProFoil
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 font-extrabold'
                  : 'bg-amber-400/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>+{card.pointValue}</span>
            </div>
          </div>

          {/* CARD CENTER ARTWORK / RUNIC EMBLEM */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 text-center">
            {/* Runic Glow Ring */}
            <div className="relative flex items-center justify-center my-auto">
              <div
                className={`rounded-full border border-dashed animate-arcane-cw ${
                  size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-20 h-20' : 'w-32 h-32'
                }`}
                style={{ borderColor: `${card.elementColor}66` }}
              />
              <div
                className={`absolute rounded-full border border-dotted animate-arcane-ccw ${
                  size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-26 h-26'
                }`}
                style={{ borderColor: `${card.elementColor}44` }}
              />

              {/* Central Core */}
              <div
                className={`absolute rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform ${
                  size === 'sm' ? 'w-9 h-9 text-base' : size === 'md' ? 'w-14 h-14 text-2xl' : 'w-20 h-20 text-4xl'
                } ${isHovered ? 'scale-110' : ''}`}
                style={{
                  backgroundColor: `${card.elementColor}26`,
                  borderColor: isProFoil ? '#fef08a' : card.elementColor,
                  boxShadow: `0 0 20px ${card.accentGlow}`,
                }}
              >
                {getDomainIcon(card.domainId, size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10')}
              </div>
            </div>

            {/* Skill Title */}
            <div className="mt-1 w-full px-1">
              <div
                className={`font-black font-cinzel truncate ${
                  size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-xs' : 'text-sm'
                }`}
                style={{ color: isProFoil ? '#fef08a' : '#f8fafc' }}
              >
                {card.skillName}
              </div>

              {size !== 'sm' && showDetails && (
                <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5 leading-tight font-light">
                  {card.skillDesc}
                </p>
              )}
            </div>
          </div>

          {/* CARD FOOTER: Rarity & PRO Insignia */}
          <div className="relative z-10 px-2 py-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
            <span className={`text-[9px] font-bold font-mono uppercase tracking-wider ${rarityGems[card.rarity]}`}>
              {card.rarity}
            </span>

            {isProFoil ? (
              <span className="flex items-center gap-1 text-[9px] font-black text-amber-300 font-cinzel px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-400">
                <Crown className="w-2.5 h-2.5 text-yellow-400" />
                <span>PRO FOIL</span>
              </span>
            ) : (
              <span className="text-[9px] text-slate-500 font-mono">#{card.id}</span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CARD BACK                                             */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-indigo-700/80 flex flex-col items-center justify-center p-3 shadow-2xl overflow-hidden"
          style={{
            backgroundColor: '#070a13',
            boxShadow: '0 0 25px rgba(67, 56, 202, 0.4), inset 0 0 20px rgba(99, 102, 241, 0.2)',
          }}
        >
          {/* Mystic Geometry Circles */}
          <div className="absolute inset-2 border border-indigo-500/30 rounded-xl" />
          <div className="absolute inset-4 border border-amber-500/20 rounded-lg" />
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/50 animate-arcane-cw flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-amber-400/40 animate-arcane-ccw flex items-center justify-center">
              <span className="text-2xl font-cinzel font-black text-amber-400">🧮</span>
            </div>
          </div>

          <div className="mt-2 text-center z-10">
            <div className="font-cinzel font-black text-[11px] tracking-widest text-amber-300 uppercase">
              MATH RUNE
            </div>
            <div className="text-[8px] font-mono text-indigo-400 tracking-wider">
              DRAW & SOLVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
