export interface ThemeDef {
  id: string;
  name: string;
  icon: string;
  previewColor: string;
  bgHex: string;
  bgClass: string;
  gradientOverlay: string;
  accentBorder: string;
  description: string;
}

export const GAME_THEMES: ThemeDef[] = [
  {
    id: 'void',
    name: 'Hư Không Dạ Khúc',
    icon: '🌌',
    previewColor: '#252937',
    bgHex: '#252937',
    bgClass: 'bg-[#252937]',
    gradientOverlay: 'from-[#252937] via-slate-800/50 to-[#252937]',
    accentBorder: 'border-slate-700',
    description: 'Bầu trời đêm huyền bí với sắc đen thẫm chuẩn mực.',
  },
  {
    id: 'violet',
    name: 'Cung Điện Bí Ẩn',
    icon: '🔮',
    previewColor: '#2d283d',
    bgHex: '#2d283d',
    bgClass: 'bg-[#2d283d]',
    gradientOverlay: 'from-[#2d283d] via-purple-900/30 to-[#2d283d]',
    accentBorder: 'border-purple-800/60',
    description: 'Sắc tím ma thuật của các đại pháp sư cổ ngữ Rune.',
  },
  {
    id: 'emerald',
    name: 'Rừng Rậm Ma Pháp',
    icon: '🌲',
    previewColor: '#263631',
    bgHex: '#263631',
    bgClass: 'bg-[#263631]',
    gradientOverlay: 'from-[#263631] via-emerald-900/30 to-[#263631]',
    accentBorder: 'border-emerald-800/60',
    description: 'Màu lục bảo rêu phong thanh tịnh và tập trung cao độ.',
  },
  {
    id: 'crimson',
    name: 'Huyết Nguyệt Chiến Trận',
    icon: '🍷',
    previewColor: '#38272c',
    bgHex: '#38272c',
    bgClass: 'bg-[#38272c]',
    gradientOverlay: 'from-[#38272c] via-rose-900/30 to-[#38272c]',
    accentBorder: 'border-rose-800/60',
    description: 'Sắc đỏ thẫm hừng hực tinh thần chiến binh quyết tử.',
  },
  {
    id: 'ocean',
    name: 'Hải Triều Thần Thoại',
    icon: '🌊',
    previewColor: '#25343e',
    bgHex: '#25343e',
    bgClass: 'bg-[#25343e]',
    gradientOverlay: 'from-[#25343e] via-sky-900/30 to-[#25343e]',
    accentBorder: 'border-cyan-800/60',
    description: 'Đại dương vực thẳm bao la, tri thức sâu thẳm vô biên.',
  },
  {
    id: 'amber',
    name: 'Mật Thất Cổ Thư',
    icon: '📜',
    previewColor: '#363128',
    bgHex: '#363128',
    bgClass: 'bg-[#363128]',
    gradientOverlay: 'from-[#363128] via-amber-900/30 to-[#363128]',
    accentBorder: 'border-amber-800/60',
    description: 'Sắc vàng mật ong ấm áp như trang sách toán học cổ điển.',
  },
];

export const getSavedTheme = (): ThemeDef => {
  if (typeof window === 'undefined') return GAME_THEMES[0];
  const savedId = localStorage.getItem('mathrune_theme_id');
  const found = GAME_THEMES.find(t => t.id === savedId);
  return found || GAME_THEMES[0];
};

export const saveTheme = (themeId: string): ThemeDef => {
  const theme = GAME_THEMES.find(t => t.id === themeId) || GAME_THEMES[0];
  if (typeof window !== 'undefined') {
    localStorage.setItem('mathrune_theme_id', theme.id);
    document.documentElement.style.setProperty('--bg-game', theme.bgHex);
  }
  return theme;
};
