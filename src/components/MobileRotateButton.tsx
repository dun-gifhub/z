import React from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

interface MobileRotateButtonProps {
  isLandscape: boolean;
  onToggle: () => void;
}

export const MobileRotateButton: React.FC<MobileRotateButtonProps> = ({
  isLandscape,
  onToggle,
}) => {
  return (
    <div className="fixed bottom-3 right-3 z-40 md:hidden flex flex-col items-end gap-1 pointer-events-auto select-none">
      <button
        onClick={onToggle}
        title={isLandscape ? 'Màn hình đang ở chế độ ngang' : 'Bấm để xoay ngang màn hình'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-xl transition-all active:scale-95 border backdrop-blur-md ${
          isLandscape
            ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 opacity-70 hover:opacity-100 text-xs'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 border-amber-300 text-slate-950 font-black shadow-amber-950/40 animate-pulse text-xs'
        }`}
      >
        <div className="relative">
          <Smartphone
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isLandscape ? 'rotate-90 text-amber-400' : 'text-slate-950'
            }`}
          />
          <RotateCw
            className={`w-2 h-2 absolute -top-1 -right-1 animate-spin ${
              isLandscape ? 'text-amber-400' : 'text-slate-950'
            }`}
            style={{ animationDuration: '4s' }}
          />
        </div>

        <span className="text-[11px] tracking-tight">
          {isLandscape ? '📱 Góc Ngang' : '📱 Xoay Ngang'}
        </span>
      </button>

      {/* Mini badge hint only in portrait */}
      {!isLandscape && (
        <span className="text-[9px] font-mono text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
          Góc rộng chuẩn bàn đấu 🎴
        </span>
      )}
    </div>
  );
};
