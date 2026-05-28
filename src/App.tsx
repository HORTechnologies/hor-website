import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

/**
 * =====================================================
 * ARCHITECTURE SYSTEM - #ARCHITECTURE-SYSTEM-005
 * VISUAL OVERLAY SYSTEM - #VISUAL-ARCHITECTURE-OVERLAY-006
 * =====================================================
 *
 * Keyboard Shortcut: CTRL + SHIFT + D
 * Toggles Developer Architecture Mode ON/OFF
 *
 * =====================================================
 */

// =====================================================
// ARCHITECTURE LABEL COMPONENT
// =====================================================

interface ArchLabelProps {
  id: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const ArchLabel: React.FC<ArchLabelProps> = ({ id, position = 'top-left' }) => {
  const positionStyles: Record<string, string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const cornerStyles: Record<string, string> = {
    'top-left': 'origin-top-left',
    'top-right': 'origin-top-right',
    'bottom-left': 'origin-bottom-left',
    'bottom-right': 'origin-bottom-right',
  };

  return (
    <div
      className={`absolute ${positionStyles[position]} m-2 z-[9999] ${cornerStyles[position]}`}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider
                   bg-black/80 backdrop-blur-sm border border-blue-500/50
                   text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]
                   animate-pulse-subtle"
        style={{
          animation: 'pulse-subtle 2s ease-in-out infinite',
        }}
      >
        {id}
      </div>
    </div>
  );
};

// =====================================================
// INLINE ARCHITECTURE LABEL
// =====================================================

interface InlineLabelProps {
  id: string;
  className?: string;
}

const InlineLabel: React.FC<InlineLabelProps> = ({ id, className = '' }) => {
  return (
    <span
      className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold
                  bg-black/80 backdrop-blur-sm border border-blue-500/50
                  text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)] whitespace-nowrap z-50
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      {id}
    </span>
  );
};

// =====================================================
// DEVELOPER MODE TOGGLE COMPONENT
// =====================================================

