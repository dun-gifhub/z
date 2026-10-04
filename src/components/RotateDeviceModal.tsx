import React from 'react';
import { Smartphone, RotateCw, X, CheckCircle } from 'lucide-react';

interface RotateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RotateDeviceModal: React.FC<RotateDeviceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm p-6 bg-gradient-to-b from-slate-900 to-indigo-950/95 border-2 border-amber-500/80 rounded-3xl shadow-2xl text-center space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Phone Rotation Graphic */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/15 rounded-full blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-slate-950/90 border border-amber-400/50 flex items-center justify-center shadow-lg relative">
            <Smartphone className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <RotateCw className="w-4 h-4 text-yellow-300 absolute -bottom-1 -right-1 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-cinzel text-base font-bold text-amber-300 tracking-wide">
            XOAY NGANG ĐIỆN THOẠI
          </h3>
          <p className="text-xs text-indigo-200 font-medium">
            Góc Rộng Chuẩn Đấu Trường Thẻ Bài TCG
          </p>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <span>
              Mở thanh điều khiển điện thoại và đảm bảo tính năng <strong>Khóa Xoay Màn Hình (Auto-Rotate)</strong> đang được BẬT.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <span>
              Cầm ngang điện thoại — toàn bộ giao diện bàn đấu và thẻ bài sẽ tự động mở rộng nằm ngang!
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wide"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Đã Hiểu & Tiếp Tục Chơi</span>
        </button>
      </div>
    </div>
  );
};
