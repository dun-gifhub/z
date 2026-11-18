import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { MathLevel, AiDifficulty, UserProfile } from '../../shared/types.ts';
import { DomainArt } from './DomainArt.tsx';
import { MATH_DOMAINS } from '../../shared/cards.ts';
import { Hero3DCard } from './Hero3DCard.tsx';
import { DailyChallengeWidget } from './DailyChallengeWidget.tsx';
import { sound } from '../utils/soundEffects.ts';

interface MainMenuProps {
  onStartAi: (diff: AiDifficulty, level: MathLevel) => void;
  onOpenOnline: () => void;
  onOpenDeck: () => void;
  onOpenRunes: () => void;
  onOpenProfile: () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin: () => void;
  onOpenHowToPlay: () => void;
  mathLevel: MathLevel;
  onSetMathLevel: (level: MathLevel) => void;
  user?: { id: string; username: string; avatar: string; role: string } | null;
  profile?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onDeleteGuestAccount?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartAi,
  onOpenOnline,
  onOpenDeck,
  onOpenRunes,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenAdmin,
  onOpenHowToPlay,
  mathLevel,
  onSetMathLevel,
  user,
  profile,
  onOpenAuth,
  onLogout,
  onDeleteGuestAccount,
}) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiDiff, setAiDiff] = useState<AiDifficulty>('medium');
  const [guideLink, setGuideLink] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setGuideLink(data?.guideLink || ''))
      .catch(() => {});
  }, []);

  const diffLabels: Record<AiDifficulty, { label: string; desc: string; badge: string }> = {
    easy: { label: 'Tân Thủ (Dễ)', desc: 'AI tính toán cẩn trọng, bank sớm, độ chính xác toán 55%', badge: 'text-moss-400 border-moss-500/50' },
    medium: { label: 'Pháp Sư (Vừa)', desc: 'AI đánh giá rủi ro cơ bản, độ chính xác toán 75%', badge: 'text-brass-400 border-brass-500/50' },
    hard: { label: 'Đại Pháp Sư (Khó)', desc: 'Tính toán tỷ lệ Bust & sử dụng Rune tối ưu, chính xác 90%', badge: 'text-garnet-400 border-garnet-500/50' },
    expert: { label: 'Hiền Triết (Cực Khó)', desc: 'Tối ưu hóa điểm kỳ vọng, hiếm khi sai sót, chính xác 98%', badge: 'text-mauve-400 border-mauve-500/50' },
  };

  const handlePlayNow = () => {
    sound.playCorrect();
    setShowAiModal(true);
  };

  const isGuest = !!user && /^Pháp Sư #\d{4}$/.test(user.username);

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col justify-between px-3 sm:px-6 py-4 sm:py-6 overflow-hidden">
      {/* Mobile-Friendly User Status & Quick Auth Card */}
      {user && (
        <div className="relative z-10 max-w-6xl mx-auto w-full mb-4 p-3 bg-ink-900/90 border border-ink-800 rounded-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="w-10 h-10 rounded-md bg-ink-800 text-ink-200 font-medium flex items-center justify-center shrink-0">
              {(user.username || '?').trim().charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink-100 text-sm">{user.username}</span>
                {isGuest ? (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-brass-500/20 text-brass-300 font-mono border border-brass-500/40">
                    Tài khoản khách
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-moss-500/20 text-moss-300 font-mono border border-moss-500/40">
                    Đã xác thực
                  </span>
                )}
              </div>
              <div className="text-xs text-ink-400 font-mono">
                Cấp độ: <strong className="text-brass-300">LV.{profile?.level || 1}</strong> • {profile?.xp || 0} XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isGuest ? (
              <>
                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="flex-1 sm:flex-initial px-4 py-2 text-on-accent font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap bg-brass-500 hover:bg-brass-400"
                  >
                    <span> Đăng nhập / đăng ký</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Bạn có muốn đăng xuất khỏi tài khoản Khách này để đổi tài khoản khác?')) {
                      if (onDeleteGuestAccount) onDeleteGuestAccount();
                      else if (onLogout) onLogout();
                    }
                  }}
                  className="px-3 py-2 bg-ink-850 hover:bg-garnet-950/70 text-ink-300 hover:text-garnet-200 border border-ink-700 hover:border-garnet-500/60 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenProfile}
                  className="px-3 py-2 bg-ink-800 hover:bg-ink-700 text-ink-200 border border-ink-700 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Hồ sơ</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-garnet-950/80 hover:bg-garnet-900 border border-garnet-500/70 text-garnet-200 text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Đăng xuất</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. CINEMATIC HERO SECTION                                 */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Column: Game Landing Typography & Core CTA Buttons */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          
          {/* Badge Tagline */}
          <p className="text-xs font-mono text-ink-400">Đấu trường thẻ tri thức toán học • học đường</p>

          {/* Epic Main Logo */}
          <div className="space-y-1">
            <h1 className="font-cinzel text-5xl sm:text-7xl font-medium leading-none text-brass-300">
              Math
              <br />
              Rune
            </h1>
            <div className="font-mono text-xs sm:text-sm text-ink-400 pt-3">
              Master the numbers
            </div>
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-ink-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Học viện thẻ tri thức toán học học đường. Rèn luyện tư duy logic, làm chủ bài toán xác suất rủi ro và kích hoạt 16 cổ ngữ Rune bảo mệnh để chinh phục đỉnh cao tri thức.
          </p>

          {/* 10 Domain Glyphs Showcase Strip */}
          <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
            {Object.entries(MATH_DOMAINS).map(([key, d]) => (
              <div
                key={key}
                title={`Hệ ${d.nameVi}: ${d.description}`}
style={{ borderColor: d.color, }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-ink-950/90 border flex items-center justify-center p-0.5 transition-transform cursor-pointer"
              >
                <DomainArt category={key} size="sm" className="w-full h-full" />
              </div>
            ))}
          </div>

          {/* Math Level Selector Pills */}
          <div className="flex items-center justify-center lg:justify-start gap-2 p-1 bg-ink-950/80 border border-ink-800 rounded-lg max-w-md mx-auto lg:mx-0">
            {(['CO_BAN', 'THCS', 'THPT'] as MathLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => onSetMathLevel(lvl)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] ${
                  mathLevel === lvl
                    ? 'text-on-accent font-medium bg-brass-500'
                    : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                {lvl === 'CO_BAN' ? 'Cơ bản' : lvl === 'THCS' ? 'Cấp 2 (THCS)' : 'Nâng cao (cấp 3)'}
              </button>
            ))}
          </div>

          {/* CTA Action Buttons */}
          <div className="space-y-3 pt-2 max-w-md mx-auto lg:mx-0">
            {/* [ TRANH TÀI CÙNG AI ] Mega Button */}
            <button
              onClick={handlePlayNow}
              className="group relative w-full overflow-hidden py-4 px-6 sm:px-8 rounded-lg font-medium text-base sm:text-xl text-on-accent flex items-center justify-center gap-3 transition-[color,background-color,border-color,opacity,transform] active:scale-[0.97] cursor-pointer bg-brass-500 hover:bg-brass-400"
            >
              <span>Bắt đầu tranh tài (đấu AI)</span>
            </button>

            {/* Secondary Buttons Row: [ HƯỚNG DẪN ] [ KHO THẺ TOÁN ] [ ĐẤU ONLINE ] */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onOpenHowToPlay}
                className="py-3 px-2 bg-ink-950/80 hover:bg-ink-900 border border-ink-800 hover:border-brass-500/60 rounded-md text-xs font-medium text-ink-200 hover:text-brass-300 transition-[color,background-color,border-color,opacity,transform] flex items-center justify-center gap-1 active:scale-95"
              >
                <span className="truncate">Hướng dẫn</span>
              </button>

              <button
                onClick={onOpenDeck}
                className="py-3 px-2 bg-ink-950/80 hover:bg-ink-900 border border-ink-800 hover:border-brass-500/60 rounded-md text-xs font-medium text-ink-200 hover:text-brass-300 transition-[color,background-color,border-color,opacity,transform] flex items-center justify-center gap-1 active:scale-95"
              >
                <span className="truncate">Kho thẻ toán</span>
              </button>

              <button
                onClick={onOpenOnline}
                className="py-3 px-2 bg-ink-950/80 hover:bg-ink-900 border border-ink-800 hover:border-brass-500/60 rounded-md text-xs font-medium text-ink-200 hover:text-brass-300 transition-[color,background-color,border-color,opacity,transform] flex items-center justify-center gap-1 active:scale-95 bg-mauve-950/60 hover:bg-mauve-900"
              >
                <span className="truncate">Đấu online</span>
              </button>
            </div>

            {/* ADMIN EXTERNAL GUIDE LINK (if configured in Admin) */}
            {guideLink && (
              <a
                href={guideLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-ink-950/80 hover:bg-ink-900 border border-ink-800 rounded-md text-xs font-medium text-ink-200 transition-[color,background-color,border-color,opacity,transform] flex items-center justify-center gap-2 group"
              >
                <span> Tài Liệu Hướng Dẫn Chi Tiết (Link Quản Trị / Nhà Trường)</span>
                <span className="text-brass-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Hero 3D Card with Parallax Mouse Tilt */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <Hero3DCard />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SUB-PORTALS & DAILY QUESTS                             */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto w-full pt-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        
        {/* Daily Challenges Widget (5 Columns) */}
        <div className="md:col-span-5 w-full">
          <DailyChallengeWidget />
        </div>

        {/* Navigation Portals Grid (7 Columns - 5 items) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
          {/* Cẩm Nang Hướng Dẫn */}
          <button
            onClick={onOpenHowToPlay}
            className="p-3 bg-ink-950/80 hover:bg-ink-900 border border-brass-900/50 hover:border-brass-500/80 rounded-lg text-center group transition-[color,background-color,border-color,opacity,transform] active:scale-95"
          >
            <div className="text-xs font-medium text-ink-200 group-hover:text-brass-300">
              Cẩm nang
            </div>
            <div className="text-[11px] text-ink-400 truncate">Luật thi đấu</div>
          </button>

          {/* Cổ Ngữ Rune */}
          <button
            onClick={onOpenRunes}
            className="p-3 bg-ink-950/80 hover:bg-ink-900 border border-mauve-900/50 hover:border-mauve-500/80 rounded-lg text-center group transition-[color,background-color,border-color,opacity,transform] active:scale-95"
          >
            <div className="text-xs font-medium text-ink-200 group-hover:text-mauve-300">
              16 RUNE
            </div>
            <div className="text-[11px] text-ink-400 truncate">Bảo mệnh</div>
          </button>

          {/* Hồ Sơ Học Viên */}
          <button
            onClick={onOpenProfile}
            className="p-3 bg-ink-950/80 hover:bg-ink-900 border border-moss-900/50 hover:border-moss-500/80 rounded-lg text-center group transition-[color,background-color,border-color,opacity,transform] active:scale-95"
          >
            <div className="text-xs font-medium text-ink-200 group-hover:text-moss-300">
              Hồ sơ
            </div>
            <div className="text-[11px] text-ink-400 truncate">Cấp độ & XP</div>
          </button>

          {/* Bảng Xếp Hạng */}
          <button
            onClick={onOpenLeaderboard}
            className="p-3 bg-ink-950/80 hover:bg-ink-900 border border-gilt-900/50 hover:border-gilt-500/80 rounded-lg text-center group transition-[color,background-color,border-color,opacity,transform] active:scale-95"
          >
            <div className="text-xs font-medium text-ink-200 group-hover:text-gilt-300">
              Bảng vàng
            </div>
            <div className="text-[11px] text-ink-400 truncate">Vinh danh</div>
          </button>

          {/* Quản Trị Viên */}
          <button
            onClick={onOpenAdmin}
            className="p-3 bg-ink-950/80 hover:bg-ink-900 border border-dusk-900/50 hover:border-dusk-500/80 rounded-lg text-center group transition-[color,background-color,border-color,opacity,transform] active:scale-95"
          >
            <div className="text-xs font-medium text-ink-200 group-hover:text-dusk-300">
              ADMIN
            </div>
            <div className="text-[11px] text-ink-400 truncate">Cấu hình</div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. AI DIFFICULTY SELECTION MODAL                          */}
      {/* ========================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md border border-brass-500/70 rounded-lg p-6 space-y-4 bg-ink-900">
            <div className="flex items-center justify-between border-b border-ink-800 pb-3">
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="text-base font-medium text-brass-200">
                    Thiết lập trận đấu AI
                  </h3>
                  <div className="text-[11px] font-mono text-ink-400">
                    Mục tiêu đạt 150 Điểm trước đối thủ
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs text-ink-400 hover:text-ink-200 underline"
              >
                Đóng
              </button>
            </div>

            {/* Difficulty Cards */}
            <div className="space-y-2">
              {(['easy', 'medium', 'hard', 'expert'] as AiDifficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setAiDiff(d)}
                  className={`w-full p-3 rounded-lg border text-left transition-[color,background-color,border-color,opacity,transform] ${
                    aiDiff === d
                      ? 'bg-brass-500/20 border-brass-400 scale-[1.02]'
                      : 'bg-ink-950 border-ink-800 hover:bg-ink-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-ink-100">{diffLabels[d].label}</span>
                    <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${diffLabels[d].badge}`}>
                      {d.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1 leading-relaxed">
                    {diffLabels[d].desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Enter Battle Button */}
            <button
              onClick={() => {
                setShowAiModal(false);
                onStartAi(aiDiff, mathLevel);
              }}
              className="w-full py-3 text-on-accent font-medium text-sm rounded-md transition-transform active:scale-95 flex items-center justify-center gap-2 bg-brass-500 hover:bg-brass-400"
            >
              <span>Bắt đầu vào đấu trường</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
