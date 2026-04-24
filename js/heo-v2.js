/* ============================================================
   HACIA EL OCASO — v2
   FX: ambient canvas, mouse spotlight, navegación, lightbox
   ============================================================ */

'use strict';

const ACCENT_R = 34, ACCENT_G = 238, ACCENT_B = 201;
const accent = (a) => `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${a})`;
const lerp   = (a, b, t) => a + (b - a) * t;
const isMobile = () => window.innerWidth < 768;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ============================================================
   PERF DETECTION
   Flagea "perf-lite" si el dispositivo es débil o el FPS cae.
   ============================================================ */
const HEO = {
  lite: false,
  setLite(reason) {
    if (this.lite) return;
    this.lite = true;
    document.body.classList.add('perf-lite');
    console.info('[heo] perf-lite activado:', reason);
  }
};

/* Detección estática al cargar */
(function initPerfDetection() {
  const cores = navigator.hardwareConcurrency || 4;
  const mem   = navigator.deviceMemory || 4;
  if (cores <= 2 || mem <= 2) HEO.setLite('low-end hardware');
  if (prefersReducedMotion())  HEO.setLite('prefers-reduced-motion');
})();

/* Monitor de FPS: si cae sostenido, bajamos fx */
(function initFpsWatchdog() {
  if (HEO.lite) return;
  let frames = 0, last = performance.now(), slowSeconds = 0;

  function loop(now) {
    frames++;
    if (now - last >= 1000) {
      const fps = frames * 1000 / (now - last);
      frames = 0; last = now;
      if (fps < 32) {
        slowSeconds++;
        if (slowSeconds >= 3) { HEO.setLite('fps<32 x3s'); return; }
      } else {
        slowSeconds = 0;
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();


/* ============================================================
   AMBIENT CANVAS
   Orbes flotantes suaves + partículas ascendentes
   ============================================================ */
(function initAmbient() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    clearTimeout(window._ambientResizeTimer);
    window._ambientResizeTimer = setTimeout(resize, 150);
  });
  resize();

  /* Orbes — gradientes radiales grandes y lentos */
  const blobs = [
    { x: 0.15, y: 0.45, r: 0.55, a: 0.048, dx:  0.00014, dy:  0.00020 },
    { x: 0.82, y: 0.62, r: 0.48, a: 0.038, dx: -0.00018, dy:  0.00013 },
    { x: 0.50, y: 0.08, r: 0.62, a: 0.018, dx:  0.00010, dy:  0.00028, purple: true },
    { x: 0.08, y: 0.88, r: 0.42, a: 0.032, dx:  0.00022, dy: -0.00012 },
    { x: 0.70, y: 0.20, r: 0.38, a: 0.022, dx: -0.00009, dy:  0.00016 },
  ];

  /* Partículas ascendentes — reducidas en móvil */
  const PCOUNT = isMobile() ? 12 : 28;

  function mkParticle(randomY = true) {
    return {
      x:    Math.random() * window.innerWidth,
      y:    randomY ? Math.random() * window.innerHeight : window.innerHeight + 8,
      size: Math.random() * 1.4 + 0.2,
      spd:  Math.random() * 0.32 + 0.06,
      opa:  Math.random() * 0.32 + 0.04,
      dx:   (Math.random() - 0.5) * 0.22,
    };
  }

  const particles = Array.from({ length: PCOUNT }, () => mkParticle(true));

  function drawFrame() {
    if (HEO.lite || document.hidden) {
      ctx.clearRect(0, 0, W, H);
      requestAnimationFrame(drawFrame);
      return;
    }
    ctx.clearRect(0, 0, W, H);

    /* --- Orbes --- */
    blobs.forEach(b => {
      const cx = b.x * W, cy = b.y * H;
      const r  = b.r * Math.min(W, H);
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const col = b.purple
        ? `rgba(90, 50, 200, ${b.a})`
        : accent(b.a);
      grd.addColorStop(0, col);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      b.x += b.dx; b.y += b.dy;
      if (b.x < -0.1 || b.x > 1.1) b.dx *= -1;
      if (b.y < -0.1 || b.y > 1.1) b.dy *= -1;
    });

    /* --- Partículas --- */
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opa;
      ctx.fillStyle = `rgb(${ACCENT_R},${ACCENT_G},${ACCENT_B})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y -= p.spd;
      p.x += p.dx;

      if (p.y < -6) {
        Object.assign(p, mkParticle(false));
      }
    });

    requestAnimationFrame(drawFrame);
  }

  drawFrame();
})();


/* ============================================================
   MOUSE SPOTLIGHT
   Gradiente radial suavizado con lerp que sigue al cursor
   ============================================================ */
(function initSpotlight() {
  let tX = 50, tY = 50, cX = 50, cY = 50;

  /* En móvil / touch — centrar el spotlight */
  if (!window.matchMedia('(pointer: fine)').matches) {
    document.documentElement.style.setProperty('--mx', '50%');
    document.documentElement.style.setProperty('--my', '40%');
    return;
  }

  document.addEventListener('mousemove', e => {
    tX = (e.clientX / window.innerWidth)  * 100;
    tY = (e.clientY / window.innerHeight) * 100;
  });

  function tick() {
    cX = lerp(cX, tX, 0.07);
    cY = lerp(cY, tY, 0.07);
    document.documentElement.style.setProperty('--mx', cX.toFixed(2) + '%');
    document.documentElement.style.setProperty('--my', cY.toFixed(2) + '%');
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ============================================================
   NAVEGACIÓN
   Scroll → glass · Burger → menú · Active section
   ============================================================ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-menu');
  if (!nav || !burger || !menu) return;

  /* Scroll: añadir clase "scrolled" */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Burger toggle */
  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  }

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  /* Cerrar al tocar un link */
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  /* Cerrar con Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) toggleMenu(false);
  });

  /* Link activo al hacer scroll — IntersectionObserver */
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-38% 0px -62% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
})();


/* ============================================================
   SCROLL REVEAL
   Fade-in + slide-up con stagger por grilla
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  /* Stagger para hijos de grillas */
  document.querySelectorAll('.spotify-grid, .video-grid, .gallery-grid, .members-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.setProperty('--stagger', `${(i * 0.08).toFixed(2)}s`);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -70px 0px', threshold: 0.08 });

  els.forEach(el => observer.observe(el));
})();


/* ============================================================
   SMOOTH SCROLL para links internos
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================================
   LIGHTBOX
   Abre fotos de la galería · teclado + swipe táctil
   ============================================================ */
(function initLightbox() {
  const lb        = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');
  if (!lb) return;

  const items = [...document.querySelectorAll('.gallery-item')];
  const images = items.map(el => ({
    src:     el.dataset.src     || '',
    caption: el.dataset.caption || '',
  }));

  let current = 0;

  function show(i) {
    current = (i + images.length) % images.length;
    lbImg.src = images[current].src;
    lbCaption.textContent = images[current].caption;
  }

  function open(i) {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lbClose.focus());
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    items[current]?.focus();
  }

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   show(current - 1);
    if (e.key === 'ArrowRight')  show(current + 1);
  });

  /* Swipe táctil */
  let swipeStartX = 0;
  lb.addEventListener('touchstart', e => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(dx) > 45) dx < 0 ? show(current + 1) : show(current - 1);
  }, { passive: true });
})();


/* ============================================================
   CURSOR PERSONALIZADO
   Dot directo + ring con lerp · Solo en dispositivos con mouse
   ============================================================ */
(function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (HEO.lite) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let dotDirty = true;

  /* mousemove: solo guarda coords — el render va en RAF */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dotDirty = true;
  }, { passive: true });

  /* Un solo RAF para dot + ring, usando transform (mucho más rápido que top/left) */
  function tick() {
    if (HEO.lite) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }
    if (dotDirty) {
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      dotDirty = false;
    }
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  /* Hover en interactivos */
  function onEnter() { dot.classList.add('hovering');  ring.classList.add('hovering'); }
  function onLeave() { dot.classList.remove('hovering'); ring.classList.remove('hovering'); }

  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });

  /* Click */
  document.addEventListener('mousedown', () => {
    dot.classList.add('clicking');
    ring.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('clicking');
    ring.classList.remove('clicking');
  });
})();


/* ============================================================
   COUNTDOWN — T-minus al próximo show
   ============================================================ */
(function initCountdown() {
  const root = document.getElementById('countdown');
  if (!root) return;

  const target = new Date(root.dataset.target).getTime();
  if (isNaN(target)) return;

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      root.classList.add('is-live');
      return;
    }
    const s = Math.floor(diff / 1000);
    elDays.textContent  = pad(Math.floor(s / 86400));
    elHours.textContent = pad(Math.floor((s % 86400) / 3600));
    elMins.textContent  = pad(Math.floor((s % 3600) / 60));
    elSecs.textContent  = pad(s % 60);
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();
})();


/* ============================================================
   PAGE GLITCH — cada tanto la página parpadea
   ============================================================ */
(function initPageGlitch() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const body = document.body;
  const MIN_GAP = 30000;  // 30s mínimo entre glitches
  const MAX_GAP = 75000;  // 75s máximo

  function trigger() {
    if (document.hidden || body.classList.contains('perf-lite')) { schedule(); return; }
    body.classList.add('is-glitching');
    setTimeout(() => body.classList.remove('is-glitching'), 650);
    schedule();
  }

  function schedule() {
    const wait = MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);
    setTimeout(trigger, wait);
  }

  /* Primer glitch entre 25-45s después de cargar */
  setTimeout(trigger, 25000 + Math.random() * 20000);
})();


/* ============================================================
   AMBIENT — aumentar intensidad de orbes
   ============================================================ */
/* Los orbes ya están definidos en initAmbient().
   Este bloque fuerza el recálculo al cambiar tamaño. */
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--mx', '50%');
  document.documentElement.style.setProperty('--my', '50%');
}, { passive: true });


/* ============================================================
   LAB FAB — aparece tras scrollear el hero
   ============================================================ */
(function initLabFab() {
  const fab = document.getElementById('lab-fab');
  if (!fab) return;

  const hero = document.getElementById('inicio');

  function show() { fab.classList.add('is-visible'); }
  function hide() { fab.classList.remove('is-visible'); }

  function update() {
    if (!hero) { show(); return; }
    const bottom = hero.getBoundingClientRect().bottom;
    bottom < window.innerHeight * 0.15 ? show() : hide();
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ============================================================
   EXPERIENCIAS — MATRIX RAIN BACKGROUND
   Cae sobre el fondo de la sección, detrás de las tarjetas
   ============================================================ */
(function initExpMatrix() {
  const el = document.getElementById('exp-matrix');
  if (!el) return;
  const ctx   = el.getContext('2d');
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01ムメモヤユヨ10';
  const FS    = 11;
  let drops   = [];

  function resize() {
    el.width  = el.offsetWidth;
    el.height = el.offsetHeight;
    const cols = Math.floor(el.width / FS);
    while (drops.length < cols) drops.push(Math.random() * -40);
    drops.length = cols;
  }

  window.addEventListener('resize', () => {
    clearTimeout(el._rt);
    el._rt = setTimeout(resize, 150);
  });
  resize();

  function tick() {
    ctx.fillStyle = 'rgba(5,5,7,0.08)';
    ctx.fillRect(0, 0, el.width, el.height);
    ctx.font = FS + "px 'Courier New', monospace";
    for (let i = 0; i < drops.length; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      const y  = Math.floor(drops[i]) * FS;
      ctx.fillStyle = y < FS * 2
        ? 'rgba(200,255,245,0.4)'
        : 'rgba(34,238,201,0.09)';
      ctx.fillText(ch, i * FS, y);
      if (y > el.height && Math.random() > 0.974) drops[i] = 0;
      drops[i] += 0.35;
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
