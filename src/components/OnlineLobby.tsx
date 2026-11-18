import React, { useState } from 'react';
import { Globe, ArrowLeft, Users, Zap } from 'lucide-react';
import { MathLevel } from '../../shared/types.ts';

interface OnlineLobbyProps {
  onBack: () => void;
  onQuickMatch: (level: MathLevel) => void;
  onCancelQuickMatch: () => void;
  searchingMatch: boolean;
  onCreateRoom: (level: MathLevel) => void;
  onJoinRoom: (code: string) => void;
  mathLevel: MathLevel;
  onSetMathLevel: (level: MathLevel) => void;
}

export const OnlineLobby: React.FC<OnlineLobbyProps> = ({
  onBack,
  onQuickMatch,
  onCancelQuickMatch,
  searchingMatch,
  onCreateRoom,
  onJoinRoom,
  mathLevel,
  onSetMathLevel,
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    onJoinRoom(roomCodeInput.trim().toUpperCase());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Top bar with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-ink-400 hover:text-ink-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-mauve-950/40 border border-mauve-800/40 rounded text-xs font-mono text-mauve-300">
          <Globe className="w-4 h-4 text-mauve-400" />
          <span>Đấu online toàn cầu</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-medium text-dusk-200">
          Đấu trường thời gian thực
        </h2>
        <p className="text-xs text-ink-400 max-w-md mx-auto">
          Đối đầu với các pháp sư toán học khác qua hệ thống WebSocket đồng bộ máy chủ.
        </p>
      </div>

      {/* Grade Level Selector */}
      <div className="p-3 bg-ink-900 border border-ink-800 rounded-lg space-y-2">
        <div className="text-xs font-medium text-ink-300 text-center">
          Chọn cấp độ câu hỏi cho trận đấu:
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['CO_BAN', 'THCS', 'THPT'] as MathLevel[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => onSetMathLevel(lvl)}
              className={`py-2 text-xs font-medium rounded-md border transition-[color,background-color,border-color,opacity,transform] ${
                mathLevel === lvl
                  ? 'bg-mauve-600 border-mauve-400 text-white'
                  : 'bg-ink-950 border-ink-800 text-ink-400 hover:bg-ink-800'
              }`}
            >
              {lvl === 'CO_BAN' ? 'Cơ Bản (Dễ)' : lvl === 'THCS' ? 'THCS (Vừa)' : 'THPT (Nâng cao)'}
            </button>
          ))}
        </div>
      </div>

      {/* Two Matching Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OPTION 1: QUICK MATCH */}
        <div className="p-5 border border-dusk-800/50 rounded-lg space-y-4 flex flex-col justify-between bg-ink-900">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-md bg-dusk-900/50 border border-dusk-700/60 flex items-center justify-center text-dusk-300">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-ink-100">
              Ghép trận nhanh (PvP)
            </h3>
            <p className="text-xs text-ink-400">
              Hệ thống tự động tìm kiếm đối thủ đang trực tuyến có cùng cấp độ kiến thức.
            </p>
          </div>

          {searchingMatch ? (
            <div className="space-y-2">
              <div className="p-3 bg-dusk-950 border border-dusk-700 rounded-md text-center text-xs text-dusk-300 flex items-center justify-center gap-2">
                <span>Đang tìm đối thủ xứng tầm...</span>
              </div>
              <button
                onClick={onCancelQuickMatch}
                className="w-full py-2 bg-ink-800 hover:bg-ink-700 text-ink-300 text-xs font-medium rounded-md transition-colors"
              >
                Hủy tìm trận
              </button>
            </div>
          ) : (
            <button
              onClick={() => onQuickMatch(mathLevel)}
              className="w-full py-3 text-white font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 bg-dusk-600 hover:bg-dusk-500"
            >
              Tìm trận ngay
            </button>
          )}
        </div>

        {/* OPTION 2: PRIVATE ROOM */}
        <div className="p-5 border border-mauve-800/50 rounded-lg space-y-4 flex flex-col justify-between bg-ink-900">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-md bg-mauve-900/50 border border-mauve-700/60 flex items-center justify-center text-mauve-300">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-ink-100">
              Phòng đấu bạn bè
            </h3>
            <p className="text-xs text-ink-400">
              Tạo phòng riêng hoặc nhập mã 6 ký tự để đấu tay đôi với bạn cùng lớp.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onCreateRoom(mathLevel)}
              className="w-full py-3 bg-mauve-700 hover:bg-mauve-600 text-white font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95"
            >
              Tạo phòng mới
            </button>

            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                maxLength={8}
                value={roomCodeInput}
                onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="Nhập mã phòng..."
                className="flex-1 bg-ink-950 border border-ink-700 focus:border-mauve-400 rounded-md px-3 py-2 text-xs font-mono text-center text-ink-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-ink-800 hover:bg-ink-700 text-ink-200 text-xs font-medium rounded-md transition-colors"
              >
                Vào
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
