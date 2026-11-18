import React from 'react';
import { RuneDef } from '../../shared/types.ts';
import { RuneIcon } from './RuneIcon.tsx';
import { Zap } from 'lucide-react';

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
border:'#ef4444',
          bg: 'from-garnet-950/60 to-ink-950',
          badge: 'bg-garnet-950 border-garnet-600 text-garnet-300',
        };
      case 'TIME':
        return {
          glow: 'rgba(14, 165, 233, 0.45)',
border:'#0ea5e9',
          bg: 'from-lake-950/60 to-ink-950',
          badge: 'bg-lake-950 border-lake-600 text-lake-300',
        };
      case 'POINTS':
        return {
          glow: 'rgba(234, 179, 8, 0.45)',
border:'#eab308',
          bg: 'from-brass-950/60 to-ink-950',
          badge: 'bg-brass-950 border-brass-600 text-brass-300',
        };
      case 'MAGIC':
      default:
        return {
          glow: 'rgba(168, 85, 247, 0.45)',
border:'#a855f7',
          bg: 'from-mauve-950/60 to-ink-950',
          badge: 'bg-mauve-950 border-mauve-600 text-mauve-300',
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
    sm: 'w-8 h-8 rounded-md',
    md: 'w-12 h-12 rounded-md',
    lg: 'w-16 h-16 rounded-lg',
  };

  // If it's a full showcase card (e.g. in Rune Grimoire or Draft)
  if (showDetails) {
    return (
      <div
        onClick={isClickable ? onClick : undefined}
        style={{
            borderColor: !isExhausted ? rune.color :'#475569',
          
        }}
        className={`group relative p-4 ${catStyle.bg} border rounded-lg flex flex-col justify-between space-y-3 transition-[color,background-color,border-color,opacity,transform] duration-200 ${
          isClickable ? 'cursor-pointer hover:border-brass-400' : ''
        } ${isExhausted ? 'opacity-50 grayscale border-dashed' : ''} ${className}`}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-md border bg-ink-950 flex items-center justify-center ${
                !isExhausted ? 'animate-pulse' : ''
              }`}
              style={{
            borderColor: rune.color,
                color: rune.color,
              }}
            >
              <RuneIcon icon={rune.icon} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-medium text-brass-200 group-hover:text-brass-100">
                  {rune.name}
                </h4>
                {rune.limitType === 'once_per_match' && (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-garnet-950/80 text-garnet-300 border border-garnet-500/50">
                    1 Lần / Trận
                  </span>
                )}
                {rune.limitType === 'once_per_turn' && (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-brass-950/80 text-brass-300 border border-brass-500/50">
                    1 Lần / Lượt
                  </span>
                )}
                {rune.limitType === 'continuous' && (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-tide-950/80 text-tide-300 border border-tide-500/50">
                    Liên tục
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-mauve-300">
                {rune.categoryNameVi} • Cổ Ngữ Phong Ấn
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-ink-300 leading-relaxed">
            {rune.description}
          </p>

          {/* Persistent Effect Badge */}
          <div className="p-3 rounded-md bg-ink-950/90 border border-brass-500/30 text-[11px] text-brass-200 font-medium space-y-1">
            <div className="font-medium text-brass-400 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Nội tại kích hoạt:</span>
              </div>
              <span className="font-mono text-ink-400">
                {rune.limitType === 'once_per_match'
                  ? 'Duy nhất 1 lần'
                  : rune.limitType === 'once_per_turn'
                  ? 'Mỗi lượt tự làm mới'
                  : 'Bất biến vĩnh viễn'}
              </span>
            </div>
            <p className="text-ink-300 font-normal leading-normal">
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
            borderColor: !isExhausted ? rune.color :'#475569',
        
      }}
      className={`relative inline-flex items-center justify-center ${catStyle.bg} border ${containerSizes[size]} ${
        isClickable ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${isExhausted ? 'opacity-50 grayscale border-dashed' : ''} ${className}`}
      title={`${rune.name}: ${rune.description}`}
    >
      <RuneIcon
        icon={rune.icon}
        className={iconSizes[size]}
        style={{ color: !isExhausted ? rune.color : '#94a3b8' }}
      />
      {isActive && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-moss-400 border border-ink-950 rounded-full" />
      )}
    </div>
  );
};
