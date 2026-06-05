(function() {
  'use strict';

  const ChromeAdapters = window.ChromeAdapters;

  function create(deps) {
    const handlers = {
      onStartPickMode: deps.onStartPickMode,
      onStopPickMode: deps.onStopPickMode,
      onGetState: deps.onGetState,
      onDeleteAnnotation: deps.onDeleteAnnotation,
      onClearPage: deps.onClearPage,
    };

    function listener(msg, sender, sendResponse) {
      if (msg.type === 'START_PICK_MODE') {
        handlers.onStartPickMode();
        sendResponse({ ok: true });
      }

      if (msg.type === 'STOP_PICK_MODE') {
        handlers.onStopPickMode();
        sendResponse({ ok: true });
      }

      if (msg.type === 'GET_STATE') {
        sendResponse(handlers.onGetState());
      }

      if (msg.type === 'DELETE_ANNOTATION') {
        handlers.onDeleteAnnotation(msg.id).then(() => sendResponse({ ok: true }));
        return true;
      }

      if (msg.type === 'CLEAR_PAGE') {
        handlers.onClearPage().then(() => sendResponse({ ok: true }));
        return true;
      }

      return true;
    }

    ChromeAdapters.messaging.onMessage(listener);

    return { listener };
  }

  window.createMessageRouter = create;
})();
