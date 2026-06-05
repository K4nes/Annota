(function () {
  'use strict';

  function pageKey(url) {
    try {
      const u = new URL(url);
      return `annotations::${u.origin}${u.pathname}${u.hash}`;
    } catch {
      return null;
    }
  }

  function isDevUrl(url) {
    try {
      const u = new URL(url);
      return (
        u.hostname === 'localhost' ||
        u.hostname === '127.0.0.1' ||
        u.hostname.endsWith('.local')
      );
    } catch {
      return false;
    }
  }

  let _escapeDiv;
  function escapeHtml(str) {
    if (!_escapeDiv) _escapeDiv = document.createElement('div');
    _escapeDiv.textContent = str || '';
    return _escapeDiv.innerHTML;
  }

  self.pageKey = pageKey;
  self.isDevUrl = isDevUrl;
  self.escapeHtml = escapeHtml;
})();
