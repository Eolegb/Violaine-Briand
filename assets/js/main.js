(function () {
  'use strict';

  /* Menu mobile plein écran */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.main-navigation .menu');
  var label = toggle ? toggle.querySelector('.menu-toggle-label') : null;

  function setMenu(opened) {
    if (!toggle || !menu) { return; }
    menu.classList.toggle('toggled', opened);
    toggle.setAttribute('aria-expanded', String(opened));
    if (label) { label.textContent = opened ? 'Fermer' : 'Menu'; }
    document.body.classList.toggle('menu-open', opened);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('toggled'));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setMenu(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('toggled')) {
        setMenu(false);
        toggle.focus();
      }
    });
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
