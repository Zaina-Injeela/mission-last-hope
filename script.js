/* ═══════════════════════════════════════════════════
   MISSION: YOU ARE THE LAST HOPE — ENHANCED SCRIPT
   ═══════════════════════════════════════════════════ */
'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  function tick() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ─────────────────────────────────────
   SECTION NAVIGATION
───────────────────────────────────── */
const SECTIONS = ['earth','launch','space','mars-entry','colony'];

function scrollToSection(idx) {
  const el = document.getElementById(SECTIONS[idx]);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function updateNavDots(idx) {
  document.querySelectorAll('.sn-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

/* ─────────────────────────────────────
   HUD STATE MACHINE
───────────────────────────────────── */
const HUD_CONFIGS = [
  { mission:'EARTH COLLAPSE',  status:'CRITICAL',   statusCls:'hv-red',
    o2:'78%',o2w:'78%', spd:'0 km/s',spdw:'0%',   tmp:'22°C', tmpw:'10%', dst:'0 km',dstw:'0%',
    nav:'err', life:'ok', eng:'',    comm:'err',  shield:'' },
  { mission:'LAUNCH SEQUENCE', status:'LAUNCHING',  statusCls:'',
    o2:'92%',o2w:'92%', spd:'1.2 km/s',spdw:'35%',tmp:'45°C', tmpw:'20%', dst:'2,400 km',dstw:'2%',
    nav:'ok',  life:'ok', eng:'ok',   comm:'ok',   shield:'ok' },
  { mission:'DEEP SPACE',      status:'EN ROUTE',   statusCls:'',
    o2:'85%',o2w:'85%', spd:'28.5 km/s',spdw:'85%',tmp:'-60°C',tmpw:'5%', dst:'27.3M km',dstw:'50%',
    nav:'ok',  life:'ok', eng:'ok',   comm:'',     shield:'ok' },
  { mission:'MARS ENTRY',      status:'ENTERING',   statusCls:'hv-red',
    o2:'64%',o2w:'64%', spd:'6.0 km/s',spdw:'60%', tmp:'1650°C',tmpw:'95%',dst:'54.6M km',dstw:'100%',
    nav:'ok',  life:'ok', eng:'ok',   comm:'err',  shield:'ok' },
  { mission:'COLONY ZERO',     status:'ESTABLISHED',statusCls:'hv-green',
    o2:'95%',o2w:'95%', spd:'0 km/s',spdw:'0%',   tmp:'-63°C',tmpw:'5%', dst:'54.6M km',dstw:'100%',
    nav:'ok',  life:'ok', eng:'',    comm:'ok',   shield:'' },
];

function setHUD(idx) {
  setAmbientSection(idx); // ← sync ambient drone to section
  const c = HUD_CONFIGS[idx];
  const g = id => document.getElementById(id);

  // Text fields
  const hudStatus = g('hud-status');
  g('hud-mission').textContent = c.mission;
  hudStatus.textContent = c.status;
  hudStatus.className   = 'hud-value ' + c.statusCls;
  g('o2-val').textContent  = c.o2;
  g('spd-val').textContent = c.spd;
  g('tmp-val').textContent = c.tmp;
  g('dst-val').textContent = c.dst;

  // Bars
  g('o2-bar').style.width  = c.o2w;
  g('spd-bar').style.width = c.spdw;
  g('tmp-bar').style.width = c.tmpw;
  g('dst-bar').style.width = c.dstw;

  // System rows
  ['nav','life','eng','comm','shield'].forEach(k => {
    const row = g('sys-' + k);
    if (!row) return;
    row.className = 'sys-row ' + (c[k] || '');
  });
}

/* ─────────────────────────────────────
   CANVAS: EARTH BACKGROUND
───────────────────────────────────── */
function initEarthCanvas() {
  const cvs = document.getElementById('earth-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = cvs.width = cvs.offsetWidth;
    h = cvs.height = cvs.offsetHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.015 + 0.004,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Grid lines
    ctx.strokeStyle = 'rgba(0,100,200,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    // Stars
    stars.forEach(s => {
      s.twinkle += s.spd;
      const a = s.alpha * (0.5 + Math.sin(s.twinkle) * 0.35);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─────────────────────────────────────
   CANVAS: DEEP SPACE STARS (BG LAYER)
───────────────────────────────────── */
function initSpaceStars() {
  const cvs = document.getElementById('stars-bg');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = cvs.width = cvs.offsetWidth || window.innerWidth;
    h = cvs.height = cvs.offsetHeight || window.innerHeight;
    stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + 0.15,
      t: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.01 + 0.003,
      col: ['255,255,255','180,210,255','255,240,210','200,230,255'][Math.floor(Math.random()*4)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.t += s.spd;
      const a = 0.3 + Math.sin(s.t) * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.col},${Math.max(0.05,a)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', () => { resize(); });
  draw();
}

/* ─────────────────────────────────────
   CANVAS: FLOATING PARTICLES (FAST LAYER)
───────────────────────────────────── */
function initParticles() {
  const cvs = document.getElementById('particle-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = cvs.width = cvs.offsetWidth || window.innerWidth;
    h = cvs.height = cvs.offsetHeight || window.innerHeight;
    particles = Array.from({ length: 60 }, () => mkParticle(w, h));
  }

  function mkParticle(w, h) {
    return {
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 2 + 0.4,
      alpha: Math.random() * 0.4 + 0.05,
      col: Math.random() > 0.7 ? '0,200,255' : '200,200,255',
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5;
      if (p.y > h + 5) p.y = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─────────────────────────────────────
   CANVAS: MARS ENTRY BACKGROUND
───────────────────────────────────── */
function initEntryCanvas() {
  const cvs = document.getElementById('entry-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, t = 0;

  function resize() { w = cvs.width = cvs.offsetWidth; h = cvs.height = cvs.offsetHeight; }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.008;
    // Atmospheric streaks
    for (let i = 0; i < 12; i++) {
      const sx = (i / 12) * w + Math.sin(t + i) * 30;
      const alpha = 0.04 + Math.sin(t * 2 + i * 0.7) * 0.025;
      ctx.strokeStyle = `rgba(255,80,20,${Math.max(0, alpha)})`;
      ctx.lineWidth = 1 + Math.sin(t + i * 0.5) * 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, 0); ctx.lineTo(sx + 60, h);
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─────────────────────────────────────
   CANVAS: COLONY BACKGROUND (MARS SURFACE)
───────────────────────────────────── */
function initColonyCanvas() {
  const cvs = document.getElementById('colony-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, t = 0;

  function resize() { w = cvs.width = cvs.offsetWidth; h = cvs.height = cvs.offsetHeight; }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.003;
    // Subtle dust particles on surface
    for (let i = 0; i < 24; i++) {
      const px = ((i * 137 + t * 8) % (w + 60)) - 30;
      const py = h * 0.75 + Math.sin(t * 0.5 + i) * 12;
      const pr = 1.5 + Math.sin(t + i * 0.8) * 0.8;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,80,30,${0.08 + Math.sin(t + i) * 0.04})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─────────────────────────────────────
   CANVAS: DUST PARTICLES (LANDING)
───────────────────────────────────── */
let dustParticles = [], dustActive = false;

function initDustCanvas() {
  const cvs = document.getElementById('dust-canvas');
  if (!cvs) return;
  cvs.width  = cvs.offsetWidth  || window.innerWidth;
  cvs.height = cvs.offsetHeight || window.innerHeight;
  const ctx  = cvs.getContext('2d');

  function mkDust(w, h) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    return {
      x: w / 2 + (Math.random() - 0.5) * 60,
      y: h * 0.72,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -(Math.random() * 4 + 2),
      life: 1, decay: Math.random() * 0.018 + 0.008,
      r: Math.random() * 6 + 2,
      col: `${180+Math.floor(Math.random()*40)},${60+Math.floor(Math.random()*30)},${20+Math.floor(Math.random()*20)}`,
    };
  }

  function triggerDust() {
    if (!cvs) return;
    const w = cvs.width, h = cvs.height;
    dustParticles = Array.from({ length: 120 }, () => mkDust(w, h));
    dustActive = true;
  }
  window._triggerLandingDust = triggerDust;

  function drawLoop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    if (dustActive) {
      dustParticles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.12; p.vx *= 0.985;
        p.life -= p.decay;
        if (p.life <= 0) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.life * 0.6})`;
        ctx.fill();
      });
      dustParticles = dustParticles.filter(p => p.life > 0);
      if (!dustParticles.length) dustActive = false;
    }
    requestAnimationFrame(drawLoop);
  }
  drawLoop();
}

/* ─────────────────────────────────────
   TYPING EFFECT
───────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const lines = [
    'COMMANDER NOVA — PREPARE FOR DEPARTURE',
    'GENOME ARCHIVE: 8.2B RECORDS SEALED',
    'ARES-7 ALL SYSTEMS GREEN',
    'MISSION CRITICAL — DO NOT FAIL THEM',
  ];
  let li = 0, ci = 0, del = false;

  function type() {
    const cur = lines[li];
    el.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
    del ? ci-- : ci++;
    if (!del && ci === cur.length) { setTimeout(type, 2000); del = true; return; }
    if (del && ci === 0) { del = false; li = (li + 1) % lines.length; setTimeout(type, 400); return; }
    setTimeout(type, del ? 22 : 52);
  }
  type();
}

/* ─────────────────────────────────────
   CRISIS TIMER
───────────────────────────────────── */
function initCrisisTimer() {
  const el = document.getElementById('crisis-timer');
  if (!el) return;
  let secs = 14 * 60 + 32;
  setInterval(() => {
    if (secs <= 0) { el.textContent = 'EXPIRED'; return; }
    secs--;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    el.textContent = `00:${m}:${s}`;
  }, 1000);
}

/* ─────────────────────────────────────
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
───────────────────────────────────── */
function initScrollAnimations() {

  // ── Section detection & HUD update
  SECTIONS.forEach((id, i) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: 'top 55%',
      onEnter:     () => { setHUD(i); updateNavDots(i); },
      onEnterBack: () => { setHUD(i); updateNavDots(i); },
    });
  });

  // ── Earth: content reveal
  gsap.from('#earth-content > *', {
    y: 30, opacity: 0, stagger: 0.12, duration: 0.9,
    ease: 'power2.out', delay: 0.5,
  });

  // ── Earth: crisis cards on scroll
  gsap.from('.crisis-card', {
    y: 40, opacity: 0, stagger: 0.12, duration: 0.7,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.crisis-grid', start: 'top 88%' },
  });

  // ── Launch: rocket ascent driven by scroll
  gsap.to('#rocket', {
    y: -520,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: '#launch', start: 'top top', end: 'bottom top',
      scrub: 1.8,
      onEnter: () => {
        document.getElementById('r-flame').classList.add('lit');
        document.getElementById('r-exhaust').classList.add('lit');
        startCountdown();
      },
      onLeaveBack: () => {
        document.getElementById('r-flame').classList.remove('lit');
        document.getElementById('r-exhaust').classList.remove('lit');
      },
    },
  });

  // ── Space: PARALLAX LAYERS (multi-speed)
  // Background stars — slowest
  gsap.to('#px-bg', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger:'#space', start:'top bottom', end:'bottom top', scrub: true },
  });
  // Nebula — slow
  gsap.to('#px-nebula', {
    yPercent: 25,
    xPercent: -5,
    ease: 'none',
    scrollTrigger: { trigger:'#space', start:'top bottom', end:'bottom top', scrub: 1.5 },
  });
  // Planets — medium
  gsap.to('#px-planets', {
    yPercent: 40,
    ease: 'none',
    scrollTrigger: { trigger:'#space', start:'top bottom', end:'bottom top', scrub: 0.8 },
  });
  // Particles — fastest
  gsap.to('#px-particles', {
    yPercent: 60,
    ease: 'none',
    scrollTrigger: { trigger:'#space', start:'top bottom', end:'bottom top', scrub: 0.4 },
  });

  // Signal logs reveal
  gsap.from('.sig-log', {
    y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.signal-logs', start: 'top 85%' },
  });

  // ── Mars Entry: capsule drop
  gsap.from('#capsule-vessel', {
    y: -60, opacity: 0, duration: 1, ease: 'power2.out',
    scrollTrigger: {
      trigger: '#mars-entry', start: 'top 70%',
      onEnter: () => {
        revealEntryWarnings();
        setTimeout(deployChute, 2200);
        animateAltitude();
      },
    },
  });

  // Screen shake on scroll into Mars Entry
  ScrollTrigger.create({
    trigger: '#mars-entry', start: 'top 40%',
    onEnter: () => {
      gsap.to('#mars-entry', {
        x: () => (Math.random()-0.5)*6, y: () => (Math.random()-0.5)*4,
        duration: 0.08, repeat: 12, yoyo: true, ease: 'none',
        onComplete: () => gsap.set('#mars-entry', { x:0, y:0 }),
      });
      flashWarnings();
    },
  });

  // ── Colony: modules & stats
  gsap.from('.col-stats .cs', {
    y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.col-stats', start: 'top 90%' },
  });
  ScrollTrigger.create({
    trigger: '#colony', start: 'top 60%',
    onEnter: () => setTimeout(showFinalMessage, 800),
  });
}

/* ─────────────────────────────────────
   LAUNCH CHECKLIST
───────────────────────────────────── */
let checksComplete = 0;

function doCheck(idx) {
  const dot = document.getElementById(`cld-${idx}`);
  const btn = document.querySelectorAll('.cl-btn')[idx];
  if (!dot || dot.classList.contains('done')) return;

  dot.textContent = '✓';
  dot.classList.add('done');
  btn.disabled = true;
  checksComplete++;
  playClick();

  gsap.from(dot, { scale: 0, duration: 0.35, ease: 'back.out(2)' });
}

/* ─────────────────────────────────────
   COUNTDOWN
───────────────────────────────────── */
let countdownActive = false;
function startCountdown() {
  if (countdownActive) return;
  countdownActive = true;
  const el = document.getElementById('countdown');
  if (!el) return;
  let t = 10;
  const tick = setInterval(() => {
    t--;
    el.textContent = t > 0 ? `T — ${String(t).padStart(2,'0')}` : '🚀 LIFTOFF';
    if (t <= 3) { el.style.color = 'var(--red)'; }
    if (t <= 0) {
      el.style.color = 'var(--green)';
      el.style.textShadow = '0 0 20px var(--green)';
      clearInterval(tick);
    }
  }, 900);
}

/* ─────────────────────────────────────
   LOG MODAL DATA
───────────────────────────────────── */
const LOG_DATA = [
  {
    day: 'DAY 012', type: 'PERSONAL LOG', sig: 'SIG: ████░░',
    body: `Earth is just a pale blue dot in the rear cameras now.<br><br>
I replay the launch footage every cycle before sleep — the roar, the g-force, the faces at Mission Control blurring with tears they didn't bother hiding. I keep thinking about my daughter's goodbye wave through the blast shield glass. She held up a drawing: ARES-7 with a smiley face on the nose cone. It's taped above my console.<br><br>
<em>Focus, Nova. All eight billion of them are in that archive. You carry their past. Make them a future.</em>`
  },
  {
    day: 'DAY 089', type: 'MISSION CONTROL', sig: 'SIG: ███░░░',
    body: `Nova. If you receive this, know that things here have accelerated.<br><br>
We don't have much time left. The grid is failing in segments now — North America first, then Europe. Millions in the dark. But we wanted you to know: you are our last hope. Not just a phrase on a mission patch. <em>You are literally it.</em><br><br>
Keep the archive intact. Keep yourself alive. We are proud of you beyond words.<br><br>
— Director Chen, Mission Control, Earth (what remains of it)`
  },
  {
    day: 'DAY 147', type: 'ENCRYPTED BURST', sig: 'SIG: █░░░░░',
    body: `This is an automated relay. Mission Control has gone silent.<br><br>
We can no longer reach you through standard channels. This encrypted burst was pre-programmed as a contingency. If you are reading this — you are alone now. Truly alone.<br><br>
ARES-7's AI companion system has been authorized to assume co-pilot duties. You are not alone in the ship, Commander. <em>You are never truly alone — you carry all of us.</em><br><br>
End of transmission. Godspeed.`
  },
  {
    day: 'DAY 214', type: 'FINAL APPROACH', sig: 'SIG: ██████',
    body: `Mars fills the viewport now.<br><br>
Red and ancient and indifferent — beautiful in the way that wild things are beautiful. I've been watching it grow for seven months. It's real. It's there.<br><br>
Colony modules are primed. The genome archive is triple-verified: 8,214,392,066 records intact. I've written the landing manifesto. If something goes wrong, they'll know we tried with everything we had.<br><br>
Nothing will go wrong.<br><br>
Initiating atmospheric entry sequence in 4 hours. Next log will be from the surface.<br><br>
<em>This is Commander Nova. Signing off from the void.</em>`
  },
];

function openLog(idx) {
  const data = LOG_DATA[idx];
  document.getElementById('lm-day').textContent  = data.day;
  document.getElementById('lm-type').textContent = data.type;
  document.getElementById('lm-body').innerHTML   = data.body;
  document.getElementById('lm-sig').textContent  = data.sig;
  const modal = document.getElementById('log-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Animate signal bar degrading
  const sigEl = document.getElementById('lm-sig');
  const bars  = ['██████','█████░','████░░','███░░░','██░░░░','█░░░░░'];
  let bi = 0;
  const tick = setInterval(() => {
    bi = (bi + 1) % bars.length;
    sigEl.textContent = 'SIG: ' + bars[bi];
  }, 600);
  modal._clearSig = () => clearInterval(tick);
}

function closeLog() {
  const modal = document.getElementById('log-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (modal._clearSig) modal._clearSig();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLog(); });

/* ─────────────────────────────────────
   AUTOPILOT TOGGLE
───────────────────────────────────── */
let autopilotOn = false;
function toggleAutopilot() {
  autopilotOn = !autopilotOn;
  const btn  = document.getElementById('ap-btn');
  const led  = document.getElementById('ap-led');
  const txt  = document.getElementById('ap-status-txt');
  const btxt = document.getElementById('ap-btn-txt');

  btn.classList.toggle('on', autopilotOn);
  led.classList.toggle('on', autopilotOn);
  txt.textContent  = autopilotOn ? 'AUTOPILOT ENGAGED' : 'MANUAL CONTROL';
  btxt.textContent = autopilotOn ? 'AUTOPILOT ON'  : 'AUTOPILOT OFF';

  if (autopilotOn) {
    gsap.to('#px-bg',        { yPercent: '+=20', duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1 });
    gsap.to('#px-particles', { yPercent: '+=30', duration: 1.5, ease: 'power1.inOut', yoyo: true, repeat: -1 });
  } else {
    gsap.killTweensOf('#px-bg');
    gsap.killTweensOf('#px-particles');
  }
}

/* ─────────────────────────────────────
   MARS ENTRY — WARNINGS & TELEMETRY
───────────────────────────────────── */
function revealEntryWarnings() {
  document.querySelectorAll('.ew-item').forEach((el, i) => {
    setTimeout(() => {
      gsap.from(el, { x: -20, opacity: 0, duration: 0.5, ease: 'power2.out' });
    }, i * 300);
  });
}

function flashWarnings() {
  const flash = document.getElementById('warning-flash');
  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 700);
}

function deployChute() {
  document.getElementById('cv-chute').classList.add('open');
  const chuteEl = document.getElementById('et-chute');
  if (chuteEl) { chuteEl.textContent = 'DEPLOYED'; chuteEl.className = 'et-v green-val'; }
}

function animateAltitude() {
  const el = document.getElementById('et-alt');
  if (!el) return;
  let h = 125;
  const iv = setInterval(() => {
    h -= 2;
    el.textContent = h > 0 ? `${h} km` : '0 km — SURFACE';
    if (h <= 0) { el.className = 'et-v green-val'; clearInterval(iv); }
  }, 140);
}

/* ─────────────────────────────────────
   LANDING — STABILIZE
───────────────────────────────────── */
let landingDone = false;

function doLanding() {
  if (landingDone) return;
  landingDone = true;

  const btn = document.getElementById('stab-btn');
  btn.disabled = true;
  playEntryAlarm();

  // 1. Screen shake
  gsap.to('#mars-entry', {
    x: () => (Math.random()-0.5)*14,
    y: () => (Math.random()-0.5)*8,
    duration: 0.06, repeat: 18, yoyo: true, ease: 'none',
    onComplete: () => gsap.set('#mars-entry', { x:0, y:0 }),
  });

  // 2. Warning flash
  const flash = document.getElementById('warning-flash');
  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 800);

  // 3. Capsule descent
  const capsule = document.getElementById('capsule-vessel');
  gsap.to(capsule, { y: 80, duration: 2.5, ease: 'power2.in', onComplete: () => {
    // 4. Dust particles
    if (window._triggerLandingDust) window._triggerLandingDust();
    playLandingChime();

    // 5. Landing confirmation
    const confirm = document.getElementById('landing-confirm');
    confirm.classList.add('show');
    gsap.from(confirm, { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(2)' });

    // 6. Update telemetry
    document.getElementById('et-alt').textContent = '0 km — SURFACE';
    document.getElementById('et-alt').className   = 'et-v green-val';
    document.getElementById('et-g').textContent   = '0.38 g';
    document.getElementById('et-g').className     = 'et-v green-val';
  }});

  // 7. Plasma rings fade
  gsap.to('.pr', { opacity: 0, duration: 2, stagger: 0.2, ease: 'power2.out' });
}

/* ─────────────────────────────────────
   COLONY BUILDING
───────────────────────────────────── */
const MODULE_CONFIGS = {
  dome:    { statLabel: 'bst-dome',    mod: 'mod-dome',    colKey: 'cs-col',  addCol: 500, addPow: 0,   addO2: 80 },
  solar:   { statLabel: 'bst-solar',   mod: 'mod-solar',   colKey: 'cs-pow',  addCol: 0,   addPow: 450, addO2: 0 },
  rover:   { statLabel: 'bst-rover',   mod: 'mod-rover',   colKey: null,      addCol: 0,   addPow: 0,   addO2: 0 },
  antenna: { statLabel: 'bst-antenna', mod: 'mod-antenna', colKey: null,      addCol: 0,   addPow: 50,  addO2: 0 },
};

let colonyState = { colonists: 0, power: 0, o2: 0 };

function buildModule(type) {
  const cfg   = MODULE_CONFIGS[type];
  const btn   = document.getElementById(`bbtn-${type}`);
  const stat  = document.getElementById(cfg.statLabel);
  const mod   = document.getElementById(cfg.mod);

  if (!btn || btn.classList.contains('built')) return;

  btn.classList.add('built');
  stat.textContent = 'BUILT ✓';
  playColonyBuild();

  // Show module with animation
  mod.classList.add('visible');
  gsap.from(mod, { y: 40, scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(2)' });

  // Ripple effect
  const ripple = document.createElement('div');
  ripple.style.cssText = `position:absolute;top:50%;left:50%;width:12px;height:12px;
    border:2px solid var(--green);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:10;`;
  mod.appendChild(ripple);
  gsap.to(ripple, { scale: 8, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() });

  // Update colony state
  colonyState.colonists += cfg.addCol;
  colonyState.power     += cfg.addPow;
  colonyState.o2        += cfg.addO2;
  animateColonyStat('cs-col', colonyState.colonists);
  animateColonyStat('cs-pow', colonyState.power, ' kW');
  animateColonyStat('cs-o2',  colonyState.o2, '%');

  // All built?
  const allBuilt = Object.keys(MODULE_CONFIGS).every(k => {
    const b = document.getElementById(`bbtn-${k}`);
    return b && b.classList.contains('built');
  });
  if (allBuilt) {
    document.getElementById('cs-sol').textContent = 'SOL 1';
    document.getElementById('cs-sol').className   = 'cs-v success';
    showFinalMessage();
  }
}

function animateColonyStat(id, target, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  gsap.to({ val: start }, {
    val: target, duration: 1.2, ease: 'power2.out',
    onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + suffix; },
  });
}

/* ─────────────────────────────────────
   FINAL MESSAGE REVEAL
───────────────────────────────────── */
function showFinalMessage() {
  const el = document.getElementById('final-msg');
  if (!el || el.classList.contains('visible')) return;
  el.classList.add('visible');
}

/* ─────────────────────────────────────
   DUST STORM TOGGLE
───────────────────────────────────── */
function triggerDustStorm() {
  const veil = document.getElementById('dust-veil');
  if (!veil) return;
  if (veil.classList.contains('storm')) {
    veil.classList.remove('storm');
  } else {
    veil.classList.add('storm');
    setTimeout(() => veil.classList.remove('storm'), 5000);
  }
}

/* ─────────────────────────────────────
   MOUSE PARALLAX — EARTH SECTION
───────────────────────────────────── */
function initMouseParallax() {
  const el = document.getElementById('earth');
  if (!el) return;
  el.addEventListener('mousemove', e => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = (e.clientX - left) / width  - 0.5;
    const cy = (e.clientY - top)  / height - 0.5;
    gsap.to('#earth-canvas', { x: cx * 18, y: cy * 12, duration: 1.2, ease: 'power2.out' });
    gsap.to('.glitch',       { x: cx * -8, y: cy * -4, duration: 1.2, ease: 'power2.out' });
    gsap.to('.crisis-grid',  { x: cx * 5,  y: cy * 3,  duration: 1.4, ease: 'power2.out' });
  });
}

/* ─────────────────────────────────────
   SMOOTH SECTION TRANSITIONS
   (Adds a brief fade overlay on nav-dot click)
───────────────────────────────────── */
function addTransitionLayer() {
  // No body-filter tween — kills GPU compositing. Overlay handled by upgrade.js fade overlay.
}

/* ─────────────────────────────────────
   PERF OPTIMISATION: pause off-screen
───────────────────────────────────── */
function initVisibilityOpt() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ScrollTrigger.getAll().forEach(t => t.disable());
    else ScrollTrigger.getAll().forEach(t => t.enable());
  });
}

/* ─────────────────────────────────────
   WEB AUDIO — AMBIENT SOUND ENGINE
   Pure synthesis, zero audio files.
───────────────────────────────────── */
const Audio = window.AudioContext || window.webkitAudioContext;
let audioCtx = null, masterGain = null, audioStarted = false;

// Persistent nodes
let droneOscs = [], droneLFO = null, droneFilter = null;
let rumbleSource = null, rumbleGain = null;
let heartbeatInterval = null;

function startAudioEngine() {
  if (audioStarted) return;
  audioStarted = true;
  audioCtx  = new Audio();
  masterGain = audioCtx.createGain();
  // Expose for cross-module access (mobile-polish, visibility handling)
  window.__audioCtx   = audioCtx;
  window.__masterGain = masterGain;
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.042, audioCtx.currentTime + 2);
  masterGain.connect(audioCtx.destination);

  // ── Simple filtered white noise — quiet background hiss only
  // 4 seconds of white noise, looped, shaped through a gentle low-pass
  const bufSize = audioCtx.sampleRate * 4;
  const noiseBuffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) noiseData[i] = (Math.random() * 2 - 1);

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Low-pass: cuts harsh highs, leaves a soft hiss
  const noiseLow = audioCtx.createBiquadFilter();
  noiseLow.type = 'lowpass';
  noiseLow.frequency.value = 900;
  noiseLow.Q.value = 0.5;

  // High-pass: removes sub-rumble so it feels airy not bassy
  const noiseHigh = audioCtx.createBiquadFilter();
  noiseHigh.type = 'highpass';
  noiseHigh.frequency.value = 200;
  noiseHigh.Q.value = 0.5;

  // Noise gain — quiet
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0.04;

  noiseSource.connect(noiseLow);
  noiseLow.connect(noiseHigh);
  noiseHigh.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSource.start();

  // Store filter ref so setAmbientSection can tweak cutoff per section
  droneFilter = noiseLow;
  droneOscs = []; // no oscillators

  // ── Heartbeat (Section 1 — Earth critical)
  startHeartbeat();
}

function startHeartbeat() {
  if (!audioCtx) return;
  heartbeatInterval = setInterval(() => {
    playBeat(60, 0.06, 0.04);
    setTimeout(() => playBeat(55, 0.04, 0.035), 180);
  }, 1100);
}

function stopHeartbeat() {
  if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; }
}

function playBeat(freq, gainVal, decay) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g   = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gainVal, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + decay);
  osc.connect(g);
  g.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + decay + 0.01);
}

function playClick() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g   = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.06);
  g.gain.setValueAtTime(0.08, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
  osc.connect(g); g.connect(masterGain);
  osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function playLaunchRumble() {
  if (!audioCtx) return;
  // Sub-bass sweep
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const g    = audioCtx.createGain();
  osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(30, audioCtx.currentTime);
  osc1.frequency.linearRampToValueAtTime(55, audioCtx.currentTime + 3);
  osc2.type = 'sawtooth'; osc2.frequency.setValueAtTime(32, audioCtx.currentTime);
  osc2.frequency.linearRampToValueAtTime(58, audioCtx.currentTime + 3);
  g.gain.setValueAtTime(0, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.5);
  g.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 2.5);
  g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4);
  osc1.connect(g); osc2.connect(g); g.connect(masterGain);
  osc1.start(); osc2.start();
  osc1.stop(audioCtx.currentTime + 4.1);
  osc2.stop(audioCtx.currentTime + 4.1);
}

function playEntryAlarm() {
  if (!audioCtx) return;
  [0, 0.35, 0.7].forEach(delay => {
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(660, audioCtx.currentTime + delay);
    osc.frequency.setValueAtTime(440, audioCtx.currentTime + delay + 0.12);
    g.gain.setValueAtTime(0.06, audioCtx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 0.28);
    osc.connect(g); g.connect(masterGain);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + 0.3);
  });
}

function playLandingChime() {
  if (!audioCtx) return;
  [261.6, 329.6, 392, 523.2].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.07, audioCtx.currentTime + i * 0.12 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.12 + 1.2);
    osc.connect(g); g.connect(masterGain);
    osc.start(audioCtx.currentTime + i * 0.12);
    osc.stop(audioCtx.currentTime + i * 0.12 + 1.3);
  });
}

function playColonyBuild() {
  if (!audioCtx) return;
  const freqs = [440, 550, 660];
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.08);
    g.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + i * 0.08 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.08 + 0.5);
    osc.connect(g); g.connect(masterGain);
    osc.start(audioCtx.currentTime + i * 0.08);
    osc.stop(audioCtx.currentTime + i * 0.08 + 0.6);
  });
}

// Shift ambient drone tone per section
function setAmbientSection(idx) {
  if (!audioCtx) return;
  // Adjust noise filter cutoff per section — subtle tonal shift
  const configs = [
    { filter: 700,  gain: 0.042 }, // Earth — slightly fuller hiss
    { filter: 1100, gain: 0.036 }, // Launch — brighter
    { filter: 500,  gain: 0.028 }, // Space — darker, quieter
    { filter: 1400, gain: 0.048 }, // Entry — harsher edge
    { filter: 600,  gain: 0.025 }, // Colony — softest
  ];
  const c = configs[idx] || configs[0];
  const t = audioCtx.currentTime;

  if (droneFilter) {
    droneFilter.frequency.linearRampToValueAtTime(c.filter, t + 2.5);
  }

  // Store intended gain — only apply if not muted
  lastSectionGain = c.gain;
  if (!audioMuted) {
    masterGain.gain.cancelScheduledValues(t);
    masterGain.gain.linearRampToValueAtTime(c.gain, t + 2);
  }

  // Section-specific sound events
  if (idx === 1) playLaunchRumble();
  if (idx === 3) { playEntryAlarm(); stopHeartbeat(); }
  if (idx === 0) startHeartbeat();
  else stopHeartbeat();
}

// Audio mute toggle — persists across section changes
let audioMuted = false;
let lastSectionGain = 0.042; // tracks the intended gain for current section

function toggleMute() {
  if (!audioCtx) return;
  audioMuted = !audioMuted;
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(
    audioMuted ? 0 : lastSectionGain,
    audioCtx.currentTime + 0.4
  );
  const btn = document.getElementById('mute-btn');
  if (btn) {
    btn.textContent = audioMuted ? '♪ UNMUTE' : '♪ MUTE';
    btn.classList.toggle('muted', audioMuted);
  }
}

/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Canvases
  initEarthCanvas();
  initSpaceStars();
  initParticles();
  initEntryCanvas();
  initColonyCanvas();
  initDustCanvas();

  // UI
  initTyping();
  initCrisisTimer();
  initScrollAnimations();
  initMouseParallax();
  addTransitionLayer();
  initVisibilityOpt();

  // Initial HUD state
  setHUD(0);
  updateNavDots(0);

  // Start audio engine on first user interaction (browser autoplay policy)
  const startAudio = () => { startAudioEngine(); document.removeEventListener('click', startAudio); document.removeEventListener('scroll', startAudio); };
  document.addEventListener('click',  startAudio, { once: true });
  document.addEventListener('scroll', startAudio, { once: true });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    const dots = document.querySelectorAll('.sn-dot');
    const cur  = [...dots].findIndex(d => d.classList.contains('active'));
    if (e.key === 'ArrowDown' && cur < SECTIONS.length - 1) scrollToSection(cur + 1);
    if (e.key === 'ArrowUp'   && cur > 0)                   scrollToSection(cur - 1);
  });
});
