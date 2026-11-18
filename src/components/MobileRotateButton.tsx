import React from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

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
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-dusk-950/90 border border-dusk-600/70 text-dusk-200 text-[11px] font-medium active:scale-95"
        >
          <span>Mở tab Safari/Chrome</span>
        </button>
      )}

      {/* Main Rotate Button */}
      <button
        onClick={onToggle}
        title={isLandscape ? 'Màn hình đang ở góc ngang' : 'Bấm để xem hướng dẫn và xoay ngang màn hình'}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-[color,background-color,border-color,opacity,transform] active:scale-95 border ${
          isLandscape
            ? 'bg-ink-900/90 border-ink-700 text-ink-300 text-xs'
            : 'border-brass-300 text-on-accent font-medium text-xs bg-brass-500'
        }`}
      >
        <div className="relative">
          <Smartphone
            className={`w-4 h-4 transition-transform duration-300 ${
              isLandscape ? 'rotate-90 text-brass-400' : 'text-on-accent'
            }`}
          />
          <RotateCw
            className={`w-2 h-2 absolute -top-1 -right-1 ${
              isLandscape ? 'text-brass-400' : 'text-on-accent'
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
        <span className="text-[11px] font-mono text-brass-300 bg-ink-950/90 px-2 py-0.5 rounded border border-brass-500/40">
          Góc rộng bàn đấu 
        </span>
      )}
    </div>
  );
};
