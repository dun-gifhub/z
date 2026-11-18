import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  Card,
  PlayerState,
  MathCategory,
} from '../../shared/types.ts';
import { ALL_RUNES } from '../../shared/runes.ts';
import { MATH_DOMAINS, DECK_60_CARDS } from '../../shared/cards.ts';
import { HowToPlayModal } from './HowToPlayModal.tsx';
import { RuneIcon } from './RuneIcon.tsx';
import { MathCard } from './MathCard.tsx';
import { RuneStone } from './RuneStone.tsx';
import { DomainArt } from './DomainArt.tsx';
import { DrawButton } from './DrawButton.tsx';
import { FlipCardReveal } from './FlipCardReveal.tsx';
import { BustImpactOverlay } from './BustImpactOverlay.tsx';
import { AnimatedCounter } from './AnimatedCounter.tsx';
import { Shield, ShieldAlert, Lock, Crown, Coins, Layers, Clock, AlertTriangle, RotateCcw, Trophy, Award, Zap, HelpCircle, BookOpen, X, Flag } from 'lucide-react';

interface GameArenaProps {
  gameState: GameState;
  currentUserId: string;
  onDraw: () => void;
  onSubmitAnswer: (answer: string) => void;
  onBank: () => void;
  onUseRune: (runeId: string) => void;
  onChooseDraftRune: (runeId: string) => void;
  onSurrender: () => void;
  onExit: () => void;
  lastBustAlert: boolean;
  errorMessage: string | null;
  isLandscape?: boolean;
  isWidescreenCompact?: boolean;
}

