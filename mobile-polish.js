/* ═══════════════════════════════════════════════════════════════════
   MISSION: MOBILE + POLISH — JS ADJUSTMENTS
   Load LAST: after script.js, enhancements.js, upgrade.js
   ═══════════════════════════════════════════════════════════════════ */

(function MobilePolishLayer() {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     UTILITY
  ───────────────────────────────────────────────────────────── */
  const isTouchDevice   = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isSmallScreen   = () => window.innerWidth <= 768;
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     1. CURSOR: hide on touch devices
  ───────────────────────────────────────────────────────────── */
  function patchCursorForTouch() {
    if (!isTouchDevice()) return;
    document.body.style.cursor = 'auto';
    // Hide the custom cursor elements entirely on touch
    ['cursor-dot','cursor-ring'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. PARALLAX: disable on touch (causes jank)
  ───────────────────────────────────────────────────────────── */
  function disableMobileParallax() {
    if (!isTouchDevice() || !window.ScrollTrigger) return;

    // Kill scroll-driven parallax tweens
    const parallaxIds = ['px-bg', 'px-nebula', 'px-planets', 'px-particles'];
    parallaxIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      // Kill all GSAP tweens on this element
      if (window.gsap) gsap.killTweensOf(el);
      el.style.transform  = 'none';
      el.style.willChange = 'auto';
    });

    // Also kill mouse-parallax on earth canvas
    const earthCanvas = document.getElementById('earth-canvas');
    if (earthCanvas && window.gsap) gsap.killTweensOf(earthCanvas);
  }

  /* ─────────────────────────────────────────────────────────────
     3. CANVAS PERFORMANCE: reduce visual weight on mobile
  ───────────────────────────────────────────────────────────── */
  function patchCanvasForMobile() {
    if (!isSmallScreen()) return;

    // Reduce nebula blur (cheaper composite)
    document.querySelectorAll('.nebula').forEach(el => {
      el.style.filter = 'blur(50px)';
    });

    // Film grain: less opacity = fewer composite layers triggered
    const grain = document.getElementById('film-grain');
    if (grain) grain.style.opacity = '0.015';

    // Shooting stars: dim on mobile, not critical to the narrative
    const shooting = document.getElementById('shooting-canvas');
    if (shooting) shooting.style.opacity = '0.5';

    // Reduce particle canvas opacity to ease fill-rate
    const particle = document.getElementById('particle-canvas');
    if (particle) particle.style.opacity = '0.6';
  }

  /* ─────────────────────────────────────────────────────────────
     4. NAV DOTS: touch feedback + proper hit area
  ───────────────────────────────────────────────────────────── */
  function patchNavDotsForTouch() {
    if (!isTouchDevice()) return;

    const nav = document.getElementById('section-nav');
    if (nav) nav.style.pointerEvents = 'all';

    document.querySelectorAll('.sn-dot').forEach(dot => {
      dot.style.pointerEvents = 'all';
      // Bigger touch target
      dot.style.padding = '6px';

      dot.addEventListener('touchstart', function () {
        this.style.transform = 'scale(1.6)';
        this.style.background = 'var(--blue, #0af)';
      }, { passive: true });

      dot.addEventListener('touchend', function () {
        setTimeout(() => { this.style.transform = ''; }, 220);
      }, { passive: true });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     5. SIGNAL LOG CARDS: clear JS-set transforms on mobile
  ───────────────────────────────────────────────────────────── */
  function patchLogCardsForMobile() {
    if (!isSmallScreen()) return;
    document.querySelectorAll('.sig-log').forEach(log => {
      log.style.animation = 'none';
      log.style.transform  = 'none';
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. LOG MODAL: swipe-down to close (touch)
  ───────────────────────────────────────────────────────────── */
  function initModalSwipeClose() {
    const modal = document.getElementById('log-modal');
    if (!modal || !isTouchDevice()) return;

    const panel = modal.querySelector('.lm-panel');
    if (!panel) return;

    let startY = 0;

    panel.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    panel.addEventListener('touchmove', e => {
      const delta = e.touches[0].clientY - startY;
      if (delta > 0) {
        // Visual drag feedback
        panel.style.transform = `translateY(${Math.min(delta * 0.4, 60)}px)`;
        panel.style.opacity   = String(1 - delta / 400);
      }
    }, { passive: true });

    panel.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientY - startY;
      if (delta > 80) {
        panel.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        panel.style.transform  = 'translateY(100px)';
        panel.style.opacity    = '0';
        setTimeout(() => {
          if (typeof window.closeLog === 'function') window.closeLog();
          panel.style.transform  = '';
          panel.style.opacity    = '';
          panel.style.transition = '';
        }, 260);
      } else {
        // Snap back
        panel.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        panel.style.transform  = '';
        panel.style.opacity    = '';
        setTimeout(() => { panel.style.transition = ''; }, 220);
      }
    }, { passive: true });

    // Swipe hint text
    const foot = modal.querySelector('.lm-foot');
    if (foot) {
      const hint = document.createElement('div');
      hint.textContent = '↓ swipe to close';
      hint.style.cssText = `
        text-align:center;font-size:9px;letter-spacing:2px;
        font-family:var(--font-m,'Share Tech Mono',monospace);
        color:rgba(80,120,180,0.45);padding-top:8px;
      `;
      foot.after(hint);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     7. REDUCED MOTION: slow GSAP, hide distracting canvases
  ───────────────────────────────────────────────────────────── */
  function applyReducedMotion() {
    if (!isReducedMotion()) return;

    if (window.gsap) {
      // Don't set to 0 — completely breaks scroll triggers.
      // 0.35 is slow enough to be non-distracting yet keeps ScrollTrigger working.
      gsap.globalTimeline.timeScale(0.35);
    }

    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) particleCanvas.style.opacity = '0.25';

    const shootingCanvas = document.getElementById('shooting-canvas');
    if (shootingCanvas) shootingCanvas.style.display = 'none';

    const filmGrain = document.getElementById('film-grain');
    if (filmGrain) filmGrain.style.display = 'none';
  }

  /* ─────────────────────────────────────────────────────────────
     8. HUD OVERFLOW GUARD
        Ensure HUD top bar never overlaps content on small screens.
  ───────────────────────────────────────────────────────────── */
  function guardHUDOverflow() {
    const hudTop = document.querySelector('.hud-top');
    if (!hudTop || !isSmallScreen()) return;

    function updatePadding() {
      const hudH = hudTop.getBoundingClientRect().height;
      const needed = hudH + 8;
      document.querySelectorAll('.section').forEach(sec => {
        const cur = parseInt(getComputedStyle(sec).paddingTop) || 0;
        if (needed > cur) sec.style.paddingTop = needed + 'px';
      });
      const ticker = document.querySelector('.warning-ticker');
      if (ticker) ticker.style.top = hudH + 'px';
    }

    window.addEventListener('resize',            updatePadding, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(updatePadding, 200));
    updatePadding();
  }

  /* ─────────────────────────────────────────────────────────────
     9. ROCKET ASCENT: shorten distance on mobile
        The -520px ascent is too tall for small viewports.
  ───────────────────────────────────────────────────────────── */
  function patchRocketForMobile() {
    if (!isSmallScreen() || !window.ScrollTrigger) return;

    // Wait one frame so script.js has registered its triggers
    requestAnimationFrame(() => {
      ScrollTrigger.getAll().forEach(trigger => {
        // Identify the rocket tween by its target element
        if (trigger.animation) {
          const tween = trigger.animation;
          const targets = tween.targets ? tween.targets() : [];
          const hasRocket = targets.some(t => t && t.id === 'rocket');
          if (hasRocket) {
            // Update the end value for the scrubbed tween
            gsap.set('#rocket', { clearProps: 'y' });
            tween.vars.y = -280;
            trigger.refresh();
          }
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     10. VIEWPORT HEIGHT FIX (iOS Safari 100vh bug)
  ───────────────────────────────────────────────────────────── */
  function fixViewportHeight() {
    function setVH() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    setVH();
    window.addEventListener('resize',            setVH, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(setVH, 150));

    // Inject fallback rule — prefer dvh natively, fall back to --vh
    const style = document.createElement('style');
    style.textContent = `
      @supports not (min-height: 100dvh) {
        .section { min-height: calc(var(--vh, 1vh) * 100) !important; }
      }
      @supports (min-height: 100dvh) {
        .section { min-height: 100dvh; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────────────────────
     11. SCROLL TRIGGER REFRESH on orientation change
  ───────────────────────────────────────────────────────────── */
  function refreshOnOrientationChange() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }, 350);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     12. TOUCH RIPPLE — visible tap feedback on mobile buttons
  ───────────────────────────────────────────────────────────── */
  function patchRippleForTouch() {
    if (!isTouchDevice()) return;

    // Inject ripple keyframes if upgrade.js hasn't already
    if (!document.getElementById('ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `@keyframes rippleOut { to { transform:scale(1); opacity:0; } }`;
      document.head.appendChild(style);
    }

    document.addEventListener('touchstart', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;

      const touch = e.touches[0];
      const rect  = btn.getBoundingClientRect();
      const size  = Math.max(rect.width, rect.height) * 1.3;
      const x     = touch.clientX - rect.left - size / 2;
      const y     = touch.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(0,200,255,0.18);transform:scale(0);
        pointer-events:none;z-index:10;
        animation:rippleOut 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
      `;
      btn.style.overflow = 'hidden';
      btn.style.position = 'relative';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────
     13. PAGE VISIBILITY: mute audio & pause GSAP when hidden
         This prevents audio bleeding through when tab is backgrounded.
  ───────────────────────────────────────────────────────────── */
  function initVisibilityAudio() {
    document.addEventListener('visibilitychange', () => {
      // Access the shared audio state from script.js globals
      const ctx    = window.__audioCtx    || null;
      const master = window.__masterGain  || null;
      if (!ctx || !master) return;

      if (document.hidden) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(0, ctx.currentTime);
      } else {
        // Only restore if not user-muted
        if (!window.audioMuted) {
          const target = window.lastSectionGain || 0.18;
          master.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.4);
        }
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     14. SOUND HINT: auto-dismiss after 6 seconds
  ───────────────────────────────────────────────────────────── */
  function autoDismissSoundHint() {
    const hint = document.getElementById('sound-hint');
    if (!hint) return;
    setTimeout(() => {
      hint.style.transition = 'opacity 0.6s ease';
      hint.style.opacity    = '0';
      setTimeout(() => { hint.style.display = 'none'; }, 650);
    }, 6000);
  }

  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */
  function init() {
    patchCursorForTouch();
    disableMobileParallax();
    patchCanvasForMobile();
    patchNavDotsForTouch();
    patchLogCardsForMobile();
    initModalSwipeClose();
    applyReducedMotion();
    guardHUDOverflow();
    fixViewportHeight();
    refreshOnOrientationChange();
    patchRippleForTouch();
    initVisibilityAudio();
    autoDismissSoundHint();

    // Rocket patch runs after ScrollTrigger is settled
    if (window.ScrollTrigger) {
      patchRocketForMobile();
    } else {
      document.addEventListener('DOMContentLoaded', patchRocketForMobile);
    }
  }

  // Run after all other DOMContentLoaded handlers (triple rAF ensures GSAP is ready)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(init)))
    );
  } else {
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(init)));
  }

})();
