import React, { useEffect } from 'react';
import { Flame } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface BustImpactOverlayProps {
  onDismiss?: () => void;
}

export const BustImpactOverlay: React.FC<BustImpactOverlayProps> = ({ onDismiss }) => {
  useEffect(() => {
    sound.playBust();
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-ink-950/80 animate-in fade-in duration-150">
      {/* Cracked Glass / Shatter Overlay Box */}
      <div className="relative text-center p-6 sm:p-10 rounded-lg bg-ink-950/95 border border-garnet-500 max-w-lg mx-4 animate-shake-violent select-none">
        {/* Flame Crown */}
        <div className="w-16 h-16 mx-auto rounded-full border border-garnet-500/60 flex items-center justify-center mb-3">
          <Flame className="w-8 h-8 text-garnet-400" />
        </div>

        {/* BUST Title */}
        <h2 className="text-5xl sm:text-6xl font-medium text-garnet-500">
          BUST!
        </h2>

        {/* Subtitle */}
        <div className="mt-3 flex items-center justify-center gap-2 text-brass-300 font-medium text-base sm:text-lg">
          <Flame className="w-5 h-5 text-garnet-400" />
          <span>Nổ lượt do rút trùng hệ toán</span>
          <Flame className="w-5 h-5 text-garnet-400" />
        </div>

        {/* Lore & Strategy Note */}
        <p className="text-xs text-ink-300 mt-3 leading-relaxed max-w-md mx-auto">
          Hai lá bài mang cùng một <strong>Hệ toán học</strong> đã xung đột năng lượng ma pháp. Điểm tạm thời lượt này về 0 và quyền đi chuyển sang đối thủ
        </p>

        {/* Pro Tip Box */}
        <div className="mt-4 p-3 bg-ink-900 border border-brass-500/40 rounded-lg text-xs text-brass-200 font-medium flex items-center gap-2 text-left">
          <span>
            <strong>Chiến thuật:</strong> Rút 2-3 lá có điểm số tốt rồi bấm <strong>[BANK]</strong> để chốt điểm vào Kho an toàn, hoặc trang bị <strong>Rune khiên hộ thân</strong> để chặn 1 lần BUST
          </span>
        </div>

        {/* Quick Close Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-5 px-8 py-3 text-white font-medium text-xs rounded-md transition-transform active:scale-95 cursor-pointer bg-garnet-600 hover:bg-garnet-500"
          >
            Tiếp tục trận đấu
          </button>
        )}
      </div>
    </div>
  );
};
