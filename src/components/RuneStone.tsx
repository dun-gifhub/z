import React from 'react';
import { RuneDef } from '../../shared/types.ts';
import { RuneIcon } from './RuneIcon.tsx';
import { Sparkles, Zap, Shield, Clock, Flame } from 'lucide-react';

interface RuneStoneProps {
  rune: RuneDef;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  isExhausted?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  className?: string;
  showDetails?: boolean;
}

export const RuneStone: React.FC<RuneStoneProps> = ({
  rune,
  size = 'md',
  isActive = false,
  isExhausted = false,
  isClickable = false,
  onClick,
  className = '',
  showDetails = false,
}) => {
  const getCategoryColor = () => {
    switch (rune.category) {
      case 'DEFENSE':
        return {
          glow: 'rgba(239, 68, 68, 0.45)',
          border: '#ef4444',
          bg: 'from-rose-950/60 to-slate-950',
          badge: 'bg-rose-950 border-rose-600 text-rose-300',
        };
      case 'TIME':
        return {
          glow: 'rgba(14, 165, 233, 0.45)',
          border: '#0ea5e9',
          bg: 'from-sky-950/60 to-slate-950',
          badge: 'bg-sky-950 border-sky-600 text-sky-300',
        };
      case 'POINTS':
        return {
          glow: 'rgba(234, 179, 8, 0.45)',
          border: '#eab308',
          bg: 'from-amber-950/60 to-slate-950',
          badge: 'bg-amber-950 border-amber-600 text-amber-300',
        };
      case 'MAGIC':
      default:
        return {
          glow: 'rgba(168, 85, 247, 0.45)',
          border: '#a855f7',
          bg: 'from-purple-950/60 to-slate-950',
          badge: 'bg-purple-950 border-purple-600 text-purple-300',
        };
    }
  };

  const catStyle = getCategoryColor();

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  // If it's a full showcase card (e.g. in Rune Grimoire or Draft)
  if (showDetails) {
    return (
      <div
        onClick={isClickable ? onClick : undefined}
        style={{
          borderColor: !isExhausted ? rune.color : '#475569',
          boxShadow: !isExhausted ? `0 0 20px ${catStyle.glow}` : 'none',
        }}
        className={`group relative p-4 bg-gradient-to-b ${catStyle.bg} border-2 rounded-2xl flex flex-col justify-between space-y-3 transition-all duration-200 ${
          isClickable ? 'cursor-pointer hover:scale-[1.02] hover:border-amber-400' : ''
        } ${isExhausted ? 'opacity-50 grayscale border-dashed' : ''} ${className}`}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border-2 bg-slate-950 flex items-center justify-center shadow-inner ${
                !isExhausted ? 'animate-pulse' : ''
              }`}
              style={{
                borderColor: rune.color,
                color: rune.color,
                boxShadow: `0 0 12px ${rune.color}44`,
              }}
            >
              <RuneIcon icon={rune.icon} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-cinzel text-base font-black text-amber-200 group-hover:text-amber-100">
                  {rune.name}
                </h4>
                {rune.limitType === 'once_per_match' && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/50 uppercase tracking-wider">
                    1 Lần / Trận
                  </span>
                )}
                {rune.limitType === 'once_per_turn' && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/50 uppercase tracking-wider">
                    1 Lần / Lượt
                  </span>
                )}
                {rune.limitType === 'continuous' && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 uppercase tracking-wider">
                    Liên Tục
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">
                {rune.categoryNameVi} • Cổ Ngữ Phong Ấn
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            {rune.description}
          </p>

          {/* Persistent Effect Badge */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-[11px] text-amber-200 font-medium space-y-1">
            <div className="font-bold text-amber-400 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Nội Tại Kích Hoạt:</span>
              </div>
              <span className="font-mono text-slate-400">
                {rune.limitType === 'once_per_match'
                  ? '⚡ Duy nhất 1 lần'
                  : rune.limitType === 'once_per_turn'
                  ? '🔄 Mỗi lượt tự làm mới'
                  : '✨ Bất biến vĩnh viễn'}
              </span>
            </div>
            <p className="text-slate-300 font-normal leading-normal">
              {rune.persistentEffectDesc || rune.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Stone Token
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      style={{
        borderColor: !isExhausted ? rune.color : '#475569',
        boxShadow: !isExhausted ? `0 0 14px ${catStyle.glow}` : 'none',
      }}
      className={`relative inline-flex items-center justify-center bg-gradient-to-b ${catStyle.bg} border-2 ${containerSizes[size]} ${
        isClickable ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform' : ''
      } ${isExhausted ? 'opacity-50 grayscale border-dashed' : ''} ${className}`}
      title={`${rune.name}: ${rune.description}`}
    >
      <RuneIcon
        icon={rune.icon}
        className={iconSizes[size]}
        style={{ color: !isExhausted ? rune.color : '#94a3b8' }}
      />
      {isActive && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border border-slate-950 rounded-full animate-ping" />
      )}
    </div>
  );
};
