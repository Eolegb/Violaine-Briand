(function () {
  'use strict';

  /* ---- Menu mobile plein écran ----
     L'overlay est construit en JS et rattaché directement à <body>.
     Il ne doit jamais rester descendant du header (sticky + overflow:hidden
     + animation), car WebKit rogne alors un enfant position:fixed
     (bugs 160953 et 239418), ce qui empêchait le menu de s'afficher
     sur iOS Safari. */
  var toggle = document.querySelector('.menu-toggle');
  var label = toggle ? toggle.querySelector('.menu-toggle-label') : null;
  var header = document.querySelector('.site-header');
  var sourceList = document.getElementById('primary-menu');
  var main = document.getElementById('main');
  var footer = document.querySelector('.site-footer');
  var supportsInert = 'inert' in HTMLElement.prototype;
  var overlay = null;

  function focusOverlay() {
    if (!overlay || !overlay.classList.contains('toggled')) { return; }
    void overlay.offsetHeight;
    try { overlay.focus({ preventScroll: true }); } catch (e) { overlay.focus(); }
  }

  function syncHeaderHeight() {
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  }

  /* Bloque le défilement du fond sur iOS sans casser le header sticky.
     On autorise le défilement à l'intérieur de l'overlay lui-même. */
  function onTouchMove(e) {
    if (overlay && e.target && overlay.contains(e.target)) { return; }
    if (e.cancelable) { e.preventDefault(); }
  }

  function lockScroll(locked) {
    if (locked) {
      document.addEventListener('touchmove', onTouchMove, { passive: false });
    } else {
      document.removeEventListener('touchmove', onTouchMove, { passive: false });
    }
  }

  function setMenu(opened, returnFocus) {
    if (!toggle || !overlay) { return; }
    overlay.classList.toggle('toggled', opened);
    overlay.setAttribute('aria-hidden', String(!opened));
    toggle.setAttribute('aria-expanded', String(opened));
    if (label) { label.textContent = opened ? 'Fermer' : 'Menu'; }
    document.documentElement.classList.toggle('menu-open', opened);
    lockScroll(opened);

    /* Rend inerte le contenu de fond (le header reste actif pour le toggle). */
    if (supportsInert) {
      if (main) { main.inert = opened; }
      if (footer) { footer.inert = opened; }
    }

    if (opened) {
      syncHeaderHeight();
      // Place le focus sur le panneau. Un second essai différé est
      // nécessaire sur WebKit/iOS car la visibilité de l'overlay est
      // encore en cours de transition au premier appel.
      focusOverlay();
      window.setTimeout(focusOverlay, 60);
    } else if (returnFocus && toggle) {
      toggle.focus();
    }
  }

  if (toggle && sourceList) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu';
    overlay.id = 'mobile-menu';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('tabindex', '-1');

    var nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Menu');

    var list = sourceList.cloneNode(true);
    list.removeAttribute('id');
    nav.appendChild(list);
    overlay.appendChild(nav);
    document.body.appendChild(overlay);

    toggle.setAttribute('aria-controls', 'mobile-menu');

    toggle.addEventListener('click', function () {
      setMenu(!overlay.classList.contains('toggled'));
    });

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setMenu(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('toggled')) {
        setMenu(false, true);
      }
    });

    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeaderHeight);
    }

    /* Réinitialise l'overlay si la fenêtre repasse en desktop (> 48rem). */
    var desktopQuery = window.matchMedia('(min-width: 48rem)');
    function onBreakpointChange(e) {
      if (e.matches && overlay.classList.contains('toggled')) {
        setMenu(false);
      }
    }
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', onBreakpointChange);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onBreakpointChange);
    }
  }

  /* Révélation au scroll */
  var targets = document.querySelectorAll(
    '.card, .post, figure, .page-title, .page-intro, .entry-header'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    targets.forEach(function (el) {
      el.classList.add('reveal', 'in-view');
    });
  }
})();
