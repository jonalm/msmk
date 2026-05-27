// Toggle the mobile nav dropdown
document.querySelectorAll('.nav-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var links = document.getElementById('nav-links');
    if (!links) return;
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// GoatCounter analytics — counts a pageview on every page that loads this file
window.goatcounter = { endpoint: 'https://msmk.goatcounter.com/count' };
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = '//gc.zgo.at/count.js';
  document.head.appendChild(s);
})();
