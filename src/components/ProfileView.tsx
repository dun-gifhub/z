import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Award, Target, Flame, History, BookOpen, User, CheckCircle, XCircle, Crown, Sparkles, Lock, Landmark, Copy, Check } from 'lucide-react';
import { UserProfile, SiteSettings, PremiumPlan } from '../../shared/types.ts';
import { BASIC_AVATARS, VIP_AVATARS } from '../../shared/avatars.ts';

interface ProfileViewProps {
  profile: UserProfile | null;
  onBack: () => void;
  onUpdateAvatar?: (avatar: string) => Promise<{ success: boolean; error?: string }>;
}

function formatVnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onBack, onUpdateAvatar }) => {
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // ------- Avatar changer -------
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  // ------- Premium purchase -------
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requestMsg, setRequestMsg] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    setLoadingHistory(true);
    fetch(`/api/profile/${profile.id}/history`)
      .then(res => res.json())
      .then(data => {
        setMatchHistory(Array.isArray(data) ? data : []);
      })
      .catch(e => console.warn('Failed to load history:', e))
      .finally(() => setLoadingHistory(false));
  }, [profile?.id]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(e => console.warn('Failed to load settings:', e));
  }, []);

  const isPremiumActive = !!profile?.isPremium && (!profile.premiumExpiresAt || new Date(profile.premiumExpiresAt).getTime() > Date.now());

  const handlePickAvatar = async (av: string) => {
    if (!onUpdateAvatar || avatarSaving) return;
    setAvatarSaving(true);
    setAvatarMsg(null);
    const result = await onUpdateAvatar(av);
    if (result.success) {
      setAvatarMsg('✓ Đã đổi Pháp Thân!');
      setAvatarPickerOpen(false);
    } else {
      setAvatarMsg(result.error || 'Không thể đổi Pháp Thân.');
    }
    setAvatarSaving(false);
    setTimeout(() => setAvatarMsg(null), 3000);
  };

  const handleCopyBank = () => {
    if (!settings?.bankAccountNumber) return;
    navigator.clipboard?.writeText(settings.bankAccountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const handleSendPremiumRequest = async () => {
    if (!profile?.id || !selectedPlan) return;
    setRequestLoading(true);
    setRequestMsg(null);
    try {
      const res = await fetch('/api/premium/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, plan: selectedPlan }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestSent(true);
      } else {
        setRequestMsg(data.error || 'Có lỗi xảy ra.');
      }
    } catch (e: any) {
      setRequestMsg('Lỗi kết nối máy chủ.');
    } finally {
      setRequestLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-400 space-y-4">
        <p>Vui lòng đăng nhập hoặc chơi một trận để kích hoạt hồ sơ pháp sư!</p>
        <button onClick={onBack} className="px-4 py-2 bg-slate-800 text-slate-200 text-xs rounded-xl">
          Quay Lại Sảnh
        </button>
      </div>
    );
  }

  // Calculate XP to next level
  const xpCurrentLevel = profile.xp % 300;
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / 300) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại Sảnh Chính</span>
        </button>

        <span className="text-xs font-mono text-amber-400">
          ID: {profile.id.substring(0, 10)}...
        </span>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 bg-slate-900 border-2 border-indigo-700/60 rounded-3xl space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-indigo-950 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-lg">
              {profile.avatar}
            </div>
            {onUpdateAvatar && (
              <button
                onClick={() => setAvatarPickerOpen(v => !v)}
                title="Đổi Pháp Thân (Avatar)"
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-slate-900 border border-amber-500 text-amber-300 text-xs flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors"
              >
                ✎
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-200">
                {profile.username}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold self-center sm:self-auto">
                {profile.rankTitle}
              </span>
              {isPremiumActive && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 text-yellow-300 text-xs font-bold self-center sm:self-auto">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Cấp Độ {profile.level} • Tổng Điểm Tích Lũy: {profile.xp} XP
            </p>

            {/* Level XP Bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Tiến Độ Cấp {profile.level + 1}</span>
                <span>{xpCurrentLevel} / 300 XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Picker (toggle) */}
        {avatarPickerOpen && (
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
            {avatarMsg && (
              <div className="text-xs text-amber-300 font-semibold">{avatarMsg}</div>
            )}
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-1.5">PHÁP THÂN CƠ BẢN (MIỄN PHÍ)</div>
              <div className="flex flex-wrap gap-2">
                {BASIC_AVATARS.map(av => (
                  <button
                    key={av}
                    disabled={avatarSaving}
                    onClick={() => handlePickAvatar(av)}
                    className={`text-xl p-2 rounded-lg transition-all disabled:opacity-50 ${
                      profile.avatar === av
                        ? 'bg-amber-500/20 border border-amber-400 scale-110'
                        : 'bg-slate-900 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-yellow-400/90 mb-1.5 flex items-center gap-1">
                <Crown className="w-3 h-3" /> PHÁP THÂN VIP (DÀNH CHO THÀNH VIÊN PREMIUM)
              </div>
              <div className="flex flex-wrap gap-2">
                {VIP_AVATARS.map(av => {
                  const locked = !isPremiumActive;
                  return (
                    <button
                      key={av}
                      disabled={avatarSaving || locked}
                      onClick={() => handlePickAvatar(av)}
                      title={locked ? 'Nâng cấp gói Premium để mở khóa' : undefined}
                      className={`relative text-xl p-2 rounded-lg transition-all disabled:cursor-not-allowed ${
                        profile.avatar === av
                          ? 'bg-yellow-500/20 border border-yellow-400 scale-110'
                          : locked
                          ? 'bg-slate-900/60 border border-slate-800 opacity-40'
                          : 'bg-slate-900 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {av}
                      {locked && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-slate-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 font-mono">
          <div className="p-3 bg-slate-950 rounded-xl text-center">
            <div className="text-[10px] text-slate-400">Tổng Trận</div>
            <div className="text-lg font-black text-slate-100">{profile.totalGames}</div>
            <div className="text-[10px] text-slate-500">{profile.wins} Thắng / {profile.losses} Bại</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl text-center">
            <div className="text-[10px] text-slate-400">Tỉ Lệ Thắng</div>
            <div className="text-lg font-black text-emerald-400">{profile.winRate}%</div>
            <div className="text-[10px] text-emerald-600">Đấu Xếp Hạng</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl text-center">
            <div className="text-[10px] text-slate-400">Điểm Kỷ Lục</div>
            <div className="text-lg font-black text-amber-300">{profile.highestScore}đ</div>
            <div className="text-[10px] text-amber-500">Trong một trận</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl text-center">
            <div className="text-[10px] text-slate-400">Rune Đang Đeo</div>
            <div className="text-lg font-black text-purple-300">{profile.equippedRunes?.length || 1}/1</div>
            <div className="text-[10px] text-purple-500">Ấn chú bảo mệnh</div>
          </div>
        </div>
      </div>

      {/* Premium Subscription Section */}
      <div className="p-5 bg-slate-900 border-2 border-yellow-700/50 rounded-3xl space-y-4 shadow-xl">
        <h3 className="font-cinzel text-base font-bold text-yellow-300 flex items-center gap-2">
          <Crown className="w-4 h-4" />
          <span>GÓI PREMIUM</span>
        </h3>

        {isPremiumActive ? (
          <div className="p-4 bg-yellow-950/30 border border-yellow-700/50 rounded-2xl text-xs text-yellow-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bạn đang là thành viên Premium!</span>
            </div>
            <div className="text-slate-300">
              Gói hiện tại: <strong className="text-yellow-300">{profile.premiumPlan === 'monthly' ? 'Gói Tháng' : 'Gói Xem Lời Giải'}</strong>
            </div>
            {profile.premiumExpiresAt && (
              <div className="text-slate-400">
                Hết hạn: {new Date(profile.premiumExpiresAt).toLocaleDateString('vi-VN')}
              </div>
            )}
            <div className="text-[11px] text-slate-500 pt-1">
              ✓ Xem lời giải chi tiết mọi câu hỏi &nbsp;•&nbsp; ✓ Mở khóa Pháp Thân VIP
            </div>
          </div>
        ) : requestSent ? (
          <div className="p-4 bg-indigo-950/40 border border-indigo-700/50 rounded-2xl text-xs text-indigo-200 space-y-1">
            <div className="font-bold">⏳ Yêu cầu của bạn đang chờ Admin xác nhận chuyển khoản.</div>
            <div className="text-slate-400">Sau khi được duyệt, gói Premium sẽ tự động kích hoạt cho tài khoản này.</div>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400">
              Mở khóa <strong className="text-yellow-300">xem lời giải chi tiết từng bước</strong> cho mọi câu hỏi và <strong className="text-yellow-300">Pháp Thân VIP</strong> độc quyền.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPlan('solution')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'solution'
                    ? 'bg-amber-500/10 border-amber-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">Gói Xem Lời Giải</div>
                <div className="text-lg font-black text-amber-300 mt-1">
                  {formatVnd(settings?.solutionPackagePrice ?? 20000)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Hiệu lực 30 ngày</div>
              </button>

              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`relative p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-emerald-500/10 border-emerald-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="absolute -top-2 right-3 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full">
                  TIẾT KIỆM HƠN
                </div>
                <div className="text-xs font-bold text-slate-200">Gói Tháng</div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {formatVnd(settings?.monthlyPackagePrice ?? 15000)}
                  <span className="text-[10px] text-slate-500 font-normal">/tháng</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Tự động gia hạn 30 ngày mỗi lần đăng ký</div>
              </button>
            </div>

            {selectedPlan && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5 text-xs">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chuyển khoản để kích hoạt gói</span>
                </div>
                {settings?.bankAccountNumber ? (
                  <div className="space-y-1 font-mono text-slate-300">
                    <div>Ngân hàng: <span className="text-slate-100">{settings.bankName || '—'}</span></div>
                    <div>Chủ TK: <span className="text-slate-100">{settings.bankAccountName || '—'}</span></div>
                    <div className="flex items-center gap-2">
                      <span>Số TK: <span className="text-slate-100">{settings.bankAccountNumber}</span></span>
                      <button onClick={handleCopyBank} className="text-amber-400 hover:text-amber-300">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div>Số tiền: <span className="text-amber-300">{formatVnd(selectedPlan === 'monthly' ? (settings?.monthlyPackagePrice ?? 15000) : (settings?.solutionPackagePrice ?? 20000))}</span></div>
                    <div>Nội dung CK: <span className="text-emerald-400">PREMIUM {profile.username}</span></div>
                  </div>
                ) : (
                  <div className="text-slate-500">Admin chưa cập nhật thông tin chuyển khoản. Vui lòng liên hệ trực tiếp Quản Trị Viên.</div>
                )}

                {requestMsg && <div className="text-rose-400">{requestMsg}</div>}

                <button
                  onClick={handleSendPremiumRequest}
                  disabled={requestLoading}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
                >
                  {requestLoading ? 'Đang gửi...' : 'Tôi Đã Chuyển Khoản - Xác Nhận'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Match History Table */}
      <div className="space-y-3">
        <h3 className="font-cinzel text-base font-bold text-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>LỊCH SỬ THI ĐẤU GẦN ĐÂY</span>
        </h3>

        {loadingHistory ? (
          <div className="p-6 text-center text-xs text-slate-500">Đang tải lịch sử đấu...</div>
        ) : matchHistory.length === 0 ? (
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
            Chưa có trận đấu nào được ghi lại. Hãy tham gia một ván đấu với AI hoặc Online!
          </div>
        ) : (
          <div className="space-y-2">
            {matchHistory.map(m => (
              <div
                key={m.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-xs font-black ${
                    m.isWin ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {m.isWin ? 'THẮNG' : 'THUA'}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Đấu với: <span className="text-amber-300">{m.opponentName}</span> ({m.mode.toUpperCase()})
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3 mt-0.5">
                      <span>Điểm: {m.score}đ</span>
                      <span>Chính xác: {m.accuracy}% ({m.correctAnswers}/{m.totalQuestions})</span>
                      <span>Bust: {m.busts} lần</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-500 font-mono">
                  {new Date(m.timestamp).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
