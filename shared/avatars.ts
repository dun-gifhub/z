// Avatars every pháp sư can pick for free.
export const BASIC_AVATARS = ['🧙‍♂️', '🧝‍♀️', '🔮', '⚡', '🐉', '✨', '🦊', '🦅', '🦉', '⚔️'];

// Exclusive avatars unlocked only for Premium members (any active package).
export const VIP_AVATARS = ['👑', '🦄', '🐲', '💎', '🌟', '🔱', '🦁', '🧞‍♂️'];

export const ALL_AVATARS = [...BASIC_AVATARS, ...VIP_AVATARS];

export function isVipAvatar(avatar: string): boolean {
  return VIP_AVATARS.includes(avatar);
}
