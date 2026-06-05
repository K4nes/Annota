(function () {
  'use strict';

  function createObserver() {
    const listeners = [];
    let notifying = false;
    const pending = [];

    return {
      subscribe(fn) {
        listeners.push(fn);
        return () => {
          const idx = listeners.indexOf(fn);
          if (idx !== -1) listeners.splice(idx, 1);
        };
      },
      notify(data) {
        if (notifying) { pending.push(data); return; }
        notifying = true;
        try {
          for (const fn of listeners) {
            try { fn(data); } catch { /* swallow subscriber errors */ }
          }
        } finally {
          notifying = false;
          if (pending.length > 0) {
            const next = pending.shift();
            this.notify(next);
          }
        }
      },
      size() { return listeners.length; },
    };
  }

  self.createObserver = createObserver;
})();
