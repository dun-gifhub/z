import React from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

interface MobileRotateButtonProps {
  isLandscape: boolean;
  isForcedLandscape: boolean;
  onToggle: () => void;
}

export const MobileRotateButton: React.FC<MobileRotateButtonProps> = ({
  isLandscape,
  isForcedLandscape,
  onToggle,
}) => {
  return (
    <div className="fixed bottom-4 right-3 z-50 md:hidden flex flex-col items-end gap-1.5 pointer-events-auto select-none">
      <button
        onClick={onToggle}
        title={isLandscape ? 'Xoay lại màn hình dọc' : 'Xoay ngang màn hình để chơi góc rộng'}
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl shadow-2xl transition-all active:scale-95 border backdrop-blur-md ${
          isLandscape
            ? 'bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border-purple-500/60 text-purple-200 ring-2 ring-purple-500/30 shadow-purple-950/80'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 border-amber-300 text-slate-950 font-black shadow-amber-950/50 animate-bounce'
        }`}
      >
        <div className="relative">
          <Smartphone
            className={`w-4 h-4 transition-transform duration-300 ${
              isLandscape ? 'rotate-90 text-purple-300' : 'text-slate-950'
            }`}
          />
          <RotateCw
            className={`w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-200 animate-spin ${
              isLandscape ? 'text-purple-300' : 'text-slate-950'
            }`}
            style={{ animationDuration: '3s' }}
          />
        </div>

        <span className="text-xs tracking-tight">
          {isLandscape ? '📱 Xoay Dọc Lại' : '📱 Xoay Ngang Màn Hình'}
        </span>
      </button>

      {/* Mini badge hint */}
      {!isLandscape && (
        <span className="text-[9px] font-mono text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
          Góc rộng chuẩn bàn đấu TCG 🎴
        </span>
      )}
    </div>
  );
};
