(function () {
  'use strict';

  const ChromeAdapters = (self.ChromeAdapters = self.ChromeAdapters || {});

  function sendWithResponse(fn, args) {
    return new Promise((resolve, reject) => {
      try {
        fn(...args, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  ChromeAdapters.messaging = {
    sendToBackground(msg) {
      return sendWithResponse(chrome.runtime.sendMessage.bind(chrome.runtime), [msg]);
    },

    sendToTab(tabId, msg) {
      return sendWithResponse(chrome.tabs.sendMessage.bind(chrome.tabs), [tabId, msg]);
    },

    onMessage(handler) {
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        return handler(msg, sender, sendResponse) === true;
      });
    },
  };
})();
