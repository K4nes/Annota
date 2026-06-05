(function (globalScope) {
  'use strict';

  const ChromeAdapters = (globalScope.ChromeAdapters = globalScope.ChromeAdapters || {});

  function setText(tabId, text) {
    return new Promise((resolve, reject) => {
      try {
        chrome.action.setBadgeText({ text: text || '', tabId }, () => {
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

  function setColor(tabId, color) {
    return new Promise((resolve, reject) => {
      try {
        chrome.action.setBadgeBackgroundColor({ color, tabId }, () => {
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

  ChromeAdapters.badge = {
    setBadge(tabId, text, color) {
      if (color) {
        return Promise.all([setText(tabId, text), setColor(tabId, color)]);
      }
      return setText(tabId, text);
    },

    clearBadge(tabId) {
      return setText(tabId, '');
    },
  };
})(typeof window !== 'undefined' ? window : self);
