import React from 'react';
import { Smartphone, RotateCw, X, CheckCircle, ExternalLink, Zap } from 'lucide-react';

interface RotateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateVirtual?: () => void;
  onOpenExternal?: () => void;
}

export const RotateDeviceModal: React.FC<RotateDeviceModalProps> = ({
  isOpen,
  onClose,
  onActivateVirtual,
  onOpenExternal,
}) => {
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
            CÁCH XOAY NGANG MÀN HÌNH
          </h3>
          <p className="text-xs text-indigo-200 font-medium">
            Góc Rộng Chuẩn Đấu Trường Thẻ Bài TCG
          </p>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-left text-xs space-y-2.5 text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong>Bật Tự Động Xoay:</strong> Vuốt Trung tâm điều khiển điện thoại và đảm bảo tính năng <strong>Khóa Xoay (Auto-Rotate)</strong> đang được BẬT.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong>Nếu xem trong ứng dụng nhúng/khung xem trước:</strong> Trình duyệt nhúng có thể chặn xoay. Hãy bấm <strong>[Bật Xoay Ngang Ảo]</strong> bên dưới để xoay ngay trên màn hình!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {onActivateVirtual && (
            <button
              onClick={() => {
                onActivateVirtual();
                onClose();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wide"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Bật Xoay Ngang Ảo Ngay</span>
            </button>
          )}

          {onOpenExternal && (
            <button
              onClick={() => {
                onOpenExternal();
                onClose();
              }}
              className="w-full py-2 bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-600 text-indigo-200 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở Trực Tiếp Safari / Chrome</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
