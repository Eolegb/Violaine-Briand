(function () {
  'use strict';

  /* Menu mobile (avec gestion aria-expanded) */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.main-navigation .menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var opened = menu.classList.toggle('toggled');
      toggle.setAttribute('aria-expanded', String(opened));
    });
  }

  /* Révélation au scroll */
  var targets = document.querySelectorAll(
    '.card, .post, figure, .site-branding, .main-navigation, .page-title, .page-intro, .entry-header'
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
