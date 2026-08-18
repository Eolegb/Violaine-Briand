(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.main-navigation .menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var opened = menu.classList.toggle('toggled');
    toggle.setAttribute('aria-expanded', String(opened));
  });
})();
