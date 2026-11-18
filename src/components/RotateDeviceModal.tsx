import React from 'react';
import { Smartphone, RotateCw, X, ExternalLink, Sparkles, Check, Monitor } from 'lucide-react';

interface RotateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInIframe?: boolean;
  isWidescreenCompact?: boolean;
  onToggleCompact?: () => void;
  onOpenExternal?: () => void;
}

export const RotateDeviceModal: React.FC<RotateDeviceModalProps> = ({
  isOpen,
  onClose,
  isInIframe = false,
  isWidescreenCompact = false,
  onToggleCompact,
  onOpenExternal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm p-5 sm:p-6 bg-gradient-to-b from-slate-900 to-indigo-950/95 border-2 border-amber-500/80 rounded-3xl shadow-2xl text-center space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Phone Graphic */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-14 h-14 rounded-2xl bg-slate-950/90 border border-amber-400/50 flex items-center justify-center shadow-lg relative">
            <Smartphone className="w-7 h-7 text-amber-400" />
            <RotateCw
              className="w-4 h-4 text-yellow-300 absolute -bottom-1 -right-1 animate-spin"
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-cinzel text-base font-bold text-amber-300 tracking-wide">
            XOAY NGANG BÀN ĐẤU TOÁN HỌC
          </h3>
          <p className="text-xs text-indigo-200">
            Trải nghiệm góc rộng chuẩn đấu trường thẻ bài TCG
          </p>
        </div>

        {/* Note if inside iframe */}
        {isInIframe ? (
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-left text-xs text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <span>⚠️</span>
              <span>Đang mở trong khung xem trước / ứng dụng nhúng:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Khung xem trước của ứng dụng đang khóa cố định màn hình dọc. Để xoay ngang cảm biến tự nhiên và thao tác chạm tốt nhất, hãy bấm <strong>[Mở Tab Mới Safari / Chrome]</strong> bên dưới!
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1">
              <span>💡</span>
              <span>Hướng dẫn xoay ngang trên điện thoại:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Vuốt bảng điều khiển điện thoại, bật <strong>Khóa Xoay (Auto-Rotate)</strong> và cầm ngang điện thoại. Giao diện sẽ tự động co giãn góc rộng!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Button 1: Open external tab */}
          {onOpenExternal && (
            <button
              onClick={() => {
                onOpenExternal();
                onClose();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở Tab Mới Trên Safari / Chrome</span>
            </button>
          )}

          {/* Button 2: Toggle Compact Widescreen Arena Mode on Portrait */}
          {onToggleCompact && (
            <button
              onClick={() => {
                onToggleCompact();
                onClose();
              }}
              className="w-full py-2 bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-500/60 text-indigo-100 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isWidescreenCompact
                  ? 'Tắt Chế Độ Bàn Đấu Thu Gọn'
                  : 'Bật Chế Độ Bàn Đấu Gọn Gàng (Cầm Dọc)'}
              </span>
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
