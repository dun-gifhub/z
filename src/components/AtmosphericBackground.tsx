import React, { useEffect, useRef, useState } from 'react';

interface AtmosphericBackgroundProps {
  lowGraphics?: boolean;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ lowGraphics = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const mouseSmooth = useRef({ x: 0.5, y: 0.5 });
  const animFrameId = useRef<number | null>(null);

  // Track mouse coordinates normalized (0 to 1) for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas particle system (disabled if lowGraphics)
  useEffect(() => {
    if (lowGraphics) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 45 ambient motes
    const particleCount = Math.min(45, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulse: Math.random() * Math.PI,
      isGold: Math.random() > 0.4,
    }));

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouseSmooth.current.x += (mousePos.x - mouseSmooth.current.x) * 0.05;
      mouseSmooth.current.y += (mousePos.y - mouseSmooth.current.y) * 0.05;

      const parallaxX = (mouseSmooth.current.x - 0.5) * 20;
      const parallaxY = (mouseSmooth.current.y - 0.5) * 20;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x + parallaxX * 0.5, p.y + parallaxY * 0.5, p.size, 0, Math.PI * 2);

        if (p.isGold) {
          ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha})`;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${currentAlpha * 0.8})`;
          ctx.shadowColor = 'rgba(192, 132, 252, 0.6)';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [lowGraphics, mousePos]);

  // Floating math symbols data
  const mathSymbols = [
    { char: 'π', top: '15%', left: '8%', size: 'text-3xl', delay: '0s', dur: '8s' },
    { char: '√x', top: '25%', left: '88%', size: 'text-2xl', delay: '1s', dur: '9s' },
    { char: 'Σ', top: '75%', left: '12%', size: 'text-4xl', delay: '2s', dur: '10s' },
    { char: '∞', top: '65%', left: '84%', size: 'text-3xl', delay: '3s', dur: '7s' },
    { char: '∫', top: '40%', left: '4%', size: 'text-3xl', delay: '1.5s', dur: '11s' },
    { char: 'φ', top: '80%', left: '72%', size: 'text-2xl', delay: '2.5s', dur: '8.5s' },
    { char: 'x²', top: '18%', left: '76%', size: 'text-2xl', delay: '0.5s', dur: '9.5s' },
    { char: '≠', top: '55%', left: '92%', size: 'text-xl', delay: '3.5s', dur: '8s' },
    { char: '±', top: '88%', left: '38%', size: 'text-2xl', delay: '1.2s', dur: '10.5s' },
  ];

  const mouseOffsetX = (mousePos.x - 0.5) * 15;
  const mouseOffsetY = (mousePos.y - 0.5) * 15;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* LAYER 1: Deep Nebula Gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 15%, rgba(67, 56, 202, 0.18), transparent 70%), radial-gradient(ellipse 70% 60% at 85% 80%, rgba(147, 51, 234, 0.14), transparent 60%), radial-gradient(ellipse 60% 50% at 15% 75%, rgba(14, 165, 233, 0.12), transparent 60%)',
        }}
      />

      {/* LAYER 2: Canvas Particles (60fps) */}
      {!lowGraphics && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />}

      {/* LAYER 3: Floating Math Glyphs */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mouseOffsetX * 0.4}px, ${mouseOffsetY * 0.4}px)`,
        }}
      >
        {mathSymbols.map((s, idx) => (
          <div
            key={idx}
            className={`absolute font-cinzel font-bold text-amber-300/15 ${s.size} select-none animate-float-slow`}
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.dur,
              textShadow: '0 0 15px rgba(245, 158, 11, 0.15)',
            }}
          >
            {s.char}
          </div>
        ))}
      </div>

      {/* LAYER 4: Sacred Geometry Magic Circles */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mouseOffsetX * 0.7}px, ${mouseOffsetY * 0.7}px)`,
        }}
      >
        {/* Outer Ring */}
        <div className="w-[680px] h-[680px] rounded-full border border-amber-500/10 border-dashed animate-rune-spin flex items-center justify-center">
          {/* Middle Triangle & Ring */}
          <div className="w-[520px] h-[520px] rounded-full border border-indigo-500/15 animate-rune-spin-reverse flex items-center justify-center">
            {/* Inner Sacred Octagon */}
            <div className="w-[360px] h-[360px] rounded-full border-2 border-purple-500/20 border-dotted animate-pulse" />
          </div>
        </div>
      </div>

      {/* LAYER 5: Mouse Spotlight Rim Beam */}
      {!lowGraphics && (
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-transform duration-150 ease-out"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${mousePos.x * window.innerWidth - 300}px, ${
              mousePos.y * window.innerHeight - 300
            }px)`,
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(245, 158, 11, 0.04) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      )}
    </div>
  );
};
