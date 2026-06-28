import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import { 
  GraduationCap, Calculator, Scale, Compass, Calendar, 
  BookOpen, FileText, Lock, TrendingUp, Search, Sparkles 
} from 'lucide-react';

export default function EduAnimation({ type = 'landing' }) {
  const containerRef = useRef(null);
  const [lottieData, setLottieData] = useState(null);

  // Attempt to fetch standard public Lottie JSON data for specific tabs
  useEffect(() => {
    let url = '';
    if (type === 'calc-lottie') {
      url = 'https://assets9.lottiefiles.com/packages/lf20_q518a3kb.json'; // Math calculator
    } else if (type === 'search-lottie') {
      url = 'https://assets10.lottiefiles.com/packages/lf20_dmx48bep.json'; // Search/magnifying glass
    }

    if (url) {
      fetch(url)
        .then(res => res.json())
        .then(data => setLottieData(data))
        .catch(err => console.log('Lottie fetch failed, using SVG fallback:', err));
    }
  }, [type]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // ─── Type-Specific GSAP Animations ───
      
      if (type === 'calculator') {
        // Floating numbers & operator symbols
        gsap.to('.calc-symbol', {
          y: '-=15',
          opacity: 0.8,
          rotation: '+=30',
          duration: 'random(2, 3)',
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.4, from: 'random' },
          ease: 'sine.inOut'
        });
        gsap.to('.calc-screen', {
          opacity: 0.4,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }

      else if (type === 'compare') {
        // Balance scale tilting
        gsap.to('.scale-beam', {
          rotation: 8,
          transformOrigin: '50% 50%',
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.scale-pan-left', {
          y: -4,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.scale-pan-right', {
          y: 4,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      else if (type === 'recommend') {
        // Rotating radar sweeps & matching nodes pulsing
        gsap.to('.radar-sweep', {
          rotation: 360,
          transformOrigin: '50% 50%',
          duration: 4,
          repeat: -1,
          ease: 'none'
        });
        gsap.to('.radar-node', {
          scale: 1.5,
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 1.5,
          repeat: -1,
          stagger: 0.5,
          ease: 'power1.out'
        });
      }

      else if (type === 'dates') {
        // Calendar page sheet folding / flipping
        gsap.to('.calendar-sheet', {
          skewX: -5,
          scaleY: 0.9,
          transformOrigin: '50% 0%',
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.calendar-clock', {
          rotation: 360,
          transformOrigin: '50% 50%',
          duration: 12,
          repeat: -1,
          ease: 'none'
        });
      }

      else if (type === 'guide') {
        // Turning book pages
        gsap.to('.book-page-right', {
          scaleX: 0,
          transformOrigin: '0% 50%',
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        gsap.to('.book-glow', {
          opacity: 0.6,
          scale: 1.1,
          transformOrigin: '50% 50%',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      else if (type === 'syllabus') {
        // Exam test paper pencil writing & checkmarks
        gsap.to('.pencil', {
          x: '+=10',
          y: '-=5',
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.fromTo('.checkmark', 
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1, repeat: -1, yoyo: true, stagger: 0.4 }
        );
      }

      else if (type === 'portal') {
        // Rotating secure key inside lock shield
        gsap.to('.portal-key', {
          rotation: 25,
          transformOrigin: '50% 50%',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        gsap.to('.portal-shield', {
          y: -4,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      else if (type === 'tracker') {
        // Graph dots blinks & grid lines draw
        gsap.fromTo('.tracker-line', 
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: 2.5, repeat: -1, ease: 'power1.inOut' }
        );
        gsap.to('.tracker-dot', {
          r: 6,
          fill: '#00FFB3',
          duration: 1,
          repeat: -1,
          yoyo: true,
          stagger: 0.3
        });
      }

      else if (type === 'search') {
        // Scanner bars sweep across searching
        gsap.to('.search-glass', {
          x: '+=8',
          y: '+=8',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.search-rings', {
          scale: 1.3,
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 1.5,
          repeat: -1,
          ease: 'power1.out'
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [type]);

  // Handle Lottie loading
  if (lottieData) {
    return (
      <div className="w-full h-full flex items-center justify-center max-w-[200px] mx-auto">
        <Lottie animationData={lottieData} loop={true} />
      </div>
    );
  }

  // ─── Custom Interactive Landing Journey Simulator ───
  if (type === 'landing') {
    const handleSimulateJourney = () => {
      const tl = gsap.timeline();
      
      // Reset path
      gsap.set('.journey-progress', { strokeDashoffset: 864 });
      gsap.set('.node-circle', { fill: '#0A1128', stroke: '#4B5563', scale: 1 });
      gsap.set('.node-dot', { fill: '#4B5563', scale: 1 });
      gsap.set('.corner-bracket', { stroke: '#7B61FF', opacity: 0.4, scale: 1 });
      gsap.set('.uni-target', { scale: 1 });
      gsap.set('.success-cap', { y: 0, opacity: 0, rotation: 0 });
      gsap.set('.success-text', { opacity: 0, scale: 0.8 });
      gsap.set('.sparkle-stars', { opacity: 0, scale: 0.5 });

      // Run simulation timeline
      tl.to('.journey-progress', { strokeDashoffset: 648, duration: 0.8, ease: 'power1.inOut' }) // up to matric
        .to('.node-matric .node-circle', { fill: '#0B5D56', stroke: '#14B8A6', scale: 1.15, duration: 0.3, ease: 'back.out' })
        .to('.node-matric .node-dot', { fill: '#14B8A6', scale: 1.2, duration: 0.3, ease: 'back.out' }, '-=0.3')
        .to('.node-matric .corner-bracket', { stroke: '#14B8A6', opacity: 1, scale: 1.2, duration: 0.3 }, '-=0.3')
        
        .to('.journey-progress', { strokeDashoffset: 432, duration: 0.8, ease: 'power1.inOut' }) // up to fsc
        .to('.node-fsc .node-circle', { fill: '#0B5D56', stroke: '#14B8A6', scale: 1.15, duration: 0.3, ease: 'back.out' })
        .to('.node-fsc .node-dot', { fill: '#14B8A6', scale: 1.2, duration: 0.3, ease: 'back.out' }, '-=0.3')
        .to('.node-fsc .corner-bracket', { stroke: '#14B8A6', opacity: 1, scale: 1.2, duration: 0.3 }, '-=0.3')
        
        .to('.journey-progress', { strokeDashoffset: 216, duration: 0.8, ease: 'power1.inOut' }) // up to test
        .to('.node-test .node-circle', { fill: '#0B5D56', stroke: '#14B8A6', scale: 1.15, duration: 0.3, ease: 'back.out' })
        .to('.node-test .node-dot', { fill: '#14B8A6', scale: 1.2, duration: 0.3, ease: 'back.out' }, '-=0.3')
        .to('.node-test .corner-bracket', { stroke: '#14B8A6', opacity: 1, scale: 1.2, duration: 0.3 }, '-=0.3')
        
        .to('.journey-progress', { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }) // up to uni
        .to('.uni-target', { scale: 1.15, duration: 0.4, ease: 'back.out' })
        .to('.success-cap', { y: -45, opacity: 1, rotation: 360, duration: 0.8, ease: 'back.out' })
        .to('.success-text', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' }, '-=0.4')
        .to('.sparkle-stars', { opacity: 1, scale: 1.3, duration: 0.4, stagger: 0.1, ease: 'elastic.out' }, '-=0.6');
    };

    return (
      <div ref={containerRef} className="flat-card p-6 w-full text-center space-y-6 select-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <span className="px-3 py-1 bg-gold/15 border border-gold/30 rounded-full text-[10px] font-black uppercase text-black dark:text-gold tracking-widest inline-flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Admission Journey
          </span>
          <h3 className="text-base font-black text-ink dark:text-white uppercase tracking-wider">Simulate Your Seat Allocation</h3>
          <p className="text-xs text-muted dark:text-gray-400 font-medium max-w-sm mx-auto">
            See how your aggregates map directly to the gate of Pakistan's premier universities!
          </p>
        </div>

        {/* The vector map */}
        <div className="relative w-full bg-gray-50/50 dark:bg-white/[0.01] border border-border dark:border-white/5 rounded-2xl p-4 overflow-hidden">
          <svg className="w-full h-auto block" viewBox="0 0 960 140" fill="none">
            {/* Definitions for Glow & Gradients */}
            <defs>
              <pattern id="figma-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="rgba(0,0,0,0.06)" className="dark:fill-white/5" />
              </pattern>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="figma-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B61FF" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
            </defs>

            {/* Grid Pattern Background */}
            <rect width="100%" height="100%" fill="url(#figma-grid)" />

            {/* Connecting Paths (Straight Line) */}
            <path 
              d="M 48 80 L 912 80" 
              stroke="#D1D5DB" 
              className="dark:stroke-gray-700" 
              strokeWidth="3" 
              strokeDasharray="8 8"
              strokeLinecap="round" 
            />
            <path 
              d="M 48 80 L 912 80" 
              stroke="url(#figma-grad)" 
              strokeWidth="5" 
              strokeLinecap="round"
              className="journey-progress"
              strokeDasharray="864"
              strokeDashoffset="864"
              filter="url(#neon-glow)"
            />

            {/* ═══ Node 1: START — Pill/Capsule with Play Icon ═══ */}
            <g className="node-start-group cursor-pointer" transform="translate(48, 80)">
              {/* Glow ring */}
              <ellipse cx="0" cy="0" rx="32" ry="20" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="4 3" opacity="0.3" className="animate-pulse" />
              {/* Pill shape */}
              <rect x="-26" y="-14" width="52" height="28" rx="14" fill="#0A1128" stroke="#10B981" strokeWidth="2.5" className="node-circle transition-all duration-300" />
              {/* Play triangle */}
              <polygon points="-4,-7 8,0 -4,7" fill="#10B981" className="node-dot transition-all duration-300" />
              {/* Figma resize handles */}
              <circle cx="-26" cy="0" r="2.5" fill="#10B981" opacity="0.5" className="corner-bracket" />
              <circle cx="26" cy="0" r="2.5" fill="#10B981" opacity="0.5" className="corner-bracket" />
            </g>
            <g transform="translate(48, 42)">
              <rect x="-24" y="-14" width="48" height="16" rx="4" fill="#10B981" />
              <polygon points="0,2 -4,-2 4,-2" fill="#10B981" />
              <text x="0" y="-4" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">START</text>
            </g>
            
            {/* ═══ Node 2: MATRIC — Diamond (Rotated Square) with Book Icon ═══ */}
            <g className="milestone-node node-matric cursor-pointer" transform="translate(264, 80)">
              <circle cx="0" cy="0" r="28" fill="rgba(123, 97, 255, 0.06)" className="hover-ring opacity-0 transition-opacity duration-300" />
              {/* Diamond shape */}
              <rect x="-17" y="-17" width="34" height="34" rx="4" fill="#0A1128" stroke="#7B61FF" strokeWidth="2.5" transform="rotate(45)" className="node-circle transition-all duration-300" />
              {/* Book icon inside */}
              <path d="M -7 -5 L 0 -8 L 7 -5 L 7 6 L 0 3 L -7 6 Z" fill="none" stroke="#7B61FF" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              <line x1="0" y1="-8" x2="0" y2="3" stroke="#7B61FF" strokeWidth="1" className="node-dot transition-all duration-300" />
              {/* Diamond corner handles */}
              <circle cx="0" cy="-24" r="2.5" fill="#7B61FF" opacity="0.5" className="corner-bracket" />
              <circle cx="24" cy="0" r="2.5" fill="#7B61FF" opacity="0.5" className="corner-bracket" />
              <circle cx="0" cy="24" r="2.5" fill="#7B61FF" opacity="0.5" className="corner-bracket" />
              <circle cx="-24" cy="0" r="2.5" fill="#7B61FF" opacity="0.5" className="corner-bracket" />
            </g>
            <g transform="translate(264, 36)">
              <rect x="-32" y="-15" width="64" height="18" rx="4" fill="#7B61FF" />
              <polygon points="0,3 -4,-1 4,-1" fill="#7B61FF" />
              <text x="0" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">MATRIC</text>
            </g>

            {/* ═══ Node 3: FSC — Rounded Square Card with Layers Icon ═══ */}
            <g className="milestone-node node-fsc cursor-pointer" transform="translate(480, 80)">
              <circle cx="0" cy="0" r="28" fill="rgba(236, 72, 153, 0.06)" className="hover-ring opacity-0 transition-opacity duration-300" />
              {/* Rounded square */}
              <rect x="-18" y="-18" width="36" height="36" rx="8" fill="#0A1128" stroke="#EC4899" strokeWidth="2.5" className="node-circle transition-all duration-300" />
              {/* Layers/Stack icon */}
              <path d="M 0 -8 L 10 -3 L 0 2 L -10 -3 Z" fill="none" stroke="#EC4899" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              <path d="M -10 0 L 0 5 L 10 0" fill="none" stroke="#EC4899" strokeWidth="1.3" opacity="0.7" className="node-dot transition-all duration-300" />
              <path d="M -10 3 L 0 8 L 10 3" fill="none" stroke="#EC4899" strokeWidth="1.1" opacity="0.5" className="node-dot transition-all duration-300" />
              {/* Square corner brackets */}
              <path d="M -18 -10 L -18 -18 L -10 -18" stroke="#EC4899" strokeWidth="1.5" className="corner-bracket opacity-50" />
              <path d="M 10 -18 L 18 -18 L 18 -10" stroke="#EC4899" strokeWidth="1.5" className="corner-bracket opacity-50" />
              <path d="M 18 10 L 18 18 L 10 18" stroke="#EC4899" strokeWidth="1.5" className="corner-bracket opacity-50" />
              <path d="M -10 18 L -18 18 L -18 10" stroke="#EC4899" strokeWidth="1.5" className="corner-bracket opacity-50" />
            </g>
            <g transform="translate(480, 36)">
              <rect x="-20" y="-15" width="40" height="18" rx="4" fill="#EC4899" />
              <polygon points="0,3 -4,-1 4,-1" fill="#EC4899" />
              <text x="0" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">FSC</text>
            </g>

            {/* ═══ Node 4: ENTRY TEST — Octagon with Crosshair Icon ═══ */}
            <g className="milestone-node node-test cursor-pointer" transform="translate(696, 80)">
              <circle cx="0" cy="0" r="28" fill="rgba(245, 158, 11, 0.06)" className="hover-ring opacity-0 transition-opacity duration-300" />
              {/* Octagon shape */}
              <polygon 
                points="10,-20 20,-10 20,10 10,20 -10,20 -20,10 -20,-10 -10,-20" 
                fill="#0A1128" 
                stroke="#F59E0B" 
                strokeWidth="2.5"
                className="node-circle transition-all duration-300"
              />
              {/* Crosshair/Target icon */}
              <circle cx="0" cy="0" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              <circle cx="0" cy="0" r="3" fill="#F59E0B" className="node-dot transition-all duration-300" />
              <line x1="0" y1="-12" x2="0" y2="-8" stroke="#F59E0B" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              <line x1="0" y1="8" x2="0" y2="12" stroke="#F59E0B" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              <line x1="-12" y1="0" x2="-8" y2="0" stroke="#F59E0B" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              <line x1="8" y1="0" x2="12" y2="0" stroke="#F59E0B" strokeWidth="1.5" className="node-dot transition-all duration-300" />
              {/* Octagon vertex handles */}
              <circle cx="10" cy="-20" r="2" fill="#F59E0B" opacity="0.4" className="corner-bracket" />
              <circle cx="-10" cy="-20" r="2" fill="#F59E0B" opacity="0.4" className="corner-bracket" />
              <circle cx="10" cy="20" r="2" fill="#F59E0B" opacity="0.4" className="corner-bracket" />
              <circle cx="-10" cy="20" r="2" fill="#F59E0B" opacity="0.4" className="corner-bracket" />
            </g>
            <g transform="translate(696, 36)">
              <rect x="-40" y="-15" width="80" height="18" rx="4" fill="#F59E0B" />
              <polygon points="0,3 -4,-1 4,-1" fill="#F59E0B" />
              <text x="0" y="-3" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">ENTRY TEST</text>
            </g>

            {/* ═══ Node 5: UNI SEAT — Glowing Hexagon Badge ═══ */}
            <g className="uni-target cursor-pointer" transform="translate(912, 80)">
              {/* Glowing aura */}
              <circle cx="0" cy="0" r="38" fill="url(#figma-grad)" opacity="0.15" className="animate-pulse" />
              {/* Outer Figma Ring */}
              <circle cx="0" cy="0" r="30" stroke="url(#figma-grad)" strokeWidth="1" strokeDasharray="3 3" />
              {/* Hexagon Badge shape */}
              <path 
                d="M 0 -22 L 19 -11 L 19 11 L 0 22 L -19 11 L -19 -11 Z" 
                fill="#0A1128" 
                stroke="url(#figma-grad)" 
                strokeWidth="2.5" 
              />
              {/* Target Symbol (Graduation Cap Outline) */}
              <path 
                d="M -9 -3 L 0 -8 L 9 -3 L 0 2 Z M -9 -3 L -9 3 C -9 5 9 5 9 3 L 9 -3" 
                fill="none" 
                stroke="#00F0FF" 
                strokeWidth="1.8" 
              />
            </g>
            <g transform="translate(912, 32)">
              <rect x="-36" y="-15" width="72" height="18" rx="4" fill="#0B5D56" />
              <polygon points="0,3 -4,-1 4,-1" fill="#0B5D56" />
              <text x="0" y="-3" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="black" fontFamily="monospace" letterSpacing="0.5">UNI SEAT</text>
            </g>

            {/* Floating graduation cap to fly up */}
            <g transform="translate(912, 35)" className="success-cap opacity-0">
              <polygon points="0,-8 10,-13 0,-18 -10,-13" fill="#0B5D56" />
              <rect x="-1" y="-8" width="2" height="6" fill="#0B5D56" />
              <line x1="0" y1="-8" x2="6" y2="-4" stroke="#D97706" strokeWidth="1" />
            </g>

            {/* Sparkles / Stars */}
            <g className="sparkle-stars opacity-0" transform="translate(912, 50)">
              <circle cx="-15" cy="-10" r="2" fill="#FBBF24" />
              <circle cx="15" cy="-20" r="1.5" fill="#34D399" />
              <circle cx="25" cy="5" r="2.5" fill="#0B5D56" />
            </g>
          </svg>

          {/* Success Banner */}
          <div className="success-text opacity-0 absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
            <div className="space-y-1 p-3">
              <p className="text-sm font-black text-white uppercase tracking-wider font-kingsman">Seat Secured!</p>
              <p className="text-[10px] text-white/80 font-semibold">Aggregate Feasible for Admission 2026</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSimulateJourney}
          className="px-6 py-2.5 bg-ink hover:bg-gold text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 w-full font-sans"
        >
          Simulate Admissions Journey
        </button>
      </div>
    );
  }

  // ─── Standard Educational SVG Animations ───
  return (
    <div ref={containerRef} className="w-20 h-20 flex items-center justify-center bg-black/5 dark:bg-gold/10 rounded-2xl border border-black/10 dark:border-gold/25 relative shrink-0">
      
      {type === 'calculator' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="8" y="4" width="32" height="40" rx="4" />
          <line x1="14" y1="12" x2="34" y2="12" className="calc-screen" strokeWidth="4" />
          {/* Operator Symbols floating */}
          <text x="14" y="24" className="calc-symbol font-sans fill-current text-[10px] stroke-none">+</text>
          <text x="24" y="24" className="calc-symbol font-sans fill-current text-[10px] stroke-none">-</text>
          <text x="34" y="24" className="calc-symbol font-sans fill-current text-[10px] stroke-none">×</text>
          <text x="14" y="34" className="calc-symbol font-sans fill-current text-[10px] stroke-none">÷</text>
          <text x="24" y="34" className="calc-symbol font-sans fill-current text-[10px] stroke-none">%</text>
          <text x="34" y="34" className="calc-symbol font-sans fill-current text-[10px] stroke-none">=</text>
        </svg>
      )}

      {type === 'compare' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="24" y1="10" x2="24" y2="40" />
          <line x1="12" y1="40" x2="36" y2="40" />
          {/* Tilting Beam */}
          <g className="scale-beam">
            <line x1="8" y1="16" x2="40" y2="16" strokeWidth="4" />
            <line x1="8" y1="16" x2="8" y2="28" />
            <line x1="40" y1="16" x2="40" y2="28" />
          </g>
          <circle cx="8" cy="28" r="4" className="scale-pan-left" fill="currentColor" />
          <circle cx="40" cy="28" r="4" className="scale-pan-right" fill="currentColor" />
        </svg>
      )}

      {type === 'recommend' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="24" cy="24" r="18" />
          <circle cx="24" cy="24" r="10" strokeDasharray="4 4" />
          {/* Radar pointer sweep */}
          <line x1="24" y1="24" x2="24" y2="8" className="radar-sweep" />
          <circle cx="34" cy="18" r="3" className="radar-node fill-black dark:fill-[#00FFB3]" />
          <circle cx="14" cy="30" r="3" className="radar-node fill-black dark:fill-[#00FFB3]" />
        </svg>
      )}

      {type === 'dates' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="6" y="10" width="36" height="32" rx="4" />
          <line x1="6" y1="18" x2="42" y2="18" />
          <path d="M14 6 L14 14" />
          <path d="M34 6 L34 14" />
          {/* Folding Sheet */}
          <rect x="12" y="24" width="24" height="14" rx="2" className="calendar-sheet" fill="currentColor" fillOpacity="0.2" />
          <circle cx="34" cy="34" r="4" className="calendar-clock" strokeDasharray="3 3" />
        </svg>
      )}

      {type === 'guide' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 12 C 16 10, 24 16, 24 16 C 24 16, 32 10, 42 12 L 42 38 C 32 36, 24 42, 24 42 C 24 42, 16 36, 6 38 Z" />
          <line x1="24" y1="16" x2="24" y2="42" />
          {/* Turning Page */}
          <path d="M24 16 C 24 16, 29 12, 36 14" className="book-page-right" />
          <circle cx="24" cy="28" r="8" className="book-glow stroke-black dark:stroke-[#00FFB3]" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      )}

      {type === 'syllabus' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="8" y="6" width="32" height="36" rx="3" />
          <line x1="14" y1="12" x2="28" y2="12" />
          <line x1="14" y1="20" x2="24" y2="20" />
          <line x1="14" y1="28" x2="30" y2="28" />
          {/* Checkmarks */}
          <path d="M28 22 L31 25 L38 18" className="checkmark stroke-black dark:stroke-[#00FFB3]" />
          {/* Writing Pencil */}
          <g className="pencil">
            <path d="M38 32 L40 30 L44 34 L42 36 Z" fill="currentColor" />
            <polygon points="38,32 30,40 33,42 40,34" fill="currentColor" />
            <polygon points="30,40 28,42 33,42" className="fill-black dark:fill-[#00FFB3]" />
          </g>
        </svg>
      )}

      {type === 'portal' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 22 V 14 A 12 12 0 0 1 36 14 V 22" className="portal-shield" />
          <rect x="8" y="20" width="32" height="22" rx="4" fill="currentColor" fillOpacity="0.1" />
          {/* Keyhole/Key rotating */}
          <circle cx="24" cy="29" r="3" />
          <line x1="24" y1="32" x2="24" y2="37" />
          <path d="M 24 29 L 34 29 V 32 H 32 V 29" className="portal-key" />
        </svg>
      )}

      {type === 'tracker' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="8" y1="40" x2="40" y2="40" />
          <line x1="8" y1="8" x2="8" y2="40" />
          {/* Dynamic line */}
          <path 
            d="M 8 36 L 18 24 L 28 28 L 38 12" 
            className="tracker-line" 
            strokeWidth="3.5" 
            strokeDasharray="100" 
            strokeDashoffset="0" 
          />
          <circle cx="18" cy="24" r="4.5" className="tracker-dot" fill="currentColor" />
          <circle cx="38" cy="12" r="4.5" className="tracker-dot" fill="currentColor" />
        </svg>
      )}

      {type === 'search' && (
        <svg className="w-12 h-12 text-black dark:text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="20" cy="20" r="10" className="search-glass" />
          <line x1="27" y1="27" x2="38" y2="38" className="search-glass" strokeWidth="4" />
          <circle cx="20" cy="20" r="15" className="search-rings" strokeDasharray="3 3" />
        </svg>
      )}

    </div>
  );
}
