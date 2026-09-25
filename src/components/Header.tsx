import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Wifi, WifiOff, Sparkles, User, LogOut, Shield, Palette, Sun, Moon } from 'lucide-react';
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
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isBgmOn, setIsBgmOn] = useState(sound.getIsBgmPlaying());

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-all">
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

          {/* User Account / Profile & Level Progress */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-2.5 sm:px-3.5 py-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner">
                <span className="text-xl leading-none">{user.avatar}</span>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                      {user.username}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/40">
                      LV.{profile?.level || 1}
                    </span>
                  </div>
                  {/* XP Progress Bar */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${Math.min(100, Math.round(((profile?.xp || 0) % 500) / 5))}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">
                      {profile?.xp || 0} XP
                    </span>
                  </div>
                </div>
              </div>
              {isGuest ? (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng Nhập / Đăng Ký</span>
                  <span className="sm:hidden">Lưu</span>
                </button>
              ) : (
                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
