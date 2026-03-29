/* ═══════════════════════════════════════════════════════
   MISSION: CINEMATIC POLISH — ENHANCEMENTS.JS
   Additive only. Hooks into existing DOM + GSAP.
   Runs after script.js via DOMContentLoaded priority.
   ═══════════════════════════════════════════════════════ */

(function CinematicEnhancements() {
  'use strict';

  /* ─────────────────────────────────────
     INJECT DOM ELEMENTS
  ───────────────────────────────────── */
  function injectElements() {
    // Film grain overlay
    const grain = document.createElement('div');
    grain.id = 'film-grain';
    document.body.appendChild(grain);

    // Letterbox bars
    ['lb-top','lb-bot'].forEach(cls => {
      const lb = document.createElement('div');
      lb.className = 'letterbox ' + cls;
      document.body.appendChild(lb);
    });

    // HUD corner brackets
    ['hc-tl','hc-tr','hc-bl','hc-br'].forEach(cls => {
      const c = document.createElement('div');
      c.className = 'hud-corner ' + cls;
      document.body.appendChild(c);
    });

    // Scroll progress bar
    const sp = document.createElement('div');
    sp.id = 'scroll-progress';
    document.body.appendChild(sp);

    // Shooting star canvas (deep space section)
    const spaceSection = document.getElementById('space');
    if (spaceSection) {
      const sc = document.createElement('canvas');
      sc.id = 'shooting-canvas';
      spaceSection.appendChild(sc);
    }

    // Glitch scan line (Earth heading)
    const glitchWrap = document.querySelector('.glitch-wrap');
    if (glitchWrap) {
      glitchWrap.style.position = 'relative';
      const scan = document.createElement('div');
      scan.className = 'glitch-scan';
      glitchWrap.appendChild(scan);
    }

    // Section dividers (bottom fade on each section)
    const dividerSections = [
      { id: 'earth',      cls: 'sd-earth'  },
      { id: 'launch',     cls: 'sd-launch' },
      { id: 'space',      cls: 'sd-space'  },
      { id: 'mars-entry', cls: 'sd-entry'  },
    ];
    dividerSections.forEach(({ id, cls }) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const div = document.createElement('div');
      div.className = 'section-divider ' + cls;
      sec.appendChild(div);
    });

    // Bleed lines on each section
    document.querySelectorAll('.section').forEach(sec => {
      const t = document.createElement('div');
      t.className = 'bleed-line bleed-top';
      const b = document.createElement('div');
      b.className = 'bleed-line bleed-bot';
      sec.appendChild(t);
      sec.appendChild(b);
    });

    // Launch ground glow
    const rocketViewport = document.querySelector('.rocket-viewport');
    if (rocketViewport) {
      const glow = document.createElement('div');
      glow.className = 'launch-glow-ground';
      glow.id = 'launch-ground-glow';
      rocketViewport.appendChild(glow);
    }

    // Astronaut silhouette (Earth section)
    const earthSection = document.getElementById('earth');
    if (earthSection) {
      const astro = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      astro.id = 'astronaut';
      astro.setAttribute('viewBox', '0 0 120 200');
      astro.setAttribute('width', '140');
      astro.setAttribute('fill', 'none');
      // Simple astronaut silhouette paths
      astro.innerHTML = `
        <!-- Helmet -->
        <ellipse cx="60" cy="44" rx="28" ry="30" fill="rgba(200,220,255,0.9)" stroke="rgba(150,190,255,0.4)" stroke-width="2"/>
        <ellipse cx="60" cy="46" rx="18" ry="20" fill="rgba(0,30,60,0.5)"/>
        <!-- Visor glare -->
        <ellipse cx="52" cy="38" rx="5" ry="7" fill="rgba(255,255,255,0.15)" transform="rotate(-20,52,38)"/>
        <!-- Suit body -->
        <path d="M32 74 Q28 88 26 110 L94 110 Q92 88 88 74 Q80 66 60 64 Q40 66 32 74Z" fill="rgba(200,215,240,0.85)" stroke="rgba(150,190,255,0.3)" stroke-width="1.5"/>
        <!-- Chest unit -->
        <rect x="46" y="78" width="28" height="18" rx="3" fill="rgba(0,60,120,0.5)" stroke="rgba(0,150,255,0.4)" stroke-width="1"/>
        <rect x="50" y="82" width="8" height="4" rx="1" fill="rgba(0,200,255,0.4)"/>
        <circle cx="66" cy="84" r="3" fill="rgba(255,50,50,0.6)"/>
        <!-- Arms -->
        <path d="M32 74 Q18 90 16 108 L24 110 Q26 94 36 80Z" fill="rgba(190,210,235,0.8)"/>
        <path d="M88 74 Q102 90 104 108 L96 110 Q94 94 84 80Z" fill="rgba(190,210,235,0.8)"/>
        <!-- Gloves -->
        <ellipse cx="18" cy="112" rx="8" ry="6" fill="rgba(160,180,210,0.7)"/>
        <ellipse cx="102" cy="112" rx="8" ry="6" fill="rgba(160,180,210,0.7)"/>
        <!-- Legs -->
        <path d="M40 110 L36 160 L52 160 L56 110Z" fill="rgba(185,205,230,0.8)"/>
        <path d="M80 110 L84 160 L68 160 L64 110Z" fill="rgba(185,205,230,0.8)"/>
        <!-- Boots -->
        <path d="M34 158 Q28 168 32 172 L54 172 L52 158Z" fill="rgba(120,140,170,0.8)"/>
        <path d="M86 158 Q92 168 88 172 L66 172 L68 158Z" fill="rgba(120,140,170,0.8)"/>
        <!-- Neck ring -->
        <rect x="48" y="70" width="24" height="6" rx="2" fill="rgba(150,175,210,0.6)" stroke="rgba(100,150,200,0.4)" stroke-width="1"/>
        <!-- Pack -->
        <rect x="46" y="74" width="28" height="32" rx="3" fill="rgba(160,180,210,0.3)" stroke="rgba(100,150,200,0.2)" stroke-width="1" transform="translate(0 -2)"/>
        <!-- Helmet light -->
        <circle cx="60" cy="20" r="4" fill="rgba(0,200,255,0.5)"/>
        <circle cx="60" cy="20" r="2" fill="rgba(200,240,255,0.8)"/>
      `;
      earthSection.appendChild(astro);
    }
  }

  /* ─────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────
     SHOOTING STARS (Deep Space section)
  ───────────────────────────────────── */
  function initShootingStars() {
    const cvs = document.getElementById('shooting-canvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let w, h;
    const stars = [];

    function resize() {
      w = cvs.width  = cvs.offsetWidth  || window.innerWidth;
      h = cvs.height = cvs.offsetHeight || window.innerHeight;
    }

    function mkStar() {
      return {
        x:     Math.random() * w,
        y:     Math.random() * h * 0.6,
        len:   Math.random() * 100 + 60,
        speed: Math.random() * 8 + 5,
        life:  1,
        decay: Math.random() * 0.012 + 0.006,
        angle: (Math.random() * 20 + 15) * Math.PI / 180, // 15-35° downward
      };
    }

    // Spawn a star every 3-7 seconds
    function scheduleStar() {
      stars.push(mkStar());
      setTimeout(scheduleStar, Math.random() * 4000 + 3000);
    }
    setTimeout(scheduleStar, 2000);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x    += Math.cos(s.angle) * s.speed;
        s.y    += Math.sin(s.angle) * s.speed;
        s.life -= s.decay;
        if (s.life <= 0 || s.x > w + 50 || s.y > h + 50) { stars.splice(i, 1); continue; }

        const tailX = s.x - Math.cos(s.angle) * s.len * s.life;
        const tailY = s.y - Math.sin(s.angle) * s.len * s.life;
        const grad  = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(200,230,255,${s.life * 0.8})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5 * s.life;
        ctx.stroke();

        // Head flare
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,240,255,${s.life * 0.9})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  /* ─────────────────────────────────────
     LAUNCH GROUND GLOW — sync with rocket
  ───────────────────────────────────── */
  function initLaunchGlow() {
    const glow = document.getElementById('launch-ground-glow');
    if (!glow || !window.gsap) return;

    // Watch for flame activation by observing class on r-flame
    const flame = document.getElementById('r-flame');
    if (!flame) return;

    const observer = new MutationObserver(() => {
      if (flame.classList.contains('lit')) {
        glow.classList.add('lit');
      } else {
        glow.classList.remove('lit');
      }
    });
    observer.observe(flame, { attributes: true, attributeFilter: ['class'] });
  }

  /* ─────────────────────────────────────
     BLEED LINE REVEALS (ScrollTrigger)
  ───────────────────────────────────── */
  function initBleedLines() {
    if (!window.ScrollTrigger) return;
    document.querySelectorAll('.section').forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 80%',
        onEnter: () => {
          sec.querySelectorAll('.bleed-line').forEach(line => {
            line.classList.add('revealed');
          });
        },
      });
    });
  }

  /* ─────────────────────────────────────
     HUD VALUE FLIP ANIMATION
     Patches the existing setHUD via MutationObserver.
  ───────────────────────────────────── */
  function initHUDFlip() {
    const targets = ['hud-mission','hud-status','o2-val','spd-val','tmp-val','dst-val'];
    targets.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new MutationObserver(() => {
        el.classList.remove('hud-val-flip');
        void el.offsetWidth; // reflow
        el.classList.add('hud-val-flip');
      });
      obs.observe(el, { characterData: true, childList: true, subtree: true });
    });
  }

  /* ─────────────────────────────────────
     CHECKLIST ROW ARMED STATE
     Enhances existing doCheck visual feedback.
  ───────────────────────────────────── */
  function initChecklistEnhancement() {
    // Observe each cl-dot for 'done' class addition
    document.querySelectorAll('.cl-dot').forEach((dot, i) => {
      const row = dot.closest('.cl-item');
      if (!row) return;
      const obs = new MutationObserver(() => {
        if (dot.classList.contains('done')) {
          row.classList.add('armed');
        }
      });
      obs.observe(dot, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ─────────────────────────────────────
     ROCKET CAMERA BLUR
     As rocket lifts, apply a subtle motion blur to the section.
  ───────────────────────────────────── */
  function initRocketMotionBlur() {
    if (!window.ScrollTrigger || !window.gsap) return;
    ScrollTrigger.create({
      trigger: '#launch',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => {
        const prog = self.progress;
        if (prog > 0.1) {
          const blur = prog * 1.5;
          document.getElementById('rocket').style.filter = `blur(${blur.toFixed(1)}px)`;
        }
      },
      onLeave: () => {
        const r = document.getElementById('rocket');
        if (r) r.style.filter = '';
      },
      onEnterBack: () => {
        const r = document.getElementById('rocket');
        if (r) r.style.filter = '';
      },
    });
  }

  /* ─────────────────────────────────────
     HUD CORNER PULSE ON SECTION CHANGE
  ───────────────────────────────────── */
  function initCornerPulse() {
    if (!window.gsap) return;
    const corners = document.querySelectorAll('.hud-corner');
    if (!corners.length) return;

    // Proxy: observe hud-mission for text changes
    const missionEl = document.getElementById('hud-mission');
    if (!missionEl) return;

    const obs = new MutationObserver(() => {
      gsap.fromTo(corners,
        { opacity: 0.9, scale: 1.15 },
        { opacity: 0.35, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.04 }
      );
    });
    obs.observe(missionEl, { characterData: true, childList: true, subtree: true });
  }

  /* ─────────────────────────────────────
     CINEMATIC SECTION ENTER FLASH
     Brief bright flash on certain section enters.
  ───────────────────────────────────── */
  function initSectionFlash() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const flashSections = [
      { id: 'space',      color: 'rgba(0,100,200,0.06)' },
      { id: 'mars-entry', color: 'rgba(255,40,0,0.08)'  },
      { id: 'colony',     color: 'rgba(200,60,0,0.05)'  },
    ];

    flashSections.forEach(({ id, color }) => {
      const sec = document.getElementById(id);
      if (!sec) return;

      const flashEl = document.createElement('div');
      flashEl.style.cssText = `
        position:absolute;inset:0;background:${color};
        pointer-events:none;z-index:20;opacity:0;
      `;
      sec.appendChild(flashEl);

      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        onEnter: () => {
          gsap.fromTo(flashEl,
            { opacity: 1 },
            { opacity: 0, duration: 1.2, ease: 'power2.out' }
          );
        },
      });
    });
  }

  /* ─────────────────────────────────────
     DEEP SPACE — SLOW FOREGROUND STARS PARALLAX (mouse)
     Adds subtle mouse-driven depth to the space section.
  ───────────────────────────────────── */
  function initSpaceMouseDepth() {
    if (!window.gsap) return;
    const spaceSection = document.getElementById('space');
    if (!spaceSection) return;

    spaceSection.addEventListener('mousemove', e => {
      const { left, top, width, height } = spaceSection.getBoundingClientRect();
      const cx = (e.clientX - left) / width  - 0.5;
      const cy = (e.clientY - top)  / height - 0.5;

      gsap.to('#px-planets', { x: cx * 14, y: cy * 8,  duration: 2, ease: 'power2.out', overwrite: 'auto' });
      gsap.to('#px-nebula',  { x: cx *  8, y: cy * 5,  duration: 3, ease: 'power2.out', overwrite: 'auto' });
    });
  }

  /* ─────────────────────────────────────
     COLONY FINAL MESSAGE WORD-BY-WORD REVEAL
     When the final message becomes visible, each word
     fades in sequentially for a typewriter-like feel.
  ───────────────────────────────────── */
  function initFinalMessageReveal() {
    if (!window.gsap) return;
    const fm = document.getElementById('final-msg');
    const quote = fm ? fm.querySelector('.fm-quote') : null;
    if (!quote) return;

    // Split into word spans (only once)
    let wrapped = false;
    const obs = new MutationObserver(() => {
      if (wrapped || !fm.classList.contains('visible')) return;
      wrapped = true;

      // Walk text nodes and wrap each word
      const walker = document.createTreeWalker(quote, NodeFilter.SHOW_TEXT, null);
      const nodes  = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);

      nodes.forEach(tn => {
        const words = tn.textContent.split(/(\s+)/);
        const frag  = document.createDocumentFragment();
        words.forEach(w => {
          if (/^\s+$/.test(w) || w === '') {
            frag.appendChild(document.createTextNode(w));
          } else {
            const sp = document.createElement('span');
            sp.textContent = w;
            sp.style.cssText = 'display:inline-block;opacity:0;transform:translateY(4px);';
            frag.appendChild(sp);
          }
        });
        tn.parentNode.replaceChild(frag, tn);
      });

      // Animate words in
      const wordSpans = quote.querySelectorAll('span');
      gsap.to([...wordSpans], {
        opacity: 1, y: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.2,
      });
    });

    obs.observe(fm, { attributes: true, attributeFilter: ['class'] });
  }

  /* ─────────────────────────────────────
     INTERACTIVE: BUILD BUTTON PARTICLE BURST
     When a module is built, emit CSS particle burst.
  ───────────────────────────────────── */
  function initBuildParticleBurst() {
    if (!window.gsap) return;

    // Patch: observe bstat elements for "BUILT" text
    document.querySelectorAll('[id^="bst-"]').forEach(el => {
      const btn = el.closest('.build-btn');
      if (!btn) return;
      const obs = new MutationObserver(() => {
        if (el.textContent.includes('BUILT')) {
          emitParticleBurst(btn);
        }
      });
      obs.observe(el, { characterData: true, childList: true, subtree: true });
    });
  }

  function emitParticleBurst(origin) {
    const rect = origin.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      const angle = (i / 14) * Math.PI * 2;
      const dist  = 40 + Math.random() * 30;
      p.style.cssText = `
        position:fixed;z-index:9500;pointer-events:none;
        width:4px;height:4px;border-radius:50%;
        background:rgba(0,255,150,0.9);
        box-shadow:0 0 6px rgba(0,255,150,0.6);
        left:${cx}px;top:${cy}px;
        transform:translate(-50%,-50%);
      `;
      document.body.appendChild(p);
      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        duration: 0.6 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => p.remove(),
      });
    }
  }

  /* ─────────────────────────────────────
     AMBIENT LENS FLARE
     Occasional subtle lens flare in deep space.
  ───────────────────────────────────── */
  function initLensFlare() {
    if (!window.gsap) return;
    const spaceSection = document.getElementById('space');
    if (!spaceSection) return;

    const flare = document.createElement('div');
    flare.style.cssText = `
      position:absolute;
      pointer-events:none;z-index:6;
      width:200px;height:200px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(200,240,255,0.12) 0%,rgba(150,210,255,0.04) 30%,transparent 70%);
      opacity:0;
      mix-blend-mode:screen;
    `;
    spaceSection.appendChild(flare);

    function doFlare() {
      const x = 15 + Math.random() * 70;
      const y = 10 + Math.random() * 60;
      gsap.set(flare, { left: x + '%', top: y + '%', opacity: 0 });
      gsap.to(flare, {
        opacity: 1, duration: 0.3, ease: 'power2.out',
        onComplete: () => gsap.to(flare, { opacity: 0, duration: 1.5, ease: 'power2.in' }),
      });
      setTimeout(doFlare, 8000 + Math.random() * 10000);
    }
    setTimeout(doFlare, 6000);
  }

  /* ─────────────────────────────────────
     STABILIZE BUTTON — CHARGING ANIMATION
     Visual "hold" effect before the button is pressed.
  ───────────────────────────────────── */
  function initStabilizeCharge() {
    const btn = document.getElementById('stab-btn');
    if (!btn || !window.gsap) return;

    // Add a charge bar inside the button
    const chargeBar = document.createElement('div');
    chargeBar.style.cssText = `
      position:absolute;bottom:0;left:0;width:0%;height:2px;
      background:linear-gradient(90deg,rgba(255,100,30,0.6),rgba(255,30,0,1));
      box-shadow:0 0 6px rgba(255,50,0,0.7);
      transition:none;pointer-events:none;z-index:2;
    `;
    btn.appendChild(chargeBar);

    // Charge on hover
    let chargeAnim = null;
    btn.addEventListener('mouseenter', () => {
      chargeAnim = gsap.to(chargeBar, { width: '100%', duration: 1.8, ease: 'power1.in' });
    });
    btn.addEventListener('mouseleave', () => {
      if (chargeAnim) chargeAnim.kill();
      gsap.to(chargeBar, { width: '0%', duration: 0.3, ease: 'power2.out' });
    });
  }

  /* ─────────────────────────────────────
     INIT ALL ENHANCEMENTS
  ───────────────────────────────────── */
  function init() {
    injectElements();
    initScrollProgress();
    initShootingStars();
    initLaunchGlow();
    initBleedLines();
    initHUDFlip();
    initChecklistEnhancement();
    initRocketMotionBlur();
    initCornerPulse();
    initSectionFlash();
    initSpaceMouseDepth();
    initFinalMessageReveal();
    initBuildParticleBurst();
    initLensFlare();
    initStabilizeCharge();
  }

  // Run after main script (which also uses DOMContentLoaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready — schedule after current frame so GSAP is registered
    requestAnimationFrame(init);
  }

})();
