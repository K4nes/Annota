(function (globalScope) {
  'use strict';

  const AFB = (globalScope.AFB = globalScope.AFB || {});

  function createObserver() {
    const subscribers = new Set();

    function subscribe(fn) {
      subscribers.add(fn);
      return function unsubscribe() {
        subscribers.delete(fn);
      };
    }

    function notify(value) {
      for (const fn of subscribers) {
        try {
          fn(value);
        } catch {}
      }
    }

    function size() {
      return subscribers.size;
    }

    return { subscribe, notify, size };
  }

  AFB.observer = { createObserver };
})(typeof window !== 'undefined' ? window : self);