const DeveloperModeToggle: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-[99999] px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider
                 transition-all duration-300 backdrop-blur-xl border
                 ${isActive
                   ? 'bg-blue-600/90 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                   : 'bg-black/80 border-white/20 text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                 }`}
      title="Toggle Developer Mode (Ctrl+Shift+D)"
    >
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {isActive ? 'DEV MODE ON' : 'DEV MODE'}
      </span>
    </button>
  );
};

// =====================================================
// ARCHITECTURE OVERLAY PANEL
// =====================================================

const ArchitectureOverlay: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: '#1', name: 'Top Navbar', children: ['#1.1 Logo Area', '#1.2 Right Area', '#1.2.1 Language', '#1.2.2 CTA Button', '#1.2.3 Mobile Menu'] },
    { id: '#2', name: 'Hero Section', children: ['#2.1 Branding', '#2.1.1 Hero Logo', '#2.1.2 Company Name', '#2.2 Title Area', '#2.2.1 Main Title', '#2.3 Buttons'] },
    { id: '#3', name: 'Background', children: ['#3.1 Grid', '#3.2 Particles', '#3.3 Ambient Glow'] },
    { id: '#4', name: 'Services', children: ['#4.1 Container', '#4.1.1 Card 1', '#4.1.2 Card 2', '#4.1.3 Card 3', '#4.1.4 Card 4', '#4.1.5 Card 5'] },
    { id: '#5', name: 'Projects', children: ['#5.1 Header', '#5.2 Grid', '#5.2.1 Project 1', '#5.2.2 Project 2', '#5.2.3 Project 3', '#5.2.4 Project 4', '#5.2.5 Project 5', '#5.2.6 Project 6'] },
    { id: '#6', name: 'Mobile System', children: ['#6.1 Nav Items', '#6.2 Menu', '#6.3 CTA Button', '#6.4 Mobile Logo'] },
    { id: '#7', name: 'Footer', children: ['#7.1 Logo', '#7.2 Navigation', '#7.3 Social Icons', '#7.4 Copyright'] },
    { id: '#8', name: 'Developers', children: ['#8.1 Dev 1', '#8.2 Dev 2', '#8.3 Dev 3', '#8.4 Dev 4'] },
    { id: '#9', name: 'Articles', children: ['#9.1 Article 1', '#9.2 Article 2', '#9.3 Article 3'] },
    { id: '#10', name: 'Clients', children: ['#10.1 Client Logo', '#10.2 Client Logo', '#10.3 Client Logo'] },
  ];

  if (!isActive) return null;

  return (
    <div className="fixed top-20 left-6 z-[99998] w-72 max-h-[calc(100vh-160px)] overflow-y-auto
                    bg-black/90 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 border-b border-blue-500/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 font-mono text-xs font-bold tracking-wider">
            #ARCHITECTURE-SYSTEM-005
          </span>
        </div>
        <p className="text-gray-500 text-[10px] mt-1 font-mono">
          Press CTRL+SHIFT+D to toggle
        </p>
      </div>

      {/* Section List */}
      <div className="p-2 space-y-1">
        {sections.map((section) => (
          <div key={section.id} className="group">
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all
                         ${activeSection === section.id
                           ? 'bg-blue-500/20 text-blue-400'
                           : 'hover:bg-white/5 text-gray-400 hover:text-white'
                         }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{section.id}</span>
                <span className="text-xs">{section.name}</span>
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${activeSection === section.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Children */}
            {activeSection === section.id && (
              <div className="ml-4 mt-1 space-y-0.5 border-l border-blue-500/20 pl-2">
                {section.children.map((child, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 rounded text-[10px] font-mono text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer transition-colors"
                  >
                    {child}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-black/95 border-t border-blue-500/30 px-4 py-2">
        <p className="text-[9px] text-gray-600 font-mono">
          Hover elements to see IDs
        </p>
      </div>
    </div>
  );
};

// =====================================================
// INTRO ANIMATION
// =====================================================

const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; targetX: number; targetY: number }[] = [];
    const particleCount = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: 0,
        targetX: centerX + (Math.random() - 0.5) * 200,
        targetY: centerY + (Math.random() - 0.5) * 100,
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      if (phase === 0 && frame > 30) {
        setPhase(1);
      }

      if (phase >= 1) {
        particles.forEach((p) => {
          if (phase === 1) {
            p.alpha = Math.min(p.alpha + 0.02, 0.8);
          }

          if (phase === 2) {
            const targetAlpha = frame < 120 ? 0 : Math.min((frame - 120) * 0.02, 0.6);
            p.alpha = targetAlpha;
            p.x += (p.targetX - p.x) * 0.02;
            p.y += (p.targetY - p.y) * 0.02;
          }

          if (phase === 3) {
            p.alpha = Math.max(p.alpha - 0.05, 0);
          }

          if (p.alpha > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 190, 200, ${p.alpha})`;
            ctx.fill();
          }
        });

        if (phase === 2) {
          particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist < 80) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 80)})`;
                ctx.stroke();
              }
            });
          });

          ctx.font = 'bold 72px Inter, sans-serif';
          ctx.fillStyle = `rgba(200, 200, 205, ${Math.min((frame - 90) * 0.02, 0.8)})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('HOR', centerX, centerY);
        }
      }

      if (frame < 200) {
        animationId = requestAnimationFrame(animate);
      } else {
        setPhase(4);
        setTimeout(onComplete, 500);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

// =====================================================
// HOR LOGO COMPONENT
// =====================================================

interface HORLogoProps {
  className?: string;
  section?: string;
  showLabel?: boolean;
  devMode?: boolean;
}

const HORLogo: React.FC<HORLogoProps> = ({ className = '', section = '#1.1.1', showLabel = false, devMode = false }) => {
  return (
    <div
      className={`relative group ${className}`}
      data-component-id={section}
    >
      {devMode && showLabel && (
        <InlineLabel id={section} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 via-white/20 to-gray-400/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/30 to-gray-500/20 rounded-lg blur-sm" />
          <div
            className="relative w-full h-full rounded-lg bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center overflow-hidden"
            data-element-id={`${section}.icon`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent" />
            <span
              className="relative text-gray-800 font-bold text-lg tracking-wider"
              style={{
                textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.1)'
              }}
              data-element-id={`${section}.letter`}
            >
              H
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <span
          className="relative text-lg font-semibold tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 25%, #E8E8E8 50%, #A8A8A8 75%, #D0D0D0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.3))'
          }}
          data-element-id={`${section}.text`}
        >
          HOR
        </span>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

// =====================================================
// NAVIGATION - #1
// =====================================================

const Navigation: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t, language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'nav.home', href: '#hero' },
    { key: 'nav.projects', href: '#projects' },
    { key: 'nav.developers', href: '#developers' },
    { key: 'nav.articles', href: '#articles' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
      data-section-id="#1"
    >
      {devMode && <ArchLabel id="#1" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* #1.1 = Navbar Left Area */}
        <div data-element-id="#1.1" className="flex items-center relative">
          {devMode && <InlineLabel id="#1.1" />}
          {/* #1.1.1 = Navbar Logo Icon */}
          <a href="#hero" className="flex items-center gap-2 group" data-element-id="#1.1.1">
            <HORLogo section="#1.1.1" devMode={devMode} showLabel={true} />
          </a>
        </div>

        {/* Nav Items */}
        <div className="hidden lg:flex items-center gap-1 relative" data-element-id="#1.0.nav-items">
          {devMode && <InlineLabel id="#1.0" className="-top-8" />}
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              {t(item.key)}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* #1.2 = Navbar Right Area */}
        <div className="flex items-center gap-3 relative" data-element-id="#1.2">
          {devMode && <InlineLabel id="#1.2" className="-top-6 right-0" />}

          {/* #1.2.1 = Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 relative"
            data-element-id="#1.2.1"
          >
            {devMode && <InlineLabel id="#1.2.1" className="-top-6" />}
            <span className="text-xs font-medium text-gray-300">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* #1.2.2 = Primary CTA Button */}
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 relative"
            data-element-id="#1.2.2"
          >
            {devMode && <InlineLabel id="#1.2.2" className="-top-6" />}
            {t('nav.getStarted')}
          </a>

          {/* #1.2.3 = Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center relative"
            data-element-id="#1.2.3"
          >
            {devMode && <InlineLabel id="#1.2.3" className="-top-6" />}
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* #6.2 = Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 border-t border-white/5' : 'max-h-0'
        } bg-[#0B0B0B]/95 backdrop-blur-xl relative`}
        data-element-id="#6.2"
      >
        {devMode && <InlineLabel id="#6.2" className="top-2 left-2" />}

        {/* #6.4 = Mobile Logo */}
        <div className="px-6 py-4 border-b border-white/5" data-element-id="#6.4">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent" />
              <span className="relative text-gray-800 font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-semibold tracking-wider" style={{
              background: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 25%, #E8E8E8 50%, #A8A8A8 75%, #D0D0D0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              HOR
            </span>
          </div>
        </div>

        {/* #6.1 = Mobile Navigation Items */}
        <div className="px-6 py-4 space-y-2 relative" data-element-id="#6.1">
          {devMode && <InlineLabel id="#6.1" className="top-2 right-2" />}
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
            >
              {t(item.key)}
            </a>
          ))}
          {/* #6.3 = Mobile CTA Button */}
          <a
            href="#contact"
            className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg relative"
            data-element-id="#6.3"
          >
            {devMode && <InlineLabel id="#6.3" className="-top-6 left-0" />}
            {t('nav.getStarted')}
          </a>
        </div>
      </div>
    </nav>
  );
};

// =====================================================
// BACKGROUND SYSTEM - #3
// =====================================================

const FloatingParticles: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
        const glowOpacity = distToMouse < 150 ? 0.5 : p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${glowOpacity})`;
        ctx.fill();

        if (distToMouse < 150) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${0.1})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      data-element-id="#3.2"
    />
  );
};

// #3.1 = Grid Background
const GridBackground: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  return (
    <div className="absolute inset-0 relative" data-element-id="#3.1">
      {devMode && <InlineLabel id="#3.1" className="top-4 left-4" />}
      {devMode && <InlineLabel id="#3.2" className="top-4 right-4" />}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />
    </div>
  );
};

// =====================================================
// HERO SECTION - #2
// =====================================================

const HeroSection: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t, isRTL } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]" data-section-id="#2">
      {devMode && <ArchLabel id="#2" position="top-left" />}
      <GridBackground devMode={devMode} />
      <FloatingParticles devMode={devMode} />

      {/* #3.3 = Ambient Glow */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
        data-element-id="#3.3"
      >
        {devMode && <InlineLabel id="#3.3" className="top-0 left-0" />}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        {/* #2.1 = Hero Branding Area */}
        <div className="mb-8 flex justify-center relative" data-element-id="#2.1">
          {devMode && <InlineLabel id="#2.1" className="top-0" />}
          <div className="group">
            <div className="relative inline-flex items-center gap-4">
              {/* #2.1.1 = Hero Main Logo */}
              <div className="relative w-16 h-16" data-element-id="#2.1.1">
                {devMode && <InlineLabel id="#2.1.1" className="top-0" />}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/40 to-gray-500/30 rounded-xl blur-md" />
                <div
                  className="relative w-full h-full rounded-xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                  data-element-id="#2.1.1.icon"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
                  <span
                    className="relative text-gray-800 font-bold text-2xl tracking-wider"
                    style={{
                      textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 -1px 1px rgba(0,0,0,0.1)'
                    }}
                    data-element-id="#2.1.1.letter"
                  >
                    H
                  </span>
                </div>
                <div className="absolute -bottom-1 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>

              {/* #2.1.2 = Hero Company Name */}
              <span
                className="relative text-2xl font-bold tracking-[0.3em] relative"
                style={{
                  background: 'linear-gradient(135deg, #F0F0F0 0%, #D0D0D0 25%, #E8E8E8 50%, #B8B8B8 75%, #E0E0E0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.4))'
                }}
                data-element-id="#2.1.2"
              >
                {devMode && <InlineLabel id="#2.1.2" className="-top-6" />}
                HOR
              </span>

              {/* #2.1.3 = Hero Small Branding Text */}
              <span className="text-gray-500 text-sm tracking-widest relative" data-element-id="#2.1.3">
                {devMode && <InlineLabel id="#2.1.3" className="-top-6" />}
                TECNOLOGIES
              </span>
            </div>
          </div>
        </div>

        {/* #2.2 = Hero Title Area */}
        <div className="relative" data-element-id="#2.2">
          {devMode && <InlineLabel id="#2.2" className="top-0 left-0" />}

          {/* #2.2.1 = Main Title */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight relative"
            data-element-id="#2.2.1"
          >
            {devMode && <InlineLabel id="#2.2.1" className="-top-6" />}
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>

          {/* #2.2.2 = Subtitle Text */}
          <p
            className="text-xl sm:text-2xl text-blue-400 font-medium mb-4 tracking-wide relative"
            data-element-id="#2.2.2"
          >
            {devMode && <InlineLabel id="#2.2.2" className="-top-6" />}
            {t('hero.subtitle')}
          </p>

          {/* #2.2.3 = Description Text */}
          <p
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed relative"
            data-element-id="#2.2.3"
          >
            {devMode && <InlineLabel id="#2.2.3" className="-top-6" />}
            {t('hero.description')}
          </p>
        </div>

        {/* #2.3 = Hero Buttons Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative" data-element-id="#2.3">
          {devMode && <InlineLabel id="#2.3" className="top-0 left-0" />}

          {/* #2.3.1 = Primary Button */}
          <a
            href="#projects"
            className="group relative px-8 py-4 rounded-xl overflow-hidden"
            data-element-id="#2.3.1"
          >
            {devMode && <InlineLabel id="#2.3.1" className="-top-6" />}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-xl border border-white/20" />
            <span className="relative text-white font-medium flex items-center gap-2">
              {t('hero.explore')}
              <svg className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>

          {/* #2.3.2 = Secondary Button */}
          <a
            href="#contact"
            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 text-white font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] relative"
            data-element-id="#2.3.2"
          >
            {devMode && <InlineLabel id="#2.3.2" className="-top-6" />}
            {t('hero.contact')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

// =====================================================
// PROJECT CARD
// =====================================================

interface ProjectCardProps {
  image: string;
  titleKey: string;
  descKey: string;
  tags: string[];
  delay: number;
  cardIndex: number;
  devMode: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, titleKey, descKey, tags, delay, cardIndex, devMode }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 transition-all duration-700 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      data-element-id={`#5.2.${cardIndex + 1}`}
    >
      {devMode && <InlineLabel id={`#5.2.${cardIndex + 1}`} className="top-2 left-2" />}

      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={image}
          alt={t(titleKey)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-element-id={`#5.2.${cardIndex + 1}.image`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2" data-element-id={`#5.2.${cardIndex + 1}.title`}>
          {t(titleKey)}
        </h3>
        <p className="text-gray-400 text-sm mb-4" data-element-id={`#5.2.${cardIndex + 1}.description`}>
          {t(descKey)}
        </p>

        <div className="flex flex-wrap gap-2" data-element-id={`#5.2.${cardIndex + 1}.tags`}>
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {t(`tag.${tag}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

// =====================================================
// PROJECTS SECTION - #5
// =====================================================

const ProjectsSection: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t } = useLanguage();

  const projects = [
    { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', titleKey: 'project.ecommerce', descKey: 'project.ecommerce.desc', tags: ['react', 'node', 'ai'] },
    { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', titleKey: 'project.fintech', descKey: 'project.fintech.desc', tags: ['python', 'cloud'] },
    { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', titleKey: 'project.health', descKey: 'project.health.desc', tags: ['mobile', 'swift'] },
    { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', titleKey: 'project.gaming', descKey: 'project.gaming.desc', tags: ['game', 'unity'] },
    { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', titleKey: 'project.saas', descKey: 'project.saas.desc', tags: ['react', 'cloud'] },
    { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', titleKey: 'project.ai', descKey: 'project.ai.desc', tags: ['ai', 'python'] },
  ];

  return (
    <section id="projects" className="py-32 bg-[#050505] relative" data-section-id="#5">
      {devMode && <ArchLabel id="#5" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6">
        {/* #5.1 = Projects Header */}
        <div className="text-center mb-16 relative" data-element-id="#5.1">
          {devMode && <InlineLabel id="#5.1" className="top-0 left-0" />}
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block" data-element-id="#5.1.label">
            Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-element-id="#5.1.title">
            {t('projects.title')}
          </h2>
          <p className="text-gray-400 text-lg" data-element-id="#5.1.subtitle">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* #5.2 = Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative" data-element-id="#5.2">
          {devMode && <InlineLabel id="#5.2" className="top-0 left-0" />}
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} delay={index * 100} cardIndex={index} devMode={devMode} />
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// SERVICE CARD
// =====================================================

interface ServiceCardProps {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  delay: number;
  cardIndex: number;
  devMode: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, titleKey, descKey, delay, cardIndex, devMode }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-700 hover:border-blue-500/30 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      data-element-id={`#4.1.${cardIndex + 1}`}
    >
      {devMode && <InlineLabel id={`#4.1.${cardIndex + 1}`} className="top-2 left-2" />}

      <div
        className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300"
        data-element-id={`#4.1.${cardIndex + 1}.icon`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3" data-element-id={`#4.1.${cardIndex + 1}.title`}>
        {t(titleKey)}
      </h3>
      <p className="text-gray-400 leading-relaxed" data-element-id={`#4.1.${cardIndex + 1}.description`}>
        {t(descKey)}
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

// =====================================================
// SERVICES SECTION - #4
// =====================================================

const ServicesSection: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" /></svg>,
      titleKey: 'services.web',
      descKey: 'services.web.desc'
    },
    {
      icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
      titleKey: 'services.mobile',
      descKey: 'services.mobile.desc'
    },
    {
      icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
      titleKey: 'services.ui',
      descKey: 'services.ui.desc'
    },
    {
      icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      titleKey: 'services.games',
      descKey: 'services.games.desc'
    },
    {
      icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
      titleKey: 'services.software',
      descKey: 'services.software.desc'
    },
  ];

  return (
    <section id="services" className="py-32 bg-[#0B0B0B] relative" data-section-id="#4">
      {devMode && <ArchLabel id="#4" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 relative">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">Capabilities</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('services.title')}</h2>
          <p className="text-gray-400 text-lg">{t('services.subtitle')}</p>
        </div>

        {/* #4.1 = Services Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative" data-element-id="#4.1">
          {devMode && <InlineLabel id="#4.1" className="top-0 left-0" />}
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 100} cardIndex={index} devMode={devMode} />
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// DEVELOPER CARD
// =====================================================

interface DeveloperCardProps {
  image: string;
  name: string;
  role: string;
  bio: string;
  delay: number;
  cardIndex: number;
  devMode: boolean;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ image, name, role, bio, delay, cardIndex, devMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-700 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      data-element-id={`#8.${cardIndex + 1}`}
    >
      {devMode && <InlineLabel id={`#8.${cardIndex + 1}`} className="top-2 left-2" />}

      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-400 mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-3">{role}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
      </div>

      <div className="absolute inset-0 rounded-2xl border border-blue-500/0 group-hover:border-blue-500/20 transition-colors duration-300" />
    </div>
  );
};

// =====================================================
// DEVELOPERS SECTION - #8
// =====================================================

const DevelopersSection: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t } = useLanguage();

  const developers = [
    { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', name: 'Ahmed Hassan', role: 'Lead Developer', bio: 'Full-stack architect with 10+ years crafting scalable systems and elegant code.' },
    { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', name: 'Sarah Chen', role: 'UI/UX Director', bio: 'Design visionary creating interfaces that users remember and love.' },
    { image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', name: 'Marcus Williams', role: 'Game Developer', bio: 'Bringing virtual worlds to life with immersive gameplay experiences.' },
    { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', name: 'Elena Rodriguez', role: 'AI Engineer', bio: 'Machine learning expert building intelligent systems of tomorrow.' },
  ];

  return (
    <section id="developers" className="py-32 bg-[#050505] relative" data-section-id="#8">
      {devMode && <ArchLabel id="#8" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">Our Team</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('developers.title')}</h2>
          <p className="text-gray-400 text-lg">{t('developers.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map((dev, index) => (
            <DeveloperCard key={index} {...dev} delay={index * 100} cardIndex={index} devMode={devMode} />
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// ARTICLE CARD
// =====================================================

interface ArticleCardProps {
  image: string;
  titleKey: string;
  categoryKey: string;
  readTime: number;
  delay: number;
  cardIndex: number;
  devMode: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ image, titleKey, categoryKey, readTime, delay, cardIndex, devMode }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group cursor-pointer transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      data-element-id={`#9.${cardIndex + 1}`}
    >
      {devMode && <InlineLabel id={`#9.${cardIndex + 1}`} className="top-2 left-2" />}

      <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={t(titleKey)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {t(categoryKey)}
            </span>
            <span className="text-gray-500 text-sm">{readTime} {t('read.time')}</span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
            {t(titleKey)}
          </h3>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

// =====================================================
// ARTICLES SECTION - #9
// =====================================================

const ArticlesSection: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t } = useLanguage();

  const articles = [
    { image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', titleKey: 'article.ai', categoryKey: 'article.ai.category', readTime: 8 },
    { image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', titleKey: 'article.ux', categoryKey: 'article.ux.category', readTime: 6 },
    { image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', titleKey: 'article.cloud', categoryKey: 'article.cloud.category', readTime: 10 },
  ];

  return (
    <section id="articles" className="py-32 bg-[#0B0B0B] relative" data-section-id="#9">
      {devMode && <ArchLabel id="#9" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">Insights</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('articles.title')}</h2>
          <p className="text-gray-400 text-lg">{t('articles.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} delay={index * 100} cardIndex={index} devMode={devMode} />
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// CLIENTS SECTION - #10
// =====================================================

const ClientsSection: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t } = useLanguage();

  const clients = [
    'TechVentures', 'InnovateCo', 'FutureLabs', 'DataStream', 'CloudNine', 'NextGen', 'QuantumAI', 'CyberSystems'
  ];

  return (
    <section className="py-32 bg-[#050505] relative" data-section-id="#10">
      {devMode && <ArchLabel id="#10" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">Partners</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('clients.title')}</h2>
          <p className="text-gray-400 text-lg">{t('clients.subtitle')}</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-12">
            {clients.map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-8 py-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors duration-300 relative"
                data-element-id={`#10.${index + 1}`}
              >
                {devMode && <InlineLabel id={`#10.${index + 1}`} className="top-2 left-2" />}
                <span className="text-xl font-semibold text-gray-400 whitespace-nowrap tracking-wider">
                  {client}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

// =====================================================
// FOOTER - #7
// =====================================================

const Footer: React.FC<{ devMode: boolean }> = ({ devMode }) => {
  const { t } = useLanguage();

  const navLinks = [
    { key: 'nav.home', href: '#hero' },
    { key: 'nav.projects', href: '#projects' },
    { key: 'nav.developers', href: '#developers' },
    { key: 'nav.articles', href: '#articles' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /> },
    { name: 'LinkedIn', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" /> },
    { name: 'GitHub', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /> },
  ];

  return (
    <footer id="contact" className="py-20 bg-[#0B0B0B] border-t border-white/5 relative" data-section-id="#7">
      {devMode && <ArchLabel id="#7" position="top-left" />}

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            {/* #7.1 = Footer Logo */}
            <div className="flex items-center gap-3 mb-6 relative" data-element-id="#7.1">
              {devMode && <InlineLabel id="#7.1" className="top-0 left-0" />}
              <HORLogo section="#7.1" devMode={devMode} />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">{t('footer.tagline')}</p>

            {/* #7.3 = Footer Social Icons */}
            <div className="flex gap-4 relative" data-element-id="#7.3">
              {devMode && <InlineLabel id="#7.3" className="top-0 left-0" />}
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 relative"
                  data-element-id={`#7.3.${index + 1}`}
                >
                  {devMode && <InlineLabel id={`#7.3.${index + 1}`} className="-top-6" />}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* #7.2 = Footer Navigation */}
          <div className="relative" data-element-id="#7.2">
            {devMode && <InlineLabel id="#7.2" className="top-0 left-0" />}
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 relative"
                    data-element-id={`#7.2.${index + 1}`}
                  >
                    {devMode && <InlineLabel id={`#7.2.${index + 1}`} className="-top-5 left-0" />}
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>hello@nexus.tech</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* #7.4 = Footer Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative" data-element-id="#7.4">
          {devMode && <InlineLabel id="#7.4" className="top-0 left-0" />}
          <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors relative" data-element-id="#7.4.privacy">
              {devMode && <InlineLabel id="#7.4.privacy" className="-top-5 left-0" />}
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors relative" data-element-id="#7.4.terms">
              {devMode && <InlineLabel id="#7.4.terms" className="-top-5 left-0" />}
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// =====================================================
// MAIN APP
// =====================================================

const AppContent: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [websiteReady, setWebsiteReady] = useState(false);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWebsiteReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut handler for Developer Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDevMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div
      className={`min-h-screen bg-[#050505] transition-opacity duration-1000 ${websiteReady ? 'opacity-100' : 'opacity-0'}`}
      data-website-id="#ARCHITECTURE-SYSTEM-005"
    >
      {/* Developer Mode Overlay Panel */}
      <ArchitectureOverlay isActive={devMode} />

      {/* Developer Mode Toggle Button */}
      <DeveloperModeToggle isActive={devMode} onToggle={() => setDevMode(!devMode)} />

      <Navigation devMode={devMode} />
      <HeroSection devMode={devMode} />
      <ProjectsSection devMode={devMode} />
      <ServicesSection devMode={devMode} />
      <DevelopersSection devMode={devMode} />
      <ArticlesSection devMode={devMode} />
      <ClientsSection devMode={devMode} />
      <Footer devMode={devMode} />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;