import bcrypt from 'bcryptjs';
import { UserProfile, LeaderboardEntry, Question, PremiumRequest, PremiumPlan, SiteSettings } from '../../shared/types.ts';
import { DEFAULT_RUNE_SELECTION } from '../../shared/runes.ts';
import { isVipAvatar } from '../../shared/avatars.ts';
import { pool } from './pool.ts';

export interface DBUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string;
  role: 'user' | 'admin' | 'guest';
  createdAt: string;
}

export interface MatchHistoryItem {
  id: string;
  userId: string;
  opponentName: string;
  isWin: boolean;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  busts: number;
  maxCombo: number;
  mode: 'ai' | 'pvp';
  timestamp: number;
}

interface DatabaseSchema {
  users: DBUser[];
  profiles: Record<string, UserProfile>;
  matchHistory: MatchHistoryItem[];
  customQuestions: Question[];
  premiumRequests: PremiumRequest[];
  settings: SiteSettings;
}

const DEFAULT_SETTINGS: SiteSettings = {
  guideLink: '',
  solutionPackagePrice: 20000,
  monthlyPackagePrice: 15000,
  bankAccountName: '',
  bankAccountNumber: '',
  bankName: '',
  lastLeaderboardReset: new Date().toISOString(),
};

function buildDefaultSeed(): DatabaseSchema {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 'admin-001',
        username: 'A3K23',
        email: 'dungdaumoi223@gmail.com',
        passwordHash: bcrypt.hashSync('A3k23maidinh', 10),
        avatar: '🧙‍♂️',
        role: 'admin',
        createdAt: now,
      },
      {
        id: 'bot-ai',
        username: 'Archimedes AI',
        email: 'ai@mathrune.com',
        passwordHash: 'none',
        avatar: '🤖',
        role: 'user',
        createdAt: now,
      },
    ],
    profiles: {
      'admin-001': {
        id: 'admin-001',
        username: 'ArchmageAdmin',
        avatar: '🧙‍♂️',
        level: 10,
        xp: 4500,
        totalGames: 28,
        wins: 24,
        losses: 4,
        winRate: 85.7,
        highestScore: 320,
        allTimeHighestScore: 320,
        rankTitle: 'Đại Pháp Sư Toán Học',
        equippedRunes: DEFAULT_RUNE_SELECTION,
        createdAt: now,
        isPremium: false,
        premiumPlan: null,
        premiumExpiresAt: null,
      },
      'bot-ai': {
        id: 'bot-ai',
        username: 'Archimedes AI',
        avatar: '🤖',
        level: 5,
        xp: 1200,
        totalGames: 50,
        wins: 25,
        losses: 25,
        winRate: 50,
        highestScore: 210,
        allTimeHighestScore: 210,
        rankTitle: 'Kỳ Thủ Thuật Toán',
        equippedRunes: DEFAULT_RUNE_SELECTION,
        createdAt: now,
        isPremium: false,
        premiumPlan: null,
        premiumExpiresAt: null,
      },
    },
    matchHistory: [],
    customQuestions: [],
    premiumRequests: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

