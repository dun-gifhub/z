import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Plus, Trash2, Users, CheckCircle, RefreshCw, Lock, KeyRound, Settings, Crown, UserX, XCircle, Link2, Landmark, RotateCcw, Globe, ExternalLink } from 'lucide-react';
import { MathLevel, MathCategory, Question, SiteSettings, PremiumRequest, PremiumPlan } from '../../shared/types.ts';
import { MATH_DOMAINS } from '../../shared/cards.ts';

function formatVnd(n: number) {
  return (n || 0).toLocaleString('vi-VN') + 'đ';
}

interface AdminPanelProps {
  onBack: () => void;
  currentUserRole?: string;
}

const ADMIN_KEY_STORAGE = 'mathrune_admin_key';

const isUserGuest = (u: any) => !!(u.isGuest || u.role === 'guest' || u.accountType === 'guest');
const isUserPro = (u: any) => !!u.isPremium && (!u.premiumExpiresAt || new Date(u.premiumExpiresAt).getTime() > Date.now());

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  // ------- Password gate -------
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem(ADMIN_KEY_STORAGE) || '');
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const verifyKey = async (key: string, opts?: { silent?: boolean }) => {
    if (!key) return false;
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: key }),
      });
      if (res.ok) {
        setAuthed(true);
        setAdminKey(key);
        sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
        return true;
      }
      if (!opts?.silent) {
        const d = await res.json().catch(() => ({}));
        setAuthError(d.error || 'Sai mật khẩu quản trị.');
      }
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
      return false;
    } catch (e) {
      if (!opts?.silent) setAuthError('Không kết nối được máy chủ.');
      return false;
    }
  };

  // Try to silently re-auth with a key saved earlier this session
  useEffect(() => {
    if (adminKey) verifyKey(adminKey, { silent: true });
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    await verifyKey(pwInput);
    setAuthLoading(false);
  };

  const adminHeaders = { 'Content-Type': 'application/json', 'x-admin-key': adminKey };

  // ------- Panel state (only used once authed) -------
  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'questions' | 'users' | 'premium' | 'settings'>('stats');

  // Premium requests state
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [premiumActionMsg, setPremiumActionMsg] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // User management state: filtering, search, and Pro package controls
  const [userFilter, setUserFilter] = useState<'all' | 'registered' | 'guest' | 'pro'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [customGrantUsername, setCustomGrantUsername] = useState('');
  const [customGrantDays, setCustomGrantDays] = useState<number>(30);
  const [customGrantPlan, setCustomGrantPlan] = useState<'monthly' | 'solution'>('monthly');
  const [grantActionMsg, setGrantActionMsg] = useState<string | null>(null);
  const [grantActionLoading, setGrantActionLoading] = useState(false);

  // New question form state
  const [qText, setQText] = useState('');
  const [qFormula, setQFormula] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qOptions, setQOptions] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qCategory, setQCategory] = useState<MathCategory>('NGUYEN_TO');
  const [qLevel, setQLevel] = useState<MathLevel>('THCS');
  const [qTimeLimit, setQTimeLimit] = useState(15);
  const [formMsg, setFormMsg] = useState<string | null>(null);
  // AI Question Generator state (từ nguồn web toán học uy tín)
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<MathCategory>('NGUYEN_TO');
  const [aiLevel, setAiLevel] = useState<MathLevel>('THCS');
  const [aiPreferredSource, setAiPreferredSource] = useState('VietJack Chuyên Đề Toán (vietjack.com)');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedQuestion, setAiGeneratedQuestion] = useState<Question | null>(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);
  const [aiSavingToDb, setAiSavingToDb] = useState(false);

  const fetchStats = () => {
    fetch('/api/admin/stats', { headers: adminHeaders })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.warn(e));
  };

  const fetchQuestions = () => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(Array.isArray(data) ? data : []))
      .catch(e => console.warn(e));
  };

  const fetchUsers = () => {
    fetch('/api/admin/users', { headers: adminHeaders })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(e => console.warn(e));
  };

  const fetchPremiumRequests = () => {
    fetch('/api/admin/premium/requests', { headers: adminHeaders })
      .then(res => res.json())
      .then(data => setPremiumRequests(Array.isArray(data) ? data : []))
      .catch(e => console.warn(e));
  };

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setSettingsForm(data);
      })
      .catch(e => console.warn(e));
  };

  useEffect(() => {
    if (!authed) return;
    fetchStats();
    fetchQuestions();
    fetchUsers();
    fetchPremiumRequests();
    fetchSettings();
  }, [authed]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qAnswer.trim()) {
      setFormMsg('Vui lòng nhập câu hỏi và đáp án.');
      return;
    }

    const optionsArray = qOptions.trim()
      ? qOptions.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          question: qText,
          formula: qFormula || undefined,
          answer: qAnswer,
          options: optionsArray,
          explanation: qExplanation,
          category: qCategory,
          level: qLevel,
          timeLimit: Number(qTimeLimit),
        }),
      });

      if (res.ok) {
        setFormMsg('Đã thêm câu hỏi vào Ngân Hàng Đề');
        setQText('');
        setQFormula('');
        setQAnswer('');
        setQOptions('');
        setQExplanation('');
        fetchQuestions();
        fetchStats();
        setTimeout(() => setFormMsg(null), 3000);
      } else {
        const d = await res.json();
        setFormMsg(`Lỗi: ${d.error}`);
      }
    } catch (err: any) {
      setFormMsg(`Lỗi kết nối: ${err.message}`);
    }
  };

  // Sinh câu hỏi thông minh bằng AI từ nguồn web toán học uy tín
  const handleGenerateAiQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAiGenerating(true);
    setAiErrorMsg(null);
    setAiSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/ai/generate-question', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          topic: aiTopic,
          category: aiCategory,
          level: aiLevel,
          preferredSource: aiPreferredSource,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể sinh câu hỏi AI.');
      }
      setAiGeneratedQuestion(data.question);
      setAiSuccessMsg('Đã sinh thành công 01 câu hỏi toán học uy tín có thẩm định');
    } catch (err: any) {
      setAiErrorMsg(err?.message || 'Lỗi khi sinh câu hỏi AI.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Lưu câu hỏi vừa sinh bằng AI vào ngân hàng đề thi đấu
  const handleSaveAiQuestionToBank = async () => {
    if (!aiGeneratedQuestion) return;
    setAiSavingToDb(true);
    setAiErrorMsg(null);
    setAiSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(aiGeneratedQuestion),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi lưu câu hỏi vào ngân hàng.');
      }
      setAiSuccessMsg('Đã thêm thành công câu hỏi vào Ngân Hàng Đề thi đấu');
      setAiGeneratedQuestion(null);
      fetchQuestions();
      fetchStats();
    } catch (err: any) {
      setAiErrorMsg(err?.message || 'Lỗi lưu câu hỏi.');
    } finally {
      setAiSavingToDb(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      await fetch(`/api/admin/questions/${id}`, { method: 'DELETE', headers: adminHeaders });
      fetchQuestions();
      fetchStats();
    } catch (e) {
      console.warn(e);
    }
  };

  // ------- Xóa tài khoản người dùng (chỉ 1 tài khoản Admin duy nhất, không thể xóa) -------
  const handleDeleteUser = async (u: any) => {
    if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${u.username}"? Toàn bộ hồ sơ, lịch sử trận đấu sẽ bị mất và không thể hoàn tác!`)) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE', headers: adminHeaders });
      const d = await res.json();
      if (res.ok) {
        fetchUsers();
        fetchStats();
      } else {
        alert(d.error || 'Không thể xóa tài khoản.');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // ------- Xóa toàn bộ tài khoản Chơi Nhanh (Khách) -------
  const handleDeleteAllGuests = async () => {
    const currentGuests = users.filter(u => isUserGuest(u));
    if (!confirm(`Bạn có chắc chắn muốn XÓA TẤT CẢ ${currentGuests.length} tài khoản Chơi Nhanh (Khách)? Toàn bộ dữ liệu tạm của các tài khoản này sẽ được dọn sạch hoàn toàn!`)) return;
    try {
      const res = await fetch('/api/admin/users/guests', { method: 'DELETE', headers: adminHeaders });
      const d = await res.json();
      if (res.ok) {
        alert(d.message || `Đã xóa thành công ${d.count} tài khoản Chơi Nhanh!`);
        fetchUsers();
        fetchStats();
      } else {
        alert(d.error || 'Lỗi xóa tài khoản Chơi Nhanh.');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // ------- Cấp / Thu hồi / Gia hạn Gói PRO thủ công (bằng ID hoặc Tên tài khoản) -------
  const handleGrantPremium = async (userId: string, plan: PremiumPlan = 'monthly', days: number = 30) => {
    try {
      const res = await fetch('/api/admin/premium/grant', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ userId, plan, days }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `Đã gia hạn thành công gói PRO thêm ${days} ngày!`);
        fetchUsers();
        fetchStats();
      } else {
        alert(data.error || 'Lỗi cấp gói PRO.');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRevokePremium = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn gỡ bỏ gói PRO của tài khoản này không?')) return;
    try {
      const res = await fetch('/api/admin/premium/revoke', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Đã gỡ gói PRO thành công');
        fetchUsers();
        fetchStats();
      } else {
        alert(data.error || 'Lỗi gỡ gói PRO.');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCustomGrantByUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGrantUsername.trim()) return;
    setGrantActionLoading(true);
    setGrantActionMsg(null);
    try {
      const res = await fetch('/api/admin/premium/grant', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          username: customGrantUsername.trim(),
          plan: customGrantPlan,
          days: customGrantDays,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGrantActionMsg(` ${data.message || 'Đã gia hạn gói PRO thành công'}`);
        setCustomGrantUsername('');
        fetchUsers();
        fetchStats();
      } else {
        setGrantActionMsg(data.error || 'Lỗi gia hạn gói PRO.');
      }
    } catch {
      setGrantActionMsg('Lỗi kết nối máy chủ.');
    } finally {
      setGrantActionLoading(false);
      setTimeout(() => setGrantActionMsg(null), 5000);
    }
  };

  // ------- Duyệt / Từ chối yêu cầu mua gói Premium -------
  const handleResolvePremiumRequest = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/admin/premium/requests/${id}/${approve ? 'approve' : 'reject'}`, {
        method: 'POST',
        headers: adminHeaders,
      });
      if (res.ok) {
        setPremiumActionMsg(approve ? 'Đã duyệt và kích hoạt Premium cho người dùng' : 'Đã từ chối yêu cầu.');
        fetchPremiumRequests();
        fetchUsers();
        fetchStats();
        setTimeout(() => setPremiumActionMsg(null), 3000);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // ------- Cài đặt hệ thống: link hướng dẫn, giá gói, thông tin chuyển khoản -------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: adminHeaders,
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
        setSettingsMsg('Đã lưu cài đặt');
      } else {
        setSettingsMsg(`Lỗi: ${data.error}`);
      }
    } catch (err: any) {
      setSettingsMsg(`Lỗi kết nối: ${err.message}`);
    } finally {
      setSettingsSaving(false);
      setTimeout(() => setSettingsMsg(null), 3000);
    }
  };

  // ------- Reset Bảng Xếp Hạng tuần (điểm về 0đ) -------
  const handleResetLeaderboard = async () => {
    if (!confirm('Xóa Bảng Xếp Hạng Tuần và đưa điểm của TẤT CẢ người chơi về 0đ? (Điểm kỷ lục mọi thời đại vẫn được giữ nguyên)')) return;
    setResetLoading(true);
    try {
      const res = await fetch('/api/admin/leaderboard/reset', { method: 'POST', headers: adminHeaders });
      const d = await res.json();
      if (res.ok) {
        setSettings(prev => prev ? { ...prev, lastLeaderboardReset: d.settings.lastLeaderboardReset } : prev);
        setSettingsMsg('Đã reset Bảng Xếp Hạng Tuần về 0đ');
        setTimeout(() => setSettingsMsg(null), 3000);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setResetLoading(false);
    }
  };

  // ------- Reset Bảng Xếp Hạng TOÀN THỜI GIAN (điểm kỷ lục mọi thời đại về 0đ) -------
  const [resetAllTimeLoading, setResetAllTimeLoading] = useState(false);
  const handleResetAllTimeLeaderboard = async () => {
    if (!confirm('Xóa Bảng Xếp Hạng TOÀN THỜI GIAN và đưa điểm kỷ lục mọi thời đại của TẤT CẢ người chơi về 0đ? Thao tác này KHÔNG THỂ hoàn tác!')) return;
    setResetAllTimeLoading(true);
    try {
      const res = await fetch('/api/admin/leaderboard/reset-alltime', { method: 'POST', headers: adminHeaders });
      if (res.ok) {
        setSettingsMsg('Đã reset Bảng Xếp Hạng Toàn Thời Gian về 0đ');
        setTimeout(() => setSettingsMsg(null), 3000);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setResetAllTimeLoading(false);
    }
  };

  // ------- Locked screen: shown until the correct admin password is entered -------
  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-ink-400 hover:text-ink-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="bg-ink-900 border border-ink-800 rounded-lg p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brass-950/60 border border-brass-700/40 text-brass-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-brass-100">Khu vực quản trị</h3>
          <p className="text-xs text-ink-400">
            Nhập mật khẩu Admin để tiếp tục. Khu vực này không dành cho khách hay người chơi thường.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-3 text-left">
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-ink-500" />
              <input
                type="password"
                autoFocus
                required
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                placeholder="Mật khẩu Admin"
                className="w-full bg-ink-950 border border-ink-800 rounded-md pl-9 pr-3 py-3 text-xs text-ink-100 focus:outline-none focus:border-brass-500 transition-colors"
              />
            </div>

            {authError && (
              <div className="p-3 bg-garnet-950/50 border border-garnet-800 text-garnet-300 text-xs rounded-md">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-brass-600 hover:bg-brass-500"
            >
              {authLoading ? 'Đang kiểm tra...' : 'Mở khóa'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-ink-400 hover:text-ink-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-brass-950/40 border border-brass-800/40 rounded text-xs font-mono text-brass-300">
          <Shield className="w-4 h-4 text-brass-400" />
          <span>Trang Quản Trị Hệ Thống (Admin Panel)</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-medium text-brass-200">
          Quản trị viên & hệ thống
        </h2>
        <p className="text-xs text-ink-400">
          Giám sát tài nguyên máy chủ, quản lý ngân hàng câu hỏi toán học và danh sách pháp sư.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: 'stats', label: 'Tổng Quan Máy Chủ' },
          { id: 'questions', label: 'Ngân hàng câu hỏi' },
          { id: 'users', label: 'Người Dùng' },
          { id: 'premium', label: 'Gói premium' },
          { id: 'settings', label: 'Cài đặt' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-medium rounded-md border transition-[color,background-color,border-color,opacity,transform] ${
              activeTab === t.id
                ? 'bg-brass-600 border-brass-400 text-on-accent'
                : 'bg-ink-900 border-ink-800 text-ink-400 hover:bg-ink-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SYSTEM STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg text-center">
              <div className="text-xs text-ink-400">Tổng người dùng</div>
              <div className="text-2xl font-medium text-brass-300 font-mono mt-1">
                {stats?.totalUsers ?? '...'}
              </div>
            </div>

            <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg text-center">
              <div className="text-xs text-ink-400">Tổng câu hỏi toán</div>
              <div className="text-2xl font-medium text-dusk-300 font-mono mt-1">
                {stats?.totalQuestions ?? '...'}
              </div>
            </div>

            <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg text-center">
              <div className="text-xs text-ink-400">Bộ Bài 10 Hệ</div>
              <div className="text-2xl font-medium text-moss-400 font-mono mt-1">
                {stats?.totalCards ?? 60} Lá
              </div>
            </div>

            <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg text-center">
              <div className="text-xs text-ink-400">Bộ ấn chú</div>
              <div className="text-2xl font-medium text-mauve-300 font-mono mt-1">
                {stats?.totalRunes ?? 16} Rune
              </div>
            </div>

            <div className="p-4 bg-ink-900 border border-gilt-800/50 rounded-lg text-center">
              <div className="text-xs text-ink-400">Thành viên premium</div>
              <div className="text-2xl font-medium text-gilt-300 font-mono mt-1">
                {stats?.totalPremiumUsers ?? 0}
              </div>
            </div>

            <div className="p-4 bg-ink-900 border border-dusk-800/50 rounded-lg text-center">
              <div className="text-xs text-ink-400">Yêu cầu premium chờ duyệt</div>
              <div className="text-2xl font-medium text-dusk-300 font-mono mt-1">
                {stats?.pendingPremiumRequests ?? 0}
              </div>
            </div>
          </div>

          <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg space-y-2 text-xs font-mono text-ink-300">
            <div className="flex justify-between">
              <span>Trạng thái hệ thống:</span>
              <span className="text-moss-400 font-medium">● Đang Hoạt Động (Healthy)</span>
            </div>
            <div className="flex justify-between">
              <span>Bộ nhớ RAM đang chiếm:</span>
              <span className="text-brass-300">{stats?.activeMemoryUsage ?? '34 MB'}</span>
            </div>
            <div className="flex justify-between">
              <span>Engine đồng bộ:</span>
              <span className="text-dusk-300">WebSocket authoritative server</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* AI QUESTION GENERATOR FROM CREDIBLE WEBSITES */}
          <div className="p-5 border border-dusk-500/50 rounded-lg space-y-4 relative overflow-hidden bg-dusk-950/90">
            {/* Ambient runic glow */}
            <div className="hidden" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dusk-800/40 pb-3">
              <div>
                <h3 className="text-base font-medium text-brass-300 flex items-center gap-2">
                  <span>SINH ĐỀ TOÁN HỌC BẰNG AI (NGUỒN WEB UY TÍN)</span>
                </h3>
                <p className="text-[11px] text-dusk-200/80 mt-0.5">
                  Mô hình AI đối chiếu và trích xuất câu hỏi toán học chuẩn mực từ: VietJack, VMF Diễn Đàn Toán Học, Lời Giải Hay, MathVN, Khan Academy, Bộ GD&ĐT.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-moss-950/80 text-moss-300 border border-moss-700/60 rounded text-[11px] font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-moss-400" />
                <span>Kết quả & lời giải thẩm định</span>
              </span>
            </div>

            {aiSuccessMsg && (
              <div className="p-3 bg-moss-950/80 border border-moss-600 text-moss-200 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-moss-400 shrink-0" />
                <span>{aiSuccessMsg}</span>
              </div>
            )}

            {aiErrorMsg && (
              <div className="p-3 bg-garnet-950/80 border border-garnet-600 text-garnet-200 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
                <XCircle className="w-4 h-4 text-garnet-400 shrink-0" />
                <span>{aiErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleGenerateAiQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Chọn Nguồn Toán Học Uy Tín */}
                <div>
                  <label className="block text-dusk-200 font-medium mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-lake-400" />
                    <span>Nguồn web uy tín ưu tiên:</span>
                  </label>
                  <select
                    value={aiPreferredSource}
                    onChange={e => setAiPreferredSource(e.target.value)}
                    className="w-full bg-ink-950/90 border border-dusk-700/60 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                  >
                    <option value="VietJack Chuyên Đề Toán (vietjack.com)"> VietJack Chuyên Đề Toán (vietjack.com)</option>
                    <option value="Diễn đàn Toán học Việt Nam (diendantoanhoc.org - VMF)"> Diễn đàn Toán học VMF (diendantoanhoc.org)</option>
                    <option value="Lời Giải Hay (loigiaihay.com)"> Lời Giải Hay (loigiaihay.com)</option>
                    <option value="MathVN Chuyên Toán (mathvn.com)"> MathVN Chuyên Toán (mathvn.com)</option>
                    <option value="Khan Academy Math (vi.khanacademy.org)"> Khan Academy Math (vi.khanacademy.org)</option>
                    <option value="Bộ GD&ĐT - đề thi tuyển sinh chuẩn"> Bộ GD&ĐT - đề thi chuẩn quốc gia</option>
                  </select>
                </div>

                {/* Chọn Phân Môn */}
                <div>
                  <label className="block text-dusk-200 font-medium mb-1">Phân môn toán học:</label>
                  <select
                    value={aiCategory}
                    onChange={e => setAiCategory(e.target.value as any)}
                    className="w-full bg-ink-950/90 border border-dusk-700/60 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                  >
                    {Object.entries(MATH_DOMAINS).map(([k, v]) => (
                      <option key={k} value={k}>{v.nameVi} ({k})</option>
                    ))}
                  </select>
                </div>

                {/* Chọn Cấp Độ */}
                <div>
                  <label className="block text-dusk-200 font-medium mb-1">Cấp độ đối tượng:</label>
                  <select
                    value={aiLevel}
                    onChange={e => setAiLevel(e.target.value as any)}
                    className="w-full bg-ink-950/90 border border-dusk-700/60 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                  >
                    <option value="THCS">THCS (Lớp 6 - Lớp 9)</option>
                    <option value="THPT">THPT (Lớp 10 - Lớp 12)</option>
                    <option value="CO_BAN">Cơ Bản (Tiểu Học Lớp 1 - 5)</option>
                  </select>
                </div>
              </div>

              {/* Nhập Chủ Đề / Từ Khóa */}
              <div>
                <label className="block text-dusk-200 font-medium mb-1">
                  Chủ Đề / Từ Khóa Cụ Thể (Tùy chọn):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="VD: Số nguyên tố & Ước số chung, Định lý Pythagoras, Bất đẳng thức Cauchy, Đạo hàm tiếp tuyến..."
                    className="flex-1 bg-ink-950/90 border border-dusk-700/60 rounded-md px-3 py-2 text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-brass-400"
                  />
                  <button
                    type="submit"
                    disabled={aiGenerating}
                    className="px-5 py-3 text-on-accent font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 bg-brass-500 hover:bg-brass-400"
                  >
                    {aiGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-on-accent" />
                        <span>Đang đối chiếu & sinh đề...</span>
                      </>
                    ) : (
                      <>
                        <span>Sinh đề AI ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* AI Generated Question Result Card */}
            {aiGeneratedQuestion && (
              <div className="p-4 bg-ink-950/90 border border-brass-500/60 rounded-md space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-ink-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-0.5 rounded text-[11px] font-medium bg-brass-400/20 text-brass-300 border border-brass-400/40 font-mono">
                       Đề thi vừa sinh
                    </span>
                    {aiGeneratedQuestion.sourceName && (
                      <a
                        href={aiGeneratedQuestion.sourceUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[11px] font-medium bg-lake-950 text-lake-300 border border-lake-700/60 hover:border-lake-400 transition-colors"
                      >
                        <Globe className="w-3 h-3 text-lake-400" />
                        <span>Nguồn: {aiGeneratedQuestion.sourceName}</span>
                        <ExternalLink className="w-3 h-3 text-lake-400" />
                      </a>
                    )}
                    <span className="text-[11px] text-ink-400 font-mono">
                      Cấp: {aiGeneratedQuestion.level} • Hệ: {aiGeneratedQuestion.category}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-medium text-ink-100 leading-relaxed">
                  {aiGeneratedQuestion.question}
                </div>

                {/* 4 Choices */}
                {aiGeneratedQuestion.options && aiGeneratedQuestion.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {aiGeneratedQuestion.options.map((opt, idx) => {
                      const isCorrect = opt.trim() === aiGeneratedQuestion.answer.trim();
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-md border flex items-center justify-between gap-2 font-mono ${
                            isCorrect
                              ? 'bg-moss-950/70 border-moss-500 text-moss-200 font-medium ring-1 ring-moss-500/50'
                              : 'bg-ink-900 border-ink-800 text-ink-300'
                          }`}
                        >
                          <span>
                            <strong className="text-brass-300 mr-2">{String.fromCharCode(65 + idx)}.</strong>
                            {opt}
                          </span>
                          {isCorrect && (
                            <span className="px-2 py-0.5 bg-moss-500 text-on-accent text-[11px] font-medium rounded-md">
                              Đáp án đúng
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3 bg-ink-900/90 border border-ink-800 rounded-md text-xs text-ink-300 space-y-1">
                  <div className="text-[11px] font-medium text-brass-300 font-mono flex items-center gap-2">
                    <span> LỜI GIẢI THÍCH CHI TIẾT (ĐÃ THẨM ĐỊNH):</span>
                  </div>
                  <p className="leading-relaxed text-ink-200">{aiGeneratedQuestion.explanation}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveAiQuestionToBank}
                    disabled={aiSavingToDb}
                    className="flex-1 py-3 text-white font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2 text-xs bg-moss-600 hover:bg-moss-500"
                  >
                    {aiSavingToDb ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-moss-300" />
                        <span>Lưu vào ngân hàng đề thi đấu</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleGenerateAiQuestion()}
                    disabled={aiGenerating}
                    className="px-4 py-3 bg-ink-900 hover:bg-ink-800 text-ink-200 border border-ink-700 rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 text-xs font-medium flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 text-brass-400 ${aiGenerating ?'animate-spin' : ''}`} />
                    <span>Sinh câu khác</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Question Form (Thủ công) */}
          <div className="p-5 bg-ink-900 border border-ink-800 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-brass-300 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi thủ công vào ngân hàng đề</span>
            </h3>

            {formMsg && (
              <div className="p-3 bg-dusk-950 border border-dusk-700 text-dusk-200 text-xs rounded-md">
                {formMsg}
              </div>
            )}

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-300 mb-1">Nội dung câu hỏi (*):</label>
                <input
                  type="text"
                  required
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  placeholder="VD: Số 29 có phải là số nguyên tố không?"
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-ink-300 mb-1">Hệ toán học:</label>
                  <select
                    value={qCategory}
                    onChange={e => setQCategory(e.target.value as any)}
                    className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                  >
                    {Object.entries(MATH_DOMAINS).map(([k, v]) => (
                      <option key={k} value={k}>{v.nameVi} ({k})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink-300 mb-1">Cấp độ:</label>
                  <select
                    value={qLevel}
                    onChange={e => setQLevel(e.target.value as any)}
                    className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                  >
                    <option value="THCS">THCS (Cấp 2)</option>
                    <option value="THPT">THPT (Cấp 3)</option>
                    <option value="DAI_HOC">Đại học</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink-300 mb-1">Thời Gian Trả Lời (giây):</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={qTimeLimit}
                    onChange={e => setQTimeLimit(Number(e.target.value))}
                    className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-300 mb-1">Đáp Án Đúng (*):</label>
                  <input
                    type="text"
                    required
                    value={qAnswer}
                    onChange={e => setQAnswer(e.target.value)}
                    placeholder="VD: Có, hoặc 15, hoặc 4"
                    className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 mb-1">Các Lựa Chọn (cách nhau bởi dấu phẩy):</label>
                  <input
                    type="text"
                    value={qOptions}
                    onChange={e => setQOptions(e.target.value)}
                    placeholder="VD: Có, Không hoặc 12, 14, 15, 16"
                    className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 mb-1">Lời giải thích chi tiết:</label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={e => setQExplanation(e.target.value)}
                  placeholder="Giải thích từng bước giúp người chơi học tập khi trả lời sai..."
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-ink-100 focus:outline-none focus:border-brass-400"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-3 text-on-accent font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 bg-brass-600 hover:bg-brass-500"
              >
                Thêm vào ngân hàng
              </button>
            </form>
          </div>

          {/* Questions List */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-ink-300">
              DANH SÁCH CÂU HỎI HIỆN CÓ ({questions.length} CÂU)
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {questions.map((q, i) => (
                <div
                  key={q.id || i}
                  className="p-3 bg-ink-900 border border-ink-800 rounded-md flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-medium text-ink-100 flex items-center gap-2 flex-wrap">
                      <span>{q.question}</span>
                      {q.sourceName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-lake-950/80 text-lake-300 border border-lake-800 font-mono font-medium">
                           {q.sourceName}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-400 font-mono mt-1 flex items-center gap-2 flex-wrap">
                      <span>Hệ: {q.category}</span>
                      <span>•</span>
                      <span>Cấp: {q.level}</span>
                      <span>•</span>
                      <span>Đáp án: <strong className="text-moss-400">{q.answer}</strong></span>
                    </div>
                  </div>

                  {q.id?.startsWith('ADMIN_') && (
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 text-ink-400 hover:text-garnet-400 rounded-md hover:bg-ink-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS LIST (PHÂN LOẠI TÀI KHOẢN ĐĂNG KÝ / CHƠI NHANH & QUẢN LÝ GÓI PRO) */}
      {activeTab === 'users' && (() => {
        const registeredUsers = users.filter(u => !isUserGuest(u) && u.role !== 'admin');
        const guestUsers = users.filter(u => isUserGuest(u));
        const proUsers = users.filter(u => isUserPro(u));

        const filteredUsers = users.filter(u => {
          if (userFilter === 'registered') {
            if (isUserGuest(u) || u.role === 'admin') return false;
          } else if (userFilter === 'guest') {
            if (!isUserGuest(u)) return false;
          } else if (userFilter === 'pro') {
            if (!isUserPro(u)) return false;
          }

          if (userSearch.trim()) {
            const query = userSearch.toLowerCase();
            const matchName = (u.username || '').toLowerCase().includes(query);
            const matchId = (u.id || '').toLowerCase().includes(query);
            return matchName || matchId;
          }
          return true;
        });

        return (
          <div className="space-y-4">
            {/* TOOL: GIA HẠN GÓI PRO CHO NGƯỜI MÌNH MUỐN */}
            <div className="p-4 bg-ink-900 border border-gilt-600/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gilt-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-gilt-400" />
                  <span>Gia hạn / cấp gói PRO cho người bạn muốn</span>
                </h3>
                <span className="text-[11px] text-ink-400">Công cụ độc quyền Admin</span>
              </div>

              {grantActionMsg && (
                <div className="p-3 bg-moss-950 border border-moss-700 text-moss-200 text-xs rounded-md flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{grantActionMsg}</span>
                </div>
              )}

              <form onSubmit={handleCustomGrantByUsername} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={customGrantUsername}
                    onChange={e => setCustomGrantUsername(e.target.value)}
                    placeholder="Nhập Tên đăng nhập hoặc ID người muốn gia hạn..."
                    className="w-full bg-ink-950 border border-ink-700 focus:border-gilt-400 rounded-md px-3 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <select
                    value={customGrantDays}
                    onChange={e => setCustomGrantDays(Number(e.target.value))}
                    className="w-full bg-ink-950 border border-ink-700 focus:border-gilt-400 rounded-md px-3 py-2 text-xs text-ink-200 focus:outline-none"
                  >
                    <option value={7}>7 Ngày (1 Tuần)</option>
                    <option value={30}>30 Ngày (1 Tháng)</option>
                    <option value={60}>60 Ngày (2 Tháng)</option>
                    <option value={90}>90 Ngày (3 Tháng)</option>
                    <option value={180}>180 Ngày (6 Tháng)</option>
                    <option value={365}>365 Ngày (1 Năm)</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={grantActionLoading || !customGrantUsername.trim()}
                    className="w-full py-2 text-on-accent font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-gilt-500 hover:bg-gilt-400"
                  >
                    {grantActionLoading ? 'Đang cấp...' : 'Gia hạn PRO ngay'}
                  </button>
                </div>
              </form>
            </div>

            {/* USERS OVERVIEW & FILTERS */}
            <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-ink-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brass-400" />
                  <span>DANH SÁCH NGƯỜI DÙNG ({users.length} PHÁP SƯ)</span>
                </h3>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setUserFilter('all')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                      userFilter === 'all'
                        ? 'bg-brass-500 text-on-accent'
                        : 'bg-ink-950 text-ink-400 hover:text-ink-200 border border-ink-800'
                    }`}
                  >
                    Tất Cả ({users.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserFilter('registered')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                      userFilter === 'registered'
                        ? 'bg-moss-600 text-white'
                        : 'bg-ink-950 text-moss-400/80 hover:text-moss-300 border border-ink-800'
                    }`}
                  >
                     Đã Đăng Ký ({registeredUsers.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserFilter('guest')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                      userFilter === 'guest'
                        ? 'bg-brass-600 text-white'
                        : 'bg-ink-950 text-brass-400/80 hover:text-brass-300 border border-ink-800'
                    }`}
                  >
                     Chơi Nhanh ({guestUsers.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserFilter('pro')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                      userFilter === 'pro'
                        ? 'bg-gilt-500 text-on-accent'
                        : 'bg-ink-950 text-gilt-400/80 hover:text-gilt-300 border border-ink-800'
                    }`}
                  >
                    <Crown className="w-3 h-3" />
                    <span>PRO ({proUsers.length})</span>
                  </button>
                </div>

                {guestUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteAllGuests}
                    className="flex items-center gap-2 px-3 py-2 bg-garnet-950/80 hover:bg-garnet-900 border border-garnet-700/80 hover:border-garnet-500 text-garnet-200 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform] active:scale-95 self-start sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4 text-garnet-400" />
                    <span>Xóa Tất Cả Acc Chơi Nhanh ({guestUsers.length})</span>
                  </button>
                )}
              </div>

              {/* Search Box */}
              <div>
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Tìm kiếm theo Tên tài khoản hoặc ID người dùng..."
                  className="w-full bg-ink-950 border border-ink-800 focus:border-brass-400 rounded-md px-3 py-2 text-xs text-ink-200 placeholder:text-ink-500 focus:outline-none"
                />
              </div>

              {/* User rows */}
              <div className="space-y-3 pt-1">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-ink-500 bg-ink-950 rounded-md border border-ink-800">
                    Không tìm thấy người dùng nào phù hợp với bộ lọc.
                  </div>
                ) : (
                  filteredUsers.map(u => {
                    const activePro = isUserPro(u);
                    const isGuest = isUserGuest(u);
                    const isAdmin = u.role === 'admin';

                    return (
                      <div
                        key={u.id}
                        className="p-4 bg-ink-950 border border-ink-800 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl shrink-0">{u.avatar}</span>
                          <div className="space-y-1">
                            <div className="font-medium text-ink-200 flex items-center gap-2 flex-wrap">
                              <span className="text-sm">{u.username}</span>

                              {/* Account Type Classification Badges */}
                              {isAdmin ? (
                                <span className="px-2 py-0.5 bg-brass-500/20 border border-brass-400/50 text-brass-300 text-[11px] font-medium rounded-md">
                                   ADMIN
                                </span>
                              ) : isGuest ? (
                                <span className="px-2 py-0.5 bg-brass-500/10 border border-brass-400/40 text-brass-300 text-[11px] font-medium rounded-md flex items-center gap-1">
                                   CHƠI NHANH (KHÁCH)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-moss-500/10 border border-moss-400/40 text-moss-300 text-[11px] font-medium rounded-md flex items-center gap-1">
                                   Đã đăng ký
                                </span>
                              )}

                              {/* Pro VIP Badge */}
                              {activePro && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-gilt-500/20 border border-gilt-400/50 text-gilt-300 text-[11px] font-medium rounded-md">
                                  <Crown className="w-3 h-3" />
                                  <span>PRO VIP ({u.premiumPlan === 'monthly' ? 'Tháng' : 'Lời giải'})</span>
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] font-mono text-ink-400 flex items-center gap-3 flex-wrap">
                              <span>ID: <span className="text-ink-300">{u.id}</span></span>
                              <span>•</span>
                              <span>Tạo: {new Date(u.createdAt).toLocaleDateString('vi-VN')}</span>
                              {activePro && u.premiumExpiresAt && (
                                <>
                                  <span>•</span>
                                  <span className="text-gilt-300 font-medium">
                                    Hạn PRO: {new Date(u.premiumExpiresAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions: Gia hạn gói PRO & Gỡ gói PRO */}
                        {!isAdmin && (
                          <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
                            {activePro ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRevokePremium(u.id)}
                                  className="px-3 py-2 bg-garnet-950/60 border border-garnet-700/60 hover:border-garnet-500 text-garnet-300 rounded-md transition-colors font-medium text-[11px]"
                                >
                                   Gỡ gói PRO
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleGrantPremium(u.id, 'monthly', 30)}
                                  className="flex items-center gap-1 px-3 py-2 bg-gilt-500/10 border border-gilt-500/40 hover:border-gilt-400 text-gilt-300 rounded-md transition-colors font-medium text-[11px]"
                                >
                                   +30 Ngày
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleGrantPremium(u.id, 'monthly', 30)}
                                className="flex items-center gap-1 px-3 py-2 bg-gilt-950/50 border border-gilt-700/60 hover:border-gilt-400 text-gilt-300 rounded-md transition-colors font-medium text-[11px]"
                              >
                                <Crown className="w-3 h-3" />
                                <span>Cấp PRO 30 Ngày</span>
                              </button>
                            )}

                            {isGuest ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                title="Xóa tài khoản Chơi Nhanh này"
                                className="flex items-center gap-1 px-3 py-2 bg-garnet-950/60 border border-garnet-800/80 hover:border-garnet-500 text-garnet-300 rounded-md hover:bg-garnet-900 transition-colors text-[11px] font-medium"
                              >
                                <Trash2 className="w-3 h-3 text-garnet-400" />
                                <span>Xóa acc khách</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                title="Xóa tài khoản này"
                                className="p-2 text-ink-400 hover:text-garnet-400 rounded-md hover:bg-ink-900 border border-ink-800 transition-colors"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 4: PREMIUM REQUESTS */}
      {activeTab === 'premium' && (
        <div className="space-y-4">
          {premiumActionMsg && (
            <div className="p-3 bg-dusk-950 border border-dusk-700 text-dusk-200 text-xs rounded-md">
              {premiumActionMsg}
            </div>
          )}
          <div className="p-4 bg-ink-900 border border-ink-800 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-ink-200 flex items-center gap-2">
              <Crown className="w-4 h-4 text-gilt-400" />
              <span>YÊU CẦU MUA GÓI PREMIUM ({premiumRequests.filter(r => r.status === 'pending').length} ĐANG CHỜ)</span>
            </h3>

            {premiumRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-ink-500">Chưa có yêu cầu nào.</div>
            ) : (
              <div className="space-y-2">
                {premiumRequests.map(r => (
                  <div
                    key={r.id}
                    className="p-3 bg-ink-950 border border-ink-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-medium text-ink-200">
                        {r.username} — <span className="text-brass-300">{r.plan === 'monthly' ? 'Gói tháng' : 'Gói xem lời giải'}</span>
                      </div>
                      <div className="text-[11px] font-mono text-ink-500">
                        {formatVnd(r.price)} • {new Date(r.createdAt).toLocaleString('vi-VN')} •{' '}
                        <span className={
                          r.status === 'pending' ? 'text-brass-400' : r.status === 'approved' ? 'text-moss-400' : 'text-garnet-400'
                        }>
                          {r.status === 'pending' ? 'Đang chờ' : r.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                      </div>
                    </div>

                    {r.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolvePremiumRequest(r.id, true)}
                          className="flex items-center gap-1 px-3 py-2 bg-moss-950/40 border border-moss-800/50 hover:border-moss-500 text-moss-300 rounded-md transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" /> Duyệt
                        </button>
                        <button
                          onClick={() => handleResolvePremiumRequest(r.id, false)}
                          className="flex items-center gap-1 px-3 py-2 bg-garnet-950/40 border border-garnet-800/50 hover:border-garnet-500 text-garnet-300 rounded-md transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="p-5 bg-ink-900 border border-ink-800 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-brass-300 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span>Đường link hướng dẫn ở trang chủ</span>
            </h3>
            <p className="text-[11px] text-ink-500">
              Link này sẽ hiện ở nút "Hướng dẫn chi tiết" trên Trang Chủ (VD: link nhóm Zalo, Facebook, video Youtube hướng dẫn...).
            </p>
            <input
              type="url"
              value={settingsForm.guideLink || ''}
              onChange={e => setSettingsForm(f => ({ ...f, guideLink: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-400"
            />

            <h3 className="text-sm font-medium text-brass-300 flex items-center gap-2 pt-2">
              <Crown className="w-4 h-4" />
              <span>Giá gói premium</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-300 mb-1 text-xs">Gói Xem Lời Giải (một lần, 30 ngày):</label>
                <input
                  type="number"
                  min={0}
                  value={settingsForm.solutionPackagePrice ?? 0}
                  onChange={e => setSettingsForm(f => ({ ...f, solutionPackagePrice: Number(e.target.value) }))}
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-ink-300 mb-1 text-xs">Gói Tháng (rẻ hơn, tự động 30 ngày):</label>
                <input
                  type="number"
                  min={0}
                  value={settingsForm.monthlyPackagePrice ?? 0}
                  onChange={e => setSettingsForm(f => ({ ...f, monthlyPackagePrice: Number(e.target.value) }))}
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-400 font-mono"
                />
              </div>
            </div>

            <h3 className="text-sm font-medium text-brass-300 flex items-center gap-2 pt-2">
              <Landmark className="w-4 h-4" />
              <span>THÔNG TIN CHUYỂN KHOẢN (HIỂN THỊ CHO NGƯỜI MUA GÓI)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-ink-300 mb-1 text-xs">Ngân hàng:</label>
                <input
                  type="text"
                  value={settingsForm.bankName || ''}
                  onChange={e => setSettingsForm(f => ({ ...f, bankName: e.target.value }))}
                  placeholder="VD: Vietcombank"
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-400"
                />
              </div>
              <div>
                <label className="block text-ink-300 mb-1 text-xs">Chủ tài khoản:</label>
                <input
                  type="text"
                  value={settingsForm.bankAccountName || ''}
                  onChange={e => setSettingsForm(f => ({ ...f, bankAccountName: e.target.value }))}
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-400"
                />
              </div>
              <div>
                <label className="block text-ink-300 mb-1 text-xs">Số tài khoản:</label>
                <input
                  type="text"
                  value={settingsForm.bankAccountNumber || ''}
                  onChange={e => setSettingsForm(f => ({ ...f, bankAccountNumber: e.target.value }))}
                  className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-400 font-mono"
                />
              </div>
            </div>

            {settingsMsg && (
              <div className="p-3 bg-dusk-950 border border-dusk-700 text-dusk-200 text-xs rounded-md">
                {settingsMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={settingsSaving}
              className="px-5 py-3 text-on-accent font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-brass-600 hover:bg-brass-500"
            >
              {settingsSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </form>

          <div className="p-5 bg-ink-900 border border-garnet-900/50 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-garnet-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Reset bảng xếp hạng tuần</span>
            </h3>
            <p className="text-[11px] text-ink-500">
              Hệ thống tự động reset điểm Bảng Xếp Hạng về 0đ mỗi 7 ngày. Bạn cũng có thể bấm nút dưới đây để reset thủ công ngay bây giờ.
              Lần reset gần nhất: {settings?.lastLeaderboardReset ? new Date(settings.lastLeaderboardReset).toLocaleString('vi-VN') : '—'}.
              (Điểm kỷ lục mọi thời đại ở mục "Tất cả thời gian" không bị ảnh hưởng.)
            </p>
            <button
              onClick={handleResetLeaderboard}
              disabled={resetLoading}
              className="px-5 py-3 text-white font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-garnet-700 hover:bg-garnet-600"
            >
              {resetLoading ? 'Đang reset...' : 'Reset Ngay (Về 0đ)'}
            </button>
          </div>

          <div className="p-5 bg-ink-900 border border-garnet-900/50 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-garnet-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Reset bảng xếp hạng toàn thời gian</span>
            </h3>
            <p className="text-[11px] text-ink-500">
              Đưa điểm kỷ lục "Tất cả thời gian" của TOÀN BỘ người chơi về 0đ. Khác với reset tuần ở trên
              (chỉ ảnh hưởng bảng xếp hạng tuần), thao tác này xoá sạch thành tích cao nhất mọi thời đại và
              KHÔNG THỂ hoàn tác — chỉ dùng khi thật sự cần (ví dụ: bắt đầu mùa giải mới).
            </p>
            <button
              onClick={handleResetAllTimeLeaderboard}
              disabled={resetAllTimeLoading}
              className="px-5 py-3 text-white font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-garnet-700 hover:bg-garnet-600"
            >
              {resetAllTimeLoading ? 'Đang reset...' : 'Reset Ngay (Về 0đ)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
