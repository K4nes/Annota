(function () {
  'use strict';

  const AFB = window.AFB = window.AFB || {};
  const RETRY_MS = 3000;
  const STALE_TEXT_THRESHOLD = 0.7;

  function create(deps) {
    const getAnnotations = deps.getAnnotations;
    const setAnnotations = deps.setAnnotations;
    const getOpenPopoverAnnotationId = deps.getOpenPopoverAnnotationId;
    const retryMap = deps.retryMap;
    const getPageKey = deps.getPageKey;
    const onStaleRemoved = deps.onStaleRemoved;
    const onStaleError = deps.onStaleError;
    const getElementText = deps.getElementText;
    const querySelectorSafe = deps.querySelectorSafe || AFB.selectorGenerator.querySelectorSafe;
    const storage = deps.storage;

    const v = {};

    function textDifference(a, b) {
      if (a === b) return 0;
      const longer = a.length > b.length ? a : b;
      const shorter = a.length > b.length ? b : a;
      if (longer.length === 0) return 0;

      let matches = 0;
      const shorterLen = shorter.length;
      for (let i = 0; i < shorterLen; i++) {
        if (shorter[i] === longer[i]) matches++;
      }
      return 1 - matches / longer.length;
    }

    v.textDifference = textDifference;

    v.validateCurrentPageAnnotations = async function () {
      const annotations = getAnnotations();
      if (annotations.length === 0) return;

      const stale = [];
      const now = Date.now();

      for (const ann of annotations) {
        if (ann.id === getOpenPopoverAnnotationId()) {
          retryMap.delete(ann.id);
          continue;
        }

        const el = querySelectorSafe(ann.selector);

        if (!el) {
          if (!retryMap.has(ann.id)) {
            retryMap.set(ann.id, now);
            continue;
          }
          if (now - retryMap.get(ann.id) >= RETRY_MS) {
            stale.push(ann);
          }
          continue;
        }

        retryMap.delete(ann.id);

        if (el.tagName.toLowerCase() !== ann.fingerprint.tagName) {
          if (!retryMap.has(ann.id + '_tag')) {
            retryMap.set(ann.id + '_tag', now);
            continue;
          }
          if (now - retryMap.get(ann.id + '_tag') >= RETRY_MS) {
            stale.push(ann);
            retryMap.delete(ann.id + '_tag');
          }
          continue;
        }

        const currentText = getElementText(el);
        const origText = ann.fingerprint.text || '';
        if (origText.length > 0 && currentText.length > 0) {
          const diff = textDifference(origText, currentText);
          if (diff > STALE_TEXT_THRESHOLD) {
            if (!retryMap.has(ann.id + '_text')) {
              retryMap.set(ann.id + '_text', now);
              continue;
            }
            if (now - retryMap.get(ann.id + '_text') >= RETRY_MS) {
              stale.push(ann);
              retryMap.delete(ann.id + '_text');
            }
            continue;
          }
        }
      }

      if (stale.length > 0) {
        const staleIds = new Set(stale.map((a) => a.id));
        const remaining = getAnnotations().filter((a) => !staleIds.has(a.id));

        try {
          await storage.replace(getPageKey(), remaining);
          setAnnotations(remaining);
          if (onStaleRemoved) onStaleRemoved(stale.length);
          ChromeAdapters.messaging.sendToBackground({ type: 'ANNOTATIONS_CHANGED' });
        } catch {
          if (onStaleError) onStaleError();
        }
      }
    };

    return v;
  }

  AFB.staleValidator = { create, RETRY_MS, STALE_TEXT_THRESHOLD };
})();
