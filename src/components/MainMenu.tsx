import React, { useState, useEffect } from 'react';
import {
  Swords,
  Globe,
  Layers,
  Sparkles,
  UserCheck,
  Trophy,
  Settings,
  Bot,
  Flame,
  Zap,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Play,
  ArrowRight,
  User,
  LogOut,
} from 'lucide-react';
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
    easy: { label: 'Tân Thủ (Dễ)', desc: 'AI tính toán cẩn trọng, bank sớm, độ chính xác toán 55%', badge: 'text-emerald-400 border-emerald-500/50' },
    medium: { label: 'Pháp Sư (Vừa)', desc: 'AI đánh giá rủi ro cơ bản, độ chính xác toán 75%', badge: 'text-amber-400 border-amber-500/50' },
    hard: { label: 'Đại Pháp Sư (Khó)', desc: 'Tính toán tỷ lệ Bust & sử dụng Rune tối ưu, chính xác 90%', badge: 'text-rose-400 border-rose-500/50' },
    expert: { label: 'Hiền Triết (Cực Khó)', desc: 'Tối ưu hóa điểm kỳ vọng, hiếm khi sai sót, chính xác 98%', badge: 'text-purple-400 border-purple-500/50' },
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
        <div className="relative z-10 max-w-6xl mx-auto w-full mb-4 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1 bg-slate-950 rounded-xl border border-amber-500/30 shadow-inner">
              {user.avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm">{user.username}</span>
                {isGuest ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                    Tài Khoản Khách
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40">
                    Đã Xác Thực
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Cấp Độ: <strong className="text-amber-300">LV.{profile?.level || 1}</strong> • {profile?.xp || 0} XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isGuest ? (
              <>
                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wide whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>🔑 Đăng Nhập / Đăng Ký</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Bạn có muốn đăng xuất khỏi tài khoản Khách này để đổi tài khoản khác?')) {
                      if (onDeleteGuestAccount) onDeleteGuestAccount();
                      else if (onLogout) onLogout();
                    }
                  }}
                  className="px-3 py-2 bg-slate-850 hover:bg-rose-950/70 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/60 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Đăng Xuất</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenProfile}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hồ Sơ</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/70 text-rose-200 text-xs font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-300" />
                    <span>Đăng Xuất</span>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-lg shadow-amber-950/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>ĐẤU TRƯỜNG THẺ TRI THỨC TOÁN HỌC • HỌC ĐƯỜNG</span>
          </div>

          {/* Epic Main Logo */}
          <div className="space-y-1">
            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_25px_rgba(245,158,11,0.4)]">
              MATH
              <br />
              RUNE
            </h1>
            <div className="font-cinzel font-bold text-xs sm:text-base tracking-[0.25em] text-indigo-300 pt-2 uppercase">
              MASTER THE NUMBERS
            </div>
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
            Học viện Thẻ Tri Thức Toán Học học đường. Rèn luyện tư duy logic, làm chủ bài toán xác suất rủi ro và kích hoạt 16 cổ ngữ Rune bảo mệnh để chinh phục đỉnh cao tri thức.
          </p>

          {/* 10 Domain Glyphs Showcase Strip */}
          <div className="flex items-center justify-center lg:justify-start gap-1.5 flex-wrap">
            {Object.entries(MATH_DOMAINS).map(([key, d]) => (
              <div
                key={key}
                title={`Hệ ${d.nameVi}: ${d.description}`}
                style={{ borderColor: d.color, boxShadow: `0 0 10px ${d.glow}` }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-950/90 border flex items-center justify-center p-0.5 hover:scale-125 transition-transform cursor-pointer"
              >
                <DomainArt category={key} size="sm" className="w-full h-full" />
              </div>
            ))}
          </div>

          {/* Math Level Selector Pills */}
          <div className="flex items-center justify-center lg:justify-start gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-md mx-auto lg:mx-0 shadow-inner">
            {(['CO_BAN', 'THCS', 'THPT'] as MathLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => onSetMathLevel(lvl)}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all ${
                  mathLevel === lvl
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'CO_BAN' ? 'Cơ Bản' : lvl === 'THCS' ? 'Cấp 2 (THCS)' : 'Nâng Cao (Cấp 3)'}
              </button>
            ))}
          </div>

          {/* CTA Action Buttons */}
          <div className="space-y-3 pt-2 max-w-md mx-auto lg:mx-0">
            {/* [ TRANH TÀI CÙNG AI ] Mega Button */}
            <button
              onClick={handlePlayNow}
              className="group relative w-full overflow-hidden py-4 px-6 sm:px-8 rounded-2xl font-cinzel font-black text-base sm:text-xl text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-[0_12px_30px_rgba(245,158,11,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              {/* Animated Light Sweep Beam */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] transform -translate-x-full group-hover:animate-light-sweep" />
              </div>
              <Play className="w-5 h-5 fill-slate-950" />
              <span className="tracking-wider uppercase">BẮT ĐẦU TRANH TÀI (ĐẤU AI)</span>
              <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
            </button>

            {/* Secondary Buttons Row: [ HƯỚNG DẪN ] [ KHO THẺ TOÁN ] [ ĐẤU ONLINE ] */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onOpenHowToPlay}
                className="py-2.5 px-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1 shadow-md hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">HƯỚNG DẪN</span>
              </button>

              <button
                onClick={onOpenDeck}
                className="py-2.5 px-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1 shadow-md hover:scale-105 active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">KHO THẺ TOÁN</span>
              </button>

              <button
                onClick={onOpenOnline}
                className="py-2.5 px-2 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/50 hover:border-purple-400 rounded-xl text-xs font-bold text-purple-200 transition-all flex items-center justify-center gap-1 shadow-md hover:scale-105 active:scale-95"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">ĐẤU ONLINE</span>
              </button>
            </div>

            {/* ADMIN EXTERNAL GUIDE LINK (if configured in Admin) */}
            {guideLink && (
              <a
                href={guideLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-500/40 rounded-xl text-xs font-semibold text-indigo-200 transition-all flex items-center justify-center gap-1.5 shadow-sm group"
              >
                <span>📖 Tài Liệu Hướng Dẫn Chi Tiết (Link Quản Trị / Nhà Trường)</span>
                <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">↗</span>
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
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full">
          {/* Cẩm Nang Hướng Dẫn */}
          <button
            onClick={onOpenHowToPlay}
            className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-amber-900/50 hover:border-amber-500/80 rounded-2xl text-center group transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-xs font-bold text-slate-200 group-hover:text-amber-300">
              CẨM NANG
            </div>
            <div className="text-[10px] text-slate-400 truncate">Luật thi đấu</div>
          </button>

          {/* Cổ Ngữ Rune */}
          <button
            onClick={onOpenRunes}
            className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-purple-900/50 hover:border-purple-500/80 rounded-2xl text-center group transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-xs font-bold text-slate-200 group-hover:text-purple-300">
              16 RUNE
            </div>
            <div className="text-[10px] text-slate-400 truncate">Bảo mệnh</div>
          </button>

          {/* Hồ Sơ Học Viên */}
          <button
            onClick={onOpenProfile}
            className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-emerald-900/50 hover:border-emerald-500/80 rounded-2xl text-center group transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-xs font-bold text-slate-200 group-hover:text-emerald-300">
              HỒ SƠ
            </div>
            <div className="text-[10px] text-slate-400 truncate">Cấp độ & XP</div>
          </button>

          {/* Bảng Xếp Hạng */}
          <button
            onClick={onOpenLeaderboard}
            className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-yellow-900/50 hover:border-yellow-500/80 rounded-2xl text-center group transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-xs font-bold text-slate-200 group-hover:text-yellow-300">
              BẢNG VÀNG
            </div>
            <div className="text-[10px] text-slate-400 truncate">Vinh danh</div>
          </button>

          {/* Quản Trị Viên */}
          <button
            onClick={onOpenAdmin}
            className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-indigo-900/50 hover:border-indigo-500/80 rounded-2xl text-center group transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Settings className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-xs font-bold text-slate-200 group-hover:text-indigo-300">
              ADMIN
            </div>
            <div className="text-[10px] text-slate-400 truncate">Cấu hình</div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. AI DIFFICULTY SELECTION MODAL                          */}
      {/* ========================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/70 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-amber-200">
                    THIẾT LẬP TRẬN ĐẤU AI
                  </h3>
                  <div className="text-[10px] font-mono text-slate-400">
                    Mục tiêu đạt 150 Điểm trước đối thủ
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
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
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    aiDiff === d
                      ? 'bg-amber-500/20 border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{diffLabels[d].label}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${diffLabels[d].badge}`}>
                      {d.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">
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
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 text-slate-950 font-cinzel font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>BẮT ĐẦU VÀO ĐẤU TRƯỜNG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
