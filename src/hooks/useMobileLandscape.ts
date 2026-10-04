import { useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/soundEffects.ts';

export function useMobileLandscape() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isMobileUa || window.innerWidth <= 768;
  });

  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight;
  });

  const [isWidescreenCompact, setIsWidescreenCompact] = useState<boolean>(false);
  const [showRotateDialog, setShowRotateDialog] = useState<boolean>(false);

  // Kiểm tra xem ứng dụng có đang bị nhúng trong iframe (như preview AI Studio / Zalo / Facebook) không
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Lắng nghe sự kiện xoay màn hình tự nhiên của thiết bị
  useEffect(() => {
    const handleResizeOrOrient = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ua = navigator.userAgent || '';
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || w <= 768;

      setIsMobile(isMobileDevice);
      const isLand = w > h;
      setIsLandscape(isLand);

      // Nếu đã xoay sang ngang tự nhiên thành công, tự động tắt modal xoay
      if (isLand) {
        setShowRotateDialog(false);
      }
    };

    window.addEventListener('resize', handleResizeOrOrient);
    window.addEventListener('orientationchange', handleResizeOrOrient);

    if (screen?.orientation?.addEventListener) {
      screen.orientation.addEventListener('change', handleResizeOrOrient);
    }

    return () => {
      window.removeEventListener('resize', handleResizeOrOrient);
      window.removeEventListener('orientationchange', handleResizeOrOrient);
      if (screen?.orientation?.removeEventListener) {
        screen.orientation.removeEventListener('change', handleResizeOrOrient);
      }
    };
  }, []);

  // Hành động kích hoạt xoay màn hình
  const toggleLandscape = useCallback(async () => {
    sound.playCardFlip();

    // 1. Thử khóa xoay màn hình qua Fullscreen & Screen Orientation API chuẩn
    try {
      const docEl = document.documentElement as any;
      const reqFullscreen =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (!document.fullscreenElement && reqFullscreen) {
        await reqFullscreen.call(docEl).catch(() => {});
      }

      if (screen?.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape').catch(() => {});
      }
    } catch {
      // Browser policy restriction (iOS Safari, iframe, etc.)
    }

    // 2. Nếu đang ở màn dọc hoặc đang trong iframe, bật hộp thoại hướng dẫn / hỗ trợ mở tab mới
    if (window.innerHeight >= window.innerWidth) {
      setShowRotateDialog((prev) => !prev);
    }
  }, []);

  const toggleWidescreenCompact = useCallback(() => {
    sound.playCardFlip();
    setIsWidescreenCompact((prev) => !prev);
  }, []);

  // Mở trực tiếp link trên trình duyệt ngoài (Safari / Chrome) để thoát khỏi iframe/webview
  const openExternalBrowser = useCallback(() => {
    try {
      const url = window.location.href;
      window.open(url, '_blank');
    } catch {
      // Fallback
    }
  }, []);

  const closeRotateDialog = useCallback(() => {
    setShowRotateDialog(false);
  }, []);

  return {
    isMobile,
    isLandscape,
    isWidescreenCompact,
    isInIframe,
    showRotateDialog,
    toggleLandscape,
    toggleWidescreenCompact,
    openExternalBrowser,
    closeRotateDialog,
  };
}
