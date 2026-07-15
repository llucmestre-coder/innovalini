/* ============================================================
   main.js — Innovalini (nav, reveals, countup, formulari, reviews)
   ============================================================ */

document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Menú mòbil ── */
  const burger     = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burger && mobileMenu) {
    const toggleMenu = (open) => {
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', () => {
      toggleMenu(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
        burger.focus();
      }
    });
  }

  /* ── 2. Scroll reveal (un sol tret — mai es torna a amagar) ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => revealObs.observe(el));
    }
  }

  /* ── 3. CountUp de xifres (.stat-number amb data-target) ── */
  function countUp(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    if (Number.isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals).replace('.', ',') + suffix;
      return;
    }
    const duration = 1600;
    const start    = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * ease).toFixed(decimals).replace('.', ',') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('.stat-number');
  if (statEls.length) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statsObs.observe(el));
  }

  /* ── 4. Formulari de contacte ── */
  const form       = document.querySelector('.contact-form');
  const successMsg = document.querySelector('.form-success');

  function showFieldError(field, msg) {
    const wrap = field.closest('.form-field');
    if (!wrap) return;
    wrap.classList.add('error');
    let err = wrap.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.id = field.name + '-error';
      wrap.appendChild(err);
    }
    err.textContent = msg;
    field.setAttribute('aria-describedby', err.id);
    field.setAttribute('aria-invalid', 'true');
    field.addEventListener('input', () => {
      wrap.classList.remove('error');
      field.removeAttribute('aria-invalid');
      err.remove();
    }, { once: true });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = form.querySelector('[name="nombre"]');
      const phone = form.querySelector('[name="telefono"]');
      const legal = form.querySelector('[name="privacidad"]');

      if (!name.value.trim())  { showFieldError(name, 'El nombre es obligatorio');   name.focus();  return; }
      if (!phone.value.trim()) { showFieldError(phone, 'El teléfono es obligatorio'); phone.focus(); return; }
      if (legal && !legal.checked) {
        alert('Debes aceptar la política de privacidad.');
        legal.focus();
        return;
      }

      /* Simula l'enviament — NOMÉS MAQUETA.
         Quan el formulari tingui l'ID real de Formspree (cerca XXXXXXXX a
         contacto.html), substituïu aquest setTimeout per:
           fetch(form.action, { method: 'POST', body: new FormData(form),
                                headers: { Accept: 'application/json' } })
             .then(r => { if (r.ok) { mostra .form-success } })                 */
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('visible');
          successMsg.focus();
        }
      }, 700);
    });
  }

  /* ── 5. Valoració de Google (data/reviews.json amb fallback HTML) ──
     El fitxer l'actualitza el workflow .github/workflows/update-reviews.yml.
     Si el fetch falla — o la web s'obre en local amb file:// — queden
     els valors ja escrits a l'HTML. */
  (function loadReviews() {
    const targets = document.querySelectorAll('[data-reviews]');
    if (!targets.length || window.location.protocol === 'file:') return;

    fetch('data/reviews.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data || !data.rating || !data.count) return;
        const rating     = Number(data.rating);
        const ratingText = (Number.isInteger(rating) ? String(rating) : rating.toFixed(1)).replace('.', ',');

        targets.forEach(el => {
          const kind = el.dataset.reviews;
          if (kind === 'rating') el.textContent = ratingText;
          if (kind === 'count')  el.textContent = String(data.count);
          if (kind === 'rating-stat') {
            el.dataset.target = String(rating);
            if (!Number.isInteger(rating)) el.dataset.decimals = '1';
            el.textContent = ratingText + (el.dataset.suffix || '');
          }
        });
      })
      .catch(() => { /* fallback silenciós: valors de l'HTML */ });
  })();

});
