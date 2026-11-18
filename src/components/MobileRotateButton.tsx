import React from 'react';
import { Smartphone, RotateCw, ExternalLink } from 'lucide-react';

interface MobileRotateButtonProps {
  isLandscape: boolean;
  isInIframe?: boolean;
  onToggle: () => void;
  onOpenExternal?: () => void;
}

export const MobileRotateButton: React.FC<MobileRotateButtonProps> = ({
  isLandscape,
  isInIframe = false,
  onToggle,
  onOpenExternal,
}) => {
  return (
    <div className="fixed bottom-3 right-3 z-40 md:hidden flex flex-col items-end gap-1 pointer-events-auto select-none">
      {/* If inside iframe and not in landscape, offer quick external browser button */}
      {isInIframe && !isLandscape && onOpenExternal && (
        <button
          onClick={onOpenExternal}
          title="Mở tab mới trên Safari / Chrome để xoay toàn màn hình"
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-950/90 border border-indigo-600/70 text-indigo-200 text-[10px] font-bold shadow-lg backdrop-blur-md active:scale-95"
        >
          <ExternalLink className="w-3 h-3 text-amber-400" />
          <span>Mở Tab Safari/Chrome</span>
        </button>
      )}

      {/* Main Rotate Button */}
      <button
        onClick={onToggle}
        title={isLandscape ? 'Màn hình đang ở góc ngang' : 'Bấm để xem hướng dẫn và xoay ngang màn hình'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-xl transition-all active:scale-95 border backdrop-blur-md ${
          isLandscape
            ? 'bg-slate-900/90 border-slate-700 text-slate-300 text-xs'
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
            className={`w-2 h-2 absolute -top-1 -right-1 ${
              isLandscape ? 'text-amber-400' : 'text-slate-950 animate-spin'
            }`}
            style={{ animationDuration: '4s' }}
          />
        </div>

        <span className="text-[11px] font-bold tracking-tight">
          {isLandscape ? '📱 Góc Ngang' : '📱 Xoay Ngang'}
        </span>
      </button>

      {/* Hint badge only in portrait */}
      {!isLandscape && (
        <span className="text-[9px] font-mono text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
          Góc rộng bàn đấu 🎴
        </span>
      )}
    </div>
  );
};
