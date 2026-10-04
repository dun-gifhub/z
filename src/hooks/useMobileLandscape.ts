import { useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/soundEffects.ts';

export function useMobileLandscape() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isMobileUa || window.innerWidth <= 768;
  });

  const [isNativeLandscape, setIsNativeLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight;
  });

  const [isForcedLandscape, setIsForcedLandscape] = useState<boolean>(false);

  // Cập nhật trạng thái kích thước và góc xoay thực tế của thiết bị
  useEffect(() => {
    const handleResizeOrOrient = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ua = navigator.userAgent || '';
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || w <= 768;
      
      setIsMobile(isMobileDevice);
      const isLand = w > h;
      setIsNativeLandscape(isLand);

      // Nếu người dùng đã tự xoay thiết bị thực tế sang ngang, tắt chế độ xoay ảo (forced)
      if (isLand && isForcedLandscape) {
        setIsForcedLandscape(false);
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
  }, [isForcedLandscape]);

  // Hành động kích hoạt xoay màn hình
  const toggleLandscape = useCallback(async () => {
    sound.playCardFlip();

    // 1. Nếu đang bật xoay ảo thì tắt về bình thường
    if (isForcedLandscape) {
      setIsForcedLandscape(false);
      try {
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Bỏ qua lỗi browser policy
      }
      return;
    }

    // 2. Thử khoá góc xoay thực tế qua Screen Orientation & Fullscreen API
    let nativeLocked = false;
    try {
      const docEl = document.documentElement as any;
      const reqFullscreen = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;

      if (reqFullscreen && !document.fullscreenElement) {
        await reqFullscreen.call(docEl).catch(() => {});
      }

      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape').catch(() => {});
        nativeLocked = window.innerWidth > window.innerHeight;
      }
    } catch {
      nativeLocked = false;
    }

    // 3. Nếu trình duyệt di động (như Safari iOS hoặc iframe) chặn API khoá xoay,
    // áp dụng Chế độ Xoay Ảo CSS (Virtual Landscape 90°)
    if (!nativeLocked && window.innerHeight > window.innerWidth) {
      setIsForcedLandscape(true);
    }
  }, [isForcedLandscape]);

  return {
    isMobile,
    isLandscape: isNativeLandscape || isForcedLandscape,
    isNativeLandscape,
    isForcedLandscape,
    toggleLandscape,
  };
}
