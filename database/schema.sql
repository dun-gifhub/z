-- ==========================================================
-- MATH RUNE: DRAW & SOLVE - DATABASE SCHEMA (Neon / PostgreSQL)
-- ==========================================================
-- File này chỉ để THAM KHẢO — server tự động chạy các câu lệnh
-- CREATE TABLE IF NOT EXISTS này khi khởi động (xem server/database/db.ts),
-- bạn KHÔNG cần tự chạy file này thủ công.
--
-- Các bảng tĩnh (60 lá bài, 16 Rune, ngân hàng câu hỏi mặc định) không lưu
-- ở đây vì chúng nằm sẵn trong code (shared/cards.ts, shared/runes.ts,
-- server/questions/questionBank.ts). Chỉ dữ liệu ĐỘNG (do người dùng tạo ra
-- khi chơi) mới cần lưu vào Neon để không bị mất khi server restart/redeploy.

-- 1. USERS TABLE (role: 'admin' — chỉ 1 tài khoản duy nhất; 'user' — tài khoản đăng ký;
--    'guest' — tài khoản "Chơi Nhanh" không cần đăng ký, tự động bị xoá sau 1 ngày)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(20) DEFAULT '🧙‍♂️',
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES & PROGRESSION (tự chứa toàn bộ, không cần JOIN với users)
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
    highest_score INTEGER DEFAULT 0, -- điểm kỷ lục TUẦN NÀY, bị reset về 0 mỗi tuần
    all_time_highest_score INTEGER DEFAULT 0, -- điểm kỷ lục MỌI THỜI ĐẠI, không bao giờ reset
    rank_title VARCHAR(50) DEFAULT 'Tập Sự Phép Thuật',
    equipped_runes JSONB DEFAULT '["rune_revive", "rune_shield", "rune_freeze"]'::jsonb,
    unlocked_skins JSONB DEFAULT '[]'::jsonb,
    -- Gói Premium (Gói Xem Lời Giải / Gói Tháng)
    is_premium BOOLEAN DEFAULT FALSE,
    premium_plan VARCHAR(20), -- 'solution' | 'monthly'
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    -- Hạn mức xem lời giải chi tiết MIỄN PHÍ cho người không có gói Premium (tối đa 10 lượt/ngày)
    daily_solution_views INTEGER DEFAULT 0,
    daily_solution_views_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PREMIUM PURCHASE REQUESTS (chuyển khoản thủ công, Admin duyệt)
CREATE TABLE IF NOT EXISTS premium_requests (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    plan VARCHAR(20) NOT NULL, -- 'solution' | 'monthly'
    price INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. SITE SETTINGS (link hướng dẫn trang chủ, giá gói Premium, thông tin chuyển khoản)
--    Chỉ có đúng 1 dòng duy nhất (id = 1).
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

-- 5. CÂU HỎI DO ADMIN TỰ THÊM (câu hỏi mặc định nằm trong code, không lưu ở đây)
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

-- 6. LỊCH SỬ TRẬN ĐẤU
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

-- 7. INDEXES CHO BẢNG XẾP HẠNG & TRUY VẤN NHANH
CREATE INDEX IF NOT EXISTS idx_profiles_highest_score ON profiles(highest_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_all_time_highest_score ON profiles(all_time_highest_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_match_history_user ON match_history(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_requests_status ON premium_requests(status);
