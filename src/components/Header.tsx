import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, User, LogOut, X } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';
import { UserProfile } from '../../shared/types.ts';
import { ThemeDef } from '../utils/themeManager.ts';

interface HeaderProps {
  user: { id: string; username: string; avatar: string; role: string } | null;
  profile: UserProfile | null;
  connected: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  currentView: string;
  currentTheme: ThemeDef;
  onOpenThemeModal: () => void;
  onToggleLightMode?: () => void;
  onOpenHowToPlay?: () => void;
  onDeleteGuestAccount?: () => void;
  isLandscape?: boolean;
  onToggleLandscape?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  profile,
  connected,
  onOpenAuth,
  onLogout,
  onNavigateHome,
  currentView,
  currentTheme,
  onOpenThemeModal,
  onToggleLightMode,
  onOpenHowToPlay,
  onDeleteGuestAccount,
  isLandscape = false,
  onToggleLandscape,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isBgmOn, setIsBgmOn] = useState(sound.getIsBgmPlaying());
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBgm = () => {
    const bgm = sound.toggleBgm();
    setIsBgmOn(bgm);
  };

  // Tài khoản Khách do hệ thống tự tạo có tên dạng "Pháp Sư #1234"
  const isGuest = !!user && /^Pháp Sư #\d{4}$/.test(user.username);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-800/80 bg-ink-950/80 px-3 sm:px-6 py-2 sm:py-3 safe-pt transition-[color,background-color,border-color,opacity,transform] landscape-compact-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div>
            <span className="font-cinzel text-base sm:text-lg font-medium text-ink-100 group-hover:text-brass-300 transition-colors">
              Math Rune
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-ink-500 ml-2">
              Draw & solve
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded text-xs font-mono border ${
              connected
                ? 'border-ink-800 text-ink-300'
                : 'border-garnet-800/60 text-garnet-300'
            }`}
          >
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${connected ? 'bg-moss-500' : 'bg-garnet-500'}`} />
            <span>{connected ? 'Trực tuyến' : 'Mất kết nối'}</span>
          </div>

          {/* Sound Controls */}
          <div className="flex items-center rounded-md bg-ink-900 border border-ink-800 p-0.5">
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
              className={`p-2 rounded-md text-xs transition-colors ${
                !isMuted ? 'text-brass-400 bg-ink-800/80' : 'text-ink-500 hover:text-ink-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleToggleBgm}
              title={isBgmOn ? 'Tắt nhạc nền ma thuật' : 'Bật nhạc nền ma thuật'}
              className={`p-2 rounded-md text-xs transition-colors ${
                isBgmOn ? 'text-brass-400 bg-ink-800/80' : 'text-ink-500 hover:text-ink-300'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Toggle Light / Dark Mode */}
          {onToggleLightMode && (
            <button
              onClick={onToggleLightMode}
              title={currentTheme.isLight ? 'Chuyển sang Giao Diện Tối' : 'Chuyển sang Giao Diện Trắng (Sáng)'}
              className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] active:scale-95 border ${
                'bg-ink-900 border-ink-700 text-ink-200 hover:bg-ink-800'
              }`}
            >
              <span className="hidden sm:inline font-medium">{currentTheme.isLight ? 'Giao diện tối' : 'Giao diện sáng'}</span>
              <span className="sm:hidden font-mono text-[11px]">{currentTheme.isLight ? 'Tối' : 'Sáng'}</span>
            </button>
          )}

          {/* Theme Background Changer */}
          <button
            onClick={onOpenThemeModal}
            title="Đổi màu nền chiến trận"
            className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-ink-900 hover:bg-ink-800 border border-ink-700 rounded-md text-xs text-ink-200 transition-[color,background-color,border-color,opacity,transform] active:scale-95"
          >
            <span aria-hidden="true" className="w-3 h-3 rounded-full border border-ink-500" style={{ backgroundColor: currentTheme.previewColor }} />
            <span className="hidden sm:inline font-medium text-[11px] text-ink-200">Đổi nền</span>
          </button>

          {/* Nút Xoay Ngang Màn Hình (Mobile / Tablet Orientation Button) */}
          {onToggleLandscape && (
            <button
              onClick={onToggleLandscape}
              title={isLandscape ? 'Xoay lại màn hình dọc' : 'Xoay ngang màn hình để chơi góc rộng bàn đấu'}
              className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] active:scale-95 border ${
                'bg-ink-900 border-ink-700 text-ink-200 hover:bg-ink-800'
              }`}
            >
              <span className="hidden sm:inline font-medium">
                {isLandscape ? 'Xoay dọc' : 'Xoay ngang'}
              </span>
              <span className="sm:hidden font-mono text-[11px] font-medium">
                {isLandscape ? 'Dọc' : 'Ngang'}
              </span>
            </button>
          )}

          {/* How To Play Guide Button */}
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              title="Mở cẩm nang hướng dẫn chi tiết"
              className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-ink-900 hover:bg-ink-800 border border-ink-700 rounded-md text-xs text-ink-200 transition-[color,background-color,border-color,opacity,transform] active:scale-95"
            >
              <span className="hidden sm:inline font-medium text-[11px]">Hướng dẫn</span>
            </button>
          )}

          {/* User Account / Profile & Level Progress */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-2">
              {/* Clickable Profile Pill to open Account Info */}
              <button
                onClick={() => setShowUserMenu(true)}
                title="Nhấn để xem thông tin tài khoản và đổi tài khoản"
                className="flex items-center gap-2 sm:gap-2 px-2 sm:px-3 py-1 bg-ink-900/90 hover:bg-ink-800/90 border border-ink-700/80 rounded-md active:scale-95 transition-[color,background-color,border-color,opacity,transform] text-left"
              >
                <span aria-hidden="true" className="w-8 h-8 text-sm rounded-md bg-ink-800 text-ink-200 font-medium flex items-center justify-center shrink-0">{(user.username || '?').trim().charAt(0).toUpperCase()}</span>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-ink-200 truncate max-w-[100px]">
                      {user.username}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-brass-400 bg-brass-950/60 px-1 py-0.2 rounded border border-brass-500/40">
                      LV.{profile?.level || 1}
                    </span>
                  </div>
                  {/* XP Progress Bar */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-14 h-1 bg-ink-950 rounded-full overflow-hidden border border-ink-800">
                      <div
                        style={{ width: `${Math.min(100, Math.round(((profile?.xp || 0) % 500) / 5))}%` }}
                        className="h-full rounded-full bg-brass-500"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-ink-400">
                      {profile?.xp || 0} XP
                    </span>
                  </div>
                </div>
              </button>

              {/* Explicit LOGIN & LOGOUT Buttons */}
              {isGuest ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={onOpenAuth}
                    title="Đăng nhập hoặc đăng ký tài khoản chính thức để lưu điểm"
                    className="flex items-center gap-1 px-3 sm:px-3 py-2 text-on-accent text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 whitespace-nowrap bg-brass-500 hover:bg-brass-400"
                  >
                    <User className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Bạn có muốn đăng xuất khỏi tài khoản Khách này để đổi tài khoản khác?')) {
                        if (onDeleteGuestAccount) onDeleteGuestAccount();
                        else onLogout();
                      }
                    }}
                    title="Đăng xuất khỏi tài khoản Khách"
                    className="flex items-center gap-1 p-2 sm:px-3 sm:py-2 bg-ink-900 hover:bg-garnet-950/70 border border-ink-700 hover:border-garnet-500 text-ink-300 hover:text-garnet-200 text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4 text-garnet-400" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogout}
                  title="Đăng xuất tài khoản"
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-3 py-2 bg-garnet-950/80 hover:bg-garnet-900 border border-garnet-500/70 text-garnet-200 text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4 text-garnet-300" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-2 text-on-accent text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 whitespace-nowrap bg-brass-500 hover:bg-brass-400"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* USER ACCOUNT QUICK SHEET / MODAL (Easy touch on mobile) */}
      {showUserMenu && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 animate-in fade-in duration-150">
          <div className="w-full max-w-xs p-5 border border-brass-500/80 rounded-lg space-y-4 text-center bg-ink-900">
            {/* Header info */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(false)}
                className="absolute -top-1 -right-1 p-1 text-ink-400 hover:text-ink-100 rounded-full hover:bg-ink-800"
              >
                <X className="w-4 h-4" />
              </button>
              <span aria-hidden="true" className="w-16 h-16 mx-auto mb-2 text-2xl rounded-md bg-ink-800 text-ink-200 font-medium flex items-center justify-center shrink-0">{(user.username || '?').trim().charAt(0).toUpperCase()}</span>
              <h3 className="font-medium text-ink-100 text-base">{user.username}</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs font-mono font-medium text-brass-400 bg-brass-950/60 px-2 py-0.5 rounded border border-brass-500/40">
                  Cấp Độ: {profile?.level || 1}
                </span>
                {isGuest ? (
                  <span className="text-[11px] text-brass-300 bg-brass-950/80 px-2 py-0.5 rounded border border-brass-500/30">
                    Tài khoản khách
                  </span>
                ) : (
                  <span className="text-[11px] text-moss-300 bg-moss-950/80 px-2 py-0.5 rounded border border-moss-500/30">
                    Đã xác thực
                  </span>
                )}
              </div>
            </div>

            {/* XP progress */}
            <div className="p-3 bg-ink-950/90 rounded-lg border border-ink-800 text-left space-y-2">
              <div className="flex justify-between text-xs font-mono text-ink-300">
                <span>Tiến trình cấp:</span>
                <span className="text-brass-300 font-medium">{profile?.xp || 0} XP</span>
              </div>
              <div className="w-full h-2 bg-ink-900 rounded-full overflow-hidden border border-ink-800">
                <div
                  style={{ width: `${Math.min(100, Math.round(((profile?.xp || 0) % 500) / 5))}%` }}
                  className="h-full bg-brass-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {isGuest ? (
                <>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full py-3 text-on-accent font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2 bg-brass-500 hover:bg-brass-400"
                  >
                    <User className="w-4 h-4" />
                    <span> Đăng nhập / đăng ký tài khoản</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (confirm('Bạn có muốn đăng xuất khỏi tài khoản Khách này?')) {
                        if (onDeleteGuestAccount) onDeleteGuestAccount();
                        else onLogout();
                      }
                    }}
                    className="w-full py-2 bg-garnet-950/70 hover:bg-garnet-900 border border-garnet-600/50 text-garnet-200 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span> Đăng Xuất (Xóa Phiên Khách)</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full py-3 bg-garnet-950 hover:bg-garnet-900 border border-garnet-500 text-garnet-100 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span> Đăng xuất tài khoản</span>
                </button>
              )}

              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full py-2 text-xs text-ink-400 hover:text-ink-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
