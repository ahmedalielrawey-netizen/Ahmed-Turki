// ============================================================
// Nav: scroll state + mobile menu
// ============================================================
const nav = document.getElementById('mainNav');
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

if (burger) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.textContent = open ? '✕' : '☰';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.textContent = '☰';
    });
  });
}

// ============================================================
// Before / After slider (signature interaction)
// ============================================================
document.querySelectorAll('[data-ba]').forEach(slider => {
  const clip = slider.querySelector('[data-ba-clip]');
  const handle = slider.querySelector('[data-ba-handle]');
  let dragging = false;

  const setPos = (pct) => {
    const clamped = Math.min(96, Math.max(4, pct));
    slider.style.setProperty('--pos', clamped + '%');
  };

  const posFromEvent = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const isRtl = getComputedStyle(document.documentElement).direction === 'rtl'
      || document.body.getAttribute('dir') === 'rtl'
      || document.documentElement.getAttribute('dir') === 'rtl';
    let pct;
    if (isRtl) {
      pct = ((rect.right - clientX) / rect.width) * 100;
    } else {
      pct = ((clientX - rect.left) / rect.width) * 100;
    }
    return pct;
  };

  const start = (e) => { dragging = true; slider.classList.add('dragging'); move(e); };
  const end = () => { dragging = false; slider.classList.remove('dragging'); };
  const move = (e) => {
    if (!dragging && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(posFromEvent(clientX));
  };

  handle.addEventListener('mousedown', start);
  slider.addEventListener('mousedown', start);
  window.addEventListener('mousemove', (e) => { if (dragging) move(e); });
  window.addEventListener('mouseup', end);

  handle.addEventListener('touchstart', start, { passive: true });
  slider.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('touchmove', (e) => { if (dragging) move(e); }, { passive: true });
  window.addEventListener('touchend', end);

  // keyboard accessibility
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'مقارنة قبل وبعد');
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
    if (e.key === 'ArrowLeft') setPos(current - 5);
    if (e.key === 'ArrowRight') setPos(current + 5);
  });

  setPos(50);
});

// ============================================================
// Gallery filter tabs
// ============================================================
const gtabs = document.querySelectorAll('.gtab');
const gitems = document.querySelectorAll('.gallery-grid [data-cat]');
gtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    gtabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    gitems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.style.display = show ? '' : 'none';
    });
  });
});

// ============================================================
// FAQ accordion
// ============================================================
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ============================================================
// Scroll reveal
// ============================================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}
