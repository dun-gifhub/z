import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Wifi, WifiOff, Sparkles, User, LogOut, Shield, Palette, Sun, Moon, Trash2, Smartphone, RotateCw } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-2.5 sm:px-6 py-2 sm:py-2.5 safe-pt transition-all landscape-compact-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-cinzel font-bold text-lg">
              🧮
            </div>
          </div>
          <div>
            <span className="font-cinzel text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-amber-200 via-yellow-100 to-purple-200 bg-clip-text text-transparent group-hover:text-amber-300">
              MATH RUNE
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-indigo-400 ml-1.5 uppercase">
              Draw & Solve
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
              connected
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/50 text-rose-300 animate-pulse'
            }`}
          >
            {connected ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
            <span>{connected ? 'Trực Tuyến' : 'Mất Kết Nối'}</span>
          </div>

          {/* Sound Controls */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                !isMuted ? 'text-amber-400 bg-slate-800/80' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleToggleBgm}
              title={isBgmOn ? 'Tắt nhạc nền ma thuật' : 'Bật nhạc nền ma thuật'}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                isBgmOn ? 'text-purple-400 bg-slate-800/80' : 'text-slate-500 hover:text-slate-300'
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
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 border ${
                currentTheme.isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
              }`}
            >
              {currentTheme.isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">Giao Diện Tối</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline font-black text-amber-300">Giao Diện Trắng</span>
                </>
              )}
            </button>
          )}

          {/* Theme Background Changer */}
          <button
            onClick={onOpenThemeModal}
            title="Đổi màu nền chiến trận"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-amber-300 transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <span className="text-sm leading-none">{currentTheme.icon}</span>
            <span className="hidden sm:inline font-medium text-[11px] text-slate-200">Đổi Nền</span>
          </button>

          {/* Nút Xoay Ngang Màn Hình (Mobile / Tablet Orientation Button) */}
          {onToggleLandscape && (
            <button
              onClick={onToggleLandscape}
              title={isLandscape ? 'Xoay lại màn hình dọc' : 'Xoay ngang màn hình để chơi góc rộng bàn đấu'}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 border ${
                isLandscape
                  ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                  : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30 ring-1 ring-amber-500/30 animate-pulse'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 transition-transform duration-300 ${isLandscape ? 'rotate-90 text-purple-300' : 'text-amber-400'}`} />
              <span className="hidden sm:inline font-bold">
                {isLandscape ? 'Xoay Dọc' : 'Xoay Ngang'}
              </span>
              <span className="sm:hidden font-mono text-[10px] font-bold">
                {isLandscape ? 'Dọc' : 'Ngang'}
              </span>
            </button>
          )}

          {/* How To Play Guide Button */}
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              title="Mở cẩm nang hướng dẫn chi tiết"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg text-xs text-amber-300 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <span className="text-sm leading-none">📖</span>
              <span className="hidden sm:inline font-bold text-[11px]">Hướng Dẫn</span>
            </button>
          )}

          {/* User Account / Profile & Level Progress */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Clickable Profile Pill to open Account Info */}
              <button
                onClick={() => setShowUserMenu(true)}
                title="Nhấn để xem thông tin tài khoản và đổi tài khoản"
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl shadow-inner active:scale-95 transition-all text-left"
              >
                <span className="text-lg sm:text-xl leading-none">{user.avatar}</span>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                      {user.username}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded border border-amber-500/40">
                      LV.{profile?.level || 1}
                    </span>
                  </div>
                  {/* XP Progress Bar */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-14 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${Math.min(100, Math.round(((profile?.xp || 0) % 500) / 5))}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">
                      {profile?.xp || 0} XP
                    </span>
                  </div>
                </div>
              </button>

              {/* Explicit LOGIN & LOGOUT Buttons */}
              {isGuest ? (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={onOpenAuth}
                    title="Đăng nhập hoặc đăng ký tài khoản chính thức để lưu điểm"
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black rounded-lg shadow-md transition-all active:scale-95 whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Đăng Nhập</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Bạn có muốn đăng xuất khỏi tài khoản Khách này để đổi tài khoản khác?')) {
                        if (onDeleteGuestAccount) onDeleteGuestAccount();
                        else onLogout();
                      }
                    }}
                    title="Đăng xuất khỏi tài khoản Khách"
                    className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-900 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-rose-200 text-xs font-bold rounded-lg transition-all active:scale-95 whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline">Đăng Xuất</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogout}
                  title="Đăng xuất tài khoản"
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/70 text-rose-200 text-xs font-bold rounded-lg shadow transition-all active:scale-95 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-300" />
                  <span>Đăng Xuất</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black rounded-lg shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* USER ACCOUNT QUICK SHEET / MODAL (Easy touch on mobile) */}
      {showUserMenu && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xs p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-3xl shadow-2xl space-y-4 text-center">
            {/* Header info */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(false)}
                className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800"
              >
                ✕
              </button>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border-2 border-amber-500/50 flex items-center justify-center text-3xl shadow-lg mb-2">
                {user.avatar}
              </div>
              <h3 className="font-bold text-slate-100 text-base">{user.username}</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Cấp Độ: {profile?.level || 1}
                </span>
                {isGuest ? (
                  <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Tài Khoản Khách
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Đã Xác Thực
                  </span>
                )}
              </div>
            </div>

            {/* XP progress */}
            <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-left space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Tiến Trình Cấp:</span>
                <span className="text-amber-300 font-bold">{profile?.xp || 0} XP</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${Math.min(100, Math.round(((profile?.xp || 0) % 500) / 5))}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
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
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wide"
                  >
                    <User className="w-4 h-4" />
                    <span>🔑 Đăng Nhập / Đăng Ký Tài Khoản</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (confirm('Bạn có muốn đăng xuất khỏi tài khoản Khách này?')) {
                        if (onDeleteGuestAccount) onDeleteGuestAccount();
                        else onLogout();
                      }
                    }}
                    className="w-full py-2 bg-rose-950/70 hover:bg-rose-900 border border-rose-600/50 text-rose-200 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>🚪 Đăng Xuất (Xóa Phiên Khách)</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 bg-rose-950 hover:bg-rose-900 border-2 border-rose-500 text-rose-100 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>🚪 Đăng Xuất Tài Khoản</span>
                </button>
              )}

              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200"
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
