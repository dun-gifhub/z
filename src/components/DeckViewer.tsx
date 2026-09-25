import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Sparkles, Layers, Zap, X, Info, ShieldCheck, Trophy, Lock, Unlock } from 'lucide-react';
import { DECK_60_CARDS, MATH_DOMAINS } from '../../shared/cards.ts';
import { Card, CardRarity, MathCategory } from '../../shared/types.ts';
import { MathCard } from './MathCard.tsx';
import { sound } from '../utils/soundEffects.ts';

interface DeckViewerProps {
  onBack: () => void;
}

export const DeckViewer: React.FC<DeckViewerProps> = ({ onBack }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);

  const filteredCards = DECK_60_CARDS.filter(card => {
    if (selectedDomain !== 'all' && card.domainId !== selectedDomain) return false;
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.skillName.toLowerCase().includes(q) ||
        card.domainNameVi.toLowerCase().includes(q) ||
        card.skillDesc.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const rarityColors: Record<CardRarity, { label: string; bg: string; text: string; border: string }> = {
    Common: { label: 'Phổ Biến', bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
    Rare: { label: 'Hiếm', bg: 'bg-blue-950', text: 'text-blue-300', border: 'border-blue-700' },
    Epic: { label: 'Cực Hiếm', bg: 'bg-purple-950', text: 'text-purple-300', border: 'border-purple-700' },
    Legendary: { label: 'Huyền Thoại', bg: 'bg-amber-950', text: 'text-amber-300', border: 'border-amber-500' },
  };

  const handleInspectCard = (card: Card) => {
    sound.playCardFlip();
    setInspectedCard(card);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay Lại Sảnh Chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded-full text-xs font-mono text-amber-300 shadow">
          <Layers className="w-3.5 h-3.5" />
          <span>Bộ Sưu Tập: 60/60 Thẻ Đã Mở Khóa</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>GRIMOIRE OF 60 ARCANE CARDS</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow">
          BỘ SƯU TẬP THẺ BÀI MA THUẬT
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light">
          Mỗi lá bài mang một Hệ Toán Học và <strong>Tác Dụng Kỹ Năng</strong> kích hoạt. Nhấp vào bất kỳ lá bài nào để chiêm ngưỡng hiệu ứng 3D và thông số chi tiết!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên lá bài, kỹ năng, hệ toán..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Rarity Selector */}
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedRarity('all')}
              className={`px-3 py-2 text-[11px] font-bold rounded-xl border whitespace-nowrap transition-all ${
                selectedRarity === 'all'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Tất Cả Phẩm
            </button>
            {(['Common', 'Rare', 'Epic', 'Legendary'] as CardRarity[]).map(r => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-3 py-2 text-[11px] font-bold rounded-xl border whitespace-nowrap transition-all ${
                  selectedRarity === r
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {rarityColors[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Domains Carousel / Grid */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDomain === 'all'
                ? 'bg-indigo-600 text-white shadow font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất Cả (10 Hệ)
          </button>
          {Object.entries(MATH_DOMAINS).map(([key, dom]) => (
            <button
              key={key}
              onClick={() => setSelectedDomain(key)}
              style={{
                borderColor: selectedDomain === key ? dom.color : 'transparent',
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                selectedDomain === key
                  ? 'bg-slate-800 text-amber-200 shadow-md scale-105 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="mr-1">{dom.icon}</span>
              <span>{dom.nameVi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid with AAA Card Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredCards.map(card => (
          <MathCard
            key={card.id}
            card={card}
            variant="standard"
            onClick={() => handleInspectCard(card)}
          />
        ))}
      </div>

      {/* DETAILED CARD INSPECTION MODAL */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setInspectedCard(null)}
              className="absolute -top-3 -right-3 z-20 w-9 h-9 bg-slate-900 border-2 border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <MathCard card={inspectedCard} variant="hero" />
            <div className="mt-3 text-center">
              <button
                onClick={() => setInspectedCard(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Đóng Chi Tiết Lá Bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
