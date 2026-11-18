import React from 'react';
import { Smartphone, RotateCw, X, ExternalLink } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm p-5 sm:p-6 border border-brass-500/80 rounded-lg text-center space-y-4 bg-ink-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink-400 hover:text-ink-100 rounded-full hover:bg-ink-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Phone Graphic */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="hidden" />
          <div className="w-14 h-14 rounded-lg bg-ink-950/90 border border-brass-400/50 flex items-center justify-center relative">
            <Smartphone className="w-7 h-7 text-brass-400" />
            <RotateCw
              className="w-4 h-4 text-brass-300 absolute -bottom-1 -right-1"
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-medium text-brass-300">
            Xoay ngang bàn đấu toán học
          </h3>
          <p className="text-xs text-dusk-200">
            Trải nghiệm góc rộng chuẩn đấu trường thẻ bài TCG
          </p>
        </div>

        {/* Note if inside iframe */}
        {isInIframe ? (
          <div className="p-3 bg-brass-950/40 border border-brass-500/40 rounded-md text-left text-xs text-brass-200 space-y-1">
            <div className="font-medium flex items-center gap-2 text-brass-300">
              <span>Đang mở trong khung xem trước / ứng dụng nhúng:</span>
            </div>
            <p className="text-[11px] text-ink-300">
              Khung xem trước của ứng dụng đang khóa cố định màn hình dọc. Để xoay ngang cảm biến tự nhiên và thao tác chạm tốt nhất, hãy bấm <strong>[Mở Tab Mới Safari / Chrome]</strong> bên dưới
            </p>
          </div>
        ) : (
          <div className="p-3 bg-ink-950/80 border border-ink-800 rounded-md text-left text-xs text-ink-300 space-y-2">
            <div className="font-medium text-ink-200 flex items-center gap-1">
              <span>Hướng dẫn xoay ngang trên điện thoại:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Vuốt bảng điều khiển điện thoại, bật <strong>Khóa Xoay (Auto-Rotate)</strong> và cầm ngang điện thoại. Giao diện sẽ tự động co giãn góc rộng
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
              className="w-full py-3 text-on-accent font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2 bg-brass-500 hover:bg-brass-400"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở tab mới trên Safari / Chrome</span>
            </button>
          )}

          {/* Button 2: Toggle Compact Widescreen Arena Mode on Portrait */}
          {onToggleCompact && (
            <button
              onClick={() => {
                onToggleCompact();
                onClose();
              }}
              className="w-full py-2 bg-dusk-900/80 hover:bg-dusk-800 border border-dusk-500/60 text-dusk-100 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>
                {isWidescreenCompact
                  ? 'Tắt chế độ bàn đấu thu gọn'
                  : 'Bật Chế Độ Bàn Đấu Gọn Gàng (Cầm Dọc)'}
              </span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 bg-ink-900 hover:bg-ink-800 text-ink-400 hover:text-ink-200 text-xs rounded-md transition-[color,background-color,border-color,opacity,transform]"
          >
            Đã hiểu & đóng
          </button>
        </div>
      </div>
    </div>
  );
};
