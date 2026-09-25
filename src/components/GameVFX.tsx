import React, { useEffect, useRef } from 'react';

export interface VFXEvent {
  id: string;
  type: 'bust' | 'bank' | 'correct' | 'card_reveal' | 'rune_cast';
  score?: number;
}

interface GameVFXProps {
  event: VFXEvent | null;
  onEventComplete?: (id: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  char?: string;
  shape?: 'circle' | 'square' | 'char' | 'spark';
}

export const GameVFX: React.FC<GameVFXProps> = ({ event, onEventComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!event) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const newParticles: Particle[] = [];

    if (event.type === 'bust') {
      // 1. EXPLOSIVE BUST: 120 particles of fire, embers, smoke, and shattered red crystals
      const colors = ['#ef4444', '#f97316', '#dc2626', '#fbbf24', '#ffffff', '#7f1d1d'];
      for (let i = 0; i < 110; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 16;
        newParticles.push({
          x: cx + (Math.random() - 0.5) * 60,
          y: cy + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 4), // upward blast
          size: 4 + Math.random() * 9,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.025,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.4 ? 'square' : 'circle',
        });
      }
    } else if (event.type === 'bank') {
      // 2. CELEBRATORY BANK: 90 glittering gold coins, stars, and currency sparks
      const goldColors = ['#f59e0b', '#fbbf24', '#fef08a', '#10b981', '#34d399', '#ffffff'];
      for (let i = 0; i < 90; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8; // fountain upwards
        const speed = 6 + Math.random() * 14;
        newParticles.push({
          x: cx + (Math.random() - 0.5) * 80,
          y: cy + 100,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 8,
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          alpha: 1,
          decay: 0.012 + Math.random() * 0.018,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: 'circle',
        });
      }
    } else if (event.type === 'correct') {
      // 3. MATH GLYPH BURST: Flying mathematical symbols in golden/cyan aura
      const mathGlyphs = ['√', 'π', '∑', '∞', '²', '7', 'x', '+', '∫', '∆'];
      const colors = ['#10b981', '#34d399', '#fbbf24', '#38bdf8', '#a855f7'];
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 10;
        newParticles.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 14 + Math.random() * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.1,
          char: mathGlyphs[Math.floor(Math.random() * mathGlyphs.length)],
          shape: 'char',
        });
      }
    } else if (event.type === 'card_reveal') {
      // 4. CARD REVEAL PRISMATIC NOVA: Radiant rays & sparkles
      const holoColors = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#ffffff'];
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        newParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 6,
          color: holoColors[Math.floor(Math.random() * holoColors.length)],
          alpha: 1,
          decay: 0.025 + Math.random() * 0.03,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.4,
          shape: 'spark',
        });
      }
    }

    particlesRef.current.push(...newParticles);

    if (onEventComplete) {
      setTimeout(() => onEventComplete(event.id), 1200);
    }
  }, [event, onEventComplete]);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'char' && p.char) {
          ctx.font = `bold ${p.size}px monospace`;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.char, 0, 0);
        } else if (p.shape === 'spark') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 2);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size * 2);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
