(function() {
  'use strict';

  const RETRY_MS = 3000;
  const STALE_TEXT_THRESHOLD = 0.7;

  function create(deps) {
    const getAnnotations = deps.getAnnotations;
    const getOpenPopoverAnnotationId = deps.getOpenPopoverAnnotationId;
    const retryMap = deps.retryMap;
    const deleteAnnotations = deps.deleteAnnotations;
    const onStaleRemoved = deps.onStaleRemoved;
    const onStaleError = deps.onStaleError;
    const getElementText = deps.getElementText;
    const querySelectorSafe = deps.querySelectorSafe || window.querySelectorSafe;

    function levenshteinSimilarity(a, b) {
      if (a === b) return 1.0;
      const an = a.length;
      const bn = b.length;
      if (an === 0 || bn === 0) return 0.0;
      const maxDist = Math.max(an, bn);
      const matrix = [];
      for (let i = 0; i <= bn; i++) matrix[i] = [i];
      for (let j = 0; j <= an; j++) matrix[0][j] = j;
      for (let i = 1; i <= bn; i++) {
        for (let j = 1; j <= an; j++) {
          const cost = a[j - 1] === b[i - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          );
        }
      }
      return 1 - matrix[bn][an] / maxDist;
    }

    function normalizeText(str) {
      return (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    const sv = {};

    sv.levenshteinSimilarity = levenshteinSimilarity;
    sv.normalizeText = normalizeText;

    sv.validateCurrentPageAnnotations = function() {
      const now = Date.now();
      const staleIds = [];

      for (const ann of getAnnotations()) {
        if (ann.id === getOpenPopoverAnnotationId()) continue;

        const el = querySelectorSafe(ann.selector);

        if (!el) {
          if (!retryMap.has(ann.id)) {
            retryMap.set(ann.id, now);
            continue;
          }
          if (now - retryMap.get(ann.id) >= RETRY_MS) {
            staleIds.push(ann.id);
            retryMap.delete(ann.id);
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
            staleIds.push(ann.id);
            retryMap.delete(ann.id + '_tag');
          }
          continue;
        }

        const storedText = normalizeText(ann.fingerprint.text);
        const currentText = normalizeText(getElementText(el));
        if (currentText && storedText) {
          const sim = levenshteinSimilarity(storedText, currentText);
          if (sim < STALE_TEXT_THRESHOLD) {
            if (!retryMap.has(ann.id + '_text')) {
              retryMap.set(ann.id + '_text', now);
              continue;
            }
            if (now - retryMap.get(ann.id + '_text') >= RETRY_MS) {
              staleIds.push(ann.id);
              retryMap.delete(ann.id + '_text');
            }
            continue;
          }
        }

        retryMap.delete(ann.id + '_text');
        retryMap.delete(ann.id + '_tag');
      }

      if (staleIds.length > 0) {
        deleteAnnotations(staleIds).then(
          () => onStaleRemoved(staleIds.length),
          () => onStaleError()
        );
      }
    };

    return sv;
  }

  window.createStaleValidator = create;
  window.RETRY_MS = RETRY_MS;
  window.STALE_TEXT_THRESHOLD = STALE_TEXT_THRESHOLD;
})();
