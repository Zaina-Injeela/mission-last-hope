/* ═══════════════════════════════════════════════════════════════
   MISSION: UPGRADE LAYER — upgrade.js
   1. Storytelling text upgrades (injected into DOM)
   2. Section fade-overlay transitions
   3. Micro-interaction enhancements
   ═══════════════════════════════════════════════════════════════
   Load after enhancements.js:
     <script src="upgrade.js"></script>
   ═══════════════════════════════════════════════════════════════ */

(function UpgradeLayer() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     1. STORYTELLING TEXT UPGRADES
     Replace/inject improved text into existing DOM nodes.
  ═══════════════════════════════════════════════════════════════ */

  /* ── 1a. TYPEWRITER LINES — Earth section (injected via initTyping) ── */
  // Override the lines array in script.js by patching after DOMContentLoaded.
  // We re-define the cycling messages to match the upgraded tone.
  const UPGRADED_TYPING_LINES = [
    'COMMANDER NOVA — THEY ARE ALL COUNTING ON YOU',
    'ATMOSPHERE: T-MINUS 14 MINUTES TO TOTAL COLLAPSE',
    'GENOME ARCHIVE: 8.2B SOULS SEALED — DO NOT FAIL THEM',
    'ARES-7 STANDING BY — THIS IS HUMANITIES LAST BREATH',
  ];

  /* ── 1b. WARNING TICKER — Earth section ── */
  // Upgraded ticker text — more visceral and urgent
  const UPGRADED_TICKER_HTML = `
    <span>⚠ CIVILISATION-LEVEL EXTINCTION EVENT — CONFIRMED</span><span class="wt-sep">◆</span>
    <span>ATMOSPHERE COLLAPSE: T-14 MIN — NO REVERSAL POSSIBLE</span><span class="wt-sep">◆</span>
    <span>SEVEN BILLION PEOPLE HAVE NO ONE ELSE</span><span class="wt-sep">◆</span>
    <span>ARES-7 IS THE ONLY SHIP LEFT</span><span class="wt-sep">◆</span>
    <span>COMMANDER NOVA — YOU ARE THE LAST BREATH OF EARTH</span><span class="wt-sep">◆</span>
    <span>⚠ CIVILISATION-LEVEL EXTINCTION EVENT — CONFIRMED</span><span class="wt-sep">◆</span>
    <span>ATMOSPHERE COLLAPSE: T-14 MIN — NO REVERSAL POSSIBLE</span><span class="wt-sep">◆</span>
    <span>SEVEN BILLION PEOPLE HAVE NO ONE ELSE</span><span class="wt-sep">◆</span>
  `;

  /* ── 1c. BRIEFING CARD — Earth section ── */
  const UPGRADED_BRIEFING = `
    <p>
      Earth has <strong>14 minutes</strong>.
      Not hours. Not days. <em>Minutes.</em><br>
      You are <strong>Commander Nova</strong> — the last calculated bet of a dying species.
      Aboard <strong>ARES-7</strong>, you carry what remains of everyone who ever lived, loved, or dreamed.
      Your mission is one word: <strong>Mars.</strong><br><br>
      <em>Don't look back. There is nothing left behind you.</em>
    </p>
  `;

  /* ── 1d. SPACE SECTION stats ── */
  const UPGRADED_SPACE_STATS_HTML = `
    <span>7 MONTHS</span><span class="ss-dot">·</span>
    <span>54.6M KM</span><span class="ss-dot">·</span>
    <span>NO SIGNAL. NO RESCUE. NO TURNING BACK.</span>
  `;

  /* ── 1e. LOG MODAL DATA — UPGRADED ── */
  // We inject upgraded log content via a patched openLog function.
  const UPGRADED_LOG_DATA = [
    {
      day: 'DAY 012',
      type: 'PERSONAL LOG',
      sig: 'SIG: ████░░',
      body: `Earth is gone.<br><br>
Not in the abstract. Not a metaphor. Gone. I watched the atmosphere fold in the rear cameras until the blue faded to grey, then nothing. I kept the feed running for six hours. I don't know why. Maybe I needed to see it to believe it.<br><br>
My daughter drew a picture. ARES-7 with a smiley face on the nose cone. She pressed it to the blast shield glass and held it there until I disappeared into the cloud cover. I have it taped above my console.<br><br>
<em>Eight billion people. Every one of them is riding on this ship right now, whether they know it or not.</em><br><br>
Focus, Nova. Focus.`
    },
    {
      day: 'DAY 089',
      type: 'MISSION CONTROL',
      sig: 'SIG: ███░░░',
      body: `Commander Nova.<br><br>
We're losing power in segments. North America went dark three days ago. Europe follows tonight. We're transmitting from a generator in a bunker that won't hold another week.<br><br>
We wanted you to hear it from us directly, not from silence: <em>you are the only thing still moving forward.</em> Not just for us — for everything our species ever built, believed, or became.<br><br>
Keep the archive intact. Keep yourself alive. Come back to us in the only way that still matters now — as proof that we deserved to survive.<br><br>
We love you, Commander.<br><br>
— Director Chen · Mission Control · Earth`
    },
    {
      day: 'DAY 147',
      type: 'ENCRYPTED BURST',
      sig: 'SIG: █░░░░░',
      body: `AUTOMATED RELAY — PRE-PROGRAMMED CONTINGENCY.<br><br>
Mission Control has gone silent.<br><br>
If you are reading this, you are alone now. Not alone like loneliness. Alone like the last candle in a blackout. There is no one left to call. No one left to hear you. The signal that used to fill this channel with voices is just static now.<br><br>
We wrote this for you before the end, knowing this day would come. Knowing you'd need to hear something human in the dark.<br><br>
<em>You are not forgotten. You are the reason we were not forgotten.</em><br><br>
End of transmission.`
    },
    {
      day: 'DAY 214',
      type: 'FINAL APPROACH',
      sig: 'SIG: ██████',
      body: `Mars fills the viewport.<br><br>
Red and ancient and indifferent and <em>beautiful.</em> I've been staring at it for twenty minutes. I can't look away.<br><br>
The genome archive reads 8,214,392,066 records intact. I checked it three times. I'll check it again before entry. Every single one of those numbers is a person who laughed, who grieved, who looked up at the sky and wondered.<br><br>
They wondered about this. Right here. This planet. This moment.<br><br>
If this is my last log — then know that I wasn't afraid. I was exactly where I was supposed to be.<br><br>
Atmospheric entry in four hours. Next transmission will be from the surface.<br><br>
<em>This is Commander Nova. The void was worth crossing.</em>`
    },
  ];

  /* ── 1f. MARS ENTRY WARNINGS — UPGRADED ── */
  const UPGRADED_ENTRY_WARNINGS = [
    { dot: 'red',   text: 'PLASMA SHEATH FORMING — HULL ABLATING' },
    { dot: 'red',   text: 'HULL TEMP: 1,650°C — CRITICAL THRESHOLD', delay: '.3s' },
    { dot: 'amber', text: 'ALL COMMS SEVERED — YOU ARE UNREACHABLE', delay: '.6s' },
    { dot: 'red',   text: 'STRUCTURAL INTEGRITY: 6% MARGIN REMAINING', delay: '.9s' },
    { dot: 'amber', text: '⚠ PARACHUTE DEPLOY WINDOW: 38 SECONDS', delay: '1.2s' },
  ];

  /* ── 1g. COLONY FINAL MESSAGE — UPGRADED ── */
  const UPGRADED_FINAL_QUOTE = `
    Earth is gone. What we built there — the cities, the languages,
    the music, the grief, the love — we carry all of it now.<br><br>
    This red dust has never known footprints before ours.<br>
    These stars have never been named by human eyes.<br><br>
    We didn't survive by accident.<br>
    We survived because someone refused to give up.<br><br>
    <strong>Begin.</strong>
  `;

  /* ── INJECT: Ticker ── */
  function upgradeTickerText() {
    const inner = document.querySelector('.wt-inner');
    if (inner) inner.innerHTML = UPGRADED_TICKER_HTML + UPGRADED_TICKER_HTML;
  }

  /* ── INJECT: Briefing card body ── */
  function upgradeBriefingText() {
    const card = document.querySelector('.briefing-card');
    if (!card) return;
    const p = card.querySelector('p');
    if (p) p.outerHTML = UPGRADED_BRIEFING;
  }

  /* ── INJECT: Space section stats ── */
  function upgradeSpaceStats() {
    const stats = document.querySelector('.space-stats');
    if (stats) stats.innerHTML = UPGRADED_SPACE_STATS_HTML;
  }

  /* ── INJECT: Mars entry warnings ── */
  function upgradeEntryWarnings() {
    const container = document.getElementById('entry-warnings');
    if (!container) return;
    container.innerHTML = UPGRADED_ENTRY_WARNINGS.map(w => `
      <div class="ew-item blink-item" ${w.delay ? `style="animation-delay:${w.delay}"` : ''}>
        <span class="ew-dot ${w.dot}"></span>${w.text}
      </div>
    `).join('');
  }

  /* ── INJECT: Colony final message quote ── */
  function upgradeFinalMessage() {
    const quote = document.querySelector('.fm-quote');
    if (quote) quote.innerHTML = UPGRADED_FINAL_QUOTE;
    const cite = document.querySelector('.final-msg cite');
    if (cite) cite.textContent = '— Commander Nova · Sol 1 · Colony Zero · Mars · Year Zero';
  }

  /* ── PATCH: Typewriter lines (replace in-flight) ── */
  function patchTypingLines() {
    // We patch the global closure by overriding the typed-text element's
    // driving array via a module-level variable trick. Since initTyping()
    // already started, we re-run our own parallel typewriter that takes over.
    const el = document.getElementById('typed-text');
    if (!el) return;

    // Stop the existing typewriter by clearing the element reference
    // (it will keep running on its stale reference with the old lines,
    // so instead we layer over it by replacing the element clone)
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);

    let li = 0, ci = 0, del = false;
    function type() {
      const cur = UPGRADED_TYPING_LINES[li];
      clone.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
      del ? ci-- : ci++;
      if (!del && ci === cur.length) { setTimeout(type, 2200); del = true; return; }
      if (del && ci === 0) { del = false; li = (li + 1) % UPGRADED_TYPING_LINES.length; setTimeout(type, 350); return; }
      setTimeout(type, del ? 20 : 48);
    }
    type();
  }

  /* ── PATCH: Log data ── */
  function patchLogData() {
    // Override the global openLog function to use upgraded log data
    window.openLog = function(idx) {
      const data = UPGRADED_LOG_DATA[idx];
      const dayEl   = document.getElementById('lm-day');
      const typeEl  = document.getElementById('lm-type');
      const bodyEl  = document.getElementById('lm-body');
      const sigEl   = document.getElementById('lm-sig');
      const modal   = document.getElementById('log-modal');
      if (!modal) return;

      if (dayEl)  dayEl.textContent  = data.day;
      if (typeEl) typeEl.textContent = data.type;
      if (bodyEl) bodyEl.innerHTML   = data.body;
      if (sigEl)  sigEl.textContent  = data.sig;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Signal degradation animation
      const bars = ['██████','█████░','████░░','███░░░','██░░░░','█░░░░░'];
      let bi = 0;
      const tick = setInterval(() => {
        bi = (bi + 1) % bars.length;
        if (sigEl) sigEl.textContent = 'SIG: ' + bars[bi];
      }, 600);
      modal._clearSig = () => clearInterval(tick);
    };
  }

  /* ── INJECT: upgraded log card previews ── */
  function upgradeLogPreviews() {
    const previews = document.querySelectorAll('.sl-preview');
    const upgraded = [
      '"The blue is gone. Earth is just static now."',
      '"Power is failing. This is our last transmission."',
      '"Mission Control has gone silent. You are alone."',
      '"Mars fills the viewport. I am not afraid."',
    ];
    previews.forEach((el, i) => {
      if (upgraded[i]) el.textContent = upgraded[i];
    });
  }

  /* ═══════════════════════════════════════════════════════════
     2. SECTION FADE-OVERLAY CINEMATIC TRANSITIONS
     Black overlay pulses between sections for
     a cinematic cut-to-black feel on scroll entry.
  ═══════════════════════════════════════════════════════════════ */

  function initSectionFadeOverlay() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'section-fade-overlay';
    document.body.appendChild(overlay);

    // Track current section index
    let lastSectionIdx = -1;

    // Watch for section changes via ScrollTrigger callbacks
    // We hook into updateNavDots which is called on section change
    const originalUpdateNavDots = window.updateNavDots;
    if (typeof originalUpdateNavDots === 'function') {
      window.updateNavDots = function(idx) {
        originalUpdateNavDots(idx);
        if (idx !== lastSectionIdx && lastSectionIdx !== -1) {
          triggerSectionFade();
        }
        lastSectionIdx = idx;
      };
    }

    function triggerSectionFade() {
      overlay.classList.add('fading');
      setTimeout(() => overlay.classList.remove('fading'), 500);
    }

    // Also trigger on scrollToSection calls (nav dot clicks)
    const originalScrollToSection = window.scrollToSection;
    if (typeof originalScrollToSection === 'function') {
      window.scrollToSection = function(idx) {
        triggerSectionFade();
        originalScrollToSection(idx);
      };
    }
  }

  /* ═══════════════════════════════════════════════════════════
     3. MICRO-INTERACTION ENHANCEMENTS
     Cursor glow states, card stagger reveals,
     click ripple feedback, hover depth effects
  ═══════════════════════════════════════════════════════════════ */

  /* ── 3a. Cursor hover & click states ── */
  function initCursorInteractions() {
    const interactiveSelectors = [
      'button', 'a', '.sig-log', '.sn-dot',
      '.crisis-card', '.build-btn', '#mute-btn',
    ];
    const selector = interactiveSelectors.join(',');

    document.addEventListener('mouseover', e => {
      if (e.target.closest(selector)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(selector)) {
        document.body.classList.remove('cursor-hover');
      }
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-click');
    });
  }

  /* ── 3b. Click ripple effect ── */
  function initClickRipple() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('button');
      if (!btn) return;

      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position:absolute;
        left:${x}px; top:${y}px;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:rgba(0,200,255,0.18);
        transform:scale(0);
        pointer-events:none;
        z-index:10;
        animation: rippleOut 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
      `;

      // Ensure button has overflow hidden
      const prevOverflow = btn.style.overflow;
      btn.style.overflow = 'hidden';
      btn.style.position = 'relative';
      btn.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
        btn.style.overflow = prevOverflow;
      });
    });

    // Inject keyframe if not already present
    if (!document.getElementById('ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes rippleOut {
          to { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ── 3c. Card stagger reveals via IntersectionObserver ── */
  function initCardStaggerReveal() {
    // Apply stagger class to targetable card groups
    const staggerGroups = [
      { selector: '.crisis-card',  baseDelay: 0 },
      { selector: '.sig-log',      baseDelay: 0 },
      { selector: '.cs',           baseDelay: 0 },
      { selector: '.col-mod',      baseDelay: 0 },
    ];

    staggerGroups.forEach(({ selector, baseDelay }) => {
      const items = document.querySelectorAll(selector);
      items.forEach((item, i) => {
        item.classList.add('card-stagger');
        item.style.transitionDelay = `${baseDelay + i * 0.08}s`;
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('entered');
          // Unobserve after triggering once
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.card-stagger').forEach(el => observer.observe(el));
  }

  /* ── 3d. Log card hover: typewriter blip on READ CTA ── */
  function initLogCardHoverFx() {
    document.querySelectorAll('.sig-log').forEach(log => {
      const cta = log.querySelector('.sl-cta');
      if (!cta) return;
      const original = cta.textContent;

      log.addEventListener('mouseenter', () => {
        cta.textContent = 'DECRYPTING ▊';
        let i = 0;
        const frames = ['DECRYPTING ▊','DECRYPTING ░','DECRYPTING ▊','READ TRANSMISSION ›'];
        const timer = setInterval(() => {
          i++;
          cta.textContent = frames[Math.min(i, frames.length - 1)];
          if (i >= frames.length - 1) clearInterval(timer);
        }, 180);
        log._hoverTimer = timer;
      });

      log.addEventListener('mouseleave', () => {
        if (log._hoverTimer) clearInterval(log._hoverTimer);
        cta.textContent = original;
      });
    });
  }

  /* ── 3e. Build button: count-up feedback on build ── */
  function initBuildFeedback() {
    // Patch buildModule to add a flash feedback
    const originalBuild = window.buildModule;
    if (typeof originalBuild === 'function') {
      window.buildModule = function(type) {
        originalBuild(type);

        // Flash the HUD briefly green
        const hudStatus = document.getElementById('hud-status');
        if (hudStatus) {
          const prev = hudStatus.textContent;
          const prevCls = hudStatus.className;
          hudStatus.textContent = '+ MODULE DEPLOYED';
          hudStatus.className = 'hud-value hv-green';
          setTimeout(() => {
            hudStatus.textContent = prev;
            hudStatus.className = prevCls;
          }, 1400);
        }
      };
    }
  }

  /* ── 3f. Entry alarm visual: flash border on mars section ── */
  function initMarsEntryIntensify() {
    const marsSection = document.getElementById('mars-entry');
    if (!marsSection || !window.gsap) return;

    // Enhanced: periodically pulse a red outline around the viewport
    const redFrame = document.createElement('div');
    redFrame.style.cssText = `
      position:absolute;inset:0;z-index:5;pointer-events:none;
      border:0px solid rgba(255,30,10,0);
      box-shadow:inset 0 0 0px rgba(255,30,10,0);
      transition:border 0.15s,box-shadow 0.15s;
    `;
    marsSection.appendChild(redFrame);

    function pulseRed() {
      redFrame.style.border = '2px solid rgba(255,30,10,0.55)';
      redFrame.style.boxShadow = 'inset 0 0 40px rgba(255,30,10,0.1)';
      setTimeout(() => {
        redFrame.style.border = '0px solid rgba(255,30,10,0)';
        redFrame.style.boxShadow = 'inset 0 0 0px rgba(255,30,10,0)';
      }, 280);
    }

    // Pulse every 2.2 seconds while in mars entry section
    let pulseInterval = null;

    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: '#mars-entry',
        start: 'top 60%',
        end: 'bottom top',
        onEnter: () => { pulseInterval = setInterval(pulseRed, 2200); },
        onLeave: () => { clearInterval(pulseInterval); },
        onEnterBack: () => { pulseInterval = setInterval(pulseRed, 2200); },
        onLeaveBack: () => { clearInterval(pulseInterval); },
      });
    }
  }

  /* ─────────────────────────────────────
     INIT ALL UPGRADES
  ───────────────────────────────────── */
  function init() {
    // 1. Text upgrades
    upgradeTickerText();
    upgradeBriefingText();
    upgradeSpaceStats();
    upgradeEntryWarnings();
    upgradeFinalMessage();
    upgradeLogPreviews();
    patchTypingLines();
    patchLogData();

    // 2. Transition
    initSectionFadeOverlay();

    // 3. Micro-interactions
    initCursorInteractions();
    initClickRipple();
    initCardStaggerReveal();
    initLogCardHoverFx();
    initBuildFeedback();
    initMarsEntryIntensify();
  }

  // Schedule after both script.js and enhancements.js DOMContentLoaded handlers
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => requestAnimationFrame(init)));
  } else {
    requestAnimationFrame(() => requestAnimationFrame(init));
  }

})();
