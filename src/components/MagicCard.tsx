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
  Calculator,
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
    Rare: 'border-blue-500',
    Epic: 'border-purple-500',
    Legendary: 'border-amber-400',
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
    sm: 'w-20 sm:w-24 h-28 sm:h-32 text-[11px]',
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
          className={`absolute inset-0 backface-hidden rounded-2xl border flex flex-col justify-between overflow-hidden transition-[color,background-color,border-color,opacity,transform] duration-300 ${
            isProFoil
              ? 'border-amber-400'
              : rarityBorders[card.rarity] || 'border-slate-700'
          }`}
          style={{
            backgroundColor: '#121214',
            borderColor: isProFoil ? '#c1a05a' : card.elementColor,
          }}
        >
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
          <div className="relative z-10 p-2 sm:p-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="p-1 rounded-lg border shrink-0"
                style={{
                  backgroundColor: `${card.elementColor}22`,
            borderColor: card.elementColor,
                  color: card.elementColor,
                }}
              >
                {getDomainIcon(card.domainId, size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}
              </span>
              <span
                className="font-medium truncate"
                style={{ color: card.elementColor }}
              >
                {card.domainNameVi}
              </span>
            </div>

            {/* Point Gem */}
            <div
              className={`font-medium font-mono px-2 py-0.5 rounded-lg border flex items-center gap-0.5 ${
                isProFoil
                  ? 'text-on-accent border-amber-400 bg-amber-500'
                  : 'text-amber-300 border-slate-700'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>+{card.pointValue}</span>
            </div>
          </div>

          {/* CARD CENTER ARTWORK / RUNIC EMBLEM */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 text-center">
            {/* Runic Glow Ring */}
            <div className="relative flex items-center justify-center my-auto">
              <div
                className={`rounded-full border border-dashed ${
                  size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-20 h-20' : 'w-32 h-32'
                }`}
style={{ borderColor:`${card.elementColor}66` }}
              />
              <div
                className={`absolute rounded-full border border-dotted ${
                  size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-26 h-26'
                }`}
style={{ borderColor:`${card.elementColor}44` }}
              />

              {/* Central Core */}
              <div
                className={`absolute rounded-2xl flex items-center justify-center border transition-transform ${
                  size === 'sm' ? 'w-9 h-9 text-base' : size === 'md' ? 'w-14 h-14 text-2xl' : 'w-20 h-20 text-4xl'
                } ${isHovered ? 'scale-110' : ''}`}
                style={{
                  backgroundColor: `${card.elementColor}26`,
            borderColor: isProFoil ? '#e2cf9a' : card.elementColor,
                }}
              >
                {getDomainIcon(card.domainId, size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10')}
              </div>
            </div>

            {/* Skill Title */}
            <div className="mt-1 w-full px-1">
              <div
                className={`font-medium truncate ${
                  size === 'sm' ? 'text-[11px]' : size === 'md' ? 'text-xs' : 'text-sm'
                }`}
                style={{ color: isProFoil ? '#e2cf9a' : '#f6f6f7' }}
              >
                {card.skillName}
              </div>

              {size !== 'sm' && showDetails && (
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-tight">
                  {card.skillDesc}
                </p>
              )}
            </div>
          </div>

          {/* CARD FOOTER: Rarity & PRO Insignia */}
          <div className="relative z-10 px-2 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
            <span className={`text-[11px] font-medium font-mono ${rarityGems[card.rarity]}`}>
              {card.rarity}
            </span>

            {isProFoil ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-300 px-2 py-0.5 rounded border border-amber-500/60">
                <Crown className="w-3 h-3" />
                <span>Pro</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">#{card.id}</span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CARD BACK                                             */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden"
          style={{ backgroundColor: '#121214' }}
        >
          <div className="absolute inset-2 border border-slate-700/70 rounded-xl" />
          <div className="w-20 h-20 rounded-full border border-amber-500/50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-amber-500/30 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="mt-3 text-center z-10">
            <div className="font-cinzel font-medium text-xs text-amber-300">
              Math Rune
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Draw &amp; Solve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
