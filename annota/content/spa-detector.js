(function() {
  'use strict';

  function create(deps) {
    const getLastUrl = deps.getLastUrl;
    const setLastUrl = deps.setLastUrl;
    const onUrlChange = deps.onUrlChange;

    const s = {};

    s.handleUrlChange = function() {
      const newUrl = location.href;
      if (newUrl === getLastUrl()) return;
      setLastUrl(newUrl);
      onUrlChange();
    };

    s.setupSPADetection = function() {
      const origPush = history.pushState;
      const origReplace = history.replaceState;

      history.pushState = function () {
        origPush.apply(this, arguments);
        s.handleUrlChange();
      };

      history.replaceState = function () {
        origReplace.apply(this, arguments);
        s.handleUrlChange();
      };

      window.addEventListener('popstate', s.handleUrlChange);
      window.addEventListener('hashchange', s.handleUrlChange);
    };

    return s;
  }

  window.createSpaDetector = create;
})();
