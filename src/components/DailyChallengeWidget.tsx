import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, Circle, Gift, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface Quest {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export const DailyChallengeWidget: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'q1',
      title: 'Giải đúng 5 câu hỏi toán học',
      target: 5,
      current: 3,
      rewardXp: 120,
      completed: false,
      claimed: false,
    },
    {
      id: 'q2',
      title: 'Đạt mốc 250 điểm trong một ván',
      target: 250,
      current: 180,
      rewardXp: 200,
      completed: false,
      claimed: false,
    },
    {
      id: 'q3',
      title: 'Hoàn thành 3 lần BANK an toàn',
      target: 3,
      current: 3,
      rewardXp: 150,
      completed: true,
      claimed: false,
    },
  ]);

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mathrune_daily_quests_v1');
      if (saved) {
        setQuests(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleClaim = (questId: string) => {
    sound.playCorrect();
    setQuests(prev => {
      const updated = prev.map(q => (q.id === questId ? { ...q, claimed: true } : q));
      try {
        localStorage.setItem('mathrune_daily_quests_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-950/85 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-xl transition-all select-none">
      {/* Header */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <div className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 tracking-wide flex items-center gap-1.5">
              <span>THỬ THÁCH HÔM NAY</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                MỚI
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Hoàn thành để nhận thêm kinh nghiệm & danh hiệu
            </div>
          </div>
        </div>

        <button className="text-slate-400 group-hover:text-amber-300 p-1">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Quests List */}
      {!collapsed && (
        <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/80">
          {quests.map(quest => {
            const progress = Math.min(100, Math.round((quest.current / quest.target) * 100));
            return (
              <div
                key={quest.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    {quest.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{quest.title}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${progress}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          quest.completed
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                </div>

                {/* Reward Action */}
                <div>
                  {quest.completed ? (
                    quest.claimed ? (
                      <span className="text-[10px] font-mono text-slate-500">Đã Nhận</span>
                    ) : (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[10px] rounded-lg shadow-md animate-pulse uppercase tracking-wider"
                      >
                        +{quest.rewardXp} XP
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400/80">
                      +{quest.rewardXp} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
