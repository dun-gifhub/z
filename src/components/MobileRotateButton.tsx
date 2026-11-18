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
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-950/90 border border-indigo-600/70 text-indigo-200 text-[11px] font-medium active:scale-95"
        >
          <ExternalLink className="w-3 h-3 text-amber-400" />
          <span>Mở tab Safari/Chrome</span>
        </button>
      )}

      {/* Main Rotate Button */}
      <button
        onClick={onToggle}
        title={isLandscape ? 'Màn hình đang ở góc ngang' : 'Bấm để xem hướng dẫn và xoay ngang màn hình'}
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-[color,background-color,border-color,opacity,transform] active:scale-95 border ${
          isLandscape
            ? 'bg-slate-900/90 border-slate-700 text-slate-300 text-xs'
            : 'border-amber-300 text-on-accent font-medium text-xs bg-amber-500'
        }`}
      >
        <div className="relative">
          <Smartphone
            className={`w-4 h-4 transition-transform duration-300 ${
              isLandscape ? 'rotate-90 text-amber-400' : 'text-on-accent'
            }`}
          />
          <RotateCw
            className={`w-2 h-2 absolute -top-1 -right-1 ${
              isLandscape ? 'text-amber-400' : 'text-on-accent'
            }`}
            style={{ animationDuration: '4s' }}
          />
        </div>

        <span className="text-[11px] font-medium">
          {isLandscape ? 'Góc ngang' : 'Xoay ngang'}
        </span>
      </button>

      {/* Hint badge only in portrait */}
      {!isLandscape && (
        <span className="text-[11px] font-mono text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-amber-500/40">
          Góc rộng bàn đấu 
        </span>
      )}
    </div>
  );
};
