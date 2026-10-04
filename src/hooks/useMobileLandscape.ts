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

  const [isVirtualLandscape, setIsVirtualLandscape] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<90 | 270>(90);

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
      setIsNativeLandscape(isLand);

      // Nếu thiết bị đã tự xoay ngang vật lý tự nhiên, tắt chế độ xoay ảo
      if (isLand && isVirtualLandscape) {
        setIsVirtualLandscape(false);
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
  }, [isVirtualLandscape]);

  // Hành động kích hoạt xoay màn hình
  const toggleLandscape = useCallback(async () => {
    sound.playCardFlip();

    // 1. Nếu đang bật xoay ảo thì tắt trở về bình thường
    if (isVirtualLandscape) {
      setIsVirtualLandscape(false);
      try {
        if (screen?.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Bỏ qua lỗi browser
      }
      return;
    }

    // 2. Thử khóa xoay màn hình qua Fullscreen & Screen Orientation API
    let nativeSuccess = false;
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
        nativeSuccess = window.innerWidth > window.innerHeight;
      }
    } catch {
      nativeSuccess = false;
    }

    // 3. Nếu đang ở màn dọc (do chạy trong iframe/webview không xoay tự nhiên được),
    // kích hoạt Chế Độ Xoay Ảo Trọng Tâm (Centered Virtual Landscape)
    if (!nativeSuccess && window.innerHeight >= window.innerWidth) {
      setIsVirtualLandscape(true);
    }
  }, [isVirtualLandscape]);

  // Đảo góc xoay giữa 90 độ và 270 độ (thuận tay trái / tay phải)
  const toggleRotationAngle = useCallback(() => {
    sound.playCardFlip();
    setRotationAngle((prev) => (prev === 90 ? 270 : 90));
  }, []);

  // Mở trực tiếp link trên trình duyệt ngoài (Safari / Chrome) để thoát khỏi iframe/webview
  const openExternalBrowser = useCallback(() => {
    try {
      window.open(window.location.href, '_blank');
    } catch {
      // Fallback
    }
  }, []);

  return {
    isMobile,
    isLandscape: isNativeLandscape || isVirtualLandscape,
    isNativeLandscape,
    isVirtualLandscape,
    rotationAngle,
    toggleLandscape,
    toggleRotationAngle,
    openExternalBrowser,
  };
}