// Chạy 1 lần lúc khởi động — tạo các bảng nếu Neon Postgres chưa có.
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(20) DEFAULT '🧙‍♂️',
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS profiles (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  avatar VARCHAR(20) DEFAULT '🧙‍♂️',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  win_rate NUMERIC(5,2) DEFAULT 0.00,
  highest_score INTEGER DEFAULT 0,
  all_time_highest_score INTEGER DEFAULT 0,
  rank_title VARCHAR(50) DEFAULT 'Tập Sự Phép Thuật',
  equipped_runes JSONB DEFAULT '[]'::jsonb,
  unlocked_skins JSONB DEFAULT '[]'::jsonb,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_plan VARCHAR(20),
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  daily_solution_views INTEGER DEFAULT 0,
  daily_solution_views_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS premium_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  plan VARCHAR(20) NOT NULL,
  price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  guide_link TEXT DEFAULT '',
  solution_package_price INTEGER DEFAULT 20000,
  monthly_package_price INTEGER DEFAULT 15000,
  bank_account_name VARCHAR(100) DEFAULT '',
  bank_account_number VARCHAR(50) DEFAULT '',
  bank_name VARCHAR(100) DEFAULT '',
  last_leaderboard_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS custom_questions (
  id VARCHAR(64) PRIMARY KEY,
  question TEXT NOT NULL,
  formula TEXT,
  options JSONB,
  answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  time_limit INTEGER DEFAULT 15,
  difficulty INTEGER DEFAULT 2,
  category VARCHAR(32) NOT NULL,
  level VARCHAR(20) DEFAULT 'THCS',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS match_history (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  opponent_name VARCHAR(50) NOT NULL,
  is_win BOOLEAN NOT NULL,
  score INTEGER NOT NULL,
  accuracy NUMERIC(5,2) DEFAULT 0.00,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  busts INTEGER DEFAULT 0,
  max_combo INTEGER DEFAULT 0,
  mode VARCHAR(10) DEFAULT 'pvp',
  played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_profiles_highest_score ON profiles(highest_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_all_time_highest_score ON profiles(all_time_highest_score DESC);
CREATE INDEX IF NOT EXISTS idx_match_history_user ON match_history(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_requests_status ON premium_requests(status);
-- Các cột thêm sau này: dùng ALTER ... IF NOT EXISTS để không phá dữ liệu đã có trên Neon.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_solution_views INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_solution_views_date DATE;
`;

// ---------- row <-> object mappers ----------
function rowToUser(r: any): DBUser {
  return {
    id: r.id,
    username: r.username,
    email: r.email || '',
    passwordHash: r.password_hash,
    avatar: r.avatar,
    role: r.role,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

function rowToProfile(r: any): UserProfile {
  return {
    id: r.user_id,
    username: r.username,
    email: r.email || undefined,
    avatar: r.avatar,
    level: r.level,
    xp: r.xp,
    totalGames: r.total_games,
    wins: r.wins,
    losses: r.losses,
    winRate: Number(r.win_rate),
    highestScore: r.highest_score,
    allTimeHighestScore: r.all_time_highest_score,
    rankTitle: r.rank_title,
    equippedRunes: r.equipped_runes || [],
    unlockedSkins: r.unlocked_skins || [],
    createdAt: new Date(r.created_at).toISOString(),
    isPremium: r.is_premium,
    premiumPlan: r.premium_plan,
    premiumExpiresAt: r.premium_expires_at ? new Date(r.premium_expires_at).toISOString() : null,
    dailySolutionViews: r.daily_solution_views || 0,
    dailySolutionViewsDate: r.daily_solution_views_date
      ? new Date(r.daily_solution_views_date).toISOString().slice(0, 10)
      : undefined,
  };
}

function rowToMatch(r: any): MatchHistoryItem {
  return {
    id: r.id,
    userId: r.user_id,
    opponentName: r.opponent_name,
    isWin: r.is_win,
    score: r.score,
    accuracy: Number(r.accuracy),
    correctAnswers: r.correct_answers,
    totalQuestions: r.total_questions,
    busts: r.busts,
    maxCombo: r.max_combo,
    mode: r.mode,
    timestamp: new Date(r.played_at).getTime(),
  };
}

function rowToQuestion(r: any): Question {
  return {
    id: r.id,
    question: r.question,
    formula: r.formula || undefined,
    options: r.options || undefined,
    answer: r.answer,
    explanation: r.explanation || undefined,
    timeLimit: r.time_limit,
    difficulty: r.difficulty,
    category: r.category,
    level: r.level,
  } as Question;
}

function rowToPremiumRequest(r: any): PremiumRequest {
  return {
    id: r.id,
    userId: r.user_id,
    username: r.username,
    plan: r.plan,
    price: r.price,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
    resolvedAt: r.resolved_at ? new Date(r.resolved_at).toISOString() : undefined,
  };
}

function rowToSettings(r: any): SiteSettings {
  return {
    guideLink: r.guide_link || '',
    solutionPackagePrice: r.solution_package_price,
    monthlyPackagePrice: r.monthly_package_price,
    bankAccountName: r.bank_account_name || '',
    bankAccountNumber: r.bank_account_number || '',
    bankName: r.bank_name || '',
    lastLeaderboardReset: new Date(r.last_leaderboard_reset).toISOString(),
  };
}

class DatabaseManager {
  private data: DatabaseSchema;
  private ready: Promise<void>;

  constructor() {
    this.data = buildDefaultSeed();
    this.ready = this.init();
  }

  /** Server nên `await db.waitUntilReady()` trước khi bắt đầu nhận request. */
  public waitUntilReady(): Promise<void> {
    return this.ready;
  }

  private async init(): Promise<void> {
    if (!pool) {
      // Không có Neon -> chạy tạm với dữ liệu mặc định trong RAM (đã set ở constructor).
      return;
    }
    try {
      await pool.query(SCHEMA_SQL);

      const { rows: userRows } = await pool.query('SELECT * FROM users');
      if (userRows.length === 0) {
        // Neon database còn trống -> gieo (seed) 2 tài khoản mặc định (Admin + AI).
        const seed = this.data;
        for (const u of seed.users) {
          await pool.query(
            `INSERT INTO users (id, username, email, password_hash, avatar, role, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             ON CONFLICT (id) DO NOTHING`,
            [u.id, u.username, u.email, u.passwordHash, u.avatar, u.role, u.createdAt]
          );
        }
        for (const p of Object.values(seed.profiles)) {
          await pool.query(
            `INSERT INTO profiles (user_id, username, email, avatar, level, xp, total_games, wins, losses,
               win_rate, highest_score, all_time_highest_score, rank_title, equipped_runes, unlocked_skins,
               is_premium, premium_plan, premium_expires_at, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
             ON CONFLICT (user_id) DO NOTHING`,
            [
              p.id, p.username, p.email || null, p.avatar, p.level, p.xp, p.totalGames, p.wins, p.losses,
              p.winRate, p.highestScore, p.allTimeHighestScore || 0, p.rankTitle,
              JSON.stringify(p.equippedRunes), JSON.stringify(p.unlockedSkins || []),
              p.isPremium || false, p.premiumPlan || null, p.premiumExpiresAt || null, p.createdAt,
            ]
          );
        }
        await pool.query(
          `INSERT INTO site_settings (id, guide_link, solution_package_price, monthly_package_price,
             bank_account_name, bank_account_number, bank_name, last_leaderboard_reset)
           VALUES (1,$1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (id) DO NOTHING`,
          [
            seed.settings.guideLink, seed.settings.solutionPackagePrice, seed.settings.monthlyPackagePrice,
            seed.settings.bankAccountName, seed.settings.bankAccountNumber, seed.settings.bankName,
            seed.settings.lastLeaderboardReset,
          ]
        );
      }

      await this.loadAllFromDb();
      console.log('✅ Đã kết nối Neon Postgres và tải dữ liệu thành công.');
    } catch (e: any) {
      console.error('❌ Không thể kết nối/tải dữ liệu từ Neon Postgres — tạm dùng dữ liệu mặc định trong RAM:', e.message);
    }
  }

  private async loadAllFromDb(): Promise<void> {
    if (!pool) return;
    const [userRes, profileRes, matchRes, questionRes, premiumRes, settingsRes] = await Promise.all([
      pool.query('SELECT * FROM users'),
      pool.query('SELECT * FROM profiles'),
      pool.query('SELECT * FROM match_history ORDER BY played_at DESC LIMIT 3000'),
      pool.query('SELECT * FROM custom_questions'),
      pool.query('SELECT * FROM premium_requests ORDER BY created_at DESC'),
      pool.query('SELECT * FROM site_settings WHERE id = 1'),
    ]);

    this.data.users = userRes.rows.map(rowToUser);

    const profiles: Record<string, UserProfile> = {};
    for (const r of profileRes.rows) profiles[r.user_id] = rowToProfile(r);
    this.data.profiles = profiles;

    this.data.matchHistory = matchRes.rows.map(rowToMatch);
    this.data.customQuestions = questionRes.rows.map(rowToQuestion);
    this.data.premiumRequests = premiumRes.rows.map(rowToPremiumRequest);

    if (settingsRes.rows.length > 0) {
      this.data.settings = rowToSettings(settingsRes.rows[0]);
    } else {
      await pool.query(
        `INSERT INTO site_settings (id, guide_link, solution_package_price, monthly_package_price,
           bank_account_name, bank_account_number, bank_name, last_leaderboard_reset)
         VALUES (1,$1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [
          DEFAULT_SETTINGS.guideLink, DEFAULT_SETTINGS.solutionPackagePrice, DEFAULT_SETTINGS.monthlyPackagePrice,
          DEFAULT_SETTINGS.bankAccountName, DEFAULT_SETTINGS.bankAccountNumber, DEFAULT_SETTINGS.bankName,
          DEFAULT_SETTINGS.lastLeaderboardReset,
        ]
      );
      this.data.settings = { ...DEFAULT_SETTINGS };
    }
  }

  /** Chạy 1 câu lệnh ghi vào Neon, không làm crash app nếu Neon tạm thời lỗi. */
  private async persist(fn: () => Promise<any>) {
    if (!pool) return;
    try {
      await fn();
    } catch (e: any) {
      console.error('❌ Lỗi ghi dữ liệu vào Neon Postgres:', e.message);
    }
  }

  // ==========================================
  // USER AUTH
  // ==========================================
  public findUserByUsername(username: string): DBUser | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public findUserById(id: string): DBUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public async createUser(username: string, email: string, password: string, avatar: string, role: 'user' | 'guest' = 'user'): Promise<DBUser> {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUser: DBUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      username,
      email,
      passwordHash,
      avatar: avatar || '🧙‍♂️',
      role,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);

    const newProfile: UserProfile = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      level: 1,
      xp: 0,
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      highestScore: 0,
      allTimeHighestScore: 0,
      rankTitle: 'Tập Sự Phép Thuật',
      equippedRunes: [...DEFAULT_RUNE_SELECTION],
      createdAt: newUser.createdAt,
      isPremium: false,
      premiumPlan: null,
      premiumExpiresAt: null,
      dailySolutionViews: 0,
      dailySolutionViewsDate: undefined,
    };
    this.data.profiles[newUser.id] = newProfile;

    await this.persist(async () => {
      await pool!.query(
        `INSERT INTO users (id, username, email, password_hash, avatar, role, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [newUser.id, newUser.username, newUser.email, newUser.passwordHash, newUser.avatar, newUser.role, newUser.createdAt]
      );
      await pool!.query(
        `INSERT INTO profiles (user_id, username, email, avatar, level, xp, total_games, wins, losses,
           win_rate, highest_score, all_time_highest_score, rank_title, equipped_runes, unlocked_skins,
           is_premium, premium_plan, premium_expires_at, created_at)
         VALUES ($1,$2,$3,$4,1,0,0,0,0,0,0,0,$5,$6,'[]',false,NULL,NULL,$7)`,
        [newProfile.id, newProfile.username, newProfile.email || null, newProfile.avatar,
          newProfile.rankTitle, JSON.stringify(newProfile.equippedRunes), newProfile.createdAt]
      );
    });

    return newUser;
  }

  // ==========================================
  // TÀI KHOẢN KHÁCH (CHƠI NHANH) - CHỈ TỒN TẠI 1 NGÀY
  // ==========================================
  // Xoá khỏi hệ thống mọi tài khoản "Chơi Nhanh" (role='guest') đã được tạo hơn
  // 24 giờ trước, cùng toàn bộ hồ sơ / lịch sử trận đấu liên quan (nhờ ON DELETE
  // CASCADE trong schema). Trả về số tài khoản đã xoá.
  public async cleanupExpiredGuests(): Promise<number> {
    const GUEST_TTL_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const expiredIds = this.data.users
      .filter(u => u.role === 'guest' && now - new Date(u.createdAt).getTime() > GUEST_TTL_MS)
      .map(u => u.id);

    if (expiredIds.length === 0) return 0;

    const expiredSet = new Set(expiredIds);
    this.data.users = this.data.users.filter(u => !expiredSet.has(u.id));
    for (const id of expiredIds) delete this.data.profiles[id];
    this.data.matchHistory = this.data.matchHistory.filter(m => !expiredSet.has(m.userId));

    await this.persist(async () => {
      await pool!.query(`DELETE FROM users WHERE role = 'guest' AND created_at < NOW() - INTERVAL '1 day'`);
    });

    return expiredIds.length;
  }

  public getProfile(userId: string): UserProfile | undefined {
    return this.data.profiles[userId];
  }

  public async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    if (!this.data.profiles[userId]) return undefined;
    this.data.profiles[userId] = { ...this.data.profiles[userId], ...updates };
    const p = this.data.profiles[userId];

    await this.persist(() =>
      pool!.query(
        `UPDATE profiles SET equipped_runes = $2, updated_at = NOW() WHERE user_id = $1`,
        [userId, JSON.stringify(p.equippedRunes)]
      )
    );
    return p;
  }

  // Được gọi từ vòng lặp game (đồng bộ, "bắn và quên") — cập nhật RAM ngay lập tức
  // để không làm chậm trận đấu, rồi ghi xuống Neon ở nền.
  public recordMatch(item: MatchHistoryItem) {
    this.data.matchHistory.unshift(item);

    const profile = this.data.profiles[item.userId];
    if (profile) {
      profile.totalGames += 1;
      if (item.isWin) {
        profile.wins += 1;
        profile.xp += 100 + item.correctAnswers * 5;
      } else {
        profile.losses += 1;
        profile.xp += 40 + item.correctAnswers * 5;
      }
      profile.winRate = Math.round((profile.wins / profile.totalGames) * 100);
      if (item.score > profile.highestScore) profile.highestScore = item.score;
      if (item.score > (profile.allTimeHighestScore || 0)) profile.allTimeHighestScore = item.score;

      const calculatedLevel = Math.max(1, Math.floor(profile.xp / 300) + 1);
      profile.level = calculatedLevel;

      if (profile.level >= 10) profile.rankTitle = 'Đại Pháp Sư Toán Học';
      else if (profile.level >= 7) profile.rankTitle = 'Bậc Thầy Ấn Chú';
      else if (profile.level >= 4) profile.rankTitle = 'Học Giả Phép Thuật';
      else profile.rankTitle = 'Tập Sự Phép Thuật';
    }

    this.persist(async () => {
      await pool!.query(
        `INSERT INTO match_history (id, user_id, opponent_name, is_win, score, accuracy, correct_answers,
           total_questions, busts, max_combo, mode, played_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,to_timestamp($12::double precision / 1000.0))`,
        [item.id, item.userId, item.opponentName, item.isWin, item.score, item.accuracy, item.correctAnswers,
          item.totalQuestions, item.busts, item.maxCombo, item.mode, item.timestamp]
      );
      if (profile) {
        await pool!.query(
          `UPDATE profiles SET total_games=$2, wins=$3, losses=$4, xp=$5, win_rate=$6, highest_score=$7,
             all_time_highest_score=$8, level=$9, rank_title=$10, updated_at=NOW() WHERE user_id=$1`,
          [item.userId, profile.totalGames, profile.wins, profile.losses, profile.xp, profile.winRate,
            profile.highestScore, profile.allTimeHighestScore || 0, profile.level, profile.rankTitle]
        );
      }
    }).catch(err => console.error('❌ Lỗi lưu lịch sử trận đấu vào Neon:', err));
  }

  public getUserMatchHistory(userId: string, limit = 15): MatchHistoryItem[] {
    return this.data.matchHistory.filter(m => m.userId === userId).slice(0, limit);
  }

  public getLeaderboard(filter: 'all' | 'weekly' | 'daily' = 'all'): LeaderboardEntry[] {
    // 'all' dùng điểm kỷ lục mọi thời đại (không bao giờ reset).
    // 'weekly' / 'daily' dùng điểm kỷ lục kể từ lần Admin reset bảng xếp hạng gần nhất (mỗi tuần một lần).
    const useWeekly = filter === 'weekly' || filter === 'daily';

    return Object.values(this.data.profiles)
      .filter(p => p.id !== 'bot-ai')
      .map(p => ({ ...p, _score: useWeekly ? p.highestScore : (p.allTimeHighestScore ?? p.highestScore) }))
      .sort((a, b) => (b._score !== a._score ? b._score - a._score : b.xp - a.xp))
      .slice(0, 50)
      .map((p, idx) => ({
        rank: idx + 1,
        userId: p.id,
        username: p.username,
        avatar: p.avatar,
        level: p.level,
        score: p._score,
        wins: p.wins,
        winRate: p.winRate,
      }));
  }

  // Xoá bảng xếp hạng tuần (điểm kỷ lục trong tuần) về 0đ cho toàn bộ người dùng.
  // Điểm kỷ lục mọi thời đại (allTimeHighestScore) không bị ảnh hưởng.
  public async resetWeeklyLeaderboard(): Promise<void> {
    for (const p of Object.values(this.data.profiles)) p.highestScore = 0;
    this.data.settings.lastLeaderboardReset = new Date().toISOString();

    await this.persist(async () => {
      await pool!.query(`UPDATE profiles SET highest_score = 0, updated_at = NOW()`);
      await pool!.query(`UPDATE site_settings SET last_leaderboard_reset = NOW() WHERE id = 1`);
    });
  }

  // Xoá bảng xếp hạng TOÀN THỜI GIAN (điểm kỷ lục mọi thời đại) về 0đ cho toàn bộ người dùng.
  // Chỉ nên dùng khi thật sự muốn xoá sạch thành tích cũ (ví dụ: bắt đầu mùa giải mới).
  // Điểm kỷ lục TUẦN NÀY (highestScore) không bị ảnh hưởng bởi thao tác này.
  public async resetAllTimeLeaderboard(): Promise<void> {
    for (const p of Object.values(this.data.profiles)) p.allTimeHighestScore = 0;

    await this.persist(async () => {
      await pool!.query(`UPDATE profiles SET all_time_highest_score = 0, updated_at = NOW()`);
    });
  }

  public getAllUsers(): Omit<DBUser, 'passwordHash'>[] {
    return this.data.users.map(({ passwordHash, ...safe }) => safe);
  }

  public async addCustomQuestion(q: Question): Promise<void> {
    this.data.customQuestions.push(q);
    await this.persist(() =>
      pool!.query(
        `INSERT INTO custom_questions (id, question, formula, options, answer, explanation, time_limit, difficulty, category, level)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [q.id, q.question, (q as any).formula || null, JSON.stringify((q as any).options || null), q.answer,
          q.explanation || null, (q as any).timeLimit || 15, q.difficulty || 2, q.category, q.level]
      )
    );
  }

  public getCustomQuestions(): Question[] {
    return this.data.customQuestions;
  }

  public async deleteCustomQuestion(id: string): Promise<void> {
    this.data.customQuestions = this.data.customQuestions.filter(q => q.id !== id);
    await this.persist(() => pool!.query('DELETE FROM custom_questions WHERE id = $1', [id]));
  }

  // ==========================================
  // ACCOUNT MANAGEMENT (chỉ 1 tài khoản Admin)
  // ==========================================
  public async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const target = this.data.users.find(u => u.id === userId);
    if (!target) return { success: false, error: 'Không tìm thấy tài khoản.' };
    if (target.role === 'admin') {
      return { success: false, error: 'Không thể xóa tài khoản Quản Trị Viên duy nhất của hệ thống.' };
    }
    this.data.users = this.data.users.filter(u => u.id !== userId);
    delete this.data.profiles[userId];
    this.data.matchHistory = this.data.matchHistory.filter(m => m.userId !== userId);
    this.data.premiumRequests = this.data.premiumRequests.filter(r => r.userId !== userId);

    // ON DELETE CASCADE trên Neon sẽ tự xóa profiles/match_history/premium_requests liên quan.
    await this.persist(() => pool!.query('DELETE FROM users WHERE id = $1', [userId]));
    return { success: true };
  }

  // ==========================================
  // AVATAR (miễn phí + VIP dành cho gói Premium)
  // ==========================================
  public async updateAvatar(userId: string, avatar: string): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    const user = this.data.users.find(u => u.id === userId);
    const profile = this.data.profiles[userId];
    if (!user || !profile) return { success: false, error: 'Không tìm thấy tài khoản.' };
    if (isVipAvatar(avatar) && !this.isPremiumActive(userId)) {
      return { success: false, error: 'Pháp thân này chỉ dành cho thành viên Premium. Hãy nâng cấp gói để mở khóa!' };
    }
    user.avatar = avatar;
    profile.avatar = avatar;

    await this.persist(async () => {
      await pool!.query('UPDATE users SET avatar = $2 WHERE id = $1', [userId, avatar]);
      await pool!.query('UPDATE profiles SET avatar = $2, updated_at = NOW() WHERE user_id = $1', [userId, avatar]);
    });
    return { success: true, profile };
  }

  // ==========================================
  // SITE SETTINGS (link hướng dẫn, giá gói, thông tin chuyển khoản)
  // ==========================================
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    this.data.settings = { ...this.data.settings, ...updates };
    const s = this.data.settings;

    await this.persist(() =>
      pool!.query(
        `UPDATE site_settings SET guide_link=$1, solution_package_price=$2, monthly_package_price=$3,
           bank_account_name=$4, bank_account_number=$5, bank_name=$6 WHERE id = 1`,
        [s.guideLink, s.solutionPackagePrice, s.monthlyPackagePrice, s.bankAccountName, s.bankAccountNumber, s.bankName]
      )
    );
    return s;
  }

  // ==========================================
  // PREMIUM SUBSCRIPTION (Gói Xem Lời Giải / Gói Tháng)
  // ==========================================
  public isPremiumActive(userId: string): boolean {
    const profile = this.data.profiles[userId];
    if (!profile || !profile.isPremium) return false;
    if (!profile.premiumExpiresAt) return true; // gói vĩnh viễn (không có ngày hết hạn)
    return new Date(profile.premiumExpiresAt).getTime() > Date.now();
  }

  // ==========================================
  // HẠN MỨC XEM LỜI GIẢI MIỄN PHÍ (không có gói Premium)
  // ==========================================
  // Người chơi thường (chưa mua gói) vẫn được xem tối đa 10 lời giải chi tiết/ngày.
  // Bộ đếm tự reset về 0 mỗi khi sang ngày mới (theo giờ máy chủ).
  private static readonly FREE_SOLUTION_VIEWS_PER_DAY = 10;

  public canViewSolution(userId: string): boolean {
    if (this.isPremiumActive(userId)) return true;
    const profile = this.data.profiles[userId];
    if (!profile) return false;
    const today = new Date().toISOString().slice(0, 10);
    if (profile.dailySolutionViewsDate !== today) return true; // ngày mới -> chưa dùng lượt nào
    return (profile.dailySolutionViews || 0) < DatabaseManager.FREE_SOLUTION_VIEWS_PER_DAY;
  }

  public getRemainingFreeSolutionViews(userId: string): number {
    const profile = this.data.profiles[userId];
    if (!profile) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const used = profile.dailySolutionViewsDate === today ? (profile.dailySolutionViews || 0) : 0;
    return Math.max(0, DatabaseManager.FREE_SOLUTION_VIEWS_PER_DAY - used);
  }

  // Gọi đúng 1 lần mỗi khi 1 lời giải chi tiết THỰC SỰ được hiển thị cho người chơi
  // KHÔNG có gói Premium, để trừ vào hạn mức miễn phí trong ngày.
  public consumeFreeSolutionView(userId: string): void {
    const profile = this.data.profiles[userId];
    if (!profile) return;
    const today = new Date().toISOString().slice(0, 10);
    if (profile.dailySolutionViewsDate !== today) {
      profile.dailySolutionViewsDate = today;
      profile.dailySolutionViews = 0;
    }
    profile.dailySolutionViews = (profile.dailySolutionViews || 0) + 1;

    this.persist(async () => {
      await pool!.query(
        `UPDATE profiles SET daily_solution_views=$2, daily_solution_views_date=$3, updated_at=NOW() WHERE user_id=$1`,
        [userId, profile.dailySolutionViews, profile.dailySolutionViewsDate]
      );
    }).catch(err => console.error('❌ Lỗi lưu lượt xem lời giải miễn phí:', err));
  }

  public async grantPremium(userId: string, plan: PremiumPlan, days = 30): Promise<UserProfile | undefined> {
    const profile = this.data.profiles[userId];
    if (!profile) return undefined;
    const now = Date.now();
    const base = profile.premiumExpiresAt && new Date(profile.premiumExpiresAt).getTime() > now
      ? new Date(profile.premiumExpiresAt).getTime()
      : now;
    profile.isPremium = true;
    profile.premiumPlan = plan;
    profile.premiumExpiresAt = new Date(base + days * 24 * 60 * 60 * 1000).toISOString();

    await this.persist(() =>
      pool!.query(
        `UPDATE profiles SET is_premium=true, premium_plan=$2, premium_expires_at=$3, updated_at=NOW() WHERE user_id=$1`,
        [userId, profile.premiumPlan, profile.premiumExpiresAt]
      )
    );
    return profile;
  }

  public async revokePremium(userId: string): Promise<UserProfile | undefined> {
    const profile = this.data.profiles[userId];
    if (!profile) return undefined;
    profile.isPremium = false;
    profile.premiumPlan = null;
    profile.premiumExpiresAt = null;

    await this.persist(() =>
      pool!.query(
        `UPDATE profiles SET is_premium=false, premium_plan=NULL, premium_expires_at=NULL, updated_at=NOW() WHERE user_id=$1`,
        [userId]
      )
    );
    return profile;
  }

  public async createPremiumRequest(userId: string, username: string, plan: PremiumPlan, price: number): Promise<PremiumRequest> {
    const req: PremiumRequest = {
      id: `PRQ_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      username,
      plan,
      price,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.data.premiumRequests.unshift(req);

    await this.persist(() =>
      pool!.query(
        `INSERT INTO premium_requests (id, user_id, username, plan, price, status, created_at)
         VALUES ($1,$2,$3,$4,$5,'pending',$6)`,
        [req.id, req.userId, req.username, req.plan, req.price, req.createdAt]
      )
    );
    return req;
  }

  public getPremiumRequests(): PremiumRequest[] {
    return this.data.premiumRequests;
  }

  public async resolvePremiumRequest(requestId: string, approve: boolean): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    const req = this.data.premiumRequests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Không tìm thấy yêu cầu.' };
    if (req.status !== 'pending') return { success: false, error: 'Yêu cầu này đã được xử lý.' };

    req.status = approve ? 'approved' : 'rejected';
    req.resolvedAt = new Date().toISOString();

    let profile: UserProfile | undefined;
    if (approve) {
      profile = await this.grantPremium(req.userId, req.plan, 30);
    }

    await this.persist(() =>
      pool!.query('UPDATE premium_requests SET status=$2, resolved_at=$3 WHERE id=$1', [req.id, req.status, req.resolvedAt])
    );
    return { success: true, profile };
  }
}

export const db = new DatabaseManager();