export const GameArena: React.FC<GameArenaProps> = ({
  gameState,
  currentUserId,
  onDraw,
  onSubmitAnswer,
  onBank,
  onUseRune,
  onChooseDraftRune,
  onSurrender,
  onExit,
  lastBustAlert,
  errorMessage,
  isLandscape = false,
  isWidescreenCompact = false,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showSurrenderModal, setShowSurrenderModal] = useState<boolean>(false);
  const [inspectedTableCard, setInspectedTableCard] = useState<Card | null>(null);

  // Identify who is YOU and who is OPPONENT
  const you: PlayerState | undefined = gameState.players[currentUserId] || Object.values(gameState.players)[0];
  const opponent: PlayerState | undefined = Object.values(gameState.players).find(p => p.id !== you?.id);

  const isMyTurn = gameState.currentPlayerId === you?.id;
  const isGameOver = gameState.status === 'game_over';
  const isWinner = gameState.winnerId === you?.id;

  // Active drawn card being resolved or answered (fallback to category match if needed)
  const activeCard: Card | undefined =
    gameState.currentCard ||
    (gameState.currentQuestion
      ? (DECK_60_CARDS.find(c => c.domainId === gameState.currentQuestion?.category) || DECK_60_CARDS[0])
      : undefined);

  // Calculate unique domains on table to show live BUST risk
  const tableDomains = new Set(gameState.tableCards.map(c => c.domainId));
  const bustRiskPercent = Math.min(100, Math.round((tableDomains.size / 10) * 100));

  // Countdown timer effect: pure client countdown per question ID (immune to clock drift)
  useEffect(() => {
    if (!gameState.currentQuestion) {
      setTimeLeft(45);
      return;
    }

    // Give abundant 45s for solving math
    const limit = Math.max(gameState.currentQuestion.timeLimit || gameState.questionTimeLimit || 45, 45);
    setTimeLeft(limit);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isMyTurn) {
            onSubmitAnswer('TIMEOUT_NO_ANSWER');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentQuestion?.id, isMyTurn]);

  // Confetti on win
  useEffect(() => {
    if (isGameOver && isWinner) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isGameOver, isWinner]);

  const handleAnswerSubmit = (ans: string) => {
    if (!ans) return;
    onSubmitAnswer(ans);
    setAnswerInput('');
  };

  return (
    <div className={`relative min-h-[calc(100vh-65px)] flex flex-col justify-between px-2 sm:px-6 py-2 sm:py-3 max-w-5xl mx-auto select-none safe-pb ${isLandscape || isWidescreenCompact ?'widescreen-arena-compact landscape-compact-py' : ''} ${lastBustAlert ? 'animate-shake' : ''}`}>
      {/*  BUST FULLSCREEN IMPACT OVERLAY */}
      {lastBustAlert && <BustImpactOverlay />}

      {/* ========================================================= */}
      {/*  RUNE DRAFTING MODAL: DEALT 2 RUNES, PICK 1 FOR MATCH    */}
      {/* ========================================================= */}
      {gameState.status === 'drafting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/90 overflow-y-auto animate-in fade-in duration-250">
          <div className="w-full max-w-2xl my-auto p-5 sm:p-7 bg-ink-900 border border-brass-500/80 rounded-lg space-y-6 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brass-500/10 border border-brass-500/30 text-brass-300 text-xs font-mono">
                <span>Giai đoạn khởi nguyên • đấu trường toán học</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium text-brass-400">
                Chọn 1 trong 2 lá bài RUNE
              </h2>
              <p className="text-xs sm:text-sm text-ink-300 max-w-lg mx-auto leading-relaxed">
                Bạn và đối thủ được chia 2 lá bài Rune ngẫu nhiên khác nhau. Hãy chọn <strong>1 lá bài duy nhất</strong> — lá bài này sẽ có <strong className="text-brass-300">tác dụng xuyên suốt toàn bộ trận đấu</strong>!
              </p>
            </div>

            {!you?.chosenRuneId ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {((you?.draftRunes && you.draftRunes.length > 0) ? you.draftRunes : ['rune_shield', 'rune_revive']).map((rId) => {
                  const rDef = ALL_RUNES.find(r => r.id === rId);
                  if (!rDef) return null;
                  return (
                    <div
                      key={rId}
style={{ borderColor: rDef.color, }}
                      className="p-5 border rounded-lg flex flex-col justify-between space-y-4 hover:border-brass-400 transition-[color,background-color,border-color,opacity,transform] group bg-ink-900"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <RuneStone rune={rDef} size="lg" isActive={true} />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-medium text-brass-200 group-hover:text-brass-100">
                                {rDef.name}
                              </h4>
                              {rDef.limitType === 'once_per_match' && (
                                <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-garnet-950/80 text-garnet-300 border border-garnet-500/50">
                                  1 Lần / Trận
                                </span>
                              )}
                              {rDef.limitType === 'once_per_turn' && (
                                <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-brass-950/80 text-brass-300 border border-brass-500/50">
                                  1 Lần / Lượt
                                </span>
                              )}
                              {rDef.limitType === 'continuous' && (
                                <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-tide-950/80 text-tide-300 border border-tide-500/50">
                                  Liên tục
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-mauve-300">
                              Ấn chú nội tại trận đấu
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-ink-300 leading-relaxed">
                          {rDef.description}
                        </p>

                        <div className="p-3 rounded-md bg-brass-950/40 border border-brass-500/40 text-[11px] text-brass-200 font-medium">
                          <div className="font-medium text-brass-400 flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              <span>Hiệu năng kích hoạt:</span>
                            </div>
                            <span className="text-[11px] font-mono text-ink-300">
                              {rDef.limitType === 'once_per_match'
                                ? 'Duy nhất 1 lần cả trận'
                                : rDef.limitType === 'once_per_turn'
                                ? 'Tự làm mới mỗi lượt'
                                : 'Kích hoạt vĩnh viễn'}
                            </span>
                          </div>
                          <span>{rDef.persistentEffectDesc || rDef.description}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onChooseDraftRune(rId)}
                        className="w-full py-3 text-on-accent font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 flex items-center justify-center gap-2 bg-brass-600 hover:bg-brass-500"
                      >
                        <span>Chọn lá RUNE này</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-ink-950/90 border border-brass-500/50 rounded-lg space-y-3">
                <h3 className="text-lg font-medium text-brass-300">
                  Bạn đã chọn xong ấn chú nội tại
                </h3>
                <p className="text-xs text-ink-300">
                  {ALL_RUNES.find(r => r.id === you.chosenRuneId)?.name}: {ALL_RUNES.find(r => r.id === you.chosenRuneId)?.persistentEffectDesc}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded bg-ink-900 border border-ink-700 text-xs font-mono text-ink-400">
                  <Clock className="w-4 h-4 text-brass-400" />
                  <span>Đang chờ đối thủ chọn xong... Trận đấu sẽ tự động bắt đầu</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP BAR: Room Code, Round, Target Score, Rules and Exit */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-3 py-2 bg-ink-900/80 border border-ink-800 rounded-md text-xs font-mono flex-wrap sm:flex-nowrap gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-ink-400">PHÒNG:</span>
          <span className="font-medium text-brass-300">{gameState.roomCode}</span>
          <span className="hidden sm:inline text-ink-500">• Cấp: {gameState.mathLevel}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-ink-300">
            <Layers className="w-4 h-4 text-dusk-400" />
            <span>Kho thẻ: <strong className="text-ink-100">{gameState.deckRemaining}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-brass-300 bg-brass-950/40 border border-brass-800/40 px-2 py-0.5 rounded-md">
            <Trophy className="w-4 h-4 text-brass-400" />
            <span>Mục tiêu: <strong>{gameState.targetScore}đ</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center gap-1 px-3 py-1 bg-brass-500/20 hover:bg-brass-500/30 text-brass-300 border border-brass-500/40 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform]"
          >
            <HelpCircle className="w-4 h-4 text-brass-400" />
            <span>Luật chơi</span>
          </button>
          {!isGameOver && (
            <button
              onClick={() => setShowSurrenderModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-garnet-500/20 hover:bg-garnet-500/30 text-garnet-300 border border-garnet-500/40 rounded-md text-xs font-medium transition-[color,background-color,border-color,opacity,transform]"
              title="Đầu hàng và chấp nhận thất bại"
            >
              <Flag className="w-4 h-4 text-garnet-400" />
              <span>Đầu hàng</span>
            </button>
          )}
          <button
            onClick={onExit}
            className="text-[11px] text-ink-400 hover:text-garnet-400 underline transition-colors ml-1"
          >
            Rời trận
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE ALERT */}
      {errorMessage && (
        <div className="my-2 p-3 bg-garnet-950/80 border border-garnet-700 text-garnet-200 text-xs rounded-md text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-garnet-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. OPPONENT SECTION */}
      {/* ========================================================= */}
      <div className={`mt-2 p-3 rounded-lg border transition-[color,background-color,border-color,opacity,transform] ${
        !isMyTurn ? 'bg-dusk-950/40 border-dusk-500/60' : 'bg-ink-900/60 border-ink-800/80'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-1 bg-ink-950 rounded-md border border-ink-800">
              {opponent?.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-ink-200">{opponent?.name || 'Đang chờ...'}</span>
                {!isMyTurn && (
                  <span className={`px-3 py-0.5 text-on-accent font-medium text-[11px] rounded flex items-center gap-1 ${
                    gameState.aiThinkingStatus ? 'bg-brass-400 ring-2 ring-brass-300/60' : 'bg-brass-500'
                  }`}>
                    {gameState.aiThinkingStatus === 'solving'
                      ? 'Đang giải toán...'
                      : gameState.aiThinkingStatus === 'thinking'
                      ? 'Đang suy tính...'
                      : 'Đang lượt'}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-ink-400 flex items-center gap-3 mt-0.5 font-mono">
                <span> HP: {opponent?.hp || 100}</span>
                <span className="text-brass-400 flex items-center gap-1">
                   Kho an toàn: <AnimatedCounter value={opponent?.safeScore || 0} suffix="đ" />
                </span>
              </div>
              {(() => {
                const oppRuneId = opponent?.chosenRuneId || opponent?.runes?.[0]?.runeId;
                if (!oppRuneId) return null;
                const rDef = ALL_RUNES.find(r => r.id === oppRuneId);
                const isOncePerMatch = rDef?.limitType === 'once_per_match';
                const isOncePerTurn = rDef?.limitType === 'once_per_turn';
                const oppUsed = isOncePerMatch ? opponent.runeUsedInMatch : isOncePerTurn ? opponent.runeUsedThisTurn : false;

                // Defense specific flags
                const isShield = oppRuneId === 'rune_shield';
                const isRevive = oppRuneId === 'rune_revive';

                return (
                  <div className="text-[11px] text-dusk-300 flex items-center gap-2 mt-1 flex-wrap" title={rDef?.persistentEffectDesc || rDef?.description}>
                    <RuneIcon icon={rDef?.icon || ''} className="w-4 h-4 inline-block" />
                    <span className="font-medium">Nội tại: {rDef?.name}</span>
                    {isOncePerMatch && (
                      <span className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                        oppUsed ? 'bg-ink-800 text-ink-500' : 'bg-garnet-950 text-garnet-300 border border-garnet-800'
                      }`}>
                        {oppUsed ? 'Đã dùng (Hết trận)' : '1 Lần/Trận'}
                      </span>
                    )}
                    {isOncePerTurn && (
                      <span className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                        oppUsed ? 'bg-ink-800 text-ink-500' : 'bg-brass-950 text-brass-300 border border-brass-800'
                      }`}>
                        {oppUsed ? 'Đã dùng lượt này' : '1 Lần/Lượt'}
                      </span>
                    )}
                    {isShield && !oppUsed && (
                      <span className="px-2 py-0.5 text-[11px] bg-garnet-950/90 border border-garnet-500 text-garnet-300 rounded font-medium flex items-center gap-0.5">
                        <Shield className="w-3 h-3" /> Có khiên chống BUST
                      </span>
                    )}
                    {isRevive && !oppUsed && (
                      <span className="px-2 py-0.5 text-[11px] bg-madder-950/90 border border-madder-500 text-madder-300 rounded font-medium flex items-center gap-0.5">
                        <ShieldAlert className="w-3 h-3" /> Có Ấn Hồi Sinh 50%
                      </span>
                    )}
                    <span className="text-ink-400 hidden sm:inline">— {rDef?.persistentEffectDesc}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[11px] text-ink-400">Điểm lượt này</div>
            <div className="text-lg font-medium text-dusk-300">
              <AnimatedCounter value={opponent?.currentTurnScore || 0} prefix="+" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CENTER STAGE: CARDS ON TABLE & MATH QUESTION CHAMBER   */}
      {/* ========================================================= */}
      <div className="my-3 flex-1 flex flex-col items-center justify-center min-h-[260px] relative">
        {/* FORESIGHT PREVIEW BANNER (If Rune Tiên Tri is active) */}
        {gameState.nextCardPreview && (
          <div className="w-full mb-2 p-2 bg-mauve-950/70 border border-mauve-500/60 rounded-md flex items-center justify-center gap-2 text-xs font-mono text-mauve-200">
            <span> TIÊN TRI NỘI TẠI: Lá bài trên cùng của xấp bài là</span>
            <span className="font-medium px-2 py-0.5 rounded bg-ink-950 border border-mauve-400 text-brass-300">
              [{gameState.nextCardPreview.domainNameVi}] (+{gameState.nextCardPreview.pointValue}đ)
            </span>
          </div>
        )}

        {/* CARDS DRAWN ON TABLE THIS TURN */}
        <div className="w-full mb-3">
          <div className="text-center text-[11px] font-mono text-ink-400 mb-2 flex items-center justify-center gap-2">
            <span>THẺ TRI THỨC TRÊN BÀN LƯỢT NÀY ({gameState.tableCards.length} THẺ)</span>
            {gameState.tableCards.length > 0 && (
              <span className="text-brass-400 font-medium">
                (Tổng: +{gameState.tableCards.reduce((sum, c) => sum + c.pointValue, 0)}đ)
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center gap-3 flex-wrap min-h-[120px] p-3 sm:p-4 border border-ink-800/90 rounded-lg overflow-hidden bg-ink-950/80">
            {/* Ambient runic watermark on battle table */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-dashed border-brass-400" />
            </div>

            {gameState.tableCards.length === 0 && !activeCard ? (
              <div className="text-xs sm:text-sm text-ink-400 py-6 text-center z-10 flex flex-col items-center gap-2">
                <span>
                  {isMyTurn
                    ? 'Chưa có thẻ tri thức nào trên bàn. Bấm [ RÚT THẺ TRI THỨC] để bắt đầu lượt khai mở toán học'
                    : `Đang trong lượt của ${opponent?.name || 'Đối thủ'}. Đang tính toán bước đi...`}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 flex-wrap z-10">
                {gameState.tableCards.map((c, idx) => (
                  <MathCard
                    key={`${c.id}-${idx}`}
                    card={c}
                    variant="mini"
                    onClick={() => setInspectedTableCard(c)}
                  />
                ))}
                {/* Active Pending Card being solved */}
                {activeCard && (
                  <div className="relative flex flex-col items-center">
                    <div className="text-[11px] font-mono text-brass-300 font-medium mb-0.5">
                       Thẻ đang mở:
                    </div>
                    <MathCard
                      card={activeCard}
                      variant="mini"
                      className="ring-2 ring-brass-400 ring-offset-2 ring-offset-ink-950 scale-105"
                      onClick={() => setInspectedTableCard(activeCard)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* REALTIME BUST RISK METER & TACTICAL ADVICE */}
          {gameState.tableCards.length > 0 && isMyTurn && !gameState.currentQuestion && (
            <div className={`mt-3 p-3 px-4 rounded-lg border transition-[color,background-color,border-color,opacity,transform] animate-in fade-in duration-200 ${
              bustRiskPercent >= 40
                ? 'border-garnet-500/80 bg-garnet-950/90'
                : bustRiskPercent >= 20
                ? 'border-brass-500/80 bg-brass-950/90'
                : 'border-moss-500/80 bg-moss-950/90'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {/* Gauge Icon & Percentage */}
                  <div className={`flex items-center gap-2 font-mono font-medium text-sm sm:text-base px-3 py-1 rounded-md border ${
                    bustRiskPercent >= 40
                      ? 'bg-garnet-950 border-garnet-400 text-garnet-300'
                      : bustRiskPercent >= 20
                      ? 'bg-brass-950 border-brass-400 text-brass-300'
                      : 'bg-moss-950 border-moss-400 text-moss-300'
                  }`}>
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>~{bustRiskPercent}%</span>
                  </div>

                  <div>
                    <div className="font-medium text-ink-100 flex items-center gap-2">
                      <span>RỦI RO BÙM (BUST TRÙNG HỆ)</span>
                    </div>
                    <div className="text-[11px] text-ink-400 font-mono">
                      {tableDomains.size}/10 hệ toán đã xuất hiện trên bàn
                    </div>
                  </div>
                </div>

                {/* Progress bar and hint */}
                <div className="flex-1 max-w-xs w-full text-center sm:text-right space-y-1">
                  <div className="w-full bg-ink-950/80 h-2 rounded-full overflow-hidden border border-ink-700/60">
                    <div
                      className={`h-full transition-[color,background-color,border-color,opacity,transform] duration-300 ${
                        bustRiskPercent >= 40
                          ? 'bg-brass-500'
                          : bustRiskPercent >= 20
                          ? 'bg-moss-500'
                          : 'bg-pine-500'
                      }`}
                      style={{ width: `${bustRiskPercent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-ink-300 font-medium">
                    {bustRiskPercent >= 40 ? (
                      <span className="text-brass-300 font-medium">
                         Nguy cơ cao Hãy bấm <strong>[BANK]</strong> để giữ chắc +{you?.currentTurnScore || 0}đ!
                      </span>
                    ) : (
                      <span>
                         An toàn Tiếp tục <strong>[Rút bài]</strong> hoặc <strong>[BANK]</strong> tích luỹ.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OPPONENT DELIBERATION BANNER (When it's opponent's turn and no active question) */}
        {!isMyTurn && !gameState.currentQuestion && (
          <div className="w-full max-w-lg mb-3 p-3 bg-ink-950/85 border border-dusk-600/50 rounded-lg flex items-center justify-center gap-3 text-xs text-dusk-200">
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-medium text-brass-300">{opponent?.name || 'Đối thủ'} đang suy nghĩ nước đi...</span>
              <span className="text-[11px] text-ink-400">Đang cân nhắc: Rút thêm lá bài mới hay Dừng lại để BANK điểm an toàn</span>
            </div>
          </div>
        )}

        {/* MATH QUESTION CHAMBER (If a card was drawn and waiting for answer) */}
        {gameState.currentQuestion && (
          <div className="w-full max-w-xl p-4 sm:p-5 border border-brass-500/70 rounded-lg space-y-3 animate-in fade-in zoom-in-95 duration-200 bg-ink-900">
            {/* ACTIVE DRAWN CARD & TÁC DỤNG HEADER WITH 3D FLIP REVEAL */}
            {activeCard && (
              <div
                style={{
            borderColor: activeCard.elementColor,
                }}
                className="p-4 border rounded-lg flex flex-col sm:flex-row items-center gap-4 animate-in fade-in bg-ink-950"
              >
                <div className="shrink-0 flex flex-col items-center">
                  <FlipCardReveal card={activeCard} autoFlip={true} size="md" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="font-medium text-lg text-ink-100">
                      {activeCard.domainNameVi}
                    </span>
                    <span className="text-xs px-3 py-0.5 rounded font-mono font-medium bg-brass-400/20 text-brass-300 border border-brass-500/50">
                      +{activeCard.pointValue} điểm
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded font-mono text-mauve-300 bg-mauve-950/60 border border-mauve-800">
                      {activeCard.rarity}
                    </span>
                  </div>
                  <div className="text-xs text-brass-200 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                    <Zap className="w-4 h-4 text-brass-400 shrink-0" />
                    <span>
                      <strong>Kỹ năng:</strong> {activeCard.skillName}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-300 mt-0.5">
                    {activeCard.skillDesc}
                  </p>
                  <div className="mt-2 text-[11px] text-dusk-300 font-mono flex items-center justify-center sm:justify-start gap-1">
                    <span> Chạm / Nhấp vào thẻ để lật 3D xem cả 2 mặt</span>
                  </div>
                </div>
              </div>
            )}

            {/* Question Header: Category & Countdown Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-brass-300">
                  CÂU HỎI TOÁN HỌC: {MATH_DOMAINS[gameState.currentQuestion.category]?.nameVi || gameState.currentQuestion.category}
                </span>
              </div>

              {/* Live Timer */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-medium border ${
                timeLeft <= 5 ? 'bg-garnet-950 border-garnet-600 text-garnet-400' : 'bg-ink-950 border-ink-700 text-brass-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Question Prompt & Credible Source */}
            <div className="py-3 text-center bg-ink-950/80 rounded-md border border-ink-800 px-3">
              <div className="text-sm sm:text-base font-medium text-ink-100">
                {gameState.currentQuestion.question}
              </div>
              {gameState.currentQuestion.sourceName && (
                <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-lake-300 font-mono">
                  <span> Nguồn: {gameState.currentQuestion.sourceName}</span>
                </div>
              )}
            </div>

            {/* If it's YOUR TURN: show interactive answering controls */}
            {isMyTurn ? (
              <div className="space-y-2.5">
                {/* 1. Quick Choice Buttons if available */}
                {gameState.currentQuestion.options && gameState.currentQuestion.options.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {gameState.currentQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSubmit(opt)}
                        className="py-2 px-3 bg-ink-900 hover:bg-brass-600 hover:text-on-accent border border-ink-700 hover:border-brass-400 text-ink-100 font-mono font-medium text-sm sm:text-base rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* 2. Direct Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAnswerSubmit(answerInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    autoFocus
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Nhập đáp án số..."
                    className="flex-1 bg-ink-950 border border-dusk-700 focus:border-brass-400 rounded-md px-4 py-2 text-sm font-mono text-ink-100 text-center focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 text-on-accent font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 bg-brass-600 hover:bg-brass-500"
                  >
                    Xác nhận
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-3 px-4 bg-ink-950/80 border border-dusk-700/50 rounded-md flex items-center justify-center gap-2 text-xs font-mono text-dusk-300">
                <span>
                  {gameState.aiThinkingStatus === 'solving'
                    ? `Đại Pháp Sư AI đang tập trung tính toán giải đề... (${timeLeft}s)`
                    : `Đối thủ đang suy nghĩ nước đi... (${timeLeft}s)`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK EXPLANATION ACCORDION (If player answered wrong and has explanation) */}
        {gameState.lastAnswerResult && !gameState.lastAnswerResult.correct && gameState.lastAnswerResult.explanation && (
          <div className="w-full max-w-xl mt-2 p-3 bg-garnet-950/60 border border-garnet-800 rounded-md text-xs text-garnet-200">
            <div className="font-medium flex items-center justify-between">
              <span> Giải thích đáp án vừa sai (Đáp án đúng: {gameState.lastAnswerResult.revealedAnswer}):</span>
            </div>
            <div className="mt-1 text-ink-300">
              {gameState.lastAnswerResult.explanation}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. PLAYER'S CONTROLS & RUNE BAR                           */}
      {/* ========================================================= */}
      <div className="space-y-3">
        {/* RUNE BAR: 1 Equipped Rune */}
        <div className="p-3 bg-ink-950/85 border border-dusk-900/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-mono text-mauve-300 flex items-center gap-2 pl-1">
              <span className="font-medium">RUNE BẢO MỆNH (1/1):</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {(() => {
              const displaySlots = (you?.runes && you.runes.length > 0)
                ? you.runes
                : you?.chosenRuneId
                ? [{
                    runeId: you.chosenRuneId,
                    usesLeft: 1,
                    active: true,
                    usedThisTurn: you.runeUsedThisTurn,
                    usedInMatch: you.runeUsedInMatch,
                  }]
                : [{
                    runeId: 'rune_shield',
                    usesLeft: 1,
                    active: true,
                    usedThisTurn: false,
                    usedInMatch: false,
                  }];

              return displaySlots.map((slot) => {
                const def = ALL_RUNES.find(r => r.id === slot.runeId);
                if (!def) return null;
                const isOncePerMatch = def.limitType === 'once_per_match';
                const isOncePerTurn = def.limitType === 'once_per_turn';

                const isExhausted = isOncePerMatch
                  ? (slot.usedInMatch || you?.runeUsedInMatch || slot.usesLeft <= 0)
                  : isOncePerTurn
                  ? (slot.usedThisTurn || you?.runeUsedThisTurn || slot.usesLeft <= 0)
                  : false;

                const isClickablePower = ['rune_swap_question', 'rune_purify', 'rune_shield', 'rune_double'].includes(def.id);
                const canUse = isMyTurn && !isGameOver && !isExhausted && isClickablePower;

                return (
                  <div key={slot.runeId} className="flex items-center gap-3 flex-wrap">
                    <button
                      disabled={!canUse}
                      onClick={() => onUseRune(slot.runeId)}
                      title={`${def.name}: ${def.description}`}
style={{ borderColor: !isExhausted ? def.color :'#334155' }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium transition-[color,background-color,border-color,opacity,transform] ${
                        canUse
                          ? 'bg-ink-900 active:scale-95 text-ink-100 ring-1 ring-brass-400/40'
                          : isExhausted
                          ? 'bg-ink-950/60 text-ink-500 opacity-60 cursor-not-allowed border-dashed'
                          : 'bg-ink-950/80 text-ink-300'
                      }`}
                    >
                      <span className="shrink-0"><RuneIcon icon={def.icon} className="w-4 h-4" /></span>
                      <span className="font-medium">{def.name}</span>

                      {/* Status Badge */}
                      {isOncePerMatch ? (
                        isExhausted ? (
                          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-garnet-950/60 border border-garnet-900 text-garnet-400">
                            Đã dùng (Hết trận)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-garnet-950 border border-garnet-500 text-garnet-300">
                            1 lần / Trận
                          </span>
                        )
                      ) : isOncePerTurn ? (
                        isExhausted ? (
                          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-brass-950/60 border border-brass-900 text-brass-500/80">
                            Đã dùng lượt này
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-brass-950 border border-brass-500 text-brass-300">
                            1 lần / Lượt (Sẵn sàng)
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-tide-950 border border-tide-500 text-tide-300">
                          Nội tại toàn trận
                        </span>
                      )}

                      {canUse && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-brass-400 text-on-accent">
                          Bấm dùng
                        </span>
                      )}
                    </button>

                    <div className="text-[11px] text-ink-300 hidden md:block max-w-sm truncate" title={def.description}>
                      <span className="text-brass-400 font-medium">Tác dụng:</span> {def.description}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* DRAW & BANK MAJOR ACTIONS */}
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* DRAW BUTTON (Crown Jewel AAA Button) */}
          <DrawButton
            onClick={onDraw}
            disabled={!isMyTurn || isGameOver || !!gameState.currentQuestion}
          />

          {/* BANK BUTTON */}
          <button
            onClick={onBank}
            disabled={!isMyTurn || isGameOver || !!gameState.currentQuestion || (you?.currentTurnScore || 0) <= 0}
            className={`py-4 px-4 rounded-lg font-medium text-base sm:text-lg flex items-center justify-center gap-3 transition-[color,background-color,border-color,opacity,transform] active:scale-[0.98] ${
              isMyTurn && !gameState.currentQuestion && (you?.currentTurnScore || 0) > 0 && !isGameOver
                ? 'text-white bg-moss-600 hover:bg-moss-500'
                : 'bg-ink-800 text-ink-500 cursor-not-allowed opacity-50'
            }`}
          >
            <Coins className="w-5 h-5 text-brass-300" />
            <span>BANK (+{you?.currentTurnScore || 0}đ)</span>
          </button>
        </div>

        {/* SURRENDER HELPER LINK */}
        {!isGameOver && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setShowSurrenderModal(true)}
              className="inline-flex items-center gap-2 text-xs text-ink-400 hover:text-garnet-300 transition-colors py-1 px-3 rounded-md hover:bg-garnet-950/40 border border-transparent hover:border-garnet-900/40 font-medium"
            >
              <Flag className="w-4 h-4 text-garnet-400" />
              <span>Xin đầu hàng ván này</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. YOU (PLAYER) STATUS BAR                                */}
        {/* ========================================================= */}
        <div className={`p-3 rounded-lg border transition-[color,background-color,border-color,opacity,transform] ${
          isMyTurn ? 'bg-brass-950/30 border-brass-500/70' : 'bg-ink-900/80 border-ink-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-1 bg-ink-950 rounded-md border border-brass-500/40">
                {you?.avatar || '🧙‍♂️'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-brass-200">{you?.name || 'Bạn'}</span>
                  {isMyTurn && (
                    <span className="px-2 py-0.5 bg-brass-400 text-on-accent font-medium text-[11px] rounded">
                      Lượt của bạn
                    </span>
                  )}
                  {/* Defense & Revive Quick Badges */}
                  {(() => {
                    const myRuneId = you?.chosenRuneId || you?.runes?.[0]?.runeId || 'rune_shield';
                    const hasShieldRune = myRuneId === 'rune_shield';
                    const hasReviveRune = myRuneId === 'rune_revive';
                    const hasInsuranceRune = myRuneId === 'rune_insurance';
                    const hasRetryRune = myRuneId === 'rune_retry';
                    const hasImmortalRune = myRuneId === 'rune_immortal';

                    const shieldActive = gameState.activeShield || (hasShieldRune && !you?.runeUsedThisTurn);
                    const reviveActive = hasReviveRune && !you?.runeUsedInMatch;
                    const insuranceActive = hasInsuranceRune && !you?.runeUsedThisTurn;
                    const retryActive = hasRetryRune && !you?.runeUsedThisTurn;
                    const immortalActive = hasImmortalRune && !you?.runeUsedInMatch;

                    return (
                      <>
                        {shieldActive && (
                          <span className="px-2 py-0.5 bg-garnet-900/90 border border-garnet-500 text-garnet-200 font-medium text-[11px] rounded flex items-center gap-1" title="Khiên hộ mệnh sẵn sàng chống 1 lần BUST trùng hệ">
                            <Shield className="w-3 h-3 text-garnet-400" /> Khiên chắn ON
                          </span>
                        )}
                        {hasShieldRune && you?.runeUsedThisTurn && !gameState.activeShield && (
                          <span className="px-2 py-0.5 bg-ink-800 text-ink-400 text-[11px] rounded flex items-center gap-1">
                            <Shield className="w-3 h-3 text-ink-500" /> Khiên: Đã dùng
                          </span>
                        )}

                        {reviveActive && (
                          <span className="px-2 py-0.5 bg-madder-950 border border-madder-500 text-madder-200 font-medium text-[11px] rounded flex items-center gap-1" title="Ấn hồi sinh bảo mệnh sẵn sàng cứu 50% điểm an toàn (1 lần/trận)">
                            <ShieldAlert className="w-3 h-3 text-madder-400" /> Hồi Sinh ON (1/1)
                          </span>
                        )}
                        {hasReviveRune && you?.runeUsedInMatch && (
                          <span className="px-2 py-0.5 bg-ink-800 text-ink-400 text-[11px] rounded flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-ink-500" /> Hồi Sinh: Đã dùng
                          </span>
                        )}

                        {insuranceActive && (
                          <span className="px-2 py-0.5 bg-brass-950 border border-brass-500 text-brass-200 font-medium text-[11px] rounded flex items-center gap-1" title="Khóa bài cao nhất vào kho khi có >= 2 lá">
                            <Lock className="w-3 h-3 text-brass-400" /> Bảo hiểm ON
                          </span>
                        )}

                        {retryActive && (
                          <span className="px-2 py-0.5 bg-blush-950 border border-blush-500 text-blush-200 font-medium text-[11px] rounded flex items-center gap-1" title="Cho phép làm lại câu hỏi toán khi giải sai">
                            <RotateCcw className="w-3 h-3 text-blush-400" /> Sửa sai ON
                          </span>
                        )}

                        {immortalActive && (
                          <span className="px-2 py-0.5 bg-mauve-950 border border-mauve-500 text-mauve-200 font-medium text-[11px] rounded flex items-center gap-1" title="Hồi sinh với 20 HP bảo mệnh khi tử trận">
                            <Crown className="w-3 h-3 text-mauve-400" /> Bất tử ON
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="text-[11px] text-ink-400 flex items-center gap-3 mt-0.5 font-mono">
                  <span> HP: {you?.hp || 100}</span>
                  <span className="text-brass-400 flex items-center gap-1">
                     Kho an toàn:{' '}
                    <AnimatedCounter
                      value={you?.safeScore || 0}
                      suffix="đ"
                      className="text-brass-200 text-sm font-medium"
                      isHighScore={(you?.safeScore || 0) >= 150}
                    />
                  </span>
                </div>
                {(() => {
                  const activeRuneId = you?.chosenRuneId || you?.runes?.[0]?.runeId || 'rune_shield';
                  const rDef = ALL_RUNES.find(r => r.id === activeRuneId);
                  if (!rDef) return null;
                  return (
                    <div className="text-[11px] text-brass-300 flex items-center gap-2 mt-1" title={rDef.persistentEffectDesc || rDef.description}>
                      <RuneIcon icon={rDef.icon || ''} className="w-4 h-4 inline-block" />
                      <span className="font-medium text-brass-400">Nội tại toàn trận: {rDef.name}</span>
                      <span className="text-ink-300 hidden sm:inline">— {rDef.persistentEffectDesc}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-[11px] text-ink-400">Điểm lượt này</div>
              <div className="text-2xl font-medium text-brass-400">
                <AnimatedCounter value={you?.currentTurnScore || 0} prefix="+" />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK 3-STEP GAMEPLAY GUIDE BAR */}
        <div className="p-2 sm:p-3 bg-ink-900/70 border border-ink-800 rounded-lg text-[11px] text-ink-300 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-brass-300 font-medium shrink-0">
            <BookOpen className="w-4 h-4 text-brass-400" />
            <span>Mẹo cách chơi:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-ink-300 text-center sm:text-left">
            <span><strong>1. DRAW:</strong> Rút bài & giải đúng để tích lũy điểm lượt này.</span>
            <span><strong>2. BUST:</strong> Rút trùng hệ đã có trên bàn = Mất trắng điểm lượt!</span>
            <span><strong>3. BANK:</strong> Cất điểm vào Kho an toàn trước khi bị BUST.</span>
          </div>
          <button
            onClick={() => setShowRulesModal(true)}
            className="text-brass-400 underline font-medium hover:text-brass-300 text-[11px] shrink-0"
          >
            Đọc Luật Đầy Đủ &raquo;
          </button>
        </div>
      </div>

      {/* HOW TO PLAY MODAL */}
      <HowToPlayModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />

      {/* ========================================================= */}
      {/* 5. GAME OVER & STUDY STATISTICS MODAL                     */}
      {/* ========================================================= */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-lg bg-ink-900 border border-brass-500 rounded-lg p-6 text-ink-100 overflow-hidden space-y-4">
            <div className="text-center space-y-1">
              <div className="text-5xl">
                {isWinner ? '' : ''}
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium text-gilt-400">
                {isWinner ? 'Chiến thắng huy hoàng' : 'Trận đấu kết thúc'}
              </h2>
              <p className="text-xs text-ink-400">
                {isWinner
                  ? `Chúc mừng! Bạn đã đạt ${you?.safeScore} điểm mục tiêu trước đối thủ!`
                  : `Đối thủ đã chạm mốc điểm chiến thắng trước.`}
              </p>
            </div>

            {/* Study Statistics Breakdown */}
            <div className="p-4 bg-ink-950 rounded-lg border border-ink-800 space-y-3">
              <h4 className="text-xs font-medium text-brass-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-brass-400" />
                <span>Báo cáo thống kê học tập</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2 bg-ink-900 rounded-md">
                  <div className="text-[11px] text-ink-400">Điểm đạt được</div>
                  <div className="text-lg font-medium text-brass-400">{you?.safeScore || 0}</div>
                </div>

                <div className="p-2 bg-ink-900 rounded-md">
                  <div className="text-[11px] text-ink-400">Độ chính xác</div>
                  <div className="text-lg font-medium text-moss-400">
                    {(() => {
                      const total = (you?.stats.correctCount || 0) + (you?.stats.wrongCount || 0);
                      return total > 0 ? Math.round(((you?.stats.correctCount || 0) / total) * 100) : 0;
                    })()}%
                  </div>
                </div>

                <div className="p-2 bg-ink-900 rounded-md">
                  <div className="text-[11px] text-ink-400">Câu đúng</div>
                  <div className="text-lg font-medium text-dusk-300">
                    {you?.stats.correctCount || 0}/{(you?.stats.correctCount || 0) + (you?.stats.wrongCount || 0)}
                  </div>
                </div>

                <div className="p-2 bg-ink-900 rounded-md">
                  <div className="text-[11px] text-ink-400">Số lần bust</div>
                  <div className="text-lg font-medium text-garnet-400">{you?.stats.bustCount || 0}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-ink-800/80 flex items-center justify-between text-xs">
                <span className="text-ink-400">Kinh nghiệm nhận được:</span>
                <span className="font-mono font-medium text-brass-300">
                  +{isWinner ? 100 : 40} XP (+{(you?.stats.correctCount || 0) * 5} XP Toán)
                </span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full py-3 text-on-accent font-medium text-xs sm:text-sm rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95 bg-brass-600 hover:bg-brass-500"
            >
              Về màn hình chính
            </button>
          </div>
        </div>
      )}

      {/* INSPECTED TABLE CARD MODAL */}
      {inspectedTableCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setInspectedTableCard(null)}
              className="absolute -top-3 -right-3 z-20 w-9 h-9 bg-ink-900 border border-ink-700 hover:border-brass-400 text-ink-300 hover:text-white rounded-full flex items-center justify-center transition-[color,background-color,border-color,opacity,transform]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <FlipCardReveal card={inspectedTableCard} autoFlip={false} size="lg" />
              <div className="mt-3 text-center space-y-2">
                <p className="text-xs text-brass-300 font-mono flex items-center justify-center gap-2">
                  <span> Chạm / Nhấp trực tiếp vào thẻ để lật xem cả 2 mặt</span>
                </p>
                <button
                  onClick={() => setInspectedTableCard(null)}
                  className="px-6 py-2 bg-ink-900 hover:bg-ink-800 border border-ink-700 hover:border-brass-400 text-ink-200 font-medium text-xs rounded-md transition-[color,background-color,border-color,opacity,transform] active:scale-95"
                >
                  Đóng chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SURRENDER CONFIRMATION MODAL */}
      {showSurrenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 animate-fadeIn">
          <div className="bg-ink-900 border border-garnet-600/50 rounded-lg max-w-md w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-lg bg-garnet-950/80 border border-garnet-500/40 flex items-center justify-center text-garnet-400">
              <Flag className="w-8 h-8 text-garnet-400" />
            </div>

            <div>
              <h3 className="text-xl font-medium text-garnet-200">
                Xác nhận đầu hàng?
              </h3>
              <p className="text-sm text-ink-300 mt-2 leading-relaxed">
                Bạn có chắc chắn muốn giương cờ trắng đầu hàng ván đấu này không? 
                Chiến thắng sẽ thuộc về <strong className="text-brass-300">{opponent?.name || 'Đối thủ'}</strong> và trận đấu sẽ kết thúc ngay lập tức.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setShowSurrenderModal(false);
                  onSurrender();
                }}
                className="flex-1 py-3 px-4 rounded-md text-white font-medium text-sm transition-[color,background-color,border-color,opacity,transform] flex items-center justify-center gap-2 active:scale-95 bg-garnet-700 hover:bg-garnet-600"
              >
                <Flag className="w-4 h-4" />
                <span>Chấp nhận đầu hàng</span>
              </button>
              <button
                onClick={() => setShowSurrenderModal(false)}
                className="flex-1 py-3 px-4 rounded-md bg-ink-800 hover:bg-ink-700 text-ink-200 font-medium text-sm border border-ink-700 transition-[color,background-color,border-color,opacity,transform] active:scale-95"
              >
                Hủy / tiếp tục quyết đấu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
