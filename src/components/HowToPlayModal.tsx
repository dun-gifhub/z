import React, { useState } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Coins,
  HelpCircle,
  BookOpen,
  Layers,
  Zap,
  Clock,
  Swords,
  Trophy,
  CheckCircle2,
  RotateCcw,
  Flame,
  Crown,
  Lightbulb,
  Shield,
  Percent,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { MATH_DOMAINS } from '../../shared/cards.ts';
import { ALL_RUNES } from '../../shared/runes.ts';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideLink?: string;
}

type TabType = 'rules' | 'domains' | 'runes' | 'modes' | 'tips';

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  guideLink = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl p-3.5 sm:p-6 text-slate-100 max-h-[94vh] sm:max-h-[90vh] flex flex-col space-y-3.5 sm:space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          aria-label="Đóng cẩm nang"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 shrink-0 pt-1">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="font-cinzel text-lg sm:text-2xl font-black text-amber-200 tracking-wide">
            CẨM NANG HƯỚNG DẪN CHI TIẾT MATH RUNE
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium max-w-xl mx-auto">
            Học viện Đấu Trường Thẻ Tri Thức Toán Học • Luật Chơi Push-Your-Luck, 10 Phân Môn & 16 Cổ Ngữ
          </p>
        </div>

        {/* ADMIN LINK BANNER (If configured in Admin Panel) */}
        {guideLink && (
          <div className="p-3 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-lg shrink-0">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="text-xl">📚</span>
              <div>
                <div className="text-xs font-bold text-indigo-200 flex items-center justify-center sm:justify-start gap-1">
                  <span>Tài Liệu Hướng Dẫn Chi Tiết Của Giáo Viên / Ban Quản Trị</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Xem tài liệu chuyên sâu, video phân tích hoặc giáo án đính kèm
                </div>
              </div>
            </div>
            <a
              href={guideLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95 uppercase tracking-wider"
            >
              <span>Xem Tài Liệu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/90 border border-slate-800 rounded-2xl overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>1. Luật Cốt Lõi</span>
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'domains'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. 10 Phân Môn & 60 Thẻ</span>
          </button>

          <button
            onClick={() => setActiveTab('runes')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'runes'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. 16 Cổ Ngữ Rune</span>
          </button>

          <button
            onClick={() => setActiveTab('modes')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'modes'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>4. Chế Độ Học Thuật</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'tips'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>5. Chiến Thuật & Mẹo</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-xs text-slate-300 leading-relaxed scrollbar-thin">
          
          {/* ========================================================= */}
          {/* TAB 1: CORE RULES                                         */}
          {/* ========================================================= */}
          {activeTab === 'rules' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Mục tiêu chiến thắng */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-950/60 via-slate-950 to-amber-950/60 rounded-2xl border-2 border-amber-500/60 flex items-center gap-3.5 shadow-lg">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                    MỤC TIÊU CHIẾN THẮNG: ĐẠT 150 ĐIỂM TRI THỨC AN TOÀN
                  </h3>
                  <p className="text-slate-300 mt-0.5 text-[11px] sm:text-xs">
                    Hai học viên / kỳ thủ tranh tài luân phiên theo lượt. Người chơi đầu tiên tích luỹ đủ <strong>150 điểm an toàn (Bank Score)</strong> trong kho lưu trữ vĩnh viễn sẽ giành chiến thắng chung cuộc!
                  </p>
                </div>
              </div>

              {/* Bước 1: Rút Thẻ Tri Thức & Lật Thẻ 3D */}
              <div className="p-3 sm:p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">1</span>
                  <span>RÚT THẺ TRI THỨC (DRAW) & KHÁM PHÁ THẺ 3D</span>
                </h4>
                <p>
                  Khi đến lượt thi đấu, bạn bấm nút <strong>[RÚT THẺ TRI THỨC]</strong> để khai mở 1 thẻ ngẫu nhiên từ kho tàng 60 thẻ toán học:
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                  <div className="text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cơ Chế Lật Thẻ 3D Tương Tác:</span>
                  </div>
                  <p>
                    Thẻ tri thức bắt đầu ở mặt sau cổ ngữ ma thuật và tự động xoay 180° trong không gian 3D để hé lộ nội dung câu hỏi toán học. Bạn có thể <strong>nhấp trực tiếp vào thẻ bất kỳ lúc nào</strong> để lật qua lật lại chiêm ngưỡng cả 2 mặt và đọc kỹ năng học thuật!
                  </p>
                </div>
              </div>

              {/* Bước 2: Giải Toán Trong Thời Gian Giới Hạn */}
              <div className="p-3 sm:p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">2</span>
                  <span>GIẢI TOÁN ĐỂ THU PHỤC THẺ TRI THỨC (30 GIÂY)</span>
                </h4>
                <p>
                  Mỗi thẻ tri thức được rút ra mang một bài toán thuộc phân môn tương ứng:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px] sm:text-xs">
                  <li><strong className="text-emerald-300">Giải Đúng:</strong> Thu phục thẻ thành công! Thẻ được đặt lên bàn đấu và điểm số (+5 đến +30 điểm) được cộng dồn vào <em>Điểm Lượt Này</em>.</li>
                  <li><strong className="text-rose-400">Hết giờ hoặc Trả lời Sai:</strong> Mất lượt rút hiện tại, thẻ bị thu hồi và chuyển lượt cho đối thủ (trừ khi có Cổ Ngữ Sửa Sai bảo hộ).</li>
                </ul>
              </div>

              {/* Bước 3: Cơ Chế BUST (Nổ Lượt / Trùng Phân Môn) */}
              <div className="p-3 sm:p-3.5 bg-rose-950/40 rounded-2xl border-2 border-rose-800/60 space-y-2">
                <h4 className="font-bold text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>CƠ CHẾ BUST (QUÁ TẢI NGUYÊN TỐ / TRÙNG PHÂN MÔN TOÁN)</span>
                </h4>
                <p>
                  Đây là cốt lõi của chiến thuật xác suất <em>Push-Your-Luck</em>! Nếu bạn tiếp tục rút thẻ và giải đúng một thẻ có <strong>CÙNG PHÂN MÔN TOÁN HỌC</strong> với bất kỳ thẻ nào đã có trên bàn trong lượt đó:
                </p>
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-200 font-bold space-y-1">
                  <div>💥 BẠN BỊ BUST (NỔ LƯỢT)! Toàn bộ điểm tích lũy trong lượt này biến mất hoàn toàn!</div>
                  <div className="text-[11px] font-normal text-rose-300">
                    Lượt thi đấu kết thúc ngay lập tức và chuyển quyền cho đối thủ.
                  </div>
                </div>
              </div>

              {/* Bước 4: BANK (Lưu Điểm Vào Kho An Toàn) */}
              <div className="p-3 sm:p-3.5 bg-emerald-950/40 rounded-2xl border-2 border-emerald-800/60 space-y-2">
                <h4 className="font-bold text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>BẤM [BANK] ĐỂ BẢO TOÀN ĐIỂM SỐ VĨNH VIỄN</span>
                </h4>
                <p>
                  Bất cứ lúc nào sau khi giải đúng ít nhất 1 thẻ và chưa bị BUST, bạn có quyền bấm <strong>[BANK]</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px] sm:text-xs">
                  <li>Toàn bộ điểm tích lũy của lượt này được chuyển vĩnh viễn vào <strong>Kho An Toàn</strong> (không bao giờ bị mất).</li>
                  <li>Bàn đấu được làm mới (dọn sạch các thẻ đã mở) và chuyển lượt thi đấu cho đối thủ.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 10 PHÂN MÔN & 60 THẺ TRI THỨC                      */}
          {/* ========================================================= */}
          {activeTab === 'domains' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-slate-300 text-[11px]">
                  Kho tàng gồm <strong>60 Thẻ Tri Thức</strong> chia đều cho 10 phân môn toán học. Mỗi phân môn gồm 6 thẻ (3 Common, 1 Rare, 1 Epic, 1 Legendary):
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(MATH_DOMAINS).map(([key, dom]) => (
                  <div
                    key={key}
                    style={{ borderColor: `${dom.color}66` }}
                    className="p-3 bg-slate-950/80 rounded-2xl border flex items-start gap-3 hover:border-amber-400/80 transition-colors"
                  >
                    <div
                      style={{ backgroundColor: `${dom.color}22`, borderColor: dom.color }}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0"
                    >
                      {dom.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-100 text-xs">{dom.nameVi}</span>
                        <span className="text-[10px] font-mono text-slate-400">({dom.name})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {dom.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: 16 CỔ NGỮ RUNE BẢO MỆNH                            */}
          {/* ========================================================= */}
          {activeTab === 'runes' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-slate-300 text-[11px]">
                  Trước mỗi trận đấu, bạn được bốc thăm chọn <strong>1 trong 2 Cổ Ngữ Rune bảo mệnh</strong> ngẫu nhiên. Cổ Ngữ này mang sức mạnh học thuật độc nhất:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_RUNES.map(r => (
                  <div
                    key={r.id}
                    style={{ borderColor: `${r.color}55` }}
                    className="p-3 bg-slate-950/80 rounded-2xl border flex items-start gap-3 hover:border-amber-400 transition-colors"
                  >
                    <div
                      style={{ backgroundColor: `${r.color}22`, borderColor: r.color }}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0"
                    >
                      {r.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-100 text-xs">{r.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                          {r.limitType === 'once_per_match' ? '1 Lần / Trận' : r.limitType === 'once_per_turn' ? '1 Lần / Lượt' : 'Liên Tục'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {r.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CHẾ ĐỘ THI ĐẤU                                    */}
          {/* ========================================================= */}
          {activeTab === 'modes' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <h4 className="font-bold text-slate-100 text-xs sm:text-sm">Đấu Trí Cùng AI (4 Cấp Độ)</h4>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Luyện tập kỹ năng toán học cùng đối thủ AI: Tân Thủ, Pháp Sư, Đại Pháp Sư và Hiền Triết Tối Thượng.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    <h4 className="font-bold text-slate-100 text-xs sm:text-sm">Đấu Trực Tuyến Thời Gian Thực</h4>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Ghép trận ngẫu nhiên hoặc tạo phòng riêng có mã số (Room Code) để thi đấu cùng bạn bè, bạn cùng lớp qua mạng.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: MẸO & CHIẾN THUẬT                                 */}
          {/* ========================================================= */}
          {activeTab === 'tips' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3.5 bg-gradient-to-r from-amber-950/60 via-slate-950 to-amber-950/60 rounded-2xl border-2 border-amber-500/50 space-y-1.5">
                <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>NGUYÊN TẮC VÀNG TỐI ƯU HÓA ĐIỂM SỐ</span>
                </h4>
                <p className="text-slate-300 text-[11px]">
                  Math Rune là bài toán tối ưu hoá xác suất và quản trị rủi ro học thuật:
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>1. Quan Sát Thanh "RỦI RO BÙM (% BUST RISK)"</span>
                  </div>
                  <p className="text-slate-300">
                    Thanh đo trên bàn đấu cập nhật tỷ lệ xuất hiện trùng phân môn toán:
                  </p>
                  <ul className="list-disc pl-5 text-slate-400 space-y-0.5">
                    <li><strong>0% - 20% (1-2 thẻ trên bàn):</strong> Vùng rất an toàn, nên rút tiếp để tối đa hóa điểm.</li>
                    <li><strong>30% - 40% (3-4 thẻ trên bàn):</strong> Đã có rủi ro! Nếu đã tích lũy trên 25 điểm, hãy cân nhắc [BANK].</li>
                    <li><strong>≥ 50% (5 thẻ trở lên):</strong> Nguy cơ BUST cực lớn! Nếu không có Rune Khiên Chắn bảo vệ, hãy bấm [BANK] ngay.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>2. Kiểm Soát Tâm Lý Học Đường</span>
                  </div>
                  <p className="text-slate-300">
                    Bảo toàn điểm số đều đặn qua mỗi lượt (15-25 điểm) mang lại tỷ lệ chiến thắng cao hơn nhiều so với việc mạo hiểm rút thẻ thứ 5 hoặc 6 rồi mất trắng điểm lượt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Nhấn vào các tab phía trên để tra cứu từng phần hướng dẫn
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider shadow-lg transition-all active:scale-95 ml-auto"
          >
            ĐÃ HIỂU HƯỚNG DẪN
          </button>
        </div>
      </div>
    </div>
  );
};
