import React, { useEffect } from 'react';
import { Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface BustImpactOverlayProps {
  onDismiss?: () => void;
}

export const BustImpactOverlay: React.FC<BustImpactOverlayProps> = ({ onDismiss }) => {
  useEffect(() => {
    sound.playBust();
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-rose-950/70 backdrop-blur-md animate-in fade-in duration-150">
      {/* Red Screen Shockwave Flash */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 via-rose-500/20 to-transparent pointer-events-none animate-pulse" />

      {/* Cracked Glass / Shatter Overlay Box */}
      <div className="relative text-center p-6 sm:p-10 rounded-3xl bg-slate-950/95 border-4 border-rose-500 shadow-[0_0_60px_rgba(225,29,72,0.6)] max-w-lg mx-4 animate-shake-violent select-none">
        {/* Flame Crown */}
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-900/40 border-2 border-rose-500/80 flex items-center justify-center text-4xl mb-3 shadow-inner">
          💥
        </div>

        {/* BUST Title */}
        <h2 className="font-cinzel text-5xl sm:text-6xl font-black text-rose-500 tracking-wider drop-shadow-[0_4px_20px_rgba(244,63,94,0.8)]">
          BUST!
        </h2>

        {/* Subtitle */}
        <div className="mt-3 flex items-center justify-center gap-2 text-amber-300 font-black text-base sm:text-lg uppercase tracking-wide">
          <Flame className="w-5 h-5 text-rose-400" />
          <span>NỔ LƯỢT DO RÚT TRÙNG HỆ TOÁN</span>
          <Flame className="w-5 h-5 text-rose-400" />
        </div>

        {/* Lore & Strategy Note */}
        <p className="text-xs text-slate-300 mt-3 leading-relaxed max-w-md mx-auto font-light">
          Hai lá bài mang cùng một <strong>Hệ Toán Học</strong> đã xung đột năng lượng ma pháp. Điểm tạm thời lượt này về 0 và quyền đi chuyển sang đối thủ!
        </p>

        {/* Pro Tip Box */}
        <div className="mt-4 p-3 bg-slate-900 border border-amber-500/40 rounded-2xl text-xs text-amber-200 font-medium flex items-center gap-2 text-left">
          <span className="text-lg">🛡️</span>
          <span>
            <strong>Chiến thuật:</strong> Rút 2-3 lá có điểm số tốt rồi bấm <strong>[BANK]</strong> để chốt điểm vào Kho An Toàn, hoặc trang bị <strong>Rune Khiên Hộ Thân</strong> để chặn 1 lần BUST!
          </span>
        </div>

        {/* Quick Close Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-5 px-8 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-cinzel font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-wider cursor-pointer"
          >
            TIẾP TỤC TRẬN ĐẤU
          </button>
        )}
      </div>
    </div>
  );
};
