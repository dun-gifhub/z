import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, CheckCircle, Crown, Lock, Landmark, Copy, Check, Trash2 } from 'lucide-react';
import { UserProfile, SiteSettings, PremiumPlan } from '../../shared/types.ts';
import { BASIC_AVATARS, VIP_AVATARS } from '../../shared/avatars.ts';
import { ALL_RUNES } from '../../shared/runes.ts';
import { RuneStone } from './RuneStone.tsx';

interface ProfileViewProps {
  profile: UserProfile | null;
  onBack: () => void;
  onUpdateAvatar?: (avatar: string) => Promise<{ success: boolean; error?: string }>;
  onRefreshProfile?: () => void;
  isGuest?: boolean;
  onDeleteGuestAccount?: () => void;
}

function formatVnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onBack, onUpdateAvatar, onRefreshProfile, isGuest, onDeleteGuestAccount }) => {
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // ------- Avatar changer -------
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  // ------- Premium purchase & gift/renew for others -------
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [showSelfRenew, setShowSelfRenew] = useState(false);
  const [targetGiftUsername, setTargetGiftUsername] = useState('');
  const [giftPlan, setGiftPlan] = useState<PremiumPlan>('monthly');
  const [giftMode, setGiftMode] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestRecipient, setRequestRecipient] = useState('');
  const [requestMsg, setRequestMsg] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ------- Cancel / Revoke Pro -------
  const [cancellingPro, setCancellingPro] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

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
      setAvatarMsg('✓ Đã đổi Pháp Thân');
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

  const handleSendPremiumRequest = async (isGift: boolean = false) => {
    if (!profile?.id) return;
    const planToUse = isGift ? giftPlan : selectedPlan;
    if (!planToUse) return;

    if (isGift && !targetGiftUsername.trim()) {
      setRequestMsg('Vui lòng nhập chính xác Tên đăng nhập người nhận');
      return;
    }

    setRequestLoading(true);
    setRequestMsg(null);
    try {
      const res = await fetch('/api/premium/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          plan: planToUse,
          targetUsername: isGift ? targetGiftUsername.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestSent(true);
        setRequestRecipient(data.recipientName || (isGift ? targetGiftUsername.trim() : profile.username));
      } else {
        setRequestMsg(data.error || 'Có lỗi xảy ra.');
      }
    } catch (e: any) {
      setRequestMsg('Lỗi kết nối máy chủ.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCancelMyPro = async () => {
    if (!profile?.id) return;
    if (!confirm('Bạn có chắc chắn muốn gỡ bỏ gói PRO khỏi tài khoản của mình không? Sau khi gỡ, các đặc quyền VIP sẽ tạm dừng.')) {
      return;
    }

    setCancellingPro(true);
    setCancelMsg(null);
    try {
      const res = await fetch('/api/premium/cancel-my-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setCancelMsg('Đã gỡ bỏ gói PRO thành công khỏi tài khoản của bạn');
        if (onRefreshProfile) {
          onRefreshProfile();
        }
      } else {
        setCancelMsg(data.error || 'Không thể gỡ gói PRO.');
      }
    } catch {
      setCancelMsg('Lỗi kết nối máy chủ.');
    } finally {
      setCancellingPro(false);
      setTimeout(() => setCancelMsg(null), 4000);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-ink-400 space-y-4">
        <p>Vui lòng đăng nhập hoặc chơi một trận để kích hoạt hồ sơ pháp sư</p>
        <button onClick={onBack} className="px-4 py-2 bg-ink-800 text-ink-200 text-xs rounded-md">
          Quay lại sảnh
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
          className="flex items-center gap-2 text-xs text-ink-400 hover:text-ink-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <span className="text-xs font-mono text-brass-400">
          ID: {profile.id.substring(0, 10)}...
        </span>
      </div>

      {/* Guest Account Banner & Delete Button */}
      {isGuest && onDeleteGuestAccount && (
        <div className="p-4 border border-garnet-800/80 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-garnet-950/60">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div>
              <div className="font-medium text-garnet-300 flex items-center justify-center sm:justify-start gap-2 text-sm">
                <span>Tài Khoản Khách (Chơi Nhanh)</span>
              </div>
              <p className="text-[11px] text-ink-400 mt-0.5">
                Bạn có thể đăng ký để lưu hồ sơ vĩnh viễn, hoặc xóa tài khoản này để làm mới phiên chơi.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản Chơi Nhanh này không? Toàn bộ điểm số, cấp độ và lịch sử tạm thời sẽ bị dọn sạch và một tài khoản khách mới sẽ được tạo.')) {
                onDeleteGuestAccount();
                onBack();
              }
            }}
            className="w-full sm:w-auto px-4 py-3 bg-garnet-600 hover:bg-garnet-500 text-white font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa acc chơi nhanh</span>
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 bg-ink-900 border border-dusk-700/60 rounded-lg space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-lg bg-dusk-950 border border-brass-400 flex items-center justify-center text-4xl">
              {profile.avatar}
            </div>
            {onUpdateAvatar && (
              <button
                onClick={() => setAvatarPickerOpen(v => !v)}
                title="Đổi Pháp Thân (Avatar)"
                className="absolute -bottom-1.5 -right-1.5 h-7 px-2 rounded bg-ink-900 border border-brass-500 text-brass-300 text-xs flex items-center justify-center hover:bg-ink-800 transition-colors"
              >
                Đổi
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-medium text-brass-200">
                {profile.username}
              </h2>
              <span className="px-3 py-0.5 rounded bg-brass-500/20 border border-brass-400/40 text-brass-300 text-xs font-medium self-center sm:self-auto">
                {profile.rankTitle}
              </span>
              {isPremiumActive && (
                <span className="flex items-center gap-1 px-3 py-0.5 rounded border border-gilt-400/50 text-gilt-300 text-xs font-medium self-center sm:self-auto bg-gilt-500/20">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </span>
              )}
            </div>

            <p className="text-xs text-ink-400">
              Cấp Độ {profile.level} • Tổng Điểm Tích Lũy: {profile.xp} XP
            </p>

            {/* Level XP Bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-ink-400">
                <span>Tiến Độ Cấp {profile.level + 1}</span>
                <span>{xpCurrentLevel} / 300 XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-ink-950 rounded-full overflow-hidden border border-ink-800">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full rounded-full transition-[color,background-color,border-color,opacity,transform] duration-500 bg-brass-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Picker (toggle) */}
        {avatarPickerOpen && (
          <div className="p-4 bg-ink-950/80 border border-ink-800 rounded-lg space-y-3">
            {avatarMsg && (
              <div className="text-xs text-brass-300 font-medium">{avatarMsg}</div>
            )}
            <div>
              <div className="text-[11px] font-medium text-ink-400 mb-2">PHÁP THÂN CƠ BẢN (MIỄN PHÍ)</div>
              <div className="flex flex-wrap gap-2">
                {BASIC_AVATARS.map(av => (
                  <button
                    key={av}
                    disabled={avatarSaving}
                    onClick={() => handlePickAvatar(av)}
                    className={`text-xl p-2 rounded-md transition-[color,background-color,border-color,opacity,transform] disabled:opacity-50 ${
                      profile.avatar === av
                        ? 'bg-brass-500/20 border border-brass-400 scale-110'
                        : 'bg-ink-900 border border-ink-800 hover:bg-ink-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-gilt-400/90 mb-2 flex items-center gap-1">
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
                      className={`relative text-xl p-2 rounded-md transition-[color,background-color,border-color,opacity,transform] disabled:cursor-not-allowed ${
                        profile.avatar === av
                          ? 'bg-gilt-500/20 border border-gilt-400 scale-110'
                          : locked
                          ? 'bg-ink-900/60 border border-ink-800 opacity-40'
                          : 'bg-ink-900 border border-ink-800 hover:bg-ink-800'
                      }`}
                    >
                      {av}
                      {locked && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-ink-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-ink-800 font-mono">
          <div className="p-3 bg-ink-950 rounded-md text-center">
            <div className="text-[11px] text-ink-400">Tổng trận</div>
            <div className="text-lg font-medium text-ink-100">{profile.totalGames}</div>
            <div className="text-[11px] text-ink-500">{profile.wins} Thắng / {profile.losses} Bại</div>
          </div>

          <div className="p-3 bg-ink-950 rounded-md text-center">
            <div className="text-[11px] text-ink-400">Tỉ lệ thắng</div>
            <div className="text-lg font-medium text-moss-400">{profile.winRate}%</div>
            <div className="text-[11px] text-moss-600">Đấu xếp hạng</div>
          </div>

          <div className="p-3 bg-ink-950 rounded-md text-center">
            <div className="text-[11px] text-ink-400">Điểm kỷ lục</div>
            <div className="text-lg font-medium text-brass-300">{profile.highestScore}đ</div>
            <div className="text-[11px] text-brass-500">Trong một trận</div>
          </div>

          <div className="p-3 bg-ink-950 rounded-md text-center flex flex-col items-center justify-center">
            <div className="text-[11px] text-ink-400">Rune bảo mệnh</div>
            {(() => {
              const rId = profile.equippedRunes?.[0] || 'rune_shield';
              const rDef = ALL_RUNES.find(r => r.id === rId);
              if (!rDef) return <div className="text-lg font-medium text-mauve-300">1/1</div>;
              return (
                <div className="flex items-center gap-2 mt-0.5" title={rDef.description}>
                  <RuneStone rune={rDef} size="sm" isActive={true} />
                  <span className="text-xs font-medium text-brass-200 truncate max-w-[85px]">{rDef.name}</span>
                </div>
              );
            })()}
            <div className="text-[11px] text-mauve-400 mt-0.5">Ấn chú bảo mệnh</div>
          </div>
        </div>
      </div>

      {/* Premium Subscription Section */}
      <div className="p-5 bg-ink-900 border border-gilt-700/50 rounded-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-800 pb-3">
          <h3 className="text-base font-medium text-gilt-300 flex items-center gap-2">
            <Crown className="w-5 h-5 text-gilt-400" />
            <span>Gói PRO & đặc quyền VIP</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGiftMode(false);
                setSelectedPlan(null);
                setRequestSent(false);
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                !giftMode ? 'bg-brass-500/20 text-brass-300 border border-brass-500/40' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              Gói của tôi
            </button>
            <button
              onClick={() => {
                setGiftMode(true);
                setRequestSent(false);
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                giftMode ? 'bg-dusk-500/20 text-dusk-300 border border-dusk-500/40' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <span>Gia hạn cho người khác</span>
            </button>
          </div>
        </div>

        {cancelMsg && (
          <div className="p-3 bg-moss-950 border border-moss-700 text-moss-200 text-xs rounded-md flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{cancelMsg}</span>
          </div>
        )}

        {/* MODE 1: FOR ANOTHER USER (GIFT/RENEW FOR ANYONE) */}
        {giftMode ? (
          <div className="space-y-4">
            <div className="p-4 bg-dusk-950/40 border border-dusk-700/50 rounded-lg text-xs space-y-1">
              <div className="font-medium text-dusk-200 flex items-center gap-2">
                <span>Gia hạn hoặc tặng gói PRO cho người bạn muốn</span>
              </div>
              <p className="text-ink-300">
                Nhập tên đăng nhập của bạn bè hoặc người chơi bạn muốn gia hạn gói PRO. Sau khi xác nhận thanh toán, hệ thống sẽ kích hoạt trực tiếp cho tài khoản đó
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-200">
                Tên đăng nhập người nhận gói PRO (*):
              </label>
              <input
                type="text"
                value={targetGiftUsername}
                onChange={e => setTargetGiftUsername(e.target.value)}
                placeholder="VD: dungdaumoi2222, phap_su_toan..."
                className="w-full bg-ink-950 border border-ink-700 focus:border-dusk-400 rounded-md px-4 py-3 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGiftPlan('monthly')}
                className={`p-4 rounded-lg border text-left transition-[color,background-color,border-color,opacity,transform] ${
                  giftPlan === 'monthly'
                    ? 'bg-dusk-500/10 border-dusk-400 ring-1 ring-dusk-400/40'
                    : 'bg-ink-950 border-ink-800 hover:bg-ink-900'
                }`}
              >
                <div className="text-xs font-medium text-ink-200">Gói Tháng (30 ngày)</div>
                <div className="text-base font-medium text-dusk-300 mt-1">
                  {formatVnd(settings?.monthlyPackagePrice ?? 15000)}
                </div>
                <div className="text-[11px] text-ink-400 mt-0.5">Tiết kiệm & đầy đủ quyền lợi</div>
              </button>

              <button
                type="button"
                onClick={() => setGiftPlan('solution')}
                className={`p-4 rounded-lg border text-left transition-[color,background-color,border-color,opacity,transform] ${
                  giftPlan === 'solution'
                    ? 'bg-dusk-500/10 border-dusk-400 ring-1 ring-dusk-400/40'
                    : 'bg-ink-950 border-ink-800 hover:bg-ink-900'
                }`}
              >
                <div className="text-xs font-medium text-ink-200">Gói Xem Lời Giải (30 ngày)</div>
                <div className="text-base font-medium text-brass-300 mt-1">
                  {formatVnd(settings?.solutionPackagePrice ?? 20000)}
                </div>
                <div className="text-[11px] text-ink-400 mt-0.5">Mở khóa toàn bộ lời giải chi tiết</div>
              </button>
            </div>

            {requestSent ? (
              <div className="p-4 bg-moss-950/40 border border-moss-700/60 rounded-lg text-xs text-moss-200 space-y-1">
                <div className="font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-moss-400" />
                  <span>Đã gửi yêu cầu gia hạn gói PRO cho: {requestRecipient}!</span>
                </div>
                <p className="text-ink-300">
                  Quản Trị Viên sẽ xác nhận giao dịch chuyển khoản và kích hoạt gói PRO ngay sau ít phút.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-ink-950 border border-ink-800 rounded-lg space-y-3 text-xs">
                <div className="font-medium text-ink-200 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-dusk-400" />
                  <span>Thông tin chuyển khoản gia hạn cho bạn bè:</span>
                </div>
                {settings?.bankAccountNumber ? (
                  <div className="space-y-1 font-mono text-ink-300">
                    <div>Ngân hàng: <span className="text-ink-100">{settings.bankName || '—'}</span></div>
                    <div>Chủ TK: <span className="text-ink-100">{settings.bankAccountName || '—'}</span></div>
                    <div className="flex items-center gap-2">
                      <span>Số TK: <span className="text-ink-100 font-medium">{settings.bankAccountNumber}</span></span>
                      <button onClick={handleCopyBank} className="text-brass-400 hover:text-brass-300">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div>Số tiền: <span className="text-brass-300 font-medium">{formatVnd(giftPlan === 'monthly' ? (settings?.monthlyPackagePrice ?? 15000) : (settings?.solutionPackagePrice ?? 20000))}</span></div>
                    <div>
                      Nội dung CK: <span className="text-moss-400 font-medium">PREMIUM {targetGiftUsername.trim() || '[TÊN_BẠN_BÈ]'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-ink-500">Admin chưa cấu hình tài khoản ngân hàng.</div>
                )}

                {requestMsg && <div className="text-garnet-400 font-medium">{requestMsg}</div>}

                <button
                  type="button"
                  onClick={() => handleSendPremiumRequest(true)}
                  disabled={requestLoading || !targetGiftUsername.trim()}
                  className="w-full py-3 text-white font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-dusk-600 hover:bg-dusk-500"
                >
                  {requestLoading ? 'Đang gửi yêu cầu...' : `Xác Nhận Đã Chuyển Khoản Gia Hạn Cho ${targetGiftUsername.trim() || 'Người dùng'}`}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: FOR SELF */
          <>
            {isPremiumActive ? (
              <div className="p-4 bg-gilt-950/30 border border-gilt-700/50 rounded-lg text-xs text-gilt-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2 text-sm text-gilt-300">
                      <span>Bạn đang là thành viên PRO VIP</span>
                    </div>
                    <div className="text-ink-300">
                      Gói hiện tại: <strong className="text-gilt-300">{profile.premiumPlan === 'monthly' ? 'Gói tháng' : 'Gói xem lời giải'}</strong>
                    </div>
                    {profile.premiumExpiresAt && (
                      <div className="text-ink-400 font-mono">
                        Hết hạn ngày: <strong className="text-ink-200">{new Date(profile.premiumExpiresAt).toLocaleDateString('vi-VN')}</strong>
                      </div>
                    )}
                  </div>

                  {/* Actions for active Pro user: Extend or Revoke */}
                  <div className="flex items-center gap-2 flex-wrap pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => setShowSelfRenew(v => !v)}
                      className="px-3 py-2 bg-gilt-500/20 border border-gilt-400/60 hover:bg-gilt-500/30 text-gilt-300 font-medium rounded-md transition-[color,background-color,border-color,opacity,transform]"
                    >
                      {showSelfRenew ? 'Đóng gia hạn' : 'Gia hạn thêm gói PRO'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelMyPro}
                      disabled={cancellingPro}
                      className="px-3 py-2 bg-garnet-950/60 border border-garnet-700/60 hover:bg-garnet-900/60 text-garnet-300 font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] disabled:opacity-50"
                    >
                      {cancellingPro ? 'Đang gỡ...' : 'Gỡ gói PRO'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-ink-400 border-t border-gilt-800/40 pt-2 flex items-center gap-3 flex-wrap">
                  <span> Xem lời giải chi tiết mọi câu hỏi</span>
                  <span>•</span>
                  <span> Mở khóa Pháp Thân VIP</span>
                  <span>•</span>
                  <span> Tùy chỉnh danh hiệu độc quyền</span>
                </div>
              </div>
            ) : null}

            {(!isPremiumActive || showSelfRenew) && (
              <>
                {requestSent ? (
                  <div className="p-4 bg-dusk-950/40 border border-dusk-700/50 rounded-lg text-xs text-dusk-200 space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-dusk-300" />
                      <span>⏳ Yêu cầu kích hoạt/gia hạn của bạn đang chờ Admin duyệt.</span>
                    </div>
                    <div className="text-ink-400">Sau khi nhận chuyển khoản, gói PRO sẽ tự động kích hoạt ngay cho tài khoản {profile.username}.</div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-ink-400">
                      Mở khóa <strong className="text-gilt-300">xem lời giải chi tiết từng bước</strong> cho mọi câu hỏi và <strong className="text-gilt-300">Pháp thân VIP</strong> độc quyền.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedPlan('solution')}
                        className={`p-4 rounded-lg border text-left transition-[color,background-color,border-color,opacity,transform] ${
                          selectedPlan === 'solution'
                            ? 'bg-brass-500/10 border-brass-400 ring-1 ring-brass-400/40'
                            : 'bg-ink-950 border-ink-800 hover:bg-ink-900'
                        }`}
                      >
                        <div className="text-xs font-medium text-ink-200">Gói xem lời giải</div>
                        <div className="text-lg font-medium text-brass-300 mt-1">
                          {formatVnd(settings?.solutionPackagePrice ?? 20000)}
                        </div>
                        <div className="text-[11px] text-ink-500 mt-1">Hiệu lực 30 ngày</div>
                      </button>

                      <button
                        onClick={() => setSelectedPlan('monthly')}
                        className={`relative p-4 rounded-lg border text-left transition-[color,background-color,border-color,opacity,transform] ${
                          selectedPlan === 'monthly'
                            ? 'bg-moss-500/10 border-moss-400 ring-1 ring-moss-400/40'
                            : 'bg-ink-950 border-ink-800 hover:bg-ink-900'
                        }`}
                      >
                        <div className="absolute -top-2 right-3 px-2 py-0.5 bg-moss-500 text-on-accent text-[11px] font-medium rounded">
                          Tiết kiệm hơn
                        </div>
                        <div className="text-xs font-medium text-ink-200">Gói tháng</div>
                        <div className="text-lg font-medium text-moss-400 mt-1">
                          {formatVnd(settings?.monthlyPackagePrice ?? 15000)}
                          <span className="text-[11px] text-ink-500 font-normal">/tháng</span>
                        </div>
                        <div className="text-[11px] text-ink-500 mt-1">Tự động gia hạn 30 ngày mỗi lần đăng ký</div>
                      </button>
                    </div>

                    {selectedPlan && (
                      <div className="p-4 bg-ink-950 border border-ink-800 rounded-lg space-y-3 text-xs">
                        <div className="font-medium text-ink-200 flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-brass-400" />
                          <span>Chuyển khoản để kích hoạt gói PRO</span>
                        </div>
                        {settings?.bankAccountNumber ? (
                          <div className="space-y-1 font-mono text-ink-300">
                            <div>Ngân hàng: <span className="text-ink-100">{settings.bankName || '—'}</span></div>
                            <div>Chủ TK: <span className="text-ink-100">{settings.bankAccountName || '—'}</span></div>
                            <div className="flex items-center gap-2">
                              <span>Số TK: <span className="text-ink-100 font-medium">{settings.bankAccountNumber}</span></span>
                              <button onClick={handleCopyBank} className="text-brass-400 hover:text-brass-300">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <div>Số tiền: <span className="text-brass-300 font-medium">{formatVnd(selectedPlan === 'monthly' ? (settings?.monthlyPackagePrice ?? 15000) : (settings?.solutionPackagePrice ?? 20000))}</span></div>
                            <div>Nội dung CK: <span className="text-moss-400 font-medium">PREMIUM {profile.username}</span></div>
                          </div>
                        ) : (
                          <div className="text-ink-500">Admin chưa cập nhật thông tin chuyển khoản. Vui lòng liên hệ trực tiếp Quản Trị Viên.</div>
                        )}

                        {requestMsg && <div className="text-garnet-400">{requestMsg}</div>}

                        <button
                          onClick={() => handleSendPremiumRequest(false)}
                          disabled={requestLoading}
                          className="w-full py-2 text-on-accent font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-brass-600 hover:bg-brass-500"
                        >
                          {requestLoading ? 'Đang gửi...' : 'Tôi đã chuyển khoản - xác nhận'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Match History Table */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-ink-200 flex items-center gap-2">
          <History className="w-4 h-4 text-brass-400" />
          <span>Lịch sử thi đấu gần đây</span>
        </h3>

        {loadingHistory ? (
          <div className="p-6 text-center text-xs text-ink-500">Đang tải lịch sử đấu...</div>
        ) : matchHistory.length === 0 ? (
          <div className="p-6 bg-ink-900 rounded-lg border border-ink-800 text-center text-xs text-ink-400">
            Chưa có trận đấu nào được ghi lại. Hãy tham gia một ván đấu với AI hoặc Online
          </div>
        ) : (
          <div className="space-y-2">
            {matchHistory.map(m => (
              <div
                key={m.id}
                className="p-4 bg-ink-900 border border-ink-800 rounded-lg flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md text-xs font-medium ${
                    m.isWin ? 'bg-moss-950 text-moss-300 border border-moss-800' : 'bg-garnet-950 text-garnet-300 border border-garnet-800'
                  }`}>
                    {m.isWin ? 'THẮNG' : 'THUA'}
                  </div>

                  <div>
                    <div className="text-xs font-medium text-ink-200">
                      Đấu với: <span className="text-brass-300">{m.opponentName}</span> ({m.mode.toUpperCase()})
                    </div>
                    <div className="text-[11px] text-ink-400 font-mono flex items-center gap-3 mt-0.5">
                      <span>Điểm: {m.score}đ</span>
                      <span>Chính xác: {m.accuracy}% ({m.correctAnswers}/{m.totalQuestions})</span>
                      <span>Bust: {m.busts} lần</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-ink-500 font-mono">
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
