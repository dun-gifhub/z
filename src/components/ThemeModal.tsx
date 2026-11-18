import React from 'react';
import { X, Check, Palette } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-ink-900 border border-brass-500/70 rounded-lg p-6 text-ink-100 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brass-500/10 text-brass-400 mb-1 border border-brass-500/30">
            <Palette className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium text-brass-200">
            Đổi màu nền chiến trận
          </h3>
          <p className="text-xs text-ink-400">
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
                className={`p-3 rounded-md border text-left flex items-center justify-between transition-[color,background-color,border-color,opacity,transform] group ${
                  isSelected
                    ? 'border-brass-400'
                    : 'border-ink-800 hover:border-ink-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="w-4 h-4 rounded-full border border-ink-500 shrink-0" style={{ backgroundColor: theme.previewColor }} />
                  <div>
                    <div className={`text-xs font-medium flex items-center gap-1 ${
                      theme.isLight ? 'text-ink-900' : 'text-ink-100'
                    }`}>
                      {theme.name}
                    </div>
                    <div className={`text-[11px] line-clamp-1 ${
                      theme.isLight ? 'text-ink-600 font-medium' : 'text-ink-400'
                    }`}>
                      {theme.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brass-400 text-on-accent flex items-center justify-center shrink-0">
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
            className="w-full py-3 text-on-accent font-medium text-xs rounded-md bg-brass-600 hover:bg-brass-500"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
