(function (globalScope) {
  'use strict';

  const AFB = (globalScope.AFB = {});

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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  AFB.utils = { pageKey, isDevUrl, escapeHtml };
})(typeof window !== 'undefined' ? window : self);
