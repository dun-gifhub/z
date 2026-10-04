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

  const [showRotatePrompt, setShowRotatePrompt] = useState<boolean>(false);

  // Lắng nghe sự kiện xoay màn hình tự nhiên của thiết bị
  useEffect(() => {
    const handleResizeOrOrient = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ua = navigator.userAgent || '';
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || w <= 768;
      
      setIsMobile(isMobileDevice);
      const isLand = w > h;
      setIsLandscape(isLand);

      // Khi người dùng đã xoay ngang thiết bị tự nhiên, tự động tắt hướng dẫn xoay
      if (isLand) {
        setShowRotatePrompt(false);
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

    // Nếu đang mở prompt hướng dẫn thì đóng lại
    if (showRotatePrompt) {
      setShowRotatePrompt(false);
      return;
    }

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
      // Browser policy restriction (iOS Safari, webviews)
    }

    // 2. Nếu thiết bị vẫn ở hướng dọc (ví dụ iOS Safari không hỗ trợ orientation.lock qua JS),
    // hiển thị giao diện hướng dẫn người dùng bật tự động xoay và nghiêng điện thoại
    if (window.innerHeight >= window.innerWidth) {
      setShowRotatePrompt(true);
    }
  }, [showRotatePrompt]);

  const closeRotatePrompt = useCallback(() => {
    setShowRotatePrompt(false);
  }, []);

  return {
    isMobile,
    isLandscape,
    showRotatePrompt,
    toggleLandscape,
    closeRotatePrompt,
  };
}
