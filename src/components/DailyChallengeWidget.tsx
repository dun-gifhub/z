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
    <div className="w-full max-w-sm mx-auto bg-slate-950/85 border border-amber-500/40 rounded-2xl p-4 transition-[color,background-color,border-color,opacity,transform] select-none">
      {/* Header */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 transition-transform">
            <Zap className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-amber-200 flex items-center gap-2">
              <span>Thử thách hôm nay</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
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
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    {quest.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{quest.title}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${progress}%` }}
                        className={`h-full rounded-full transition-[color,background-color,border-color,opacity,transform] duration-500 ${
                          quest.completed
                            ? 'bg-emerald-500'
                            : 'bg-amber-500'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                </div>

                {/* Reward Action */}
                <div>
                  {quest.completed ? (
                    quest.claimed ? (
                      <span className="text-[11px] font-mono text-slate-500">Đã nhận</span>
                    ) : (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="px-3 py-1 text-on-accent font-medium text-[11px] rounded-lg bg-amber-500 hover:bg-amber-400"
                      >
                        +{quest.rewardXp} XP
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] font-mono text-amber-400/80">
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
