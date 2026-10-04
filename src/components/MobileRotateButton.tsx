import React from 'react';
import { Smartphone, RotateCw, ExternalLink, RefreshCw } from 'lucide-react';

interface MobileRotateButtonProps {
  isLandscape: boolean;
  isVirtualLandscape: boolean;
  rotationAngle?: 90 | 270;
  onToggle: () => void;
  onToggleAngle?: () => void;
  onOpenExternal?: () => void;
}

export const MobileRotateButton: React.FC<MobileRotateButtonProps> = ({
  isLandscape,
  isVirtualLandscape,
  rotationAngle = 90,
  onToggle,
  onToggleAngle,
  onOpenExternal,
}) => {
  return (
    <div className="fixed bottom-3 right-3 z-50 md:hidden flex flex-col items-end gap-1.5 pointer-events-auto select-none">
      {/* If in virtual landscape: Show extra helper buttons */}
      {isVirtualLandscape && onToggleAngle && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleAngle}
            title="Đảo chiều xoay 180 độ"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-[10px] font-bold shadow-lg backdrop-blur-md active:scale-95"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>Đảo {rotationAngle}°</span>
          </button>

          {onOpenExternal && (
            <button
              onClick={onOpenExternal}
              title="Mở tab mới trên Safari / Chrome để xoay cảm biến tự nhiên"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-950/90 border border-indigo-600 text-indigo-200 text-[10px] font-bold shadow-lg backdrop-blur-md active:scale-95"
            >
              <ExternalLink className="w-3 h-3 text-indigo-300" />
              <span>Mở Tab Mới</span>
            </button>
          )}
        </div>
      )}

      {/* Main Rotate Toggle Button */}
      <button
        onClick={onToggle}
        title={isLandscape ? 'Trở về màn hình dọc' : 'Bấm để xoay ngang màn hình'}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl shadow-2xl transition-all active:scale-95 border backdrop-blur-md ${
          isLandscape
            ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-purple-500/70 text-purple-200 shadow-purple-950/80 ring-1 ring-purple-400/30'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 border-amber-300 text-slate-950 font-black shadow-amber-950/60 animate-bounce'
        }`}
      >
        <div className="relative">
          <Smartphone
            className={`w-4 h-4 transition-transform duration-300 ${
              isLandscape ? 'rotate-90 text-purple-300' : 'text-slate-950'
            }`}
          />
          <RotateCw
            className={`w-2 h-2 absolute -top-1 -right-1 ${
              isLandscape ? 'text-purple-300' : 'text-slate-950 animate-spin'
            }`}
            style={{ animationDuration: '3s' }}
          />
        </div>

        <span className="text-xs font-bold tracking-tight">
          {isLandscape ? '📱 Xoay Dọc Lại' : '📱 Xoay Ngang Màn Hình'}
        </span>
      </button>

      {/* Mini badge hint only in portrait */}
      {!isLandscape && (
        <span className="text-[9px] font-mono text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-amber-500/40 shadow-md">
          Chơi góc rộng bàn đấu TCG 🎴
        </span>
      )}
    </div>
  );
};
