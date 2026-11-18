import React from 'react';
import { Card, CardRarity, MathCategory } from '../../shared/types.ts';
import { DomainArt } from './DomainArt.tsx';
import { Zap, Sparkles, Shield, Info } from 'lucide-react';

interface MathCardProps {
  card: Card;
  variant?: 'mini' | 'standard' | 'hero';
  onClick?: () => void;
  className?: string;
  isDrawCard?: boolean;
}

export const MathCard: React.FC<MathCardProps> = ({
  card,
  variant = 'standard',
  onClick,
  className = '',
  isDrawCard = false,
}) => {
  const rarityConfig: Record<CardRarity, {
    label: string;
    borderGrad: string;
    bgGrad: string;
    gemColor: string;
    glowColor: string;
    ringColor: string;
  }> = {
    Common: {
      label: 'Phổ Biến',
      borderGrad: 'from-slate-400 via-slate-600 to-slate-700',
      bgGrad: 'from-slate-900 via-slate-950 to-slate-900',
      gemColor: '#94a3b8',
      glowColor: 'rgba(148, 163, 184, 0.35)',
      ringColor: 'border-slate-500',
    },
    Rare: {
      label: 'Hiếm',
      borderGrad: 'from-blue-400 via-indigo-500 to-blue-700',
      bgGrad: 'from-slate-900 via-blue-950/80 to-slate-900',
      gemColor: '#60a5fa',
      glowColor: 'rgba(96, 165, 250, 0.45)',
      ringColor: 'border-blue-400',
    },
    Epic: {
      label: 'Cực Hiếm',
      borderGrad: 'from-purple-400 via-fuchsia-500 to-indigo-700',
      bgGrad: 'from-slate-900 via-purple-950/80 to-slate-900',
      gemColor: '#c084fc',
      glowColor: 'rgba(192, 132, 252, 0.55)',
      ringColor: 'border-purple-400',
    },
    Legendary: {
      label: 'Huyền Thoại',
      borderGrad: 'from-amber-300 via-yellow-500 to-amber-700',
      bgGrad: 'from-slate-900 via-amber-950/80 to-slate-900',
      gemColor: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.65)',
      ringColor: 'border-amber-400',
    },
  };

  const rInfo = rarityConfig[card.rarity] || rarityConfig.Common;

  // ==========================================
  // 1. MINI VARIANT: For table cards in Arena
  // ==========================================
  if (variant === 'mini') {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`${card.domainNameVi} (+${card.pointValue}đ): ${card.skillName} - ${card.skillDesc}`}
        style={{
          borderColor: card.elementColor,
          boxShadow: `0 6px 18px rgba(0,0,0,0.6), 0 0 16px ${card.accentGlow || 'rgba(234, 179, 8, 0.3)'}`,
        }}
        className={`group relative w-20 sm:w-24 p-2 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl border-2 flex flex-col items-center text-center transform transition-all duration-200 hover:scale-110 hover:-translate-y-1.5 active:scale-95 cursor-pointer select-none overflow-hidden ${className}`}
      >
        {/* Subtle top elemental gradient sheen */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: card.elementColor }}
        />

        {/* Decorative corner metallic notches */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-amber-300/60 pointer-events-none" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-amber-300/60 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-amber-300/60 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-amber-300/60 pointer-events-none" />

        {/* Mini Domain Glyph */}
        <div className="my-0.5 transform group-hover:scale-115 transition-transform duration-200">
          <DomainArt category={card.domainId} size="sm" className="w-8 h-8" />
        </div>

        {/* Domain Name */}
        <div
          className="text-[10px] font-black uppercase tracking-tight truncate w-full"
          style={{ color: card.elementColor }}
        >
          {card.domainNameVi}
        </div>

        {/* Points Orb */}
        <div className="text-sm sm:text-base font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
          +{card.pointValue}đ
        </div>

        {/* Skill Name */}
        <div className="text-[9px] text-slate-300 truncate w-full group-hover:text-amber-200 transition-colors font-medium">
          {card.skillName}
        </div>

        {/* Rarity Dot */}
        <div
          className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ring-1 ring-black shadow"
          style={{ backgroundColor: rInfo.gemColor }}
        />
      </button>
    );
  }

  // ==========================================
  // 2. HERO VARIANT: Inspection & Active Draw
  // ==========================================
  if (variant === 'hero') {
    return (
      <div
        style={{
          boxShadow: `0 0 35px ${card.accentGlow || 'rgba(234,179,8,0.4)'}`,
          borderColor: card.elementColor,
        }}
        className={`relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 rounded-3xl p-5 sm:p-6 text-slate-100 space-y-4 overflow-hidden ${className}`}
      >
        {/* Ambient background glow */}
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: card.elementColor }}
        />

        {/* Top Header: Domain Badge, Points, Rarity Gem */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-2xl border-2 flex items-center justify-center bg-slate-950/80"
              style={{ borderColor: card.elementColor }}
            >
              <DomainArt category={card.domainId} size="md" className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-black text-slate-100 tracking-wide">
                  {card.domainNameVi}
                </h3>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border"
                  style={{
                    backgroundColor: `${card.elementColor}22`,
                    borderColor: card.elementColor,
                    color: card.elementColor,
                  }}
                >
                  {card.domainName}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Thuộc tính: Hệ {card.domainNameVi} ({card.domainId})
              </div>
            </div>
          </div>

          {/* Golden Points Seal */}
          <div className="text-right">
            <div className="inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-amber-500/60 shadow-inner">
              <span className="text-[10px] text-amber-400/90 font-mono font-bold uppercase tracking-wider">
                Điểm Thu Hoạch
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 drop-shadow">
                +{card.pointValue}đ
              </span>
            </div>
          </div>
        </div>

        {/* Center Artwork Stage */}
        <div className="relative py-4 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
          <DomainArt category={card.domainId} size="lg" className="w-28 h-28 transform hover:scale-105 transition-transform" />
          
          {/* Rarity Ribbon */}
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
            <span
              className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: rInfo.gemColor,
                color: rInfo.gemColor,
              }}
            >
              ✦ Phẩm Chất {rInfo.label} ✦
            </span>
          </div>
        </div>

        {/* Skill Information Plate */}
        <div className="p-3.5 sm:p-4 bg-slate-950/90 border border-amber-500/40 rounded-2xl space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5 font-cinzel">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Tác Dụng Kỹ Năng: {card.skillName}</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300">
              Ma Pháp Kích Hoạt
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
            {card.skillDesc}
          </p>
        </div>

        {/* Tactical Advice Footer */}
        <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex items-center gap-2 text-[11px] text-indigo-200">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Giải đúng câu hỏi Toán để triệu hồi lá bài này lên bàn đấu và tích lũy điểm số!
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. STANDARD VARIANT: For DeckViewer & Lists
  // ==========================================
  return (
    <div
      onClick={onClick}
      style={{
        borderColor: card.elementColor,
        boxShadow: `0 4px 18px ${card.accentGlow || 'rgba(0, 0, 0, 0.4)'}`,
      }}
      className={`group relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 rounded-2xl p-3 flex flex-col justify-between hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-200 cursor-pointer shadow-xl hover:border-amber-400 select-none overflow-hidden ${className}`}
    >
      {/* Top Foil Shimmer Accent */}
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, ${card.elementColor}, transparent)`,
        }}
      />

      {/* Card Header: Domain Tag & Score Orb */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: `${card.elementColor}22`,
              borderColor: card.elementColor,
              color: card.elementColor,
            }}
          >
            {card.domainNameVi}
          </span>
          <div className="flex items-center gap-1 font-mono text-sm font-black text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30 shadow-inner">
            <span>+{card.pointValue}đ</span>
          </div>
        </div>

        {/* Card Artwork Window */}
        <div className="my-2 py-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-slate-700 transition-colors">
          <div
            className="absolute inset-0 opacity-15 blur-lg pointer-events-none"
            style={{ backgroundColor: card.elementColor }}
          />
          <DomainArt
            category={card.domainId}
            size="md"
            className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-200"
          />
        </div>

        {/* Domain Title */}
        <div className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-200 transition-colors font-cinzel truncate">
          {card.domainName}
        </div>

        {/* Card Skill Preview */}
        <div className="mt-2 p-2 bg-slate-950/90 border border-slate-800 rounded-xl space-y-0.5 group-hover:border-amber-500/40 transition-colors">
          <div className="text-[10px] font-bold text-amber-300 flex items-center gap-1 truncate">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{card.skillName}</span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 font-light leading-tight">
            {card.skillDesc}
          </p>
        </div>
      </div>

      {/* Footer: Rarity Seal & Inspection prompt */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-md border"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderColor: rInfo.gemColor,
            color: rInfo.gemColor,
          }}
        >
          {rInfo.label}
        </span>
        <span className="text-[10px] text-amber-400/90 font-bold group-hover:underline flex items-center gap-0.5">
          <span>Xem thẻ</span>
          <span>&raquo;</span>
        </span>
      </div>
    </div>
  );
};
