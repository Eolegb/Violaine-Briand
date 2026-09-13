(function () {
  'use strict';

  /* ---- Menu mobile plein écran ----
     L'overlay et le bouton flottant (FAB) sont construits en JS et
     rattachés directement à <body>. Ils ne doivent jamais rester
     descendants du header (sticky + overflow:hidden + animation), car
     WebKit rogne alors un enfant position:fixed (bugs 160953 et 239418).
     L'ouverture de l'overlay repose sur `display`, pas seulement sur
     opacity/visibility, pour rester fiable sur Safari ancien. */
  var sourceList = document.getElementById('primary-menu');
  var main = document.getElementById('main');
  var footer = document.querySelector('.site-footer');
  var header = document.querySelector('.site-header');
  var skipLink = document.querySelector('.skip-link');
  var supportsInert = 'inert' in HTMLElement.prototype;
  var overlay = null;
  var fab = null;

  var ICON_OPEN = '<svg class="menu-fab-icon menu-fab-icon--open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  var ICON_CLOSE = '<svg class="menu-fab-icon menu-fab-icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function focusOverlay() {
    if (!overlay || !overlay.classList.contains('toggled')) { return; }
    void overlay.offsetHeight;
    try { overlay.focus({ preventScroll: true }); } catch (e) { overlay.focus(); }
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

  function setInert(locked) {
    if (!supportsInert) { return; }
    if (main) { main.inert = locked; }
    if (footer) { footer.inert = locked; }
    if (header) { header.inert = locked; }
    if (skipLink) { skipLink.inert = locked; }
  }

  function setMenu(opened, returnFocus) {
    if (!overlay || !fab) { return; }
    overlay.classList.toggle('toggled', opened);
    overlay.setAttribute('aria-hidden', String(!opened));
    fab.classList.toggle('is-open', opened);
    fab.setAttribute('aria-expanded', String(opened));
    fab.setAttribute('aria-label', opened ? 'Fermer le menu' : 'Ouvrir le menu');
    document.documentElement.classList.toggle('menu-open', opened);
    lockScroll(opened);
    setInert(opened);

    if (opened) {
      // Place le focus sur le panneau. Un second essai différé est
      // nécessaire sur WebKit/iOS : l'overlay vient de passer en display:flex.
      focusOverlay();
      window.setTimeout(focusOverlay, 60);
    } else if (returnFocus && fab) {
      fab.focus();
    }
  }

  if (sourceList) {
    /* Overlay (navigation clonée depuis le menu desktop) */
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

    /* Bouton flottant d'ouverture/fermeture */
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'menu-fab';
    fab.setAttribute('aria-controls', 'mobile-menu');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Ouvrir le menu');
    fab.innerHTML = ICON_OPEN + ICON_CLOSE;

    document.body.appendChild(fab);
    document.body.appendChild(overlay);

    fab.addEventListener('click', function () {
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

    /* Réinitialise l'overlay si la fenêtre repasse en desktop (> 48rem). */
    var desktopQuery = window.matchMedia('(min-width: 48.0625rem)');
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
