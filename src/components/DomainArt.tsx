import React from 'react';
import { MathCategory } from '../../shared/types.ts';

interface DomainArtProps {
  category: MathCategory | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const DomainArt: React.FC<DomainArtProps> = ({ category, className = '', size = 'md' }) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { w: 48, h: 48, viewBox: '0 0 100 100' };
      case 'md':
        return { w: 96, h: 96, viewBox: '0 0 100 100' };
      case 'lg':
        return { w: 140, h: 140, viewBox: '0 0 100 100' };
      case 'hero':
        return { w: 180, h: 180, viewBox: '0 0 100 100' };
      default:
        return { w: 96, h: 96, viewBox: '0 0 100 100' };
    }
  };

  const { w, h, viewBox } = getDimensions();

  switch (category) {
    // 1. NGUYÊN TỐ (Prime Core): Solar fire core, orbiting atomic ring with primes 2, 3, 5, 7, 11
    case 'NGUYEN_TO':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="primeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="85%" stopColor="#991b1b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="primeRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          {/* Outer runic orbit */}
          <circle cx="50" cy="50" r="44" stroke="url(#primeRing)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="50" cy="50" r="38" stroke="#f87171" strokeWidth="1" opacity="0.4" />
          {/* Flame aura core */}
          <circle cx="50" cy="50" r="30" fill="url(#primeGlow)" />
          {/* Central Prime Star Polygon */}
          <polygon
            points="50,18 58,38 78,38 62,50 68,70 50,58 32,70 38,50 22,38 42,38"
            fill="#fee2e2"
            stroke="#ef4444"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Orbiting celestial prime nodes */}
          <circle cx="50" cy="8" r="4.5" fill="#f87171" stroke="#fff" strokeWidth="1" />
          <circle cx="88" cy="38" r="3.5" fill="#f87171" stroke="#fff" strokeWidth="1" />
          <circle cx="78" cy="82" r="3" fill="#ef4444" stroke="#fff" strokeWidth="0.8" />
          <circle cx="22" cy="82" r="3" fill="#ef4444" stroke="#fff" strokeWidth="0.8" />
          <circle cx="12" cy="38" r="3.5" fill="#f87171" stroke="#fff" strokeWidth="1" />
          {/* Central glyph symbol P */}
          <text x="50" y="55" textAnchor="middle" fill="#7f1d1d" fontSize="16" fontWeight="900" fontFamily="Cinzel, serif">
            ℙ
          </text>
        </svg>
      );

    // 2. CHÍNH PHƯƠNG (Perfect Square): Sacred geometric rotating squares & square root cube
    case 'CHINH_PHUONG':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(249,115,22,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="squareGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="45" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
          <circle cx="50" cy="50" r="32" fill="url(#squareGlow)" />
          {/* 3 Interlocking Geometric Squares */}
          <rect x="24" y="24" width="52" height="52" stroke="#fdba74" strokeWidth="1.5" rx="4" transform="rotate(0 50 50)" fill="#ffedd5" fillOpacity="0.1" />
          <rect x="24" y="24" width="52" height="52" stroke="#ea580c" strokeWidth="1.5" rx="4" transform="rotate(45 50 50)" fill="#ea580c" fillOpacity="0.08" />
          <rect x="29" y="29" width="42" height="42" stroke="#fed7aa" strokeWidth="1" rx="2" transform="rotate(22.5 50 50)" />
          {/* Matrix Grid Dots */}
          <circle cx="38" cy="38" r="2.5" fill="#fff" />
          <circle cx="62" cy="38" r="2.5" fill="#fff" />
          <circle cx="38" cy="62" r="2.5" fill="#fff" />
          <circle cx="62" cy="62" r="2.5" fill="#fff" />
          {/* Center Power Glyph x² */}
          <text x="50" y="56" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="JetBrains Mono, monospace">
            x²
          </text>
        </svg>
      );

    // 3. ĐẠI SỐ (Algebra Rune): Alchemical compass with variable x and coordinate axis
    case 'DAI_SO':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(234,179,8,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="algebraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#ca8a04" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#713f12" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
          <circle cx="50" cy="50" r="34" fill="url(#algebraGlow)" />
          {/* Astrolabe Axis Cross */}
          <line x1="50" y1="12" x2="50" y2="88" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
          <line x1="12" y1="50" x2="88" y2="50" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
          {/* Diamond Compass Frame */}
          <polygon points="50,16 84,50 50,84 16,50" stroke="#eab308" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="#fef08a" strokeWidth="1.5" fill="#854d0e" fillOpacity="0.3" />
          {/* Variable X Symbol */}
          <text x="50" y="57" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900" fontFamily="Cinzel, serif">
            χ
          </text>
        </svg>
      );

    // 4. KHAI CĂN (Radical Root): Ancient mystic root tree & glowing radical symbol √
    case 'KHAI_CAN':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(132,204,22,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d9f99d" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#84cc16" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#365314" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <circle cx="50" cy="50" r="32" fill="url(#rootGlow)" />
          {/* Bioluminescent Root Tendrils */}
          <path d="M50 20 Q56 36 68 44 Q76 52 82 72" stroke="#65a30d" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M50 20 Q44 36 32 44 Q24 52 18 72" stroke="#65a30d" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M50 45 Q50 65 50 82" stroke="#84cc16" strokeWidth="2.5" fill="none" />
          {/* Sacred Radical Square Root Sign */}
          <path
            d="M26 54 L34 54 L44 76 L62 26 L80 26"
            stroke="#f7fee7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="68" cy="46" r="3" fill="#a3e635" />
          <circle cx="76" cy="46" r="3" fill="#bef264" />
        </svg>
      );

    // 5. LŨY THỪA (Exponent Bolt): Crackling lightning plasma arc surging upwards
    case 'LUY_THUA':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(16,185,129,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="expoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 2" opacity="0.6" />
          <circle cx="50" cy="50" r="33" fill="url(#expoGlow)" />
          {/* Dual Lightning Surge */}
          <polygon
            points="54,12 30,50 48,50 40,88 72,42 52,42"
            fill="#ecfdf5"
            stroke="#059669"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Electric Spark Orbs */}
          <circle cx="22" cy="30" r="2.5" fill="#6ee7b7" />
          <circle cx="78" cy="30" r="3" fill="#6ee7b7" />
          <circle cx="76" cy="74" r="2" fill="#34d399" />
          <circle cx="24" cy="74" r="2" fill="#34d399" />
        </svg>
      );

    // 6. ÂM SỐ (Negative Void): Deep celestial singularity wormhole & minus polarity
    case 'AM_SO':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="voidGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#083344" stopOpacity="1" />
              <stop offset="45%" stopColor="#0e7490" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Outer Accretion Disk */}
          <circle cx="50" cy="50" r="44" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
          <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#67e8f9" strokeWidth="1.5" transform="rotate(-25 50 50)" opacity="0.7" />
          <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#0891b2" strokeWidth="1.5" transform="rotate(25 50 50)" opacity="0.5" />
          {/* Dark Singularity Center */}
          <circle cx="50" cy="50" r="24" fill="url(#voidGlow)" stroke="#67e8f9" strokeWidth="2" />
          {/* Negative Sign Monolith */}
          <line x1="32" y1="50" x2="68" y2="50" stroke="#ecfeff" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="6" fill="#083344" stroke="#cffafe" strokeWidth="1.5" />
        </svg>
      );

    // 7. CHIA HẾT (Divisibility Ray): Crystal laser prism splitting into harmonic rays
    case 'CHIA_HET':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="divGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6 2" opacity="0.6" />
          <circle cx="50" cy="50" r="32" fill="url(#divGlow)" />
          {/* Ray bundle from left to right */}
          <line x1="14" y1="50" x2="42" y2="50" stroke="#dbeafe" strokeWidth="3" />
          {/* Prism triangle */}
          <polygon points="50,22 68,66 32,66" stroke="#93c5fd" strokeWidth="2" fill="#1e40af" fillOpacity="0.4" />
          {/* Refracted Harmonic Rays */}
          <line x1="56" y1="46" x2="86" y2="28" stroke="#93c5fd" strokeWidth="2" strokeDasharray="2 1" />
          <line x1="58" y1="50" x2="88" y2="50" stroke="#bfdbfe" strokeWidth="2.5" />
          <line x1="56" y1="54" x2="86" y2="72" stroke="#60a5fa" strokeWidth="2" strokeDasharray="2 1" />
          {/* Division Symbol dots */}
          <circle cx="50" cy="34" r="3" fill="#fff" />
          <circle cx="50" cy="58" r="3" fill="#fff" />
        </svg>
      );

    // 8. PHÂN SỐ (Fraction Shard): Sacred geometry crystal split into proportional parts
    case 'PHAN_SO':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(139,92,246,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="fracGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <circle cx="50" cy="50" r="33" fill="url(#fracGlow)" />
          {/* Top Hex Shard */}
          <polygon points="50,16 66,32 50,42 34,32" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5" />
          {/* Golden Fraction Bar */}
          <rect x="20" y="47" width="60" height="6" rx="3" fill="#f5f3ff" stroke="#6d28d9" strokeWidth="1.5" />
          {/* Bottom Hex Shard */}
          <polygon points="50,58 66,68 50,84 34,68" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5" />
          {/* Numerator / Denominator nodes */}
          <circle cx="50" cy="29" r="3" fill="#fff" />
          <circle cx="50" cy="71" r="3" fill="#fff" />
        </svg>
      );

    // 9. TUYỆT ĐỐI (Absolute Shield): Prismatic Aegis warding against all negative forces
    case 'TUYET_DOI':
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(217,70,239,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="absGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#d946ef" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#701a75" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#e879f9" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
          <circle cx="50" cy="50" r="34" fill="url(#absGlow)" />
          {/* Royal Aegis Shield Silhouette */}
          <path
            d="M50 16 L76 26 C76 56 50 82 50 84 C50 82 24 56 24 26 Z"
            fill="#fae8ff"
            fillOpacity="0.3"
            stroke="#d946ef"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Vertical Modulus Bars | x | */}
          <line x1="38" y1="36" x2="38" y2="64" stroke="#fdf4ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="36" x2="62" y2="64" stroke="#fdf4ff" strokeWidth="3" strokeLinecap="round" />
          <text x="50" y="56" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900" fontFamily="Cinzel, serif">
            x
          </text>
        </svg>
      );

    // 10. ƯỚC & BỘI (Factor & Multi): Celestial constellation web of interconnected nodes
    case 'UOC_BOI':
    default:
      return (
        <svg
          width={w}
          height={h}
          viewBox={viewBox}
          className={`drop-shadow-[0_0_12px_rgba(236,72,153,0.6)] ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="gcdGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#ec4899" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#831843" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="50" cy="50" r="33" fill="url(#gcdGlow)" />
          {/* Mathematical Star Web (Factorization lattice) */}
          <polygon points="50,18 78,38 68,74 32,74 22,38" stroke="#f9a8d4" strokeWidth="1.5" fill="none" />
          <polygon points="50,82 78,62 68,26 32,26 22,62" stroke="#db2777" strokeWidth="1.5" fill="#fdf2f8" fillOpacity="0.15" />
          {/* Constellation Nodes */}
          <circle cx="50" cy="18" r="4" fill="#fff" stroke="#ec4899" strokeWidth="1.5" />
          <circle cx="78" cy="38" r="3.5" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
          <circle cx="68" cy="74" r="3.5" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
          <circle cx="32" cy="74" r="3.5" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
          <circle cx="22" cy="38" r="3.5" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
          <circle cx="50" cy="50" r="6" fill="#fff" stroke="#be185d" strokeWidth="2" />
        </svg>
      );
  }
};
