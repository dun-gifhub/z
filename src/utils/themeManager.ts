export interface ThemeDef {
  id: string;
  name: string;
  previewColor: string;
  bgHex: string;
  description: string;
  isLight?: boolean;
}

// Ids are kept so saved choices still resolve. Every dark theme is a near-neutral
// surface with a faint tint; the accent and card colours stay the same in all of them.
export const GAME_THEMES: ThemeDef[] = [
  { id: 'light_pure', name: 'Giấy trắng', previewColor: '#f6f6f7', bgHex: '#f6f6f7', description: 'Nền sáng, chữ đậm, dễ đọc ban ngày', isLight: true },
  { id: 'light_ivory', name: 'Giấy ngà', previewColor: '#f4f0e6', bgHex: '#f4f0e6', description: 'Nền sáng ấm, dịu mắt', isLight: true },
  { id: 'void', name: 'Than chì', previewColor: '#17171a', bgHex: '#17171a', description: 'Nền tối trung tính' },
  { id: 'violet', name: 'Mực tím', previewColor: '#1a1920', bgHex: '#1a1920', description: 'Nền tối pha tím nhạt' },
  { id: 'emerald', name: 'Nỉ xanh', previewColor: '#161b19', bgHex: '#161b19', description: 'Nền tối pha xanh lá nhạt, như mặt bàn nỉ' },
  { id: 'crimson', name: 'Rượu vang', previewColor: '#1c1618', bgHex: '#1c1618', description: 'Nền tối pha đỏ nhạt' },
  { id: 'ocean', name: 'Mực xanh', previewColor: '#15191d', bgHex: '#15191d', description: 'Nền tối pha xanh dương nhạt' },
  { id: 'amber', name: 'Nâu gỗ', previewColor: '#1c1914', bgHex: '#1c1914', description: 'Nền tối pha nâu ấm' },
];

export const getSavedTheme = (): ThemeDef => {
  if (typeof window === 'undefined') return GAME_THEMES[0];
  const savedId = localStorage.getItem('mathrune_theme_id');
  const found = GAME_THEMES.find(t => t.id === savedId);
  const theme = found || GAME_THEMES[0];
  applyThemeToDom(theme);
  return theme;
};

export const applyThemeToDom = (theme: ThemeDef) => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty('--bg-game', theme.bgHex);
  document.documentElement.style.setProperty('--surface-page', theme.bgHex);
  if (theme.isLight) {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light-theme');
    document.body.style.backgroundColor = theme.bgHex;
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light-theme');
    document.body.style.backgroundColor = theme.bgHex;
  }
};

export const saveTheme = (themeId: string): ThemeDef => {
  const theme = GAME_THEMES.find(t => t.id === themeId) || GAME_THEMES[0];
  if (typeof window !== 'undefined') {
    localStorage.setItem('mathrune_theme_id', theme.id);
    applyThemeToDom(theme);
  }
  return theme;
};

