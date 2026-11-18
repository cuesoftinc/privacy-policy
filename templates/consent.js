// Consent-gated Google Analytics. The build inlines this after the banner it drives.
(function () {
  var bar = document.querySelector('[data-cuesoft-consent]');
  if (!bar) return;
  var ID = bar.getAttribute('data-measurement-id');
  var KEY = bar.getAttribute('data-storage-key');
  var TAG = 'data-cuesoft-ga';
  var memory = null;
  var broken = false;

  // A browser sending Global Privacy Control never loads the tag, whatever it stored.
  function gpc() {
    return navigator.globalPrivacyControl === true;
  }

  function cookie() {
    try {
      var pairs = document.cookie.split(';');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].trim();
        if (pair.indexOf(KEY + '=') === 0) return pair.slice(KEY.length + 1);
      }
    } catch (e) {}
    return null;
  }

  // The cookie only ever carries a decline.
  function setCookie(value) {
    try {
      document.cookie =
        KEY +
        '=' +
        (value || '') +
        '; path=/; max-age=' +
        (value ? 31536000 : 0) +
        '; SameSite=Lax; Secure';
    } catch (e) {}
  }

  function stored() {
    if (cookie() === 'declined') return 'declined';
    var value = memory;
    if (!broken) {
      try {
        var saved = localStorage.getItem(KEY);
        if (saved !== null) value = saved;
      } catch (e) {}
    }
    return value === 'accepted' || value === 'declined' ? value : null;
  }

  function loaded() {
    return !!document.querySelector('script[' + TAG + ']');
  }

  function load() {
    if (loaded()) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ID);
    var script = document.createElement('script');
    script.async = true;
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    script.setAttribute(TAG, '');
    document.head.appendChild(script);
  }

  // The open bar publishes its height so the footer keeps its last line clear of it.
  function dock() {
    var style = document.documentElement.style;
    if (bar.hidden) style.removeProperty('--ds-dock');
    else
      style.setProperty(
        '--ds-dock',
        Math.ceil(bar.getBoundingClientRect().height) + 'px',
      );
  }

  function render(reopened) {
    var choice = stored();
    if (choice === 'accepted' && !gpc()) load();
    bar.hidden = choice !== null;
    dock();
    if (reopened && !bar.hidden) bar.focus();
  }

  function answer(choice) {
    memory = choice;
    setCookie(choice === 'declined' ? 'declined' : null);
    try {
      localStorage.setItem(KEY, choice);
    } catch (e) {
      broken = true;
    }
    // Only a reload unloads a tag that already ran.
    if (choice === 'declined' && loaded()) {
      window.location.reload();
      return;
    }
    render(false);
  }

  function reopen() {
    memory = null;
    setCookie(null);
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      broken = true;
    }
    render(true);
  }

  bar.querySelector('.ds-button--quiet').addEventListener('click', function () {
    answer('declined');
  });
  bar
    .querySelector('.ds-button--primary')
    .addEventListener('click', function () {
      answer('accepted');
    });

  var controls = document.querySelectorAll('[data-cuesoft-consent-reopen]');
  for (var i = 0; i < controls.length; i++) {
    controls[i].hidden = false;
    controls[i].addEventListener('click', reopen);
  }

  window.addEventListener('storage', function (event) {
    if (event.key !== null && event.key !== KEY) return;
    if (stored() === 'declined' && loaded()) window.location.reload();
    else render(false);
  });
  if (typeof ResizeObserver === 'function')
    new ResizeObserver(dock).observe(bar);

  render(false);
})();
