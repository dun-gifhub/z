import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Layers, X } from 'lucide-react';
import { DECK_60_CARDS, MATH_DOMAINS } from '../../shared/cards.ts';
import { Card, CardRarity, MathCategory } from '../../shared/types.ts';
import { MathCard } from './MathCard.tsx';
import { FlipCardReveal } from './FlipCardReveal.tsx';
import { DomainArt } from './DomainArt.tsx';
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
    Common: { label: 'Phổ biến', bg: 'bg-ink-800', text: 'text-ink-300', border:'border-ink-700' },
    Rare: { label: 'Hiếm', bg: 'bg-cobalt-950', text: 'text-cobalt-300', border:'border-cobalt-700' },
    Epic: { label: 'Cực hiếm', bg: 'bg-mauve-950', text: 'text-mauve-300', border:'border-mauve-700' },
    Legendary: { label: 'Huyền thoại', bg: 'bg-brass-950', text: 'text-brass-300', border:'border-brass-500' },
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
          className="flex items-center gap-2 text-xs text-ink-400 hover:text-brass-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-brass-950/40 border border-brass-500/40 rounded text-xs font-mono text-brass-300">
          <Layers className="w-4 h-4" />
          <span>Bộ sưu tập: 60/60 thẻ đã mở khóa</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-dusk-500/10 border border-dusk-500/30 text-dusk-300 text-xs font-mono">
          <span>Kho tàng 60 thẻ tri thức toán học học đường</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-medium text-gilt-300">
          Bộ sưu tập thẻ tri thức toán học
        </h2>
        <p className="text-xs sm:text-sm text-ink-300 max-w-xl mx-auto">
          Mỗi thẻ tri thức đại diện cho một Phân Môn Toán Học và mang <strong>Kỹ năng học thuật</strong> kích hoạt. Nhấp vào bất kỳ thẻ nào để khám phá hiệu ứng lật 3D và thông số chi tiết
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-ink-900/90 border border-ink-800 rounded-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-ink-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên lá bài, kỹ năng, hệ toán..."
              className="w-full bg-ink-950 border border-ink-800 rounded-md pl-9 pr-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-brass-500"
            />
          </div>

          {/* Rarity Selector */}
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedRarity('all')}
              className={`px-3 py-2 text-[11px] font-medium rounded-md border whitespace-nowrap transition-[color,background-color,border-color,opacity,transform] ${
                selectedRarity === 'all'
                  ? 'bg-brass-500 border-brass-400 text-on-accent font-medium'
                  : 'bg-ink-950 border-ink-800 text-ink-400 hover:bg-ink-800'
              }`}
            >
              Tất cả phẩm
            </button>
            {(['Common', 'Rare', 'Epic', 'Legendary'] as CardRarity[]).map(r => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-3 py-2 text-[11px] font-medium rounded-md border whitespace-nowrap transition-[color,background-color,border-color,opacity,transform] ${
                  selectedRarity === r
                    ? 'bg-brass-500 border-brass-400 text-on-accent font-medium'
                    : 'bg-ink-950 border-ink-800 text-ink-400 hover:bg-ink-800'
                }`}
              >
                {rarityColors[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Domains Carousel / Grid */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity,transform] ${
              selectedDomain === 'all'
                ? 'bg-dusk-600 text-white font-medium'
                : 'bg-ink-950 text-ink-400 hover:text-ink-200'
            }`}
          >
            Tất Cả (10 Hệ)
          </button>
          {Object.entries(MATH_DOMAINS).map(([key, dom]) => (
            <button
              key={key}
              onClick={() => setSelectedDomain(key)}
              style={{
            borderColor: selectedDomain === key ? dom.color :'transparent',
              }}
              className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap border transition-[color,background-color,border-color,opacity,transform] ${
                selectedDomain === key
                  ? 'bg-ink-800 text-brass-200 scale-105 font-medium'
                  : 'bg-ink-950 text-ink-400 hover:text-ink-200'
              }`}
            >
              <DomainArt category={dom.id} size="sm" className="w-4 h-4 mr-1" />
              <span>{dom.nameVi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid with AAA Card Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-4">
        {filteredCards.map(card => (
          <MathCard
            key={card.id}
            card={card}
            variant="standard"
            onClick={() => handleInspectCard(card)}
          />
        ))}
      </div>

      {/* DETAILED CARD INSPECTION MODAL WITH 3D FLIP */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg flex flex-col items-center">
            <button
              onClick={() => setInspectedCard(null)}
              className="absolute -top-3 -right-3 z-20 w-9 h-9 bg-ink-900 border border-ink-700 hover:border-brass-400 text-ink-300 hover:text-white rounded-full flex items-center justify-center transition-[color,background-color,border-color,opacity,transform] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <FlipCardReveal card={inspectedCard} autoFlip={false} size="lg" />
            <div className="mt-3 text-center space-y-2">
              <p className="text-xs text-brass-300 font-mono flex items-center justify-center gap-2">
                <span> Chạm / Nhấp trực tiếp vào thẻ để lật 3D xem cả 2 mặt</span>
              </p>
              <button
                onClick={() => setInspectedCard(null)}
                className="px-6 py-2 bg-ink-900 hover:bg-ink-800 border border-ink-700 hover:border-brass-400 text-ink-200 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] cursor-pointer active:scale-95"
              >
                Đóng chi tiết thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
