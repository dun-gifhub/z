import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../../shared/types.ts';

interface LeaderboardViewProps {
  onBack: () => void;
  currentUserId?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onBack, currentUserId }) => {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'daily'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?filter=${filter}`)
      .then(res => res.json())
      .then(data => {
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch(e => console.warn('Failed to fetch leaderboard:', e))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-ink-400 hover:text-ink-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-gilt-950/40 border border-gilt-800/40 rounded text-xs font-mono text-gilt-300">
          <Trophy className="w-4 h-4" />
          <span>Bảng vàng danh dự</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-medium text-brass-200">
          Bảng xếp hạng pháp sư
        </h2>
        <p className="text-xs text-ink-400 max-w-md mx-auto">
          Vinh danh những kỳ thủ toán học có điểm số kỷ lục cao nhất và tỉ lệ thắng áp đảo.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'all', label: 'Tất Cả Thời Gian' },
          { id: 'weekly', label: 'Tuần này' },
          { id: 'daily', label: 'Hôm Nay' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 text-xs font-medium rounded-md border transition-[color,background-color,border-color,opacity,transform] ${
              filter === tab.id
                ? 'bg-brass-600 border-brass-400 text-on-accent'
                : 'bg-ink-900 border-ink-800 text-ink-400 hover:bg-ink-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-ink-900 border border-ink-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-ink-950/80 border-b border-ink-800 text-[11px] font-mono text-ink-400">
          <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
          <div className="col-span-6 sm:col-span-6">Pháp sư</div>
          <div className="col-span-2 sm:col-span-2 text-center">Tỉ lệ thắng</div>
          <div className="col-span-2 sm:col-span-3 text-right">Điểm kỷ lục</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-ink-500">Đang đồng bộ thứ hạng...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-500">Chưa có dữ liệu xếp hạng.</div>
        ) : (
          <div className="divide-y divide-ink-800/60">
            {entries.map((entry, idx) => {
              const isCurrentUser = entry.userId === currentUserId;

              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 items-center px-4 py-3 text-xs transition-colors ${
                    isCurrentUser
                      ? 'bg-brass-500/10 border-l-4 border-brass-400'
                      : idx % 2 === 0
                      ? 'bg-ink-900/40'
                      : 'bg-ink-900/80'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 sm:col-span-1 text-center font-mono font-medium">
                    <span className={idx < 3 ? "text-brass-300" : "text-ink-400"}>#{idx + 1}</span>
                  </div>

                  {/* Player Info */}
                  <div className="col-span-6 sm:col-span-6 flex items-center gap-3">
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <div className="font-medium text-ink-100 flex items-center gap-2">
                        <span>{entry.username}</span>
                        {isCurrentUser && (
                          <span className="text-[11px] px-2 py-0.2 bg-brass-500 text-on-accent font-medium rounded-md">
                            BẠN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-brass-400/90 font-mono">
                        Cấp {entry.level} • {entry.wins} Trận Thắng
                      </div>
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 sm:col-span-2 text-center font-mono font-medium text-moss-400">
                    {entry.winRate}%
                  </div>

                  {/* Highest Score */}
                  <div className="col-span-2 sm:col-span-3 text-right font-mono font-medium text-brass-300 text-sm">
                    {entry.score}đ
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
