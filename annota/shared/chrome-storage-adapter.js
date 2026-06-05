(function () {
  'use strict';

  const ChromeAdapters = (self.ChromeAdapters = self.ChromeAdapters || {});

  function promisify(fn, args) {
    return new Promise((resolve, reject) => {
      try {
        fn(...args, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  function promisifyGet(fn, args) {
    return new Promise((resolve, reject) => {
      try {
        fn(...args, (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(result);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  function setItem(key, value) {
    return promisify(chrome.storage.local.set.bind(chrome.storage.local), [{ [key]: value }]);
  }

  function getItem(key) {
    return promisifyGet(chrome.storage.local.get.bind(chrome.storage.local), [key]).then(
      (items) => (items && key in items ? items[key] : null)
    );
  }

  ChromeAdapters.storage = {
    getAnnotations(pageKey) {
      return getItem(pageKey).then((value) => (Array.isArray(value) ? value : []));
    },

    setAnnotations(pageKey, list) {
      return setItem(pageKey, list);
    },

    removeAnnotations(pageKey) {
      return promisify(chrome.storage.local.remove.bind(chrome.storage.local), [pageKey]);
    },

    getBadgeCount(pageKey) {
      return ChromeAdapters.storage.getAnnotations(pageKey).then((list) => list.length);
    },

    onChanged(callback) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') return;
        for (const pageKey of Object.keys(changes)) {
          const change = changes[pageKey];
          const newValue = change && change.newValue !== undefined ? change.newValue : null;
          callback(pageKey, newValue);
        }
      });
    },
  };
})();
