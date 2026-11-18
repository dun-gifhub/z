import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { GAME_THEMES, ThemeDef } from '../utils/themeManager.ts';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeDef;
  onSelectTheme: (theme: ThemeDef) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/70 rounded-2xl p-6 text-slate-100 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mb-1 border border-amber-500/30">
            <Palette className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium text-amber-200">
            Đổi màu nền chiến trận
          </h3>
          <p className="text-xs text-slate-400">
            Chọn không gian ma thuật phù hợp với phong cách và thị giác của bạn
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {GAME_THEMES.map(theme => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme);
                }}
                style={{ backgroundColor: theme.bgHex }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-[color,background-color,border-color,opacity,transform] group ${
                  isSelected
                    ? 'border-amber-400'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="w-4 h-4 rounded-full border border-slate-500 shrink-0" style={{ backgroundColor: theme.previewColor }} />
                  <div>
                    <div className={`text-xs font-medium flex items-center gap-1 ${
                      theme.isLight ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      {theme.name}
                    </div>
                    <div className={`text-[11px] line-clamp-1 ${
                      theme.isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}>
                      {theme.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-on-accent flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 text-on-accent font-medium text-xs rounded-xl bg-amber-600 hover:bg-amber-500"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
