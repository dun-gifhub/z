import React, { useState } from 'react';
import { ArrowLeft, Check, Zap, Info } from 'lucide-react';
import { ALL_RUNES } from '../../shared/runes.ts';
import { RuneCategory, RuneDef } from '../../shared/types.ts';
import { RuneIcon } from './RuneIcon.tsx';
import { RuneStone } from './RuneStone.tsx';

interface RuneGrimoireProps {
  equippedRunes: string[];
  onUpdateRunes: (runes: string[]) => void;
  onBack: () => void;
}

export const RuneGrimoire: React.FC<RuneGrimoireProps> = ({
  equippedRunes,
  onUpdateRunes,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  // Enforce 1 single rune selection as requested by the user
  const initialRuneId = (equippedRunes && equippedRunes.length > 0) ? equippedRunes[0] : 'rune_shield';
  const [selectedRuneId, setSelectedRuneId] = useState<string>(initialRuneId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories: { id: string; name: string }[] = [
    { id: 'all', name: 'Tất Cả (16 Ấn Chú)' },
    { id: 'DEFENSE', name: 'Phòng Thủ & Hồi Sinh (4 Ấn)' },
    { id: 'TIME', name: '⏳ Kéo Dài Thời Gian (4 Ấn)' },
    { id: 'POINTS', name: 'Nhân Điểm & Combo (4 Ấn)' },
    { id: 'MAGIC', name: 'Ma Thuật Huyền Bí (4 Ấn)' },
  ];

  const handleSelectRune = (runeId: string) => {
    setSelectedRuneId(runeId);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    if (!selectedRuneId) return;
    onUpdateRunes([selectedRuneId]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredRunes = ALL_RUNES.filter(r => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory || r.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const activeRuneDef = ALL_RUNES.find(r => r.id === selectedRuneId);

  // Helper to describe activation mechanism
  const getActivationGuide = (rune: RuneDef) => {
    switch (rune.id) {
      case 'rune_revive':
        return 'Tự động kích hoạt khi BUST: Cứu lại 50% điểm an toàn của lượt đó vào kho. Duy nhất 1 lần trong cả trận đấu';
      case 'rune_shield':
        return 'Tự động kích hoạt khi rút trùng hệ: Vô hiệu hóa cú nổ BUST đầu tiên trong mỗi lượt thi đấu';
      case 'rune_insurance':
        return 'Tự động kích hoạt: Khóa lá bài điểm cao nhất trên bàn vào kho an toàn khi gom từ 2 lá trở lên (1 lần/lượt).';
      case 'rune_retry':
        return 'Tự động kích hoạt khi trả lời sai: Cho phép làm lại câu hỏi toán với thêm 15 giây hồi phục (1 lần/lượt).';
      case 'rune_freeze':
        return 'Nội tại liên tục: Tự động cộng thêm +20 giây suy nghĩ cho mọi câu hỏi toán trong suốt cả trận.';
      case 'rune_haste':
        return 'Nội tại áp chế: Giảm 8 giây thời gian suy nghĩ của đối thủ trong mọi lượt thi đấu của họ.';
      case 'rune_time_plus':
        return 'Nội tại liên tục: Luôn có 60 giây thời gian tư duy và nhận thưởng +3 điểm khi trả lời nhanh dưới 12 giây.';
      case 'rune_swap_question':
        return 'Chủ động bấm (1 lần/lượt): Đổi ngay câu hỏi toán khó sang một câu hỏi khác cùng hệ.';
      case 'rune_double':
        return 'Chủ động bấm (1 lần/lượt): Nhân x1.5 điểm cho 1 lá bài giải đúng trong lượt thi đấu.';
      case 'rune_bank_bonus':
        return 'Tự động khi bấm BANK: Thưởng thêm +15 điểm trực tiếp vào kho an toàn (1 lần/lượt).';
      case 'rune_harvest':
        return 'Tự động khi gom từ 3 lá trên bàn: Thưởng thêm +15 điểm kinh nghiệm vào lượt (1 lần/lượt).';
      case 'rune_siphon':
        return 'Tự động khi trả lời đúng: Hút 3 điểm an toàn từ đối thủ sang kho của bạn (1 lần/lượt).';
      case 'rune_foresight':
        return 'Nội tại thấu thị: Luôn nhìn thấy trước hệ và điểm số của lá bài trên đỉnh bộ bài để né BUST.';
      case 'rune_purify':
        return 'Chủ động bấm (1 lần/lượt): Thanh tẩy toàn bộ lá bài trên bàn, đưa nguy cơ BUST về 0%.';
      case 'rune_curse':
        return 'Chủ động bấm: Ám bùa nguyền rủa lên đối thủ, làm giảm điểm cất giữ của họ.';
      case 'rune_immortal':
        return 'Tự động kích hoạt khi HP về 0: Hồi sinh lập tức với 20 HP bảo mệnh (Duy nhất 1 lần/trận).';
      default:
        return 'Kích hoạt trong lượt của bạn để xoay chuyển cục diện trận đấu.';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-purple-950/40 border border-purple-800/40 rounded-full text-xs font-mono text-purple-300">
          <span>Grimoire: Chọn Duy Nhất 1 Rune Bảo Mệnh</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-medium text-purple-200">
          Thư viện cổ ngữ RUNE & tác dụng pháp thuật
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Mỗi trận đấu, pháp sư chỉ được chọn <strong>duy nhất 1 lá Rune</strong> để bảo mệnh và thi triển phép thuật. Hãy cân nhắc kỹ tác dụng của từng ấn chú
        </p>
      </div>

      {/* CURRENTLY EQUIPPED 1-RUNE SHOWCASE */}
      <div className="p-4 sm:p-5 border border-amber-500/80 rounded-2xl space-y-3 bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-amber-300">
              1 RUNE ĐANG TRANG BỊ VÀO TRẬN ĐẤU (1/1)
            </span>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-on-accent font-medium text-xs rounded-xl transition-[color,background-color,border-color,opacity,transform] active:scale-95 bg-amber-600 hover:bg-amber-500"
          >
            {saveSuccess ? 'Đã lưu Rune vào hồ sơ' : 'Lưu trang bị này'}
          </button>
        </div>

        {activeRuneDef ? (
          <div className="p-4 bg-slate-950/85 border border-indigo-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <RuneStone rune={activeRuneDef} size="lg" isActive={true} />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-medium text-amber-200">
                    {activeRuneDef.name}
                  </h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {activeRuneDef.categoryNameVi}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-700">
                    Tối đa {activeRuneDef.maxUses} lần/trận
                  </span>
                </div>
                <div className="text-xs text-amber-300/95 font-medium flex items-center gap-2 pt-1">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Tác dụng:</strong> {activeRuneDef.description}</span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{getActivationGuide(activeRuneDef)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 p-3">Chưa chọn Rune nào. Hãy bấm vào một Rune bên dưới.</div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl border whitespace-nowrap transition-[color,background-color,border-color,opacity,transform] ${
              activeCategory === c.id
                ? 'bg-purple-600 border-purple-400 text-white scale-102'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Runes Grid with Explicit Effect and Usage Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRunes.map(rune => {
          const isSelected = selectedRuneId === rune.id;

          return (
            <div
              key={rune.id}
              onClick={() => handleSelectRune(rune.id)}
              style={{
            borderColor: isSelected ? rune.color :'#334155',
                
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-[color,background-color,border-color,opacity,transform] duration-200 flex flex-col justify-between relative select-none ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/50 bg-indigo-950/80'
                  : 'bg-slate-900/90 hover:bg-slate-850 hover:border-slate-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-on-accent text-[11px] font-medium flex items-center gap-1 bg-amber-400">
                  <Check className="w-3 h-3 stroke-[3]" /> Đang trang bị
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <RuneStone rune={rune} size="md" isActive={isSelected} />
                  <div>
                    <h3 className="text-sm font-medium text-slate-100" style={{ color: rune.color }}>
                      {rune.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>{rune.categoryNameVi}</span>
                      <span>•</span>
                      <span className="text-amber-300">Dùng {rune.maxUses} lần/trận</span>
                    </div>
                  </div>
                </div>

                {/* TÁC DỤNG CỦA RUNE */}
                <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tác dụng chính:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {rune.description}
                  </p>
                </div>

                {/* HƯỚNG DẪN KÍCH HOẠT */}
                <div className="text-[11px] text-slate-400 flex items-start gap-1">
                  <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                  <span>{getActivationGuide(rune)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500">Mã: #{rune.id}</span>
                <button
                  type="button"
                  className={`font-medium px-3 py-1 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-on-accent font-medium'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? 'Đang dùng' : 'Chọn Rune này'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
