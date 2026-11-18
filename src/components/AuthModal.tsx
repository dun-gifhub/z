import React, { useState } from 'react';
import { X, User, Key, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import { BASIC_AVATARS } from '../../shared/avatars.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (u: string, p: string) => Promise<any>;
  onRegister: (u: string, e: string, p: string, a: string) => Promise<any>;
  onGuestLogin: () => Promise<any>;
}

const AVATARS = BASIC_AVATARS;

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onGuestLogin,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await onLogin(username, password);
      } else {
        await onRegister(username, email, password, selectedAvatar);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError(null);
    setLoading(true);
    try {
      await onGuestLogin();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập khách.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-ink-900 border border-ink-800 rounded-lg p-6 text-ink-100 overflow-hidden">
{/* Magic gradient border light */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brass-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-dusk-950/60 border border-dusk-700/40 text-brass-400 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium text-brass-100">
            Hội pháp sư toán học
          </h3>
          <p className="text-xs text-ink-400 mt-1">
            Đăng nhập để lưu hồ sơ, lịch sử trận đấu, cấp độ và bảng xếp hạng
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-ink-950 rounded-md mb-5 border border-ink-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-2 text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] ${
              tab === 'login'
                ? 'text-white bg-dusk-600'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`py-2 text-xs font-medium rounded-md transition-[color,background-color,border-color,opacity,transform] ${
              tab === 'register'
                ? 'text-white bg-dusk-600'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            Đăng ký mới
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-garnet-950/50 border border-garnet-800 text-garnet-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2">
                Chọn Pháp Thân (Avatar):
              </label>
              <div className="flex flex-wrap gap-2 justify-center py-2 bg-ink-950/60 rounded-md border border-ink-800">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`text-xl p-2 rounded-md transition-[color,background-color,border-color,opacity,transform] ${
                      selectedAvatar === av
                        ? 'bg-brass-500/20 border border-brass-400 scale-110'
                        : 'hover:bg-ink-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-300 mb-1">
              Tên tài khoản (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-ink-500" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="VD: ArchmageAlex"
                className="w-full bg-ink-950 border border-ink-800 rounded-md pl-9 pr-3 py-3 text-xs text-ink-100 focus:outline-none focus:border-brass-500 transition-colors"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1">
                Email (Tùy chọn)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-ink-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-ink-950 border border-ink-800 rounded-md pl-9 pr-3 py-3 text-xs text-ink-100 focus:outline-none focus:border-brass-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-300 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-ink-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ink-950 border border-ink-800 rounded-md pl-9 pr-3 py-3 text-xs text-ink-100 focus:outline-none focus:border-brass-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 disabled:opacity-50 bg-brass-600 hover:bg-brass-500"
          >
            {loading ? 'Đang kích hoạt ấn chú...' : tab === 'login' ? 'Đăng nhập ngay' : 'Hoàn tất đăng ký'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-ink-800/80 text-center">
          <button
            type="button"
            onClick={handleGuest}
            disabled={loading}
            className="text-xs text-brass-400/90 hover:text-brass-300 font-medium underline underline-offset-4 transition-colors"
          >
             Chơi nhanh với tư cách Khách (Không cần mật khẩu)
          </button>
        </div>
      </div>
    </div>
  );
};
