import React, { useState } from 'react';
import { Globe, Swords, ArrowLeft, Copy, Check, Users, Shield, Zap } from 'lucide-react';
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
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-purple-950/40 border border-purple-800/40 rounded-full text-xs font-mono text-purple-300">
          <Globe className="w-4 h-4 text-purple-400" />
          <span>Đấu online toàn cầu</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-medium text-indigo-200">
          Đấu trường thời gian thực
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Đối đầu với các pháp sư toán học khác qua hệ thống WebSocket đồng bộ máy chủ.
        </p>
      </div>

      {/* Grade Level Selector */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="text-xs font-medium text-slate-300 text-center">
          Chọn cấp độ câu hỏi cho trận đấu:
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['CO_BAN', 'THCS', 'THPT'] as MathLevel[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => onSetMathLevel(lvl)}
              className={`py-2 text-xs font-medium rounded-xl border transition-[color,background-color,border-color,opacity,transform] ${
                mathLevel === lvl
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
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
        <div className="p-5 border border-indigo-800/50 rounded-2xl space-y-4 flex flex-col justify-between bg-slate-900">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-900/50 border border-indigo-700/60 flex items-center justify-center text-indigo-300">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-slate-100">
              Ghép trận nhanh (PvP)
            </h3>
            <p className="text-xs text-slate-400">
              Hệ thống tự động tìm kiếm đối thủ đang trực tuyến có cùng cấp độ kiến thức.
            </p>
          </div>

          {searchingMatch ? (
            <div className="space-y-2">
              <div className="p-3 bg-indigo-950 border border-indigo-700 rounded-xl text-center text-xs text-indigo-300 flex items-center justify-center gap-2">
                <span>Đang tìm đối thủ xứng tầm...</span>
              </div>
              <button
                onClick={onCancelQuickMatch}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Hủy tìm trận
              </button>
            </div>
          ) : (
            <button
              onClick={() => onQuickMatch(mathLevel)}
              className="w-full py-3 text-white font-medium text-xs rounded-xl transition-[color,background-color,border-color,opacity,transform] active:scale-95 bg-indigo-600 hover:bg-indigo-500"
            >
              Tìm trận ngay
            </button>
          )}
        </div>

        {/* OPTION 2: PRIVATE ROOM */}
        <div className="p-5 border border-purple-800/50 rounded-2xl space-y-4 flex flex-col justify-between bg-slate-900">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/60 flex items-center justify-center text-purple-300">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-slate-100">
              Phòng đấu bạn bè
            </h3>
            <p className="text-xs text-slate-400">
              Tạo phòng riêng hoặc nhập mã 6 ký tự để đấu tay đôi với bạn cùng lớp.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onCreateRoom(mathLevel)}
              className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs rounded-xl transition-[color,background-color,border-color,opacity,transform] active:scale-95"
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
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-purple-400 rounded-xl px-3 py-2 text-xs font-mono text-center text-slate-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
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
