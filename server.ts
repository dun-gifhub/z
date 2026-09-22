import express from 'express';
import http from 'http';
import path from 'path';
import bcrypt from 'bcryptjs';
import { db } from './server/database/db.ts';
import { DECK_60_CARDS } from './shared/cards.ts';
import { ALL_RUNES } from './shared/runes.ts';
import { CURATED_QUESTIONS } from './server/questions/questionBank.ts';
import { WebSocketHandler } from './server/websocket/wsHandler.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // ==========================================
  // ADMIN PASSWORD GATE
  // ==========================================
  // Set ADMIN_PASSWORD as an environment variable (on Render: Dashboard -> your
  // service -> Environment). If it's missing, the admin panel stays locked so
  // nobody can reach it by accident.
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_PASSWORD chưa được thiết lập. Trang Quản Trị sẽ bị khóa cho tới khi bạn đặt biến môi trường này.');
  }

  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ error: 'Máy chủ chưa cấu hình mật khẩu Admin (ADMIN_PASSWORD).' });
    }
    const key = req.headers['x-admin-key'];
    if (key !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Sai mật khẩu quản trị.' });
    }
    next();
  }

  app.use(express.json());

  // Chờ Neon Postgres kết nối & tải dữ liệu xong trước khi nhận request
  // (nếu chưa cấu hình DATABASE_URL, việc này trả về ngay và chạy tạm bằng RAM).
  await db.waitUntilReady();

  // Create HTTP server for both Express and WebSocket
  const server = http.createServer(app);
  new WebSocketHandler(server);

  // ==========================================
  // TỰ ĐỘNG RESET BẢNG XẾP HẠNG MỖI TUẦN MỘT LẦN
  // ==========================================
  // Kiểm tra mỗi giờ: nếu đã hơn 7 ngày kể từ lần reset gần nhất thì tự động
  // xóa bảng xếp hạng tuần (đưa điểm về 0đ). Admin cũng có thể bấm reset thủ
  // công bất cứ lúc nào trong Trang Quản Trị.
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const checkWeeklyLeaderboardReset = () => {
    const last = new Date(db.getSettings().lastLeaderboardReset || 0).getTime();
    if (Date.now() - last >= WEEK_MS) {
      db.resetWeeklyLeaderboard().then(() => {
        console.log('🏆 Đã tự động reset Bảng Xếp Hạng Tuần về 0đ.');
      });
    }
  };
  checkWeeklyLeaderboardReset();
  setInterval(checkWeeklyLeaderboardReset, 60 * 60 * 1000);

  // ==========================================
  // TỰ ĐỘNG XOÁ TÀI KHOẢN KHÁCH (CHƠI NHANH) SAU 1 NGÀY
  // ==========================================
  // Kiểm tra mỗi giờ: xoá mọi tài khoản "Chơi Nhanh" (không đăng ký Gmail/mật khẩu)
  // đã được tạo hơn 24 giờ trước, cùng toàn bộ dữ liệu liên quan.
  const checkExpiredGuests = () => {
    db.cleanupExpiredGuests().then(count => {
      if (count > 0) console.log(`🧹 Đã xoá ${count} tài khoản Khách hết hạn (quá 1 ngày).`);
    });
  };
  checkExpiredGuests();
  setInterval(checkExpiredGuests, 60 * 60 * 1000);

  // ==========================================
  // AUTH REST APIS
  // ==========================================
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password, avatar } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.' });
      }

      const existing = db.findUserByUsername(username);
      if (existing) {
        return res.status(400).json({ error: 'Tên người dùng đã được sử dụng.' });
      }

      const newUser = await db.createUser(username, email || '', password, avatar || '🧙‍♂️');
      const profile = db.getProfile(newUser.id);
      return res.json({
        user: { id: newUser.id, username: newUser.username, avatar: newUser.avatar, role: newUser.role, createdAt: newUser.createdAt },
        profile,
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập tên tài khoản và mật khẩu.' });
      }

      const user = db.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Tài khoản không tồn tại.' });
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
      }

      const profile = db.getProfile(user.id);
      return res.json({
        user: { id: user.id, username: user.username, avatar: user.avatar, role: user.role, createdAt: user.createdAt },
        profile,
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/auth/guest', async (req, res) => {
    try {
      const randomGuestName = `Pháp Sư #${Math.floor(1000 + Math.random() * 9000)}`;
      const avatars = ['🧙‍♂️', '🔮', '⚡', '🐉', '✨', '🦊', '🦅', '🦉'];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      const guestUser = await db.createUser(randomGuestName, '', Math.random().toString(), randomAvatar, 'guest');
      const profile = db.getProfile(guestUser.id);
      return res.json({
        user: { id: guestUser.id, username: guestUser.username, avatar: guestUser.avatar, role: guestUser.role, createdAt: guestUser.createdAt },
        profile,
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // ==========================================
  // PUBLIC SITE SETTINGS (link hướng dẫn, giá gói Premium, thông tin chuyển khoản)
  // ==========================================
  app.get('/api/settings', (_req, res) => {
    return res.json(db.getSettings());
  });

  // ==========================================
  // PROFILE & LEADERBOARD APIS
  // ==========================================
  app.get('/api/profile/:id', (req, res) => {
    const profile = db.getProfile(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Không tìm thấy hồ sơ.' });
    return res.json(profile);
  });

  app.put('/api/profile/:id/runes', async (req, res) => {
    const { runes } = req.body;
    if (!Array.isArray(runes) || runes.length === 0) {
      return res.status(400).json({ error: 'Cần chọn ít nhất 1 Rune để trang bị!' });
    }
    const updated = await db.updateProfile(req.params.id, { equippedRunes: runes });
    return res.json(updated);
  });

  app.get('/api/profile/:id/history', (req, res) => {
    const history = db.getUserMatchHistory(req.params.id);
    return res.json(history);
  });

  app.put('/api/profile/:id/avatar', async (req, res) => {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ error: 'Vui lòng chọn pháp thân (avatar).' });
    }
    const result = await db.updateAvatar(req.params.id, avatar);
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }
    return res.json(result.profile);
  });

  // ==========================================
  // PREMIUM SUBSCRIPTION APIS (Gói Xem Lời Giải / Gói Tháng)
  // ==========================================
  app.post('/api/premium/request', async (req, res) => {
    const { userId, plan } = req.body;
    if (!userId || (plan !== 'solution' && plan !== 'monthly')) {
      return res.status(400).json({ error: 'Thông tin gói đăng ký không hợp lệ.' });
    }
    const user = db.findUserById(userId);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });

    const settings = db.getSettings();
    const price = plan === 'monthly' ? settings.monthlyPackagePrice : settings.solutionPackagePrice;
    const request = await db.createPremiumRequest(userId, user.username, plan, price);
    return res.json({ success: true, request });
  });

  app.get('/api/leaderboard', (req, res) => {
    const filter = (req.query.filter as any) || 'all';
    const list = db.getLeaderboard(filter);
    return res.json(list);
  });

  // ==========================================
  // STATIC CARD & RUNE METADATA APIS
  // ==========================================
  app.get('/api/cards', (_req, res) => {
    return res.json(DECK_60_CARDS);
  });

  app.get('/api/runes', (_req, res) => {
    return res.json(ALL_RUNES);
  });

  app.get('/api/questions', (_req, res) => {
    const custom = db.getCustomQuestions();
    return res.json([...CURATED_QUESTIONS, ...custom]);
  });

  // ==========================================
  // ADMIN PANEL APIS
  // ==========================================
  app.post('/api/admin/verify', (req, res) => {
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ error: 'Máy chủ chưa cấu hình mật khẩu Admin (ADMIN_PASSWORD).' });
    }
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Sai mật khẩu quản trị.' });
    }
    return res.json({ success: true });
  });

  app.get('/api/admin/stats', requireAdmin, (_req, res) => {
    const allUsers = db.getAllUsers();
    const premiumCount = allUsers.filter(u => db.isPremiumActive(u.id)).length;
    const pendingPremiumRequests = db.getPremiumRequests().filter(r => r.status === 'pending').length;
    return res.json({
      totalUsers: allUsers.length,
      totalQuestions: CURATED_QUESTIONS.length + db.getCustomQuestions().length,
      totalCards: DECK_60_CARDS.length,
      totalRunes: ALL_RUNES.length,
      totalPremiumUsers: premiumCount,
      pendingPremiumRequests,
      systemStatus: 'Operational',
      activeMemoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    });
  });

  app.get('/api/admin/users', requireAdmin, (_req, res) => {
    const users = db.getAllUsers();
    return res.json(users);
  });

  app.post('/api/admin/questions', requireAdmin, async (req, res) => {
    const { question, formula, options, answer, explanation, timeLimit, difficulty, category, level } = req.body;
    if (!question || !answer || !category) {
      return res.status(400).json({ error: 'Thiếu thông tin câu hỏi bắt buộc.' });
    }
    const newQ = {
      id: `ADMIN_${Date.now()}`,
      question,
      formula: formula || undefined,
      options: options || undefined,
      answer,
      explanation: explanation || 'Lời giải chi tiết từ Ban Quản Trị.',
      timeLimit: timeLimit || 15,
      difficulty: difficulty || 2,
      category,
      level: level || 'THCS',
    };
    await db.addCustomQuestion(newQ);
    return res.json({ success: true, question: newQ });
  });

  app.delete('/api/admin/questions/:id', requireAdmin, async (req, res) => {
    await db.deleteCustomQuestion(req.params.id);
    return res.json({ success: true });
  });

  // ------- Xóa tài khoản (chỉ 1 tài khoản Admin duy nhất, không thể tự xóa) -------
  app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
    const result = await db.deleteUser(req.params.id);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true });
  });

  // ------- Cài đặt hệ thống: link hướng dẫn, giá gói Premium, thông tin chuyển khoản -------
  app.put('/api/admin/settings', requireAdmin, async (req, res) => {
    const { guideLink, solutionPackagePrice, monthlyPackagePrice, bankAccountName, bankAccountNumber, bankName } = req.body;
    const updated = await db.updateSettings({
      ...(guideLink !== undefined && { guideLink }),
      ...(solutionPackagePrice !== undefined && { solutionPackagePrice: Number(solutionPackagePrice) }),
      ...(monthlyPackagePrice !== undefined && { monthlyPackagePrice: Number(monthlyPackagePrice) }),
      ...(bankAccountName !== undefined && { bankAccountName }),
      ...(bankAccountNumber !== undefined && { bankAccountNumber }),
      ...(bankName !== undefined && { bankName }),
    });
    return res.json(updated);
  });

  // ------- Quản lý gói Premium: duyệt / từ chối yêu cầu, cấp / thu hồi thủ công -------
  app.get('/api/admin/premium/requests', requireAdmin, (_req, res) => {
    return res.json(db.getPremiumRequests());
  });

  app.post('/api/admin/premium/requests/:id/approve', requireAdmin, async (req, res) => {
    const result = await db.resolvePremiumRequest(req.params.id, true);
    if (!result.success) return res.status(400).json({ error: result.error });
    return res.json({ success: true, profile: result.profile });
  });

  app.post('/api/admin/premium/requests/:id/reject', requireAdmin, async (req, res) => {
    const result = await db.resolvePremiumRequest(req.params.id, false);
    if (!result.success) return res.status(400).json({ error: result.error });
    return res.json({ success: true });
  });

  app.post('/api/admin/premium/grant', requireAdmin, async (req, res) => {
    const { userId, plan, days } = req.body;
    if (!userId || (plan !== 'solution' && plan !== 'monthly')) {
      return res.status(400).json({ error: 'Thông tin không hợp lệ.' });
    }
    const profile = await db.grantPremium(userId, plan, days ? Number(days) : 30);
    if (!profile) return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
    return res.json(profile);
  });

  app.post('/api/admin/premium/revoke', requireAdmin, async (req, res) => {
    const { userId } = req.body;
    const profile = await db.revokePremium(userId);
    if (!profile) return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
    return res.json(profile);
  });

  // ------- Reset Bảng Xếp Hạng tuần (thủ công - ngoài lịch tự động mỗi tuần) -------
  app.post('/api/admin/leaderboard/reset', requireAdmin, async (_req, res) => {
    await db.resetWeeklyLeaderboard();
    return res.json({ success: true, settings: db.getSettings() });
  });

  // ------- Reset Bảng Xếp Hạng TOÀN THỜI GIAN (xoá sạch điểm kỷ lục mọi thời đại) -------
  app.post('/api/admin/leaderboard/reset-alltime', requireAdmin, async (_req, res) => {
    await db.resetAllTimeLeaderboard();
    return res.json({ success: true });
  });

  // ==========================================
  // VITE MIDDLEWARE / PRODUCTION STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Math Rune Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
