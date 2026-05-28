import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

/**
 * =====================================================
 * ARCHITECTURE SYSTEM - #ARCHITECTURE-SYSTEM-005
 * SMART INSPECTOR SYSTEM - #SMART-INSPECTOR-SYSTEM-009
 * =====================================================
 *
 * #1 = TOP NAVBAR
 * #2 = HERO SECTION
 * #3 = BACKGROUND SYSTEM
 * #4 = SERVICES SECTION
 * #5 = PROJECTS SECTION
 * #6 = MOBILE SYSTEM
 * #7 = FOOTER
 * #8 = DEVELOPERS SECTION
 * #9 = ARTICLES SECTION
 * #10 = CLIENTS SECTION
 *
 * =====================================================
 */

// =====================================================
// SMART INTERACTIVE INSPECTOR SYSTEM
// =====================================================

interface InspectorData {
  id: string;
  name: string;
  type: string;
  section: string;
  content: string;
  rect: DOMRect;
}

// Element name mapping based on data attributes
const getElementInfo = (el: HTMLElement): InspectorData | null => {
  const id = el.getAttribute('data-element-id') || el.getAttribute('data-section-id');
  if (!id) return null;

  // Get text content
  const textContent = el.textContent?.trim().slice(0, 100) || '';

  // Get tag name
  const tagName = el.tagName.toLowerCase();

  // Determine element type
  let type = 'Element';
  if (tagName === 'button') type = 'Button';
  else if (tagName === 'a') type = 'Link';
  else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') type = 'Heading';
  else if (tagName === 'p') type = 'Paragraph';
  else if (tagName === 'img') type = 'Image';
  else if (tagName === 'nav') type = 'Navigation';
  else if (tagName === 'section') type = 'Section';
  else if (tagName === 'footer') type = 'Footer';
  else if (tagName === 'canvas') type = 'Canvas Animation';
  else if (tagName === 'span') type = 'Text Span';
  else if (tagName === 'div') type = 'Container';

  // Determine section based on ID prefix
  let section = 'Unknown';
  if (id.startsWith('#1')) section = 'Navbar';
  else if (id.startsWith('#2')) section = 'Hero Section';
  else if (id.startsWith('#3')) section = 'Background System';
  else if (id.startsWith('#4')) section = 'Services Section';
  else if (id.startsWith('#5')) section = 'Projects Section';
  else if (id.startsWith('#6')) section = 'Mobile System';
  else if (id.startsWith('#7')) section = 'Footer';
  else if (id.startsWith('#8')) section = 'Developers Section';
  else if (id.startsWith('#9')) section = 'Articles Section';
  else if (id.startsWith('#10')) section = 'Clients Section';

  // Create readable name from ID
  const nameParts = id.replace('#', '').split('.');
  const name = nameParts.map(p => {
    if (p.match(/^\d+$/)) return '';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).filter(Boolean).join(' ');

  return {
    id,
    name: name || id,
    type,
    section,
    content: textContent,
    rect: el.getBoundingClientRect()
  };
};

// Smart Inspector Component
const SmartInspector: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [hoveredElement, setHoveredElement] = useState<InspectorData | null>(null);
  const [lockedElement, setLockedElement] = useState<InspectorData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPanel, setShowPanel] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const activeElement = lockedElement || hoveredElement;

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Hover detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    if (lockedElement) return; // Don't update if locked

    const target = e.target as HTMLElement;
    const inspectableEl = target.closest('[data-element-id], [data-section-id]') as HTMLElement;

    if (inspectableEl && !inspectableEl.closest('.inspector-panel') && !inspectableEl.closest('.dev-mode-toggle')) {
      const info = getElementInfo(inspectableEl);
      if (info) {
        setHoveredElement(info);
        setShowPanel(true);
      }
    } else if (!target.closest('.inspector-panel') && !target.closest('.dev-mode-toggle')) {
      setHoveredElement(null);
      setShowPanel(false);
    }
  }, [isActive, lockedElement]);

  // Click to lock
  const handleClick = useCallback((e: MouseEvent) => {
    if (!isActive) return;

    const target = e.target as HTMLElement;
    const inspectableEl = target.closest('[data-element-id], [data-section-id]') as HTMLElement;

    if (inspectableEl && !inspectableEl.closest('.inspector-panel') && !inspectableEl.closest('.dev-mode-toggle')) {
      const info = getElementInfo(inspectableEl);
      if (info) {
        setLockedElement(prev => prev?.id === info.id ? null : info);
        setShowPanel(true);
      }
    } else if (!target.closest('.inspector-panel') && !target.closest('.dev-mode-toggle')) {
      setLockedElement(null);
      setShowPanel(false);
    }
  }, [isActive]);

  // Escape to unlock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lockedElement) {
        setLockedElement(null);
        setShowPanel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lockedElement]);

  // Attach event listeners
  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleClick);
    };
  }, [isActive, handleMouseMove, handleMouseOver, handleClick]);

  if (!isActive) return null;

  // Calculate panel position
  const panelWidth = 280;
  const panelHeight = 320;
  let panelX = mousePos.x + 20;
  let panelY = mousePos.y - 20;

  // Keep panel in viewport
  if (panelX + panelWidth > window.innerWidth - 20) {
    panelX = mousePos.x - panelWidth - 20;
  }
  if (panelY + panelHeight > window.innerHeight - 20) {
    panelY = mousePos.y - panelHeight + 40;
  }
  if (panelY < 20) {
    panelY = 20;
  }

  return (
    <>
      {/* Highlight border for hovered element */}
      {hoveredElement && !lockedElement && (
        <div
          className="pointer-events-none fixed z-[99980] transition-all duration-200"
          style={{
            left: hoveredElement.rect.left - 2,
            top: hoveredElement.rect.top - 2,
            width: hoveredElement.rect.width + 4,
            height: hoveredElement.rect.height + 4,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(59, 130, 246, 0.8)',
            borderRadius: '6px',
            animation: 'inspector-pulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Locked element highlight */}
      {lockedElement && (
        <div
          className="pointer-events-none fixed z-[99980]"
          style={{
            left: lockedElement.rect.left - 2,
            top: lockedElement.rect.top - 2,
            width: lockedElement.rect.width + 4,
            height: lockedElement.rect.height + 4,
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 15px rgba(59, 130, 246, 0.4)',
            border: '2px solid rgba(59, 130, 246, 1)',
            borderRadius: '6px',
            background: 'rgba(59, 130, 246, 0.05)',
          }}
        />
      )}

      {/* Inspector Panel */}
      {showPanel && activeElement && (
        <div
          className="fixed z-[99999] inspector-panel"
          style={{
            left: lockedElement ? undefined : panelX,
            right: lockedElement ? 20 : undefined,
            top: lockedElement ? 20 : panelY,
            width: panelWidth,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute -inset-2 rounded-2xl opacity-40"
            style={{
              background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Main panel */}
          <div
            className="relative bg-black/95 backdrop-blur-xl border border-blue-500/50 rounded-xl overflow-hidden"
            style={{
              boxShadow: '0 0 50px rgba(59, 130, 246, 0.3), inset 0 0 40px rgba(59, 130, 246, 0.05)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b border-blue-500/30 flex items-center justify-between"
              style={{
                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, transparent 100%)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400 text-xs font-mono font-bold tracking-wider">INSPECTOR</span>
              </div>
              {lockedElement && (
                <button
                  onClick={() => {
                    setLockedElement(null);
                    setShowPanel(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* ID Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">ID</label>
                <div
                  className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30"
                  style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}
                >
                  <span className="text-blue-400 text-sm font-mono font-bold">
                    {activeElement.id}
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Name</label>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-300 text-sm font-medium">
                    {activeElement.name}
                  </span>
                </div>
              </div>

              {/* Type & Section Row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Type</label>
                  <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-center">
                    <span className="text-gray-400 text-xs">
                      {activeElement.type}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Section</label>
                  <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-center">
                    <span className="text-gray-400 text-xs">
                      {activeElement.section}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Content</label>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 max-h-16 overflow-hidden">
                  <span className="text-gray-400 text-xs font-mono truncate block">
                    {activeElement.content || '(empty)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/50">
              <p className="text-[9px] font-mono text-gray-600 text-center">
                {lockedElement ? 'ESC to unlock • Click elsewhere to close' : 'Click to lock • ESC to close'}
              </p>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6">
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-blue-500/60" />
            </div>
            <div className="absolute top-0 right-0 w-6 h-6">
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-blue-500/60" />
            </div>
            <div className="absolute bottom-0 left-0 w-6 h-6">
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-blue-500/60" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6">
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-blue-500/60" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes inspector-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

// Developer Mode Toggle Button
const DeveloperModeToggle: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-[99999] group transition-all duration-300
        ${isActive ? 'scale-110' : 'hover:scale-105'}`}
    >
      <div
        className={`absolute -inset-1 rounded-xl opacity-50 transition-opacity duration-300
          ${isActive ? 'bg-blue-500/30' : 'bg-transparent'}`}
        style={{ filter: 'blur(10px)' }}
      />

      <div
        className={`relative px-5 py-3 rounded-xl border backdrop-blur-xl transition-all duration-300
          ${isActive
            ? 'bg-blue-600/90 border-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]'
            : 'bg-black/80 border-white/20 text-gray-400 hover:border-blue-500/50'
          }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="font-mono text-xs font-bold tracking-wider">
            {isActive ? '✓ INSPECTOR ON' : 'INSPECTOR'}
          </span>
        </div>

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 rounded bg-black/90 border border-white/10 text-[10px] font-mono text-gray-400 whitespace-nowrap">
            ALT + SHIFT + X
          </div>
        </div>
      </div>
    </button>
  );
};

// Architecture Info Panel
const ArchitectureInfoPanel: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed top-4 left-4 z-[99999] max-w-xs group">
      <div
        className="absolute -inset-1 rounded-xl opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%)',
          filter: 'blur(15px)',
        }}
      />

      <div
        className="relative bg-black/90 backdrop-blur-xl border border-blue-500/40 rounded-xl overflow-hidden"
        style={{
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.2), inset 0 0 30px rgba(59, 130, 246, 0.05)',
        }}
      >
        <div
          className="px-4 py-3 border-b border-blue-500/30 flex items-center gap-2"
          style={{
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-mono font-bold tracking-wider">SMART INSPECTOR</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-[10px] font-mono text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-blue-400">HOVER/CLICK</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3">
            <p className="text-[9px] font-mono text-gray-500 mb-2">CONTROLS</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                HOVER
              </div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                PREVIEW
              </div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                CLICK
              </div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                LOCK
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3">
            <p className="text-[9px] font-mono text-gray-500 mb-1">SHORTCUT</p>
            <p className="text-[9px] font-mono text-gray-600">
              ALT + SHIFT + X
            </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-8 h-8">
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-blue-500/40" />
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SECTION #1: TOP NAVBAR
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

// HOR Logo Component
interface HORLogoProps {
  className?: string;
  section?: string;
}

const HORLogo: React.FC<HORLogoProps> = ({ className = '', section = '#1.1.1' }) => {
  return (
    <div className={`relative group ${className}`} data-architecture={section}>
      <img
        src="/hor-logo.png"
        alt="HOR Logo"
        loading="eager"
        fetchPriority="high"
        className="h-10 w-[148px] object-contain bg-transparent block"
        data-architecture="#1.1.1.logo"
      />
    </div>
  );
};

// Navigation Component
const Navigation: React.FC = () => {
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
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <div data-element-id="#1.1" className="flex items-center">
          <a href="#hero" className="flex items-center gap-2 group" data-element-id="#1.1.1">
            <HORLogo section="#1.1.1" />
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-1" data-element-id="#1.0.nav-items">
          {navItems.map((item, idx) => (
            <a
              key={item.key}
              href={item.href}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 relative group"
              data-element-id={`#1.0.nav-items.${idx + 1}`}
            >
              {t(item.key)}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3" data-element-id="#1.2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
            data-element-id="#1.2.1"
          >
            <span className="text-xs font-medium text-gray-300">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <a
            href="#contact"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300"
            data-element-id="#1.2.2"
          >
            {t('nav.getStarted')}
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center"
            data-element-id="#1.2.3"
          >
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

      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 border-t border-white/5' : 'max-h-0'
        } bg-[#0B0B0B]/95 backdrop-blur-xl`}
        data-element-id="#6.2"
      >
        <div className="px-6 py-4 border-b border-white/5" data-element-id="#6.4">
          <img
            src="/hor-logo.png"
            alt="HOR Logo"
            loading="eager"
            fetchPriority="high"
            className="h-[34px] w-[108px] object-contain bg-transparent block"
            data-architecture="#1.1.1.mobile"
          />
        </div>
        <div className="px-6 py-4 space-y-2" data-element-id="#6.1">
          {navItems.map((item, idx) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
              data-element-id={`#6.1.${idx + 1}`}
            >
              {t(item.key)}
            </a>
          ))}
          <a
            href="#contact"
            className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg"
            data-element-id="#6.3"
          >
            {t('nav.getStarted')}
          </a>
        </div>
      </div>
    </nav>
  );
};

// =====================================================
// SECTION #3: BACKGROUND SYSTEM
// =====================================================

const FloatingParticles: React.FC = () => {
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

const GridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0" data-element-id="#3.1">
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
// SECTION #2: HERO SECTION
// =====================================================

const HeroSection: React.FC = () => {
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
      <GridBackground />
      <FloatingParticles />

      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
        data-element-id="#3.3"
      />

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        {/* NEW #2.1 - HOR Main Logo System */}
        <div
          className="mb-8 flex justify-center"
          data-architecture="#2.1"
          style={{ marginTop: '20px', marginBottom: '10px' }}
        >
          {/* #2.1.2 - Logo Glow Layer */}
          <div
            className="relative flex items-center justify-center"
            data-architecture="#2.1.2"
          >
            {/* Glow Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              data-architecture="#2.1.2.glow"
              style={{
                background: 'radial-gradient(circle, rgba(120,180,255,0.18) 0%, rgba(120,180,255,0.08) 35%, transparent 75%)',
                filter: 'blur(80px)',
                opacity: 0.9,
                width: '600px',
                height: '300px',
                transform: 'translate(-40px, -50px)',
              }}
            />

            {/* #2.1.1 + #2.1.3 - Main Transparent Logo Image with Float Animation */}
            <img
              src="/hor-logo.png"
              alt="HOR Logo"
              loading="eager"
              fetchPriority="high"
              className="relative w-[520px] max-w-full object-contain"
              data-architecture="#2.1.1 #2.1.3"
              style={{
                animation: 'float 6s ease-in-out infinite',
                background: 'transparent',
                opacity: '1',
                visibility: 'visible',
              }}
            />
          </div>
        </div>

        {/* Keep #2.2.2 and #2.2.3 exactly as they are */}
        <div data-element-id="#2.2">
          <p
            className="text-xl sm:text-2xl text-blue-400 font-medium mb-4 tracking-wide"
            data-element-id="#2.2.2"
          >
            {t('hero.subtitle')}
          </p>

          <p
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            data-element-id="#2.2.3"
          >
            {t('hero.description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-element-id="#2.3">
          <a
            href="#projects"
            className="group relative px-8 py-4 rounded-xl overflow-hidden"
            data-element-id="#2.3.1"
          >
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

          <a
            href="#contact"
            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 text-white font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            data-element-id="#2.3.2"
          >
            {t('hero.contact')}
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" data-element-id="#2.scroll">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

// =====================================================
// SECTION #4 & #5: SERVICES & PROJECTS
// =====================================================

interface ProjectCardProps {
  image: string;
  titleKey: string;
  descKey: string;
  tags: string[];
  delay: number;
  cardIndex: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, titleKey, descKey, tags, delay, cardIndex }) => {
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
      <div className="aspect-[4/3] overflow-hidden">
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
              data-element-id={`#5.2.${cardIndex + 1}.tag.${i + 1}`}
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

const ProjectsSection: React.FC = () => {
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
    <section id="projects" className="py-32 bg-[#050505]" data-section-id="#5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-element-id="#5.1">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-element-id="#5.2">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} delay={index * 100} cardIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  delay: number;
  cardIndex: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, titleKey, descKey, delay, cardIndex }) => {
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

const ServicesSection: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    { icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" /></svg>, titleKey: 'services.web', descKey: 'services.web.desc' },
    { icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, titleKey: 'services.mobile', descKey: 'services.mobile.desc' },
    { icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, titleKey: 'services.ui', descKey: 'services.ui.desc' },
    { icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, titleKey: 'services.games', descKey: 'services.games.desc' },
    { icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>, titleKey: 'services.software', descKey: 'services.software.desc' },
  ];

  return (
    <section id="services" className="py-32 bg-[#0B0B0B]" data-section-id="#4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-element-id="#4.header">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block" data-element-id="#4.header.label">Capabilities</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-element-id="#4.header.title">{t('services.title')}</h2>
          <p className="text-gray-400 text-lg" data-element-id="#4.header.subtitle">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-element-id="#4.1">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 100} cardIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// SECTIONS #8, #9, #10 (Developers, Articles, Clients)
// =====================================================

interface DeveloperCardProps {
  image: string;
  name: string;
  role: string;
  bio: string;
  delay: number;
  cardIndex: number;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ image, name, role, bio, delay, cardIndex }) => {
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
      <div
        className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
        data-element-id={`#8.${cardIndex + 1}.image`}
      >
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-400 mb-1" data-element-id={`#8.${cardIndex + 1}.name`}>{name}</h3>
        <p className="text-gray-500 text-sm mb-3" data-element-id={`#8.${cardIndex + 1}.role`}>{role}</p>
        <p className="text-gray-400 text-sm leading-relaxed" data-element-id={`#8.${cardIndex + 1}.bio`}>{bio}</p>
      </div>

      <div className="absolute inset-0 rounded-2xl border border-blue-500/0 group-hover:border-blue-500/20 transition-colors duration-300" />
    </div>
  );
};

const DevelopersSection: React.FC = () => {
  const { t } = useLanguage();

  const developers = [
    { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', name: 'Ahmed Hassan', role: 'Lead Developer', bio: 'Full-stack architect with 10+ years crafting scalable systems and elegant code.' },
    { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', name: 'Sarah Chen', role: 'UI/UX Director', bio: 'Design visionary creating interfaces that users remember and love.' },
    { image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', name: 'Marcus Williams', role: 'Game Developer', bio: 'Bringing virtual worlds to life with immersive gameplay experiences.' },
    { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', name: 'Elena Rodriguez', role: 'AI Engineer', bio: 'Machine learning expert building intelligent systems of tomorrow.' },
  ];

  return (
    <section id="developers" className="py-32 bg-[#050505]" data-section-id="#8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-element-id="#8.header">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block" data-element-id="#8.header.label">Our Team</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-element-id="#8.header.title">{t('developers.title')}</h2>
          <p className="text-gray-400 text-lg" data-element-id="#8.header.subtitle">{t('developers.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-element-id="#8.grid">
          {developers.map((dev, index) => (
            <DeveloperCard key={index} {...dev} delay={index * 100} cardIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ArticleCardProps {
  image: string;
  titleKey: string;
  categoryKey: string;
  readTime: number;
  delay: number;
  cardIndex: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ image, titleKey, categoryKey, readTime, delay, cardIndex }) => {
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
      <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={t(titleKey)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-element-id={`#9.${cardIndex + 1}.image`}
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20" data-element-id={`#9.${cardIndex + 1}.category`}>
              {t(categoryKey)}
            </span>
            <span className="text-gray-500 text-sm" data-element-id={`#9.${cardIndex + 1}.readtime`}>{readTime} {t('read.time')}</span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300" data-element-id={`#9.${cardIndex + 1}.title`}>
            {t(titleKey)}
          </h3>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

const ArticlesSection: React.FC = () => {
  const { t } = useLanguage();

  const articles = [
    { image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', titleKey: 'article.ai', categoryKey: 'article.ai.category', readTime: 8 },
    { image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', titleKey: 'article.ux', categoryKey: 'article.ux.category', readTime: 6 },
    { image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', titleKey: 'article.cloud', categoryKey: 'article.cloud.category', readTime: 10 },
  ];

  return (
    <section id="articles" className="py-32 bg-[#0B0B0B]" data-section-id="#9">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-element-id="#9.header">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block" data-element-id="#9.header.label">Insights</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-element-id="#9.header.title">{t('articles.title')}</h2>
          <p className="text-gray-400 text-lg" data-element-id="#9.header.subtitle">{t('articles.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-element-id="#9.grid">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} delay={index * 100} cardIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// SECTION #7: FOOTER
// =====================================================

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const navLinks = [
    { key: 'nav.home', href: '#hero' },
    { key: 'nav.projects', href: '#projects' },
    { key: 'nav.developers', href: '#developers' },
    { key: 'nav.articles', href: '#articles' },
  ];

  const socialLinks = [
    { name: 'X', url: 'https://x.com/Hor_Tech', icon: <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
    { name: 'GitHub', url: 'https://github.com', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /> },
  ];

  return (
    <footer id="contact" className="py-16 bg-[#0B0B0B] border-t border-white/5" data-section-id="#7">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6" data-element-id="#7.1">
              <HORLogo section="#7.1" />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md" data-element-id="#7.tagline">{t('footer.tagline')}</p>

            <div className="flex gap-4" data-element-id="#7.3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-300"
                  data-element-id={`#7.3.${index + 1}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div data-element-id="#7.2">
            <h4 className="text-white font-semibold mb-6" data-element-id="#7.2.title">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    data-element-id={`#7.2.${index + 1}`}
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-element-id="#7.contact">
            <h4 className="text-white font-semibold mb-6" data-element-id="#7.contact.title">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li data-element-id="#7.4.contact-email">hello@nexus.tech</li>
              <li>
                <a
                  href="https://wa.me/201025040945"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-architecture="#7.4.contact-phone"
                  className="text-white hover:text-blue-400 transition-all duration-300 cursor-pointer"
                  style={{
                    textDecoration: "none",
                    fontWeight: 500,
                    letterSpacing: "0.5px"
                  }}
                >
                  01025040945
                </a>
              </li>
              <li data-element-id="#7.4.contact-location">San Francisco, CA</li>
            </ul>
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
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        setDevMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#050505]"
      data-website-id="#ARCHITECTURE-SYSTEM-005"
    >
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <ServicesSection />
      <DevelopersSection />
      <ArticlesSection />
      <Footer />

      <DeveloperModeToggle isActive={devMode} onToggle={() => setDevMode(!devMode)} />
      <ArchitectureInfoPanel isActive={devMode} />
      <SmartInspector isActive={devMode} />
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